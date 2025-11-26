# 🔒 Security Standards

**Industry standards for secure application development**

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [OWASP Top 10](#owasp-top-10)
3. [Input Validation](#input-validation)
4. [Authentication](#authentication)
5. [Authorization](#authorization)
6. [Cryptography](#cryptography)
7. [Secure Communication](#secure-communication)
8. [Common Vulnerabilities](#common-vulnerabilities)

---

## Overview

### Philosophy

Security requires **defense in depth**:
- ✅ **Input Validation** - Validate and sanitize all user input
- ✅ **Output Encoding** - Encode data before rendering
- ✅ **Authentication** - Verify user identity securely
- ✅ **Authorization** - Control access to resources
- ✅ **Encryption** - Protect data at rest and in transit
- ✅ **Least Privilege** - Grant minimum necessary permissions

**Source**: [Develop Secure Applications on Azure](https://learn.microsoft.com/en-us/azure/security/develop/secure-develop)

---

## OWASP Top 10

**Source**: [ASP.NET Core Security Topics](https://learn.microsoft.com/en-us/aspnet/core/security/)

### Critical Vulnerabilities

1. **Injection** - SQL, NoSQL, OS command injection
2. **Broken Authentication** - Session management, credential storage
3. **Sensitive Data Exposure** - Insufficient encryption
4. **XML External Entities (XXE)** - XML parsing vulnerabilities
5. **Broken Access Control** - Improper authorization
6. **Security Misconfiguration** - Default configs, verbose errors
7. **Cross-Site Scripting (XSS)** - Unescaped user input
8. **Insecure Deserialization** - Object injection attacks
9. **Using Components with Known Vulnerabilities** - Outdated dependencies
10. **Insufficient Logging & Monitoring** - Delayed breach detection

---

## Input Validation

**Source**: [Input Validation Mitigations](https://learn.microsoft.com/en-us/azure/security/develop/threat-modeling-tool-input-validation)

### Validation Strategy

```typescript
// ✅ GOOD: Allowlist approach (validate expected input)
function validateUsername(username: string): boolean {
    // Only alphanumeric and underscore, 3-20 chars
    return /^[a-zA-Z0-9_]{3,20}$/.test(username);
}

// ❌ BAD: Blocklist approach (trying to block everything malicious)
function badValidation(input: string): boolean {
    // Impossible to catch all malicious patterns!
    return !input.includes('<script>') && 
           !input.includes('DROP TABLE') &&
           !input.includes('../../');
}

// ✅ GOOD: Comprehensive validation
import { z } from 'zod';

const CreateUserSchema = z.object({
    username: z.string()
        .min(3, 'Username must be at least 3 characters')
        .max(20, 'Username must be at most 20 characters')
        .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    
    email: z.string()
        .email('Invalid email address')
        .max(255, 'Email too long'),
    
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain uppercase letter')
        .regex(/[a-z]/, 'Password must contain lowercase letter')
        .regex(/[0-9]/, 'Password must contain number')
        .regex(/[^A-Za-z0-9]/, 'Password must contain special character'),
    
    age: z.number()
        .int('Age must be an integer')
        .min(13, 'Must be at least 13 years old')
        .max(120, 'Invalid age'),
    
    website: z.string()
        .url('Invalid URL')
        .optional()
});

// Usage
try {
    const validated = CreateUserSchema.parse(userInput);
    // Safe to use validated data
} catch (error) {
    if (error instanceof z.ZodError) {
        // Handle validation errors
        console.error(error.errors);
    }
}
```

### SQL Injection Prevention

**Source**: [SQL Injection](https://learn.microsoft.com/en-us/sql/relational-databases/security/sql-injection)

```typescript
// ❌ DANGEROUS: String concatenation
function dangerousQuery(userId: string) {
    const query = `SELECT * FROM users WHERE id = ${userId}`;  // NEVER DO THIS!
    // Input: "1 OR 1=1" exposes all users
    // Input: "1; DROP TABLE users--" destroys data
}

// ✅ GOOD: Parameterized queries
async function safeQuery(userId: string) {
    // Prisma (ORM - automatically parameterized)
    return await prisma.user.findUnique({
        where: { id: parseInt(userId) }
    });
}

// ✅ GOOD: Raw SQL with parameters
async function safeRawQuery(userId: string) {
    return await prisma.$queryRaw`
        SELECT * FROM users WHERE id = ${userId}
    `;  // Prisma automatically parameterizes
}
```

```csharp
// ✅ GOOD: Parameterized query in C#
public User GetUser(int userId)
{
    using (SqlConnection conn = new SqlConnection(connectionString))
    {
        string sql = "SELECT * FROM Users WHERE Id = @UserId";
        SqlCommand cmd = new SqlCommand(sql, conn);
        
        // Add parameter (prevents SQL injection)
        cmd.Parameters.AddWithValue("@UserId", userId);
        
        conn.Open();
        using (SqlDataReader reader = cmd.ExecuteReader())
        {
            // Process results
        }
    }
}
```

### Cross-Site Scripting (XSS) Prevention

**Source**: [Encode Untrusted Web Output](https://learn.microsoft.com/en-us/azure/security/develop/threat-modeling-tool-input-validation#encode-untrusted-web-output-prior-to-rendering)

```typescript
// ❌ DANGEROUS: Direct insertion of user input
function dangerousRender(userInput: string) {
    document.getElementById('content').innerHTML = userInput;
    // Input: "<script>alert('XSS')</script>" executes malicious code
}

// ✅ GOOD: Use textContent (auto-escapes)
function safeRender(userInput: string) {
    document.getElementById('content').textContent = userInput;
    // HTML special chars are escaped automatically
}

// ✅ GOOD: HTML encoding
import DOMPurify from 'dompurify';

function sanitizeHtml(userInput: string): string {
    return DOMPurify.sanitize(userInput, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
        ALLOWED_ATTR: ['href']
    });
}

// React (auto-escapes by default)
function UserComment({ comment }: { comment: string }) {
    // ✅ GOOD: React escapes by default
    return <div>{comment}</div>;
    
    // ❌ DANGEROUS: dangerouslySetInnerHTML
    // return <div dangerouslySetInnerHTML={{ __html: comment }} />;
}
```

---

## Authentication

### Password Security

```typescript
import bcrypt from 'bcrypt';
import crypto from 'crypto';

// ✅ GOOD: Hash passwords with bcrypt
async function hashPassword(password: string): Promise<string> {
    const saltRounds = 12;  // Higher = more secure but slower
    return await bcrypt.hash(password, saltRounds);
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
}

// ❌ BAD: Plain text passwords
// const user = { password: "mypassword" };  // NEVER!

// ❌ BAD: Simple hashing without salt
// const hash = crypto.createHash('sha256').update(password).digest('hex');

// Usage
async function registerUser(email: string, password: string) {
    // Validate password strength
    if (password.length < 8) {
        throw new Error('Password too short');
    }
    
    // Hash password
    const passwordHash = await hashPassword(password);
    
    // Store hash, never plain password
    await prisma.user.create({
        data: {
            email,
            passwordHash  // Store hash, not password
        }
    });
}

async function loginUser(email: string, password: string) {
    const user = await prisma.user.findUnique({
        where: { email }
    });
    
    if (!user) {
        throw new Error('Invalid credentials');
    }
    
    // Verify password against hash
    const valid = await verifyPassword(password, user.passwordHash);
    
    if (!valid) {
        throw new Error('Invalid credentials');
    }
    
    // Generate session token
    return generateSessionToken(user.id);
}
```

### Session Management

```typescript
import jwt from 'jsonwebtoken';

// ✅ GOOD: Secure session tokens
function generateSessionToken(userId: number): string {
    return jwt.sign(
        { userId, type: 'session' },
        process.env.JWT_SECRET!,
        {
            expiresIn: '24h',
            issuer: 'myapp.com',
            audience: 'myapp.com'
        }
    );
}

function verifySessionToken(token: string): { userId: number } {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!, {
            issuer: 'myapp.com',
            audience: 'myapp.com'
        }) as { userId: number; type: string };
        
        if (decoded.type !== 'session') {
            throw new Error('Invalid token type');
        }
        
        return { userId: decoded.userId };
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
}

// Cookie configuration
app.use(cookieParser());

app.post('/login', async (req, res) => {
    // Authenticate user...
    const token = generateSessionToken(user.id);
    
    // Set secure cookie
    res.cookie('session', token, {
        httpOnly: true,      // Not accessible via JavaScript
        secure: true,        // HTTPS only
        sameSite: 'strict',  // CSRF protection
        maxAge: 24 * 60 * 60 * 1000  // 24 hours
    });
    
    res.json({ success: true });
});
```

### Multi-Factor Authentication (MFA)

```typescript
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';

// Setup TOTP (Time-based One-Time Password)
async function setupMFA(userId: number) {
    // Generate secret
    const secret = speakeasy.generateSecret({
        name: `MyApp (${userId})`,
        issuer: 'MyApp'
    });
    
    // Save secret to database
    await prisma.user.update({
        where: { id: userId },
        data: { mfaSecret: secret.base32 }
    });
    
    // Generate QR code for authenticator app
    const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url!);
    
    return {
        secret: secret.base32,
        qrCode: qrCodeUrl
    };
}

// Verify MFA token
function verifyMFA(secret: string, token: string): boolean {
    return speakeasy.totp.verify({
        secret,
        encoding: 'base32',
        token,
        window: 1  // Allow 1 time step before/after
    });
}

// Login with MFA
app.post('/login/mfa', async (req, res) => {
    const { email, password, mfaToken } = req.body;
    
    // 1. Verify password
    const user = await authenticateUser(email, password);
    
    // 2. Verify MFA if enabled
    if (user.mfaSecret) {
        const valid = verifyMFA(user.mfaSecret, mfaToken);
        if (!valid) {
            return res.status(401).json({ error: 'Invalid MFA token' });
        }
    }
    
    // 3. Create session
    const token = generateSessionToken(user.id);
    res.json({ token });
});
```

---

## Authorization

### Role-Based Access Control (RBAC)

```typescript
enum Role {
    ADMIN = 'ADMIN',
    EDITOR = 'EDITOR',
    VIEWER = 'VIEWER'
}

interface User {
    id: number;
    email: string;
    roles: Role[];
}

// Middleware for role checking
function requireRole(...allowedRoles: Role[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = req.user as User;
        
        if (!user) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        
        const hasRole = user.roles.some(role => allowedRoles.includes(role));
        
        if (!hasRole) {
            return res.status(403).json({ 
                error: 'Insufficient permissions',
                required: allowedRoles
            });
        }
        
        next();
    };
}

// Usage
app.get('/admin/users', 
    authenticate,
    requireRole(Role.ADMIN),
    async (req, res) => {
        const users = await prisma.user.findMany();
        res.json(users);
    }
);

app.put('/articles/:id',
    authenticate,
    requireRole(Role.ADMIN, Role.EDITOR),
    async (req, res) => {
        // Update article
    }
);
```

### Resource-Level Authorization

```typescript
// Check ownership
async function requireOwnership(req: Request, res: Response, next: NextFunction) {
    const userId = req.user!.id;
    const articleId = parseInt(req.params.id);
    
    const article = await prisma.article.findUnique({
        where: { id: articleId }
    });
    
    if (!article) {
        return res.status(404).json({ error: 'Article not found' });
    }
    
    if (article.authorId !== userId && !req.user!.roles.includes(Role.ADMIN)) {
        return res.status(403).json({ error: 'Not authorized' });
    }
    
    req.article = article;
    next();
}

// Usage
app.put('/articles/:id',
    authenticate,
    requireOwnership,
    async (req, res) => {
        const article = req.article;
        // User owns this article or is admin
    }
);
```

---

## Cryptography

**Source**: [Cryptography](https://learn.microsoft.com/en-us/security-updates/glossary/glossary#c)

### Encryption at Rest

```typescript
import crypto from 'crypto';

// AES-256-GCM encryption
function encrypt(plaintext: string, key: Buffer): { 
    encrypted: string; 
    iv: string; 
    authTag: string; 
} {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    
    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return {
        encrypted,
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex')
    };
}

function decrypt(encrypted: string, key: Buffer, iv: string, authTag: string): string {
    const decipher = crypto.createDecipheriv(
        'aes-256-gcm',
        key,
        Buffer.from(iv, 'hex')
    );
    
    decipher.setAuthTag(Buffer.from(authTag, 'hex'));
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
}

// Key management (use environment variables or key vault)
const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');

// Encrypt sensitive data before storing
async function storeSensitiveData(userId: number, ssn: string) {
    const { encrypted, iv, authTag } = encrypt(ssn, ENCRYPTION_KEY);
    
    await prisma.user.update({
        where: { id: userId },
        data: {
            ssnEncrypted: encrypted,
            ssnIv: iv,
            ssnAuthTag: authTag
        }
    });
}

// Decrypt when retrieving
async function getSensitiveData(userId: number): Promise<string> {
    const user = await prisma.user.findUnique({
        where: { id: userId }
    });
    
    if (!user || !user.ssnEncrypted) {
        throw new Error('Data not found');
    }
    
    return decrypt(
        user.ssnEncrypted,
        ENCRYPTION_KEY,
        user.ssnIv,
        user.ssnAuthTag
    );
}
```

---

## Secure Communication

### HTTPS/TLS Configuration

```typescript
import https from 'https';
import fs from 'fs';

// ✅ GOOD: HTTPS server
const httpsOptions = {
    key: fs.readFileSync('path/to/private-key.pem'),
    cert: fs.readFileSync('path/to/certificate.pem'),
    // TLS 1.2+ only
    minVersion: 'TLSv1.2' as const,
    // Strong ciphers only
    ciphers: [
        'ECDHE-ECDSA-AES128-GCM-SHA256',
        'ECDHE-RSA-AES128-GCM-SHA256',
        'ECDHE-ECDSA-AES256-GCM-SHA384',
        'ECDHE-RSA-AES256-GCM-SHA384'
    ].join(':')
};

https.createServer(httpsOptions, app).listen(443);

// Redirect HTTP to HTTPS
import express from 'express';
const httpApp = express();

httpApp.use((req, res) => {
    res.redirect(301, `https://${req.headers.host}${req.url}`);
});

httpApp.listen(80);
```

### CORS Configuration

```typescript
import cors from 'cors';

// ✅ GOOD: Restrictive CORS
app.use(cors({
    origin: [
        'https://app.example.com',
        'https://admin.example.com'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400
}));

// ❌ BAD: Permissive CORS (security risk)
// app.use(cors({ origin: '*' }));
```

---

## Common Vulnerabilities

### CSRF Protection

**Source**: [Cross-Site Request Forgery](https://learn.microsoft.com/en-us/security-updates/glossary/glossary#c)

```typescript
import csrf from 'csurf';

// CSRF middleware
const csrfProtection = csrf({ cookie: true });

app.get('/form', csrfProtection, (req, res) => {
    res.render('form', { csrfToken: req.csrfToken() });
});

app.post('/form', csrfProtection, (req, res) => {
    // CSRF token validated automatically
    res.json({ success: true });
});
```

### Security Headers

```typescript
import helmet from 'helmet';

// ✅ GOOD: Security headers
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", 'data:', 'https:']
        }
    },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    }
}));
```

---

**Document Status**: Complete  
**Last Updated**: November 17, 2025  
**Location**: `STANDARDS/SECURITY/SECURITY_STANDARDS.md`
