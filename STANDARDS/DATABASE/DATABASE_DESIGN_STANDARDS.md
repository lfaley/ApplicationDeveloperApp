# 🗄️ Database Design Standards

**Industry standards for designing relational databases**

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Normalization](#normalization)
3. [Primary & Foreign Keys](#primary--foreign-keys)
4. [Indexing Strategy](#indexing-strategy)
5. [Transactions & ACID](#transactions--acid)
6. [Query Optimization](#query-optimization)
7. [Connection Management](#connection-management)
8. [Best Practices](#best-practices)

---

## Overview

### Philosophy

Database design requires adherence to **proven principles**:
- ✅ **Normalization** - Eliminate redundancy, maintain data integrity
- ✅ **Indexing** - Optimize query performance with proper indexes
- ✅ **Constraints** - Enforce data integrity with keys and constraints
- ✅ **ACID Compliance** - Atomicity, Consistency, Isolation, Durability
- ✅ **Performance** - Connection pooling, query optimization, caching

**Source**: [Designing Relational Database Tables](https://learn.microsoft.com/en-us/aspnet/web-forms/videos/sql-2005/designing-relational-database-tables)

---

## Normalization

### Normal Forms

**Source**: [Explore Performance-Based Database Design](https://learn.microsoft.com/en-us/training/modules/explore-performance-based-design/2-describe-normalization)

| Form | Rule | Example |
|------|------|---------|
| **1NF** | Atomic values, no repeating groups | Each cell contains single value |
| **2NF** | 1NF + No partial dependencies | All non-key attributes depend on entire primary key |
| **3NF** | 2NF + No transitive dependencies | No non-key attribute depends on another non-key attribute |

### First Normal Form (1NF)

```sql
-- ❌ BAD: Multiple values in single column
CREATE TABLE Orders (
    OrderId INT PRIMARY KEY,
    CustomerId INT,
    ProductIds VARCHAR(100)  -- "1,5,9" - Multiple products!
);

-- ✅ GOOD: Atomic values
CREATE TABLE Orders (
    OrderId INT PRIMARY KEY,
    CustomerId INT
);

CREATE TABLE OrderItems (
    OrderItemId INT PRIMARY KEY,
    OrderId INT,
    ProductId INT,
    Quantity INT,
    FOREIGN KEY (OrderId) REFERENCES Orders(OrderId)
);
```

### Second Normal Form (2NF)

```sql
-- ❌ BAD: Partial dependency (ProductName depends only on ProductId, not full composite key)
CREATE TABLE OrderItems (
    OrderId INT,
    ProductId INT,
    ProductName VARCHAR(100),  -- Depends only on ProductId!
    Quantity INT,
    PRIMARY KEY (OrderId, ProductId)
);

-- ✅ GOOD: Separate product information
CREATE TABLE Products (
    ProductId INT PRIMARY KEY,
    ProductName VARCHAR(100),
    Price DECIMAL(10,2)
);

CREATE TABLE OrderItems (
    OrderItemId INT PRIMARY KEY,
    OrderId INT,
    ProductId INT,
    Quantity INT,
    FOREIGN KEY (ProductId) REFERENCES Products(ProductId)
);
```

### Third Normal Form (3NF)

```sql
-- ❌ BAD: Transitive dependency (City/State depend on ZipCode)
CREATE TABLE Customers (
    CustomerId INT PRIMARY KEY,
    Name VARCHAR(100),
    ZipCode VARCHAR(10),
    City VARCHAR(50),      -- Depends on ZipCode!
    State VARCHAR(2)       -- Depends on ZipCode!
);

-- ✅ GOOD: Remove transitive dependencies
CREATE TABLE ZipCodes (
    ZipCode VARCHAR(10) PRIMARY KEY,
    City VARCHAR(50),
    State VARCHAR(2)
);

CREATE TABLE Customers (
    CustomerId INT PRIMARY KEY,
    Name VARCHAR(100),
    ZipCode VARCHAR(10),
    FOREIGN KEY (ZipCode) REFERENCES ZipCodes(ZipCode)
);
```

### Denormalization (When Appropriate)

**Source**: [Data Modeling - Normalized Data Models](https://learn.microsoft.com/en-us/azure/databricks/transform/data-modeling#database-management-concepts)

```typescript
// For read-heavy workloads, consider denormalization
// Star schema example (data warehouse)
interface FactSales {
    salesId: number;
    dateKey: number;
    productKey: number;
    customerId: number;
    quantity: number;
    amount: number;
    // Denormalized for performance
    productName: string;     // From Products
    customerName: string;    // From Customers
    region: string;          // From Customers
}

// ✅ GOOD: Denormalize when:
// - Read performance is critical
// - Data rarely changes
// - Queries frequently join tables
// - Redundancy cost < join cost
```

---

## Primary & Foreign Keys

### Primary Keys

**Source**: [Primary and Foreign Key Constraints](https://learn.microsoft.com/en-us/sql/relational-databases/tables/primary-and-foreign-key-constraints)

```sql
-- ✅ GOOD: Single column primary key (auto-increment)
CREATE TABLE Customers (
    CustomerId INT IDENTITY(1,1) PRIMARY KEY,
    Email VARCHAR(255) UNIQUE NOT NULL,
    Name VARCHAR(100) NOT NULL
);

-- ✅ GOOD: Composite primary key
CREATE TABLE OrderItems (
    OrderId INT,
    LineNumber INT,
    ProductId INT NOT NULL,
    Quantity INT NOT NULL,
    PRIMARY KEY (OrderId, LineNumber)
);

-- ✅ GOOD: GUID primary key (for distributed systems)
CREATE TABLE Sessions (
    SessionId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId INT NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE()
);
```

### Foreign Keys

**Source**: [Foreign Key Constraints](https://learn.microsoft.com/en-us/sql/relational-databases/tables/primary-and-foreign-key-constraints#foreign-key-constraints)

```sql
-- ✅ GOOD: Foreign key with cascading actions
CREATE TABLE Orders (
    OrderId INT PRIMARY KEY,
    CustomerId INT NOT NULL,
    OrderDate DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (CustomerId) REFERENCES Customers(CustomerId)
        ON DELETE CASCADE    -- Delete orders when customer deleted
        ON UPDATE CASCADE    -- Update OrderId if CustomerId changes
);

-- ✅ GOOD: Foreign key with restrictions
CREATE TABLE Payments (
    PaymentId INT PRIMARY KEY,
    OrderId INT NOT NULL,
    Amount DECIMAL(10,2),
    FOREIGN KEY (OrderId) REFERENCES Orders(OrderId)
        ON DELETE RESTRICT   -- Prevent order deletion if payments exist
);

-- Multiple foreign keys
CREATE TABLE OrderItems (
    OrderItemId INT PRIMARY KEY,
    OrderId INT NOT NULL,
    ProductId INT NOT NULL,
    Quantity INT CHECK (Quantity > 0),
    FOREIGN KEY (OrderId) REFERENCES Orders(OrderId),
    FOREIGN KEY (ProductId) REFERENCES Products(ProductId)
);
```

### Constraints

```sql
-- CHECK constraints
CREATE TABLE Products (
    ProductId INT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Price DECIMAL(10,2) CHECK (Price >= 0),
    Stock INT CHECK (Stock >= 0),
    Category VARCHAR(50) CHECK (Category IN ('Electronics', 'Clothing', 'Food'))
);

-- UNIQUE constraints
CREATE TABLE Users (
    UserId INT PRIMARY KEY,
    Username VARCHAR(50) UNIQUE NOT NULL,
    Email VARCHAR(255) UNIQUE NOT NULL,
    Phone VARCHAR(20) UNIQUE
);

-- DEFAULT constraints
CREATE TABLE AuditLog (
    LogId INT IDENTITY PRIMARY KEY,
    UserId INT NOT NULL,
    Action VARCHAR(100) NOT NULL,
    Timestamp DATETIME DEFAULT GETDATE(),
    IPAddress VARCHAR(45) DEFAULT '0.0.0.0'
);
```

---

## Indexing Strategy

**Source**: [Design Indexes](https://learn.microsoft.com/en-us/training/modules/explore-performance-based-design/4-design-indexes)

### Index Types

```sql
-- Clustered index (one per table, determines physical order)
CREATE CLUSTERED INDEX IX_Orders_OrderDate 
    ON Orders(OrderDate);

-- Non-clustered index (multiple allowed)
CREATE NONCLUSTERED INDEX IX_Customers_Email 
    ON Customers(Email);

-- Composite index (multiple columns)
CREATE INDEX IX_Orders_CustomerId_OrderDate 
    ON Orders(CustomerId, OrderDate);

-- Covering index (includes all columns in query)
CREATE INDEX IX_Orders_Status_Include 
    ON Orders(Status) 
    INCLUDE (OrderDate, TotalAmount);

-- Unique index
CREATE UNIQUE INDEX IX_Users_Email 
    ON Users(Email);

-- Filtered index (partial index)
CREATE INDEX IX_Orders_ActiveOrders 
    ON Orders(OrderDate) 
    WHERE Status = 'Active';
```

### When to Create Indexes

```typescript
// ✅ Index these columns:
// 1. Primary keys (automatic)
// 2. Foreign keys
// 3. Frequently searched columns (WHERE clauses)
// 4. Frequently sorted columns (ORDER BY)
// 5. Frequently joined columns (JOIN conditions)

// ❌ DON'T index:
// - Small tables (< 1000 rows)
// - Columns with low cardinality (few distinct values)
// - Columns updated frequently
// - Wide columns (large data types)
```

### Index Best Practices

```sql
-- ✅ GOOD: Index foreign keys
CREATE INDEX IX_Orders_CustomerId ON Orders(CustomerId);
CREATE INDEX IX_OrderItems_OrderId ON OrderItems(OrderId);
CREATE INDEX IX_OrderItems_ProductId ON OrderItems(ProductId);

-- ✅ GOOD: Composite index for common queries
-- Query: SELECT * FROM Orders WHERE CustomerId = 123 ORDER BY OrderDate DESC
CREATE INDEX IX_Orders_Customer_Date ON Orders(CustomerId, OrderDate DESC);

-- ✅ GOOD: Covering index for specific query
-- Query: SELECT OrderId, Status, TotalAmount FROM Orders WHERE Status = 'Pending'
CREATE INDEX IX_Orders_Status_Covering 
    ON Orders(Status) 
    INCLUDE (OrderId, TotalAmount);

-- ❌ BAD: Over-indexing (slows INSERT/UPDATE/DELETE)
CREATE INDEX IX_Every_Column ON Products(ProductId, Name, Price, Stock, Category);
```

---

## Transactions & ACID

**Source**: [Transaction Basics](https://learn.microsoft.com/en-us/sql/relational-databases/sql-server-transaction-locking-and-row-versioning-guide#transaction-basics)

### ACID Properties

| Property | Description |
|----------|-------------|
| **Atomicity** | All operations succeed or all fail (all-or-nothing) |
| **Consistency** | Database remains in valid state before/after transaction |
| **Isolation** | Concurrent transactions don't interfere |
| **Durability** | Committed changes persist even after system failure |

### Transaction Implementation

```typescript
// TypeScript with Prisma
async function transferFunds(fromId: number, toId: number, amount: number) {
    return await prisma.$transaction(async (tx) => {
        // 1. Debit source account
        const fromAccount = await tx.account.update({
            where: { id: fromId },
            data: { balance: { decrement: amount } }
        });
        
        // Validate sufficient funds
        if (fromAccount.balance < 0) {
            throw new Error('Insufficient funds');
        }
        
        // 2. Credit destination account
        await tx.account.update({
            where: { id: toId },
            data: { balance: { increment: amount } }
        });
        
        // 3. Create transaction log
        await tx.transaction.create({
            data: {
                fromAccountId: fromId,
                toAccountId: toId,
                amount,
                type: 'TRANSFER',
                timestamp: new Date()
            }
        });
        
        // All operations succeed or all fail
    });
}
```

```sql
-- SQL Server transaction
BEGIN TRANSACTION;

BEGIN TRY
    -- Debit source account
    UPDATE Accounts 
    SET Balance = Balance - 100 
    WHERE AccountId = 1;
    
    -- Check balance
    IF (SELECT Balance FROM Accounts WHERE AccountId = 1) < 0
        THROW 50001, 'Insufficient funds', 1;
    
    -- Credit destination account
    UPDATE Accounts 
    SET Balance = Balance + 100 
    WHERE AccountId = 2;
    
    -- Log transaction
    INSERT INTO TransactionLog (FromAccountId, ToAccountId, Amount, Timestamp)
    VALUES (1, 2, 100, GETDATE());
    
    COMMIT TRANSACTION;
END TRY
BEGIN CATCH
    ROLLBACK TRANSACTION;
    THROW;
END CATCH;
```

### Isolation Levels

**Source**: [Understanding Isolation Levels](https://learn.microsoft.com/en-us/sql/connect/jdbc/understanding-isolation-levels)

| Level | Dirty Read | Non-Repeatable Read | Phantom Read |
|-------|------------|---------------------|--------------|
| **Read Uncommitted** | ✅ | ✅ | ✅ |
| **Read Committed** | ❌ | ✅ | ✅ |
| **Repeatable Read** | ❌ | ❌ | ✅ |
| **Serializable** | ❌ | ❌ | ❌ |
| **Snapshot** | ❌ | ❌ | ❌ |

```typescript
// Set isolation level
await prisma.$executeRaw`SET TRANSACTION ISOLATION LEVEL READ COMMITTED`;

// Or configure in connection string
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: 'postgresql://user:pass@localhost:5432/db?options=-c%20default_transaction_isolation=read%20committed'
        }
    }
});
```

---

## Query Optimization

**Source**: [Optimize Database Queries](https://learn.microsoft.com/en-us/azure/well-architected/performance-efficiency/optimize-data-performance#optimize-database-queries)

### Avoid N+1 Problem

```typescript
// ❌ BAD: N+1 queries
const orders = await prisma.order.findMany();
for (const order of orders) {
    // Runs N additional queries!
    const customer = await prisma.customer.findUnique({
        where: { id: order.customerId }
    });
}

// ✅ GOOD: Single query with join
const orders = await prisma.order.findMany({
    include: { customer: true }  // Single join query
});
```

### Use Proper Joins

```sql
-- ✅ GOOD: Efficient join order (smaller table first)
SELECT o.OrderId, c.Name
FROM Customers c
INNER JOIN Orders o ON c.CustomerId = o.CustomerId
WHERE c.Country = 'USA';

-- Reorder joins based on filtering
-- Filter customers first (smaller result set)
-- Then join with orders
```

### Index Hints

```sql
-- Force specific index usage
SELECT * FROM Orders WITH (INDEX(IX_Orders_CustomerId))
WHERE CustomerId = 123;

-- Table hint for performance
SELECT * FROM Orders WITH (NOLOCK)  -- Read uncommitted
WHERE Status = 'Pending';
```

### Query Caching

```typescript
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 300 });  // 5 minutes

async function getProducts(category: string) {
    const cacheKey = `products:${category}`;
    
    // Check cache
    const cached = cache.get(cacheKey);
    if (cached) return cached;
    
    // Query database
    const products = await prisma.product.findMany({
        where: { category }
    });
    
    // Cache results
    cache.set(cacheKey, products);
    return products;
}
```

---

## Connection Management

**Source**: [Connection Pooling](https://learn.microsoft.com/en-us/dotnet/framework/data/adonet/connection-pooling)

### Connection Pooling

```typescript
// Prisma (built-in pooling)
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL
        }
    },
    log: ['query', 'error', 'warn']
});

// Configure pool size
// DATABASE_URL="postgresql://user:pass@localhost:5432/db?connection_limit=20"
```

```csharp
// ADO.NET connection pooling
string connectionString = 
    "Server=myServer;Database=myDB;User Id=myUser;Password=myPass;" +
    "Pooling=true;" +              // Enable pooling (default: true)
    "Min Pool Size=5;" +            // Minimum connections
    "Max Pool Size=100;" +          // Maximum connections
    "Connection Lifetime=300;" +    // Recycle after 5 minutes
    "Connection Timeout=15";        // Wait 15s for connection

using (SqlConnection conn = new SqlConnection(connectionString))
{
    conn.Open();
    // Use connection
} // Connection returned to pool, not closed
```

### Connection Best Practices

```typescript
// ✅ GOOD: Reuse connections via pooling
async function getUser(id: number) {
    // Prisma handles pooling automatically
    return await prisma.user.findUnique({ where: { id } });
}

// ✅ GOOD: Close connections properly
async function executeQuery() {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM users');
        return result.rows;
    } finally {
        client.release();  // Return to pool
    }
}

// ❌ BAD: Creating new connections for each query
async function badExample() {
    const client = new Client({ /* config */ });
    await client.connect();
    await client.query('SELECT 1');
    await client.end();  // Destroys connection!
}
```

---

## Best Practices

### Schema Design Checklist

```markdown
✅ Normalization
- [ ] Eliminate repeating groups (1NF)
- [ ] Remove partial dependencies (2NF)
- [ ] Remove transitive dependencies (3NF)
- [ ] Consider denormalization for read-heavy workloads

✅ Primary Keys
- [ ] Every table has a primary key
- [ ] Use surrogate keys (INT, BIGINT, UUID) for large tables
- [ ] Natural keys only for small, stable lookup tables

✅ Foreign Keys
- [ ] All relationships have foreign key constraints
- [ ] Appropriate cascading rules (CASCADE, RESTRICT, SET NULL)
- [ ] Indexed for join performance

✅ Indexes
- [ ] Foreign keys are indexed
- [ ] Frequently queried columns are indexed
- [ ] Composite indexes for common query patterns
- [ ] Covering indexes for specific queries
- [ ] Not over-indexed (max 5-10 per table)

✅ Constraints
- [ ] NOT NULL where appropriate
- [ ] UNIQUE constraints for uniqueness
- [ ] CHECK constraints for data validation
- [ ] DEFAULT values for common cases

✅ Data Types
- [ ] Smallest appropriate data type
- [ ] VARCHAR with appropriate length (not VARCHAR(MAX))
- [ ] DECIMAL for money (not FLOAT)
- [ ] DATE/DATETIME for temporal data

✅ Transactions
- [ ] ACID compliance for critical operations
- [ ] Appropriate isolation level
- [ ] Error handling with rollback
- [ ] Keep transactions short

✅ Performance
- [ ] Connection pooling configured
- [ ] Query caching for read-heavy data
- [ ] Avoid N+1 queries
- [ ] Monitor slow queries
```

### Migration Strategy

```typescript
// Prisma migration example
// 1. Update schema.prisma
model User {
    id        Int      @id @default(autoincrement())
    email     String   @unique
    name      String
    createdAt DateTime @default(now())
    // New field
    lastLogin DateTime?
    
    @@index([email])
}

// 2. Create migration
// npx prisma migrate dev --name add_last_login

// 3. Generated SQL (migration.sql)
-- AlterTable
ALTER TABLE "User" ADD COLUMN "lastLogin" TIMESTAMP;

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");
```

---

**Document Status**: Complete  
**Last Updated**: November 17, 2025  
**Location**: `STANDARDS/DATABASE/DATABASE_DESIGN_STANDARDS.md`
