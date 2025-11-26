# 🌐 API Design Standards

**Industry standards for designing RESTful and GraphQL APIs**

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [REST API Design](#rest-api-design)
3. [GraphQL API Design](#graphql-api-design)
4. [Authentication & Authorization](#authentication--authorization)
5. [Versioning](#versioning)
6. [Data Handling](#data-handling)
7. [Error Handling](#error-handling)
8. [Security](#security)
9. [Performance](#performance)
10. [Documentation](#documentation)

---

## Overview

### Philosophy

API design requires adherence to **industry best practices**:
- ✅ **RESTful Principles** - Stateless, platform-independent, loosely coupled
- ✅ **Clear Semantics** - HTTP methods and status codes used correctly
- ✅ **Security First** - Authentication, authorization, encryption by default
- ✅ **Versioning** - Support multiple API versions gracefully
- ✅ **Documentation** - OpenAPI/Swagger specifications
- ✅ **Developer Experience** - Intuitive, consistent, well-documented

**Source**: [Best Practices for RESTful Web API Design](https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design)

---

## REST API Design

### Core Principles

**Source**: [RESTful Web API Design](https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design)

1. **Platform Independence** - Clients can call API regardless of internal implementation
2. **Loose Coupling** - Client and service evolve independently
3. **Stateless** - Each request contains all information needed
4. **Resource-Oriented** - APIs expose resources, not actions

### Resource Naming

```http
# ✅ GOOD: Plural nouns, hierarchical structure
GET    /api/v1/customers
GET    /api/v1/customers/123
GET    /api/v1/customers/123/orders
POST   /api/v1/customers
PUT    /api/v1/customers/123
DELETE /api/v1/customers/123

# ❌ BAD: Verbs in URLs
GET    /api/v1/getCustomer?id=123
POST   /api/v1/createCustomer
PUT    /api/v1/updateCustomer
DELETE /api/v1/deleteCustomer

# ❌ BAD: Singular nouns
GET    /api/v1/customer/123
```

**Rules**:
- Use **plural nouns** for collections
- Use **hierarchical structure** for related resources
- Keep URLs **lowercase** with hyphens (kebab-case)
- Avoid deeply nested URLs (max 3 levels)

### HTTP Methods

**Source**: [Define RESTful Web API Methods](https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design#define-restful-web-api-methods)

| Method | Purpose | Idempotent | Safe | Request Body | Response Body |
|--------|---------|------------|------|--------------|---------------|
| **GET** | Retrieve resource(s) | ✅ | ✅ | ❌ | ✅ |
| **POST** | Create resource | ❌ | ❌ | ✅ | ✅ |
| **PUT** | Replace resource | ✅ | ❌ | ✅ | ✅ |
| **PATCH** | Partial update | ❌ | ❌ | ✅ | ✅ |
| **DELETE** | Remove resource | ✅ | ❌ | ❌ | Optional |

**Examples**:

```typescript
// GET - Retrieve all customers
app.get('/api/v1/customers', async (req, res) => {
    const customers = await db.customers.findMany();
    res.json(customers);
});

// GET - Retrieve single customer
app.get('/api/v1/customers/:id', async (req, res) => {
    const customer = await db.customers.findUnique({
        where: { id: req.params.id }
    });
    
    if (!customer) {
        return res.status(404).json({ error: 'Customer not found' });
    }
    
    res.json(customer);
});

// POST - Create customer
app.post('/api/v1/customers', async (req, res) => {
    const { name, email, address } = req.body;
    
    const customer = await db.customers.create({
        data: { name, email, address }
    });
    
    res.status(201)
       .location(`/api/v1/customers/${customer.id}`)
       .json(customer);
});

// PUT - Replace customer (full update)
app.put('/api/v1/customers/:id', async (req, res) => {
    const { name, email, address } = req.body;
    
    // Validate all required fields present
    if (!name || !email || !address) {
        return res.status(400).json({ 
            error: 'PUT requires all fields: name, email, address' 
        });
    }
    
    const customer = await db.customers.update({
        where: { id: req.params.id },
        data: { name, email, address }
    });
    
    res.json(customer);
});

// PATCH - Partial update
app.patch('/api/v1/customers/:id', async (req, res) => {
    // Only update fields provided
    const updates = {};
    if (req.body.name !== undefined) updates.name = req.body.name;
    if (req.body.email !== undefined) updates.email = req.body.email;
    if (req.body.address !== undefined) updates.address = req.body.address;
    
    const customer = await db.customers.update({
        where: { id: req.params.id },
        data: updates
    });
    
    res.json(customer);
});

// DELETE - Remove customer
app.delete('/api/v1/customers/:id', async (req, res) => {
    await db.customers.delete({
        where: { id: req.params.id }
    });
    
    res.status(204).send();  // No content
});
```

### HTTP Status Codes

**Source**: [Response Codes](https://learn.microsoft.com/en-us/azure/devops/integrate/how-to/call-rest-api#response-codes)

| Code | Meaning | Usage |
|------|---------|-------|
| **200 OK** | Success | GET, PUT, PATCH succeeded |
| **201 Created** | Resource created | POST succeeded |
| **204 No Content** | Success, no body | DELETE succeeded |
| **400 Bad Request** | Invalid input | Validation failed |
| **401 Unauthorized** | Auth failed | Invalid/missing token |
| **403 Forbidden** | No permission | User lacks access |
| **404 Not Found** | Resource missing | GET/PUT/DELETE non-existent |
| **409 Conflict** | State conflict | Duplicate resource, version conflict |
| **415 Unsupported Media Type** | Wrong Content-Type | JSON expected, XML sent |
| **422 Unprocessable Entity** | Validation error | Semantic validation failed |
| **429 Too Many Requests** | Rate limited | Exceeded quota |
| **500 Internal Server Error** | Server error | Unhandled exception |
| **503 Service Unavailable** | Temporarily down | Maintenance, overload |

**Implementation**:

```typescript
// Consistent error response format
interface ErrorResponse {
    error: {
        code: string;
        message: string;
        details?: any[];
        timestamp: string;
        requestId: string;
    };
}

class ApiError extends Error {
    constructor(
        public statusCode: number,
        public code: string,
        message: string,
        public details?: any[]
    ) {
        super(message);
    }
}

// Error handler middleware
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    const requestId = req.headers['x-request-id'] as string || uuidv4();
    
    if (error instanceof ApiError) {
        const response: ErrorResponse = {
            error: {
                code: error.code,
                message: error.message,
                details: error.details,
                timestamp: new Date().toISOString(),
                requestId
            }
        };
        
        return res.status(error.statusCode).json(response);
    }
    
    // Unhandled error - log and return 500
    logger.error('Unhandled error', { error, requestId });
    
    res.status(500).json({
        error: {
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred',
            timestamp: new Date().toISOString(),
            requestId
        }
    });
});

// Usage examples
app.post('/api/v1/customers', async (req, res, next) => {
    try {
        // 400 - Validation error
        if (!req.body.email) {
            throw new ApiError(400, 'VALIDATION_ERROR', 'Email is required');
        }
        
        // 409 - Conflict (duplicate)
        const existing = await db.customers.findUnique({ 
            where: { email: req.body.email } 
        });
        if (existing) {
            throw new ApiError(409, 'DUPLICATE_EMAIL', 'Email already exists');
        }
        
        // 201 - Created
        const customer = await db.customers.create({ data: req.body });
        res.status(201).json(customer);
        
    } catch (error) {
        next(error);  // Pass to error handler
    }
});
```

### Content Negotiation

**Source**: [Resource MIME Types](https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design#define-restful-web-api-methods)

```http
# Request with Accept header
GET /api/v1/customers/123
Accept: application/json, application/xml
```

```typescript
app.get('/api/v1/customers/:id', async (req, res) => {
    const customer = await db.customers.findUnique({
        where: { id: req.params.id }
    });
    
    if (!customer) {
        return res.status(404).json({ error: 'Customer not found' });
    }
    
    // Check Accept header
    const acceptsJson = req.accepts('json');
    const acceptsXml = req.accepts('xml');
    
    if (acceptsJson) {
        res.json(customer);
    } else if (acceptsXml) {
        res.type('application/xml').send(jsonToXml(customer));
    } else {
        // 406 - Not Acceptable
        res.status(406).json({ 
            error: 'Unsupported media type. API supports: application/json, application/xml' 
        });
    }
});

// Validate Content-Type on POST/PUT/PATCH
app.post('/api/v1/customers', (req, res, next) => {
    if (!req.is('application/json')) {
        return res.status(415).json({
            error: 'Unsupported Media Type. Expected: application/json'
        });
    }
    next();
});
```

---

## GraphQL API Design

### Overview

**Source**: [Overview of GraphQL APIs](https://learn.microsoft.com/en-us/azure/api-management/graphql-apis-overview)

GraphQL provides:
- **Query Language** - Clients request exactly the data they need
- **Strong Typing** - Schema defines all available data and operations
- **Single Endpoint** - One endpoint for all queries, mutations, subscriptions
- **No Over-fetching** - Clients specify fields to return

### Schema Design

**Source**: [GraphQL Schema and Types](https://learn.microsoft.com/en-us/azure/api-management/graphql-apis-overview#schema-and-types)

```graphql
# Type definitions
type User {
    id: ID!
    name: String!
    email: String!
    createdAt: DateTime!
    posts: [Post!]!
}

type Post {
    id: ID!
    title: String!
    content: String!
    published: Boolean!
    author: User!
    comments: [Comment!]!
}

type Comment {
    id: ID!
    content: String!
    author: User!
    post: Post!
}

# Query operations
type Query {
    # Get single user
    user(id: ID!): User
    
    # Get all users (with pagination)
    users(limit: Int = 25, offset: Int = 0): [User!]!
    
    # Search users
    searchUsers(query: String!, limit: Int = 10): [User!]!
    
    # Get single post
    post(id: ID!): Post
    
    # Get all posts (with filtering)
    posts(
        published: Boolean
        authorId: ID
        limit: Int = 25
        offset: Int = 0
    ): [Post!]!
}

# Mutation operations
type Mutation {
    # Create user
    createUser(input: CreateUserInput!): User!
    
    # Update user
    updateUser(id: ID!, input: UpdateUserInput!): User!
    
    # Delete user
    deleteUser(id: ID!): Boolean!
    
    # Create post
    createPost(input: CreatePostInput!): Post!
    
    # Publish post
    publishPost(id: ID!): Post!
}

# Subscription operations
type Subscription {
    # Real-time post updates
    postAdded: Post!
    
    # User-specific notifications
    notificationReceived(userId: ID!): Notification!
}

# Input types
input CreateUserInput {
    name: String!
    email: String!
}

input UpdateUserInput {
    name: String
    email: String
}

input CreatePostInput {
    title: String!
    content: String!
    authorId: ID!
}
```

### Queries

**Source**: [Development of Queries and Mutations](https://learn.microsoft.com/en-us/fabric/data-engineering/api-graphql-editor#development-of-queries-and-mutations)

```graphql
# Simple query - get user by ID
query GetUser {
    user(id: "123") {
        id
        name
        email
    }
}

# Query with nested fields
query GetUserWithPosts {
    user(id: "123") {
        id
        name
        email
        posts {
            id
            title
            published
        }
    }
}

# Query with variables
query GetUserById($userId: ID!) {
    user(id: $userId) {
        id
        name
        email
        posts {
            id
            title
            comments {
                id
                content
            }
        }
    }
}

# Variables (sent separately)
{
    "userId": "123"
}

# Query with pagination
query GetPosts($limit: Int, $offset: Int) {
    posts(limit: $limit, offset: $offset) {
        id
        title
        author {
            name
        }
    }
}

# Query with filtering
query GetPublishedPosts {
    posts(published: true, limit: 10) {
        id
        title
        author {
            name
            email
        }
    }
}
```

### Mutations

```graphql
# Create user
mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
        id
        name
        email
        createdAt
    }
}

# Variables
{
    "input": {
        "name": "Jane Doe",
        "email": "jane@example.com"
    }
}

# Update user
mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
        id
        name
        email
    }
}

# Delete user
mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
}

# Create post
mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
        id
        title
        content
        published
        author {
            name
        }
    }
}
```

### Subscriptions

**Source**: [GraphQL Subscriptions](https://learn.microsoft.com/en-us/azure/api-management/graphql-apis-overview#schema-and-types)

```typescript
// Server-side (Apollo Server with graphql-ws)
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();

const resolvers = {
    Mutation: {
        createPost: async (_, { input }) => {
            const post = await db.posts.create({ data: input });
            
            // Publish event to subscribers
            pubsub.publish('POST_ADDED', { postAdded: post });
            
            return post;
        }
    },
    Subscription: {
        postAdded: {
            subscribe: () => pubsub.asyncIterator(['POST_ADDED'])
        }
    }
};

// WebSocket server setup
const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql'
});

useServer({ schema }, wsServer);
```

```graphql
# Client-side subscription
subscription OnPostAdded {
    postAdded {
        id
        title
        content
        author {
            name
        }
    }
}
```

```typescript
// Client usage (Apollo Client)
import { useSubscription } from '@apollo/client';

function PostFeed() {
    const { data, loading } = useSubscription(
        gql`
            subscription OnPostAdded {
                postAdded {
                    id
                    title
                    author { name }
                }
            }
        `
    );
    
    if (loading) return <p>Loading...</p>;
    
    return <div>New post: {data.postAdded.title}</div>;
}
```

### N+1 Problem and DataLoader

**Source**: [GraphQL Performance Best Practices](https://learn.microsoft.com/en-us/fabric/data-engineering/api-graphql-performance)

```typescript
// ❌ BAD: N+1 queries
const resolvers = {
    Query: {
        posts: () => db.posts.findMany()  // 1 query
    },
    Post: {
        // This runs for EACH post! (N queries)
        author: (parent) => db.users.findUnique({ 
            where: { id: parent.authorId } 
        })
    }
};

// ✅ GOOD: Use DataLoader
import DataLoader from 'dataloader';

// Batch load users by IDs
const userLoader = new DataLoader(async (userIds: readonly number[]) => {
    const users = await db.users.findMany({
        where: { id: { in: [...userIds] } }
    });
    
    // Return users in same order as requested IDs
    const userMap = new Map(users.map(u => [u.id, u]));
    return userIds.map(id => userMap.get(id));
});

const resolvers = {
    Query: {
        posts: () => db.posts.findMany()  // 1 query
    },
    Post: {
        // DataLoader batches these into single query
        author: (parent) => userLoader.load(parent.authorId)  // Batched!
    }
};

// Context setup (create new loaders per request)
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: () => ({
        loaders: {
            user: new DataLoader(batchGetUsers),
            post: new DataLoader(batchGetPosts)
        }
    })
});
```

---

## Authentication & Authorization

### OAuth 2.0 Flow

**Source**: [OAuth 2.0 Concepts](https://learn.microsoft.com/en-us/azure/api-management/authentication-authorization-overview#oauth-20-concepts)

```typescript
// 1. Client authenticates and obtains access token
// 2. Client includes token in Authorization header
// 3. API validates token
// 4. API grants/denies access based on validation

import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

// JWT validation middleware
const validateJWT = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Extract token from Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: {
                    code: 'MISSING_TOKEN',
                    message: 'Authorization header with Bearer token required'
                }
            });
        }
        
        const token = authHeader.substring(7);
        
        // Decode token without verification (to get kid)
        const decoded = jwt.decode(token, { complete: true });
        if (!decoded) {
            return res.status(401).json({
                error: {
                    code: 'INVALID_TOKEN',
                    message: 'Token is malformed'
                }
            });
        }
        
        // Get signing key from JWKS endpoint
        const client = jwksClient({
            jwksUri: process.env.JWKS_URI!  // e.g., https://login.microsoftonline.com/{tenant}/discovery/v2.0/keys
        });
        
        const key = await client.getSigningKey(decoded.header.kid);
        const signingKey = key.getPublicKey();
        
        // Verify token
        const verified = jwt.verify(token, signingKey, {
            algorithms: ['RS256'],
            audience: process.env.JWT_AUDIENCE,  // Expected audience
            issuer: process.env.JWT_ISSUER       // Expected issuer
        }) as jwt.JwtPayload;
        
        // Attach user info to request
        req.user = {
            id: verified.sub!,
            email: verified.email,
            roles: verified.roles || []
        };
        
        next();
        
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                error: {
                    code: 'TOKEN_EXPIRED',
                    message: 'Token has expired'
                }
            });
        }
        
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                error: {
                    code: 'INVALID_TOKEN',
                    message: 'Token validation failed'
                }
            });
        }
        
        return res.status(500).json({
            error: {
                code: 'INTERNAL_ERROR',
                message: 'Token validation error'
            }
        });
    }
};

// Apply to protected routes
app.use('/api/v1', validateJWT);
```

### Role-Based Access Control

**Source**: [Using JWT Tokens to Secure an API](https://learn.microsoft.com/en-us/aspnet/core/security/authentication/configure-jwt-bearer-authentication#using-jwt-tokens-to-secure-an-api)

```typescript
// Extend User type
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                roles: string[];
            };
        }
    }
}

// Authorization middleware
const requireRole = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'Authentication required'
                }
            });
        }
        
        const hasRole = req.user.roles.some(role => 
            allowedRoles.includes(role)
        );
        
        if (!hasRole) {
            return res.status(403).json({
                error: {
                    code: 'FORBIDDEN',
                    message: `Requires one of: ${allowedRoles.join(', ')}`
                }
            });
        }
        
        next();
    };
};

// Usage
app.get('/api/v1/customers', 
    validateJWT,  // Authentication
    requireRole('admin', 'sales'),  // Authorization
    async (req, res) => {
        const customers = await db.customers.findMany();
        res.json(customers);
    }
);

app.delete('/api/v1/customers/:id',
    validateJWT,
    requireRole('admin'),  // Only admins can delete
    async (req, res) => {
        await db.customers.delete({ where: { id: req.params.id } });
        res.status(204).send();
    }
);
```

### API Keys

```typescript
// API key validation middleware
const validateApiKey = async (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.headers['x-api-key'] as string;
    
    if (!apiKey) {
        return res.status(401).json({
            error: {
                code: 'MISSING_API_KEY',
                message: 'X-API-Key header required'
            }
        });
    }
    
    // Validate API key (check database/cache)
    const key = await db.apiKeys.findUnique({
        where: { key: apiKey, active: true }
    });
    
    if (!key) {
        return res.status(401).json({
            error: {
                code: 'INVALID_API_KEY',
                message: 'Invalid or inactive API key'
            }
        });
    }
    
    // Check rate limits for this key
    const rateLimitKey = `ratelimit:${key.id}`;
    const requests = await redis.incr(rateLimitKey);
    
    if (requests === 1) {
        await redis.expire(rateLimitKey, 60);  // 1 minute window
    }
    
    if (requests > key.rateLimit) {
        return res.status(429).json({
            error: {
                code: 'RATE_LIMIT_EXCEEDED',
                message: `Rate limit: ${key.rateLimit} requests/minute`
            }
        });
    }
    
    // Track usage
    await db.apiKeyUsage.create({
        data: {
            apiKeyId: key.id,
            endpoint: req.path,
            timestamp: new Date()
        }
    });
    
    req.apiKey = key;
    next();
};
```

---

## Versioning

### URI Versioning (Recommended)

**Source**: [URI Versioning](https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design#implement-versioning)

```typescript
// ✅ GOOD: Version in URI
app.get('/api/v1/customers/:id', async (req, res) => {
    // v1 implementation
    const customer = await db.customers.findUnique({
        where: { id: req.params.id },
        select: { id: true, name: true, address: true }
    });
    res.json(customer);
});

app.get('/api/v2/customers/:id', async (req, res) => {
    // v2 implementation - address is now nested object
    const customer = await db.customers.findUnique({
        where: { id: req.params.id },
        select: {
            id: true,
            name: true,
            dateCreated: true,
            address: {
                select: {
                    streetAddress: true,
                    city: true,
                    state: true,
                    zipCode: true
                }
            }
        }
    });
    res.json(customer);
});
```

### Header Versioning

**Source**: [Header Versioning](https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design#implement-versioning)

```typescript
// Version via custom header
app.get('/api/customers/:id', async (req, res) => {
    const version = req.headers['api-version'] || '1';
    
    if (version === '2') {
        // v2 logic
        const customer = await getCustomerV2(req.params.id);
        res.json(customer);
    } else {
        // v1 logic (default)
        const customer = await getCustomerV1(req.params.id);
        res.json(customer);
    }
});
```

### Media Type Versioning

```http
GET /api/customers/3
Accept: application/vnd.contoso.v1+json
```

```typescript
app.get('/api/customers/:id', async (req, res) => {
    const acceptHeader = req.headers.accept || '';
    
    if (acceptHeader.includes('vnd.contoso.v2+json')) {
        const customer = await getCustomerV2(req.params.id);
        res.type('application/vnd.contoso.v2+json').json(customer);
    } else {
        const customer = await getCustomerV1(req.params.id);
        res.type('application/vnd.contoso.v1+json').json(customer);
    }
});
```

---

## Data Handling

### Pagination

**Source**: [Data Pagination and Filtering](https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design#implement-data-pagination-and-filtering)

```typescript
interface PaginationParams {
    limit?: number;
    offset?: number;
}

interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        limit: number;
        offset: number;
        total: number;
        hasMore: boolean;
    };
}

app.get('/api/v1/customers', async (req, res) => {
    // Parse pagination params
    const limit = Math.min(parseInt(req.query.limit as string) || 25, 100);  // Max 100
    const offset = parseInt(req.query.offset as string) || 0;
    
    // Get data and total count
    const [customers, total] = await Promise.all([
        db.customers.findMany({
            skip: offset,
            take: limit
        }),
        db.customers.count()
    ]);
    
    const response: PaginatedResponse<Customer> = {
        data: customers,
        pagination: {
            limit,
            offset,
            total,
            hasMore: offset + limit < total
        }
    };
    
    res.json(response);
});

// Usage: GET /api/v1/customers?limit=25&offset=50
```

### Filtering

```typescript
app.get('/api/v1/orders', async (req, res) => {
    const { minCost, maxCost, status, customerId } = req.query;
    
    // Build where clause
    const where: any = {};
    
    if (minCost) {
        where.cost = { gte: parseFloat(minCost as string) };
    }
    if (maxCost) {
        where.cost = { ...where.cost, lte: parseFloat(maxCost as string) };
    }
    if (status) {
        where.status = status as string;
    }
    if (customerId) {
        where.customerId = customerId as string;
    }
    
    const orders = await db.orders.findMany({ where });
    res.json(orders);
});

// Usage: GET /api/v1/orders?minCost=100&status=shipped&customerId=123
```

### Sorting

```typescript
app.get('/api/v1/products', async (req, res) => {
    const sortBy = req.query.sort as string || 'name';
    const order = req.query.order as string || 'asc';
    
    // Whitelist allowed sort fields
    const allowedFields = ['name', 'price', 'createdAt'];
    if (!allowedFields.includes(sortBy)) {
        return res.status(400).json({
            error: `Invalid sort field. Allowed: ${allowedFields.join(', ')}`
        });
    }
    
    const products = await db.products.findMany({
        orderBy: { [sortBy]: order === 'desc' ? 'desc' : 'asc' }
    });
    
    res.json(products);
});

// Usage: GET /api/v1/products?sort=price&order=desc
```

### Field Selection

```typescript
app.get('/api/v1/customers/:id', async (req, res) => {
    const fields = req.query.fields as string;
    
    if (fields) {
        // Parse comma-separated fields
        const requestedFields = fields.split(',').map(f => f.trim());
        
        // Whitelist allowed fields
        const allowedFields = ['id', 'name', 'email', 'address', 'phone'];
        const invalidFields = requestedFields.filter(f => !allowedFields.includes(f));
        
        if (invalidFields.length > 0) {
            return res.status(400).json({
                error: `Invalid fields: ${invalidFields.join(', ')}`
            });
        }
        
        // Build select object
        const select = requestedFields.reduce((obj, field) => {
            obj[field] = true;
            return obj;
        }, {} as any);
        
        const customer = await db.customers.findUnique({
            where: { id: req.params.id },
            select
        });
        
        res.json(customer);
    } else {
        // Return all fields
        const customer = await db.customers.findUnique({
            where: { id: req.params.id }
        });
        res.json(customer);
    }
});

// Usage: GET /api/v1/customers/123?fields=id,name,email
```

---

## Error Handling

### Consistent Error Format

```typescript
interface ApiErrorResponse {
    error: {
        code: string;
        message: string;
        details?: ErrorDetail[];
        timestamp: string;
        requestId: string;
        path: string;
    };
}

interface ErrorDetail {
    field?: string;
    message: string;
    code?: string;
}

class ValidationError extends ApiError {
    constructor(details: ErrorDetail[]) {
        super(422, 'VALIDATION_ERROR', 'Validation failed', details);
    }
}

// Example validation
app.post('/api/v1/customers', async (req, res, next) => {
    const errors: ErrorDetail[] = [];
    
    if (!req.body.name) {
        errors.push({ field: 'name', message: 'Name is required', code: 'REQUIRED' });
    }
    
    if (!req.body.email) {
        errors.push({ field: 'email', message: 'Email is required', code: 'REQUIRED' });
    } else if (!isValidEmail(req.body.email)) {
        errors.push({ field: 'email', message: 'Invalid email format', code: 'INVALID_FORMAT' });
    }
    
    if (errors.length > 0) {
        throw new ValidationError(errors);
    }
    
    // Continue with creation
    const customer = await db.customers.create({ data: req.body });
    res.status(201).json(customer);
});

// Response (422):
{
    "error": {
        "code": "VALIDATION_ERROR",
        "message": "Validation failed",
        "details": [
            {
                "field": "email",
                "message": "Invalid email format",
                "code": "INVALID_FORMAT"
            }
        ],
        "timestamp": "2025-11-17T10:30:00Z",
        "requestId": "req-abc123",
        "path": "/api/v1/customers"
    }
}
```

---

## Security

### HTTPS Only

```typescript
// Redirect HTTP to HTTPS
app.use((req, res, next) => {
    if (!req.secure && process.env.NODE_ENV === 'production') {
        return res.redirect(301, `https://${req.headers.host}${req.url}`);
    }
    next();
});

// Set security headers
import helmet from 'helmet';
app.use(helmet());
```

### CORS Configuration

**Source**: [Security Misconfiguration](https://learn.microsoft.com/en-us/azure/api-management/mitigate-owasp-api-threats#security-misconfiguration)

```typescript
import cors from 'cors';

// ✅ GOOD: Specific origins
app.use(cors({
    origin: [
        'https://app.example.com',
        'https://admin.example.com'
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400  // 24 hours
}));

// ❌ BAD: Wildcard (security risk)
app.use(cors({ origin: '*' }));
```

### Input Validation

```typescript
import { z } from 'zod';

// Define schema with Zod
const CreateCustomerSchema = z.object({
    name: z.string().min(1).max(100),
    email: z.string().email(),
    phone: z.string().regex(/^\d{10}$/).optional(),
    address: z.object({
        street: z.string().min(1),
        city: z.string().min(1),
        state: z.string().length(2),
        zipCode: z.string().regex(/^\d{5}$/)
    })
});

app.post('/api/v1/customers', async (req, res, next) => {
    try {
        // Validate request body
        const validated = CreateCustomerSchema.parse(req.body);
        
        const customer = await db.customers.create({ data: validated });
        res.status(201).json(customer);
        
    } catch (error) {
        if (error instanceof z.ZodError) {
            const details = error.errors.map(err => ({
                field: err.path.join('.'),
                message: err.message,
                code: err.code
            }));
            
            throw new ValidationError(details);
        }
        next(error);
    }
});
```

### Rate Limiting

**Source**: [Broken Authentication Recommendations](https://learn.microsoft.com/en-us/azure/api-management/mitigate-owasp-api-threats#broken-authentication)

```typescript
import rateLimit from 'express-rate-limit';

// General rate limit
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 100,  // 100 requests per window
    message: {
        error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many requests, please try again later'
        }
    },
    standardHeaders: true,
    legacyHeaders: false
});

// Stricter limit for auth endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,  // 5 attempts per 15 minutes
    skipSuccessfulRequests: true
});

app.use('/api', generalLimiter);
app.use('/api/auth', authLimiter);
```

---

## Performance

### Caching

```typescript
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 300 });  // 5 minutes

app.get('/api/v1/customers/:id', async (req, res) => {
    const cacheKey = `customer:${req.params.id}`;
    
    // Check cache
    const cached = cache.get(cacheKey);
    if (cached) {
        res.set('X-Cache', 'HIT');
        return res.json(cached);
    }
    
    // Fetch from database
    const customer = await db.customers.findUnique({
        where: { id: req.params.id }
    });
    
    if (customer) {
        cache.set(cacheKey, customer);
    }
    
    res.set('X-Cache', 'MISS');
    res.json(customer);
});

// Invalidate on update
app.put('/api/v1/customers/:id', async (req, res) => {
    const customer = await db.customers.update({
        where: { id: req.params.id },
        data: req.body
    });
    
    cache.del(`customer:${req.params.id}`);
    res.json(customer);
});
```

### ETags

```typescript
import etag from 'etag';

app.get('/api/v1/customers/:id', async (req, res) => {
    const customer = await db.customers.findUnique({
        where: { id: req.params.id }
    });
    
    if (!customer) {
        return res.status(404).json({ error: 'Not found' });
    }
    
    // Generate ETag
    const tag = etag(JSON.stringify(customer));
    
    // Check If-None-Match header
    if (req.headers['if-none-match'] === tag) {
        return res.status(304).send();  // Not Modified
    }
    
    res.set('ETag', tag);
    res.json(customer);
});
```

---

## Documentation

### OpenAPI/Swagger

**Source**: [OpenAPI Initiative](https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design#openapi-initiative)

```typescript
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Customer API',
            version: '1.0.0',
            description: 'API for managing customers'
        },
        servers: [
            { url: 'https://api.example.com', description: 'Production' },
            { url: 'https://api-staging.example.com', description: 'Staging' }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [{ bearerAuth: [] }]
    },
    apis: ['./src/routes/*.ts']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @openapi
 * /api/v1/customers:
 *   get:
 *     summary: Get all customers
 *     tags: [Customers]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 25
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Customer'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 */
app.get('/api/v1/customers', getCustomers);
```

---

**Document Status**: Complete  
**Last Updated**: November 17, 2025  
**Location**: `STANDARDS/API_DESIGN/API_DESIGN_STANDARDS.md`
