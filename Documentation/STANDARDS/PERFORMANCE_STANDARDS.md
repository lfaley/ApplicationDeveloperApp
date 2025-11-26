# ⚡ Performance Standards

**Industry standards for optimizing application performance**

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Connection Pooling](#connection-pooling)
3. [Caching Strategies](#caching-strategies)
4. [Query Optimization](#query-optimization)
5. [Code Optimization](#code-optimization)
6. [Monitoring & Profiling](#monitoring--profiling)
7. [Best Practices](#best-practices)

---

## Overview

### Philosophy

Performance optimization requires **systematic approach**:
- ✅ **Measure First** - Profile before optimizing
- ✅ **Connection Pooling** - Reuse database connections
- ✅ **Caching** - Store frequently accessed data
- ✅ **Query Optimization** - Efficient database queries
- ✅ **Lazy Loading** - Load data only when needed
- ✅ **Asynchronous Operations** - Non-blocking I/O

**Source**: [Architecture Strategies for Optimizing Data Performance](https://learn.microsoft.com/en-us/azure/well-architected/performance-efficiency/optimize-data-performance)

---

## Connection Pooling

**Source**: [Connection Pooling](https://learn.microsoft.com/en-us/dotnet/framework/data/adonet/connection-pooling)

### Why Connection Pooling?

```typescript
// ❌ BAD: Creating new connection each time (expensive!)
async function badExample() {
    for (let i = 0; i < 100; i++) {
        const client = new Client({ /* config */ });
        await client.connect();           // Expensive handshake!
        await client.query('SELECT 1');
        await client.end();               // Destroys connection
    }
    // 100 connection handshakes = slow!
}

// ✅ GOOD: Reuse connections via pooling
import { Pool } from 'pg';

const pool = new Pool({
    host: 'localhost',
    database: 'mydb',
    user: 'user',
    password: 'password',
    max: 20,              // Maximum connections in pool
    min: 5,               // Minimum idle connections
    idleTimeoutMillis: 30000,  // Close idle connections after 30s
    connectionTimeoutMillis: 2000  // Wait 2s for available connection
});

async function goodExample() {
    for (let i = 0; i < 100; i++) {
        const client = await pool.connect();  // Reuses existing connection
        try {
            await client.query('SELECT 1');
        } finally {
            client.release();  // Return to pool, don't destroy
        }
    }
    // Only created 20 connections, reused 80 times!
}
```

### Prisma Connection Pooling

```typescript
// Prisma (automatic pooling)
const prisma = new PrismaClient();

// Configure via connection string
// postgresql://user:pass@localhost:5432/db?connection_limit=20&pool_timeout=10

// PgBouncer for external pooling (for serverless)
// postgresql://user:pass@pgbouncer:6432/db?pgbouncer=true
```

### ADO.NET Connection Pooling

```csharp
// Connection string with pooling
string connString = 
    "Server=myServer;Database=myDB;User=myUser;Password=myPass;" +
    "Pooling=true;" +           // Enable (default: true)
    "Min Pool Size=5;" +         // Minimum connections
    "Max Pool Size=100;" +       // Maximum connections  
    "Connection Lifetime=300;" + // Recycle after 5 min
    "Connection Timeout=15";     // Wait 15s for connection

// Usage
using (SqlConnection conn = new SqlConnection(connString))
{
    conn.Open();
    // Use connection
} // Returns to pool (not destroyed)
```

---

## Caching Strategies

**Source**: [Query Caching and Parameterization](https://learn.microsoft.com/en-us/ef/core/performance/advanced-performance-topics#query-caching-and-parameterization)

### In-Memory Caching

```typescript
import NodeCache from 'node-cache';

// Create cache instance
const cache = new NodeCache({
    stdTTL: 300,        // 5 minutes default TTL
    checkperiod: 60,    // Check for expired keys every 60s
    useClones: false    // Store references (faster, less memory)
});

// Cache wrapper
async function getCached<T>(
    key: string,
    ttl: number,
    fetchFn: () => Promise<T>
): Promise<T> {
    // Check cache
    const cached = cache.get<T>(key);
    if (cached !== undefined) {
        return cached;
    }
    
    // Fetch data
    const data = await fetchFn();
    
    // Store in cache
    cache.set(key, data, ttl);
    
    return data;
}

// Usage
async function getProducts(category: string) {
    return getCached(
        `products:${category}`,
        300,  // 5 minutes
        async () => {
            // Only called on cache miss
            return await prisma.product.findMany({
                where: { category }
            });
        }
    );
}

// Invalidate on update
async function updateProduct(id: number, data: any) {
    const product = await prisma.product.update({
        where: { id },
        data
    });
    
    // Invalidate cache
    cache.del(`product:${id}`);
    cache.del(`products:${product.category}`);
    
    return product;
}
```

### Redis Caching

```typescript
import Redis from 'ioredis';

const redis = new Redis({
    host: 'localhost',
    port: 6379,
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    lazyConnect: true
});

// Cache with Redis
async function getCachedRedis<T>(
    key: string,
    ttl: number,
    fetchFn: () => Promise<T>
): Promise<T> {
    // Check cache
    const cached = await redis.get(key);
    if (cached) {
        return JSON.parse(cached);
    }
    
    // Fetch data
    const data = await fetchFn();
    
    // Store in Redis
    await redis.setex(key, ttl, JSON.stringify(data));
    
    return data;
}

// Cache patterns
class ProductCache {
    // Cache single product
    async getProduct(id: number) {
        return getCachedRedis(
            `product:${id}`,
            3600,  // 1 hour
            () => prisma.product.findUnique({ where: { id } })
        );
    }
    
    // Cache list with hash
    async getProductsByCategory(category: string) {
        const key = `products:category:${category}`;
        
        const cached = await redis.hgetall(key);
        if (Object.keys(cached).length > 0) {
            return Object.values(cached).map(p => JSON.parse(p));
        }
        
        const products = await prisma.product.findMany({
            where: { category }
        });
        
        // Store as hash
        const pipeline = redis.pipeline();
        products.forEach(p => {
            pipeline.hset(key, p.id, JSON.stringify(p));
        });
        pipeline.expire(key, 300);  // 5 minutes
        await pipeline.exec();
        
        return products;
    }
    
    // Invalidate pattern
    async invalidateCategory(category: string) {
        const keys = await redis.keys(`products:category:${category}*`);
        if (keys.length > 0) {
            await redis.del(...keys);
        }
    }
}
```

### HTTP Caching (ETags)

```typescript
import etag from 'etag';

app.get('/api/products/:id', async (req, res) => {
    const product = await prisma.product.findUnique({
        where: { id: parseInt(req.params.id) }
    });
    
    if (!product) {
        return res.status(404).json({ error: 'Not found' });
    }
    
    // Generate ETag
    const tag = etag(JSON.stringify(product));
    
    // Check If-None-Match header
    if (req.headers['if-none-match'] === tag) {
        return res.status(304).send();  // Not Modified
    }
    
    // Set cache headers
    res.set('ETag', tag);
    res.set('Cache-Control', 'public, max-age=300');  // 5 minutes
    res.json(product);
});
```

---

## Query Optimization

**Source**: [Optimize Database Queries](https://learn.microsoft.com/en-us/azure/well-architected/performance-efficiency/optimize-data-performance#optimize-database-queries)

### Avoid N+1 Queries

```typescript
// ❌ BAD: N+1 queries
async function getOrdersWithCustomers() {
    const orders = await prisma.order.findMany();  // 1 query
    
    for (const order of orders) {
        order.customer = await prisma.customer.findUnique({  // N queries!
            where: { id: order.customerId }
        });
    }
    
    return orders;
}
// Total: 1 + N queries (if 100 orders = 101 queries!)

// ✅ GOOD: Single query with join
async function getOrdersWithCustomersOptimized() {
    return await prisma.order.findMany({
        include: { customer: true }  // Single join query
    });
}
// Total: 1 query

// ✅ GOOD: DataLoader (batching)
import DataLoader from 'dataloader';

const customerLoader = new DataLoader(async (customerIds: readonly number[]) => {
    const customers = await prisma.customer.findMany({
        where: { id: { in: [...customerIds] } }
    });
    
    const customerMap = new Map(customers.map(c => [c.id, c]));
    return customerIds.map(id => customerMap.get(id)!);
});

async function getOrdersWithDataLoader() {
    const orders = await prisma.order.findMany();
    
    // Batches all requests into single query
    for (const order of orders) {
        order.customer = await customerLoader.load(order.customerId);
    }
    
    return orders;
}
// Total: 2 queries (orders + batched customers)
```

### Select Only Needed Fields

```typescript
// ❌ BAD: Select all fields
const products = await prisma.product.findMany();
// Returns ALL columns (including large description field)

// ✅ GOOD: Select specific fields
const products = await prisma.product.findMany({
    select: {
        id: true,
        name: true,
        price: true
        // Omit large 'description' field
    }
});
// Smaller payload, faster query
```

### Use Indexes Effectively

```sql
-- Add index on frequently queried columns
CREATE INDEX IX_Orders_CustomerId ON Orders(CustomerId);
CREATE INDEX IX_Orders_OrderDate ON Orders(OrderDate DESC);

-- Composite index for common query
CREATE INDEX IX_Orders_Customer_Date 
    ON Orders(CustomerId, OrderDate DESC);
```

```typescript
// Query benefits from composite index
const orders = await prisma.order.findMany({
    where: { customerId: 123 },
    orderBy: { orderDate: 'desc' }
});
// Uses IX_Orders_Customer_Date (single index lookup)
```

---

## Code Optimization

### Lazy Loading

```typescript
// ✅ GOOD: Lazy load large data
class Product {
    id: number;
    name: string;
    price: number;
    
    private _reviews?: Review[];
    
    // Load reviews only when accessed
    async getReviews(): Promise<Review[]> {
        if (!this._reviews) {
            this._reviews = await prisma.review.findMany({
                where: { productId: this.id }
            });
        }
        return this._reviews;
    }
}
```

### Pagination

```typescript
// ✅ GOOD: Paginate large result sets
async function getProducts(page: number = 1, pageSize: number = 25) {
    const [products, total] = await Promise.all([
        prisma.product.findMany({
            skip: (page - 1) * pageSize,
            take: pageSize
        }),
        prisma.product.count()
    ]);
    
    return {
        data: products,
        pagination: {
            page,
            pageSize,
            total,
            pages: Math.ceil(total / pageSize)
        }
    };
}
```

### Parallel Processing

```typescript
// ❌ BAD: Sequential processing
async function getDataSequential() {
    const users = await fetchUsers();        // Wait 100ms
    const products = await fetchProducts();  // Wait 150ms
    const orders = await fetchOrders();      // Wait 200ms
    return { users, products, orders };
}
// Total: 450ms

// ✅ GOOD: Parallel processing
async function getDataParallel() {
    const [users, products, orders] = await Promise.all([
        fetchUsers(),      // All run in parallel
        fetchProducts(),
        fetchOrders()
    ]);
    return { users, products, orders };
}
// Total: 200ms (longest operation)
```

### Debouncing & Throttling

```typescript
// Debounce: Wait until user stops typing
function debounce<T extends (...args: any[]) => any>(
    fn: T,
    delay: number
): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout;
    
    return function(...args: Parameters<T>) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
}

// Usage: Search API call
const searchProducts = debounce(async (query: string) => {
    const results = await fetch(`/api/search?q=${query}`);
    // Only called after user stops typing for 300ms
}, 300);

// Throttle: Limit execution rate
function throttle<T extends (...args: any[]) => any>(
    fn: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    
    return function(...args: Parameters<T>) {
        if (!inThrottle) {
            fn(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Usage: Scroll event
const handleScroll = throttle(() => {
    console.log('Scroll position:', window.scrollY);
    // Only called once per 100ms, even if scrolling fast
}, 100);
```

---

## Monitoring & Profiling

### Performance Monitoring

```typescript
import { performance } from 'perf_hooks';

// Measure operation duration
async function measurePerformance<T>(
    name: string,
    fn: () => Promise<T>
): Promise<T> {
    const start = performance.now();
    
    try {
        const result = await fn();
        const duration = performance.now() - start;
        
        console.log(`${name}: ${duration.toFixed(2)}ms`);
        
        // Log to monitoring system
        if (duration > 1000) {
            logger.warn(`Slow operation: ${name} took ${duration}ms`);
        }
        
        return result;
    } catch (error) {
        const duration = performance.now() - start;
        logger.error(`${name} failed after ${duration}ms`, { error });
        throw error;
    }
}

// Usage
const products = await measurePerformance(
    'getProducts',
    () => prisma.product.findMany()
);
```

### Query Performance

```typescript
// Prisma query logging
const prisma = new PrismaClient({
    log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'error' },
        { emit: 'stdout', level: 'warn' }
    ]
});

prisma.$on('query', (e) => {
    if (e.duration > 1000) {  // Slow query threshold: 1s
        console.warn('Slow query detected:', {
            query: e.query,
            duration: `${e.duration}ms`,
            params: e.params
        });
    }
});
```

### Application Insights

```typescript
import { TelemetryClient } from 'applicationinsights';

const client = new TelemetryClient();

// Track dependency performance
async function trackDatabaseCall<T>(
    name: string,
    fn: () => Promise<T>
): Promise<T> {
    const startTime = Date.now();
    
    try {
        const result = await fn();
        const duration = Date.now() - startTime;
        
        client.trackDependency({
            target: 'Database',
            name,
            data: name,
            duration,
            success: true,
            resultCode: 'OK'
        });
        
        return result;
    } catch (error) {
        const duration = Date.now() - startTime;
        
        client.trackDependency({
            target: 'Database',
            name,
            data: name,
            duration,
            success: false,
            resultCode: 'ERROR'
        });
        
        throw error;
    }
}
```

---

## Best Practices

### Performance Checklist

```markdown
✅ Connection Management
- [ ] Connection pooling enabled
- [ ] Pool size configured (10-20 for most apps)
- [ ] Connection timeout set (2-5 seconds)
- [ ] Connections properly released

✅ Caching
- [ ] In-memory cache for frequently accessed data
- [ ] Redis for distributed caching
- [ ] Cache invalidation strategy implemented
- [ ] HTTP caching headers (ETag, Cache-Control)
- [ ] CDN for static assets

✅ Database Queries
- [ ] No N+1 queries
- [ ] Select only needed fields
- [ ] Proper indexes on foreign keys and query columns
- [ ] Pagination for large result sets
- [ ] Query results cached appropriately

✅ Code Optimization
- [ ] Asynchronous operations (async/await)
- [ ] Parallel processing where possible
- [ ] Lazy loading for expensive operations
- [ ] Debouncing for user input
- [ ] Throttling for frequent events

✅ Monitoring
- [ ] Query performance logging
- [ ] Slow query alerts (> 1s)
- [ ] Application insights/metrics
- [ ] Error rate monitoring
- [ ] Resource utilization tracking

✅ API Performance
- [ ] Response compression (gzip)
- [ ] Request rate limiting
- [ ] Batch endpoints for multiple operations
- [ ] WebSocket for real-time data
- [ ] API response caching
```

### Performance Targets

| Metric | Target | Critical Threshold |
|--------|--------|-------------------|
| **API Response Time (P95)** | < 200ms | > 1000ms |
| **Database Query Time** | < 100ms | > 500ms |
| **Page Load Time** | < 2s | > 5s |
| **Time to Interactive** | < 3s | > 7s |
| **Cache Hit Rate** | > 80% | < 50% |
| **Error Rate** | < 0.1% | > 1% |
| **Connection Pool Utilization** | 40-60% | > 90% |

---

**Document Status**: Complete  
**Last Updated**: November 17, 2025  
**Location**: `STANDARDS/PERFORMANCE/PERFORMANCE_STANDARDS.md`
