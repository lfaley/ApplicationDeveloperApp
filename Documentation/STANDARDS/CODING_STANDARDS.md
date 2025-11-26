# 💻 Coding Standards & Best Practices

**Comprehensive development standards for ProjectPlanner projects**

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Development Methodology](#development-methodology)
3. [Object-Oriented Design](#object-oriented-design)
4. [SOLID Principles](#solid-principles)
5. [Code Reusability (DRY)](#code-reusability-dry)
6. [Logging Standards](#logging-standards)
7. [Error Handling & Resilience](#error-handling--resilience)
8. [Code Comments](#code-comments)
9. [Language-Specific Guidelines](#language-specific-guidelines)
10. [Quality Metrics](#quality-metrics)

---

## Overview

### Philosophy

These coding standards follow a **Documentation-Driven → Test-Driven → Object-Oriented** approach:

1. **Documentation-Driven Development (DDD)**: Write documentation FIRST
   - Define interfaces, APIs, and behavior before coding
   - Creates clear contracts and expectations
   - Reduces rework and misunderstandings

2. **Test-Driven Development (TDD)**: Write tests SECOND
   - Tests validate the documentation's promises
   - Ensures code meets specifications
   - Provides safety net for refactoring

3. **Object-Oriented Development (OOD)**: Write implementation THIRD
   - Focus on code reusability through OOP principles
   - Apply SOLID principles for maintainability
   - Keep applications efficient, powerful, and robust

### Goals

- ✅ **Maximum Code Reuse**: DRY principle - Don't Repeat Yourself
- ✅ **Minimal Application Size**: Efficient through reusability
- ✅ **Robust Error Handling**: Comprehensive logging and resilience patterns
- ✅ **Clear Documentation**: Code comments explain WHY, not just WHAT
- ✅ **Consistent Quality**: Industry-standard practices across all projects

---

## Development Methodology

### Documentation → Test → Code Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                   1. DOCUMENTATION FIRST                    │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  Write:                                              │  │
│  │  • API/Interface definitions                        │  │
│  │  • Function signatures with JSDoc/TSDoc/docstrings  │  │
│  │  • Usage examples                                   │  │
│  │  • Expected behavior                                │  │
│  │  • Error conditions                                 │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    2. TESTS SECOND                          │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  Write tests that validate documentation:           │  │
│  │  • Unit tests for each function/method              │  │
│  │  • Integration tests for workflows                  │  │
│  │  • Edge case tests                                  │  │
│  │  • Error handling tests                             │  │
│  │  • Performance tests                                │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    3. CODE THIRD                            │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  Implement using OOP principles:                    │  │
│  │  • Follow SOLID principles                          │  │
│  │  • Apply DRY (Don't Repeat Yourself)                │  │
│  │  • Use design patterns                              │  │
│  │  • Maximize code reuse                              │  │
│  │  • Add comprehensive logging (levels 0-5)           │  │
│  │  • Implement error handling                         │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Benefits of This Approach

| Phase | Benefit | Industry Standard |
|-------|---------|-------------------|
| **Documentation First** | Clear requirements before coding | [Agile Documentation](https://learn.microsoft.com/en-us/dotnet/architecture/microservices/) |
| **Tests Second** | Validates documentation promises | TDD (Kent Beck) |
| **OOP Third** | Maximizes reusability and maintainability | SOLID (Robert C. Martin) |

---

## Object-Oriented Design

### Core OOP Principles

**Source**: [Object-Oriented Programming (C#)](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/tutorials/oop)

#### 1. Abstraction
Model relevant attributes and interactions as classes.

```csharp
// Good: Abstract interface defines behavior
public interface ILogger {
    void Log(LogLevel level, string message);
    bool IsEnabled(LogLevel level);
}

// Good: Implementation details hidden
public class FileLogger : ILogger {
    private readonly string _filePath;
    
    public void Log(LogLevel level, string message) {
        // Implementation details hidden from caller
        WriteToFile($"{DateTime.UtcNow}: [{level}] {message}");
    }
}
```

#### 2. Encapsulation
Hide internal state, only expose through public interface.

```typescript
// Good: Private fields, public methods
class BankAccount {
    private _balance: number = 0;  // Private state
    
    // Public interface
    public deposit(amount: number): void {
        if (amount <= 0) throw new Error('Amount must be positive');
        this._balance += amount;
    }
    
    public getBalance(): number {
        return this._balance;  // Controlled access
    }
}
```

#### 3. Inheritance
Create new abstractions based on existing ones for code reuse.

**IMPORTANT**: Prefer **Composition over Inheritance** ([F# Coding Conventions](https://learn.microsoft.com/en-us/dotnet/fsharp/style-guide/conventions#object-programming))

```typescript
// AVOID: Deep inheritance hierarchies
class Animal { }
class Mammal extends Animal { }
class Dog extends Mammal { }  // Getting complex

// PREFER: Composition
interface IMovable { move(): void; }
interface IEater { eat(): void; }

class Dog implements IMovable, IEater {
    private _mover = new LegMover();  // Composition
    private _eater = new Omnivore();  // Composition
    
    move() { this._mover.move(); }
    eat() { this._eater.eat(); }
}
```

**When to use inheritance**:
- Single-level inheritance for specialization
- Shared behavior across similar types
- "is-a" relationships (Circle IS-A Shape)

**When to use composition**:
- Multiple behaviors needed
- "has-a" relationships (Car HAS-A Engine)
- Behavior changes at runtime
- Most scenarios (composition is more flexible)

#### 4. Polymorphism
Implement inherited properties/methods in different ways.

```csharp
// Base class with virtual method
public abstract class Shape {
    public abstract double CalculateArea();
}

// Different implementations
public class Circle : Shape {
    public double Radius { get; set; }
    public override double CalculateArea() => Math.PI * Radius * Radius;
}

public class Rectangle : Shape {
    public double Width { get; set; }
    public double Height { get; set; }
    public override double CalculateArea() => Width * Height;
}

// Polymorphic usage
Shape[] shapes = { new Circle { Radius = 5 }, new Rectangle { Width = 3, Height = 4 } };
foreach (var shape in shapes) {
    Console.WriteLine(shape.CalculateArea());  // Different implementations
}
```

---

## SOLID Principles

**Source**: [Use SOLID Principles and Dependency Injection](https://learn.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/microservice-application-layer-web-api-design#use-solid-principles-and-dependency-injection)

### S - Single Responsibility Principle (SRP)

**Rule**: A class should have ONE reason to change.

```typescript
// BAD: Multiple responsibilities
class User {
    name: string;
    email: string;
    
    save() { /* Save to database */ }
    sendEmail() { /* Send email */ }
    generateReport() { /* Create PDF */ }  // Too many jobs!
}

// GOOD: Single responsibility per class
class User {
    constructor(public name: string, public email: string) {}
}

class UserRepository {
    save(user: User) { /* Save to database */ }
}

class EmailService {
    send(to: string, message: string) { /* Send email */ }
}

class ReportGenerator {
    generate(user: User): PDF { /* Create PDF */ }
}
```

### O - Open/Closed Principle (OCP)

**Rule**: Open for extension, closed for modification.

```csharp
// BAD: Must modify class to add new shapes
public class AreaCalculator {
    public double Calculate(object shape) {
        if (shape is Circle c) return Math.PI * c.Radius * c.Radius;
        if (shape is Rectangle r) return r.Width * r.Height;
        // Must add if-statement for each new shape!
        return 0;
    }
}

// GOOD: Extend via interfaces
public interface IShape {
    double CalculateArea();
}

public class AreaCalculator {
    public double Calculate(IShape shape) {
        return shape.CalculateArea();  // No modification needed for new shapes
    }
}

// Add new shapes without changing AreaCalculator
public class Triangle : IShape {
    public double Base { get; set; }
    public double Height { get; set; }
    public double CalculateArea() => 0.5 * Base * Height;
}
```

### L - Liskov Substitution Principle (LSP)

**Rule**: Subtypes must be substitutable for their base types.

```python
# BAD: Square violates LSP (changing width also changes height)
class Rectangle:
    def set_width(self, width):
        self._width = width
    
    def set_height(self, height):
        self._height = height

class Square(Rectangle):  # BAD: Square can't substitute Rectangle
    def set_width(self, width):
        self._width = width
        self._height = width  # Unexpected side effect!

# GOOD: Separate types
class Shape:
    def area(self) -> float:
        pass

class Rectangle(Shape):
    def __init__(self, width: float, height: float):
        self._width = width
        self._height = height
    
    def area(self) -> float:
        return self._width * self._height

class Square(Shape):
    def __init__(self, size: float):
        self._size = size
    
    def area(self) -> float:
        return self._size * self._size
```

### I - Interface Segregation Principle (ISP)

**Rule**: Many specific interfaces > One general interface.

```typescript
// BAD: Fat interface
interface IWorker {
    work(): void;
    eat(): void;
    sleep(): void;
}

class Human implements IWorker {
    work() { /* ... */ }
    eat() { /* ... */ }
    sleep() { /* ... */ }
}

class Robot implements IWorker {
    work() { /* ... */ }
    eat() { /* Robots don't eat! */ }  // Forced to implement
    sleep() { /* Robots don't sleep! */ }  // Forced to implement
}

// GOOD: Segregated interfaces
interface IWorkable { work(): void; }
interface IEatable { eat(): void; }
interface ISleepable { sleep(): void; }

class Human implements IWorkable, IEatable, ISleepable {
    work() { /* ... */ }
    eat() { /* ... */ }
    sleep() { /* ... */ }
}

class Robot implements IWorkable {
    work() { /* ... */ }  // Only implements what it needs
}
```

### D - Dependency Inversion Principle (DIP)

**Rule**: Depend on abstractions, not concretions.

```csharp
// BAD: High-level depends on low-level
public class EmailNotificationService {
    private SmtpClient _smtp = new SmtpClient();  // Tightly coupled!
    
    public void Notify(string message) {
        _smtp.Send(message);
    }
}

// GOOD: Both depend on abstraction
public interface IMessageSender {
    void Send(string message);
}

public class EmailNotificationService {
    private readonly IMessageSender _sender;
    
    // Dependency Injection
    public EmailNotificationService(IMessageSender sender) {
        _sender = sender;
    }
    
    public void Notify(string message) {
        _sender.Send(message);  // Loosely coupled
    }
}

// Can swap implementations
public class SmtpSender : IMessageSender { }
public class SlackSender : IMessageSender { }
public class SmsSender : IMessageSender { }
```

---

## Code Reusability (DRY)

**Principle**: Don't Repeat Yourself

**Source**: [Reusing Objects](https://learn.microsoft.com/en-us/windows/win32/com/reusing-objects)

### Strategies for Reusability

#### 1. Extract Common Functionality

```typescript
// BAD: Repeated code
function createUser(name: string, email: string) {
    const timestamp = new Date().toISOString();
    const id = `user_${Math.random().toString(36).substr(2, 9)}`;
    logger.log(LogLevel.Info, `Creating user: ${name}`);
    
    return { id, name, email, createdAt: timestamp };
}

function createProject(title: string, owner: string) {
    const timestamp = new Date().toISOString();  // Duplicate!
    const id = `proj_${Math.random().toString(36).substr(2, 9)}`;  // Duplicate!
    logger.log(LogLevel.Info, `Creating project: ${title}`);  // Duplicate pattern!
    
    return { id, title, owner, createdAt: timestamp };
}

// GOOD: Extract reusable utilities
class IdGenerator {
    static generate(prefix: string): string {
        return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
    }
}

class TimestampHelper {
    static now(): string {
        return new Date().toISOString();
    }
}

class AuditLogger {
    static logCreation(entityType: string, entityName: string): void {
        logger.log(LogLevel.Info, `Creating ${entityType}: ${entityName}`);
    }
}

// Reuse everywhere
function createUser(name: string, email: string) {
    AuditLogger.logCreation('user', name);
    return {
        id: IdGenerator.generate('user'),
        name,
        email,
        createdAt: TimestampHelper.now()
    };
}

function createProject(title: string, owner: string) {
    AuditLogger.logCreation('project', title);
    return {
        id: IdGenerator.generate('proj'),
        title,
        owner,
        createdAt: TimestampHelper.now()
    };
}
```

#### 2. Use Base Classes/Interfaces

```python
# BAD: Duplicate validation logic
class UserValidator:
    def validate_email(self, email):
        if '@' not in email:
            raise ValueError('Invalid email')
        if len(email) < 5:
            raise ValueError('Email too short')

class ProjectValidator:
    def validate_email(self, email):  # Duplicate!
        if '@' not in email:
            raise ValueError('Invalid email')
        if len(email) < 5:
            raise ValueError('Email too short')

# GOOD: Reusable base class
class BaseValidator:
    @staticmethod
    def validate_email(email: str) -> bool:
        if '@' not in email:
            raise ValueError('Invalid email')
        if len(email) < 5:
            raise ValueError('Email too short')
        return True
    
    @staticmethod
    def validate_not_empty(value: str, field_name: str) -> bool:
        if not value or not value.strip():
            raise ValueError(f'{field_name} cannot be empty')
        return True

class UserValidator(BaseValidator):
    def validate_user(self, name: str, email: str) -> bool:
        self.validate_not_empty(name, 'Name')
        self.validate_email(email)
        return True

class ProjectValidator(BaseValidator):
    def validate_project(self, title: str, owner_email: str) -> bool:
        self.validate_not_empty(title, 'Title')
        self.validate_email(owner_email)
        return True
```

#### 3. Configuration over Code

```csharp
// BAD: Hard-coded logic
public class ReportGenerator {
    public string Generate(string type) {
        if (type == "PDF") {
            return GeneratePDF();
        } else if (type == "Excel") {
            return GenerateExcel();
        } else if (type == "CSV") {
            return GenerateCSV();
        }
        // Must modify code for each new type!
        return null;
    }
}

// GOOD: Configuration-driven with factory pattern
public interface IReportFormat {
    string Generate(ReportData data);
}

public class ReportGenerator {
    private readonly Dictionary<string, IReportFormat> _formats;
    
    public ReportGenerator() {
        // Configuration (could be from config file)
        _formats = new Dictionary<string, IReportFormat> {
            { "PDF", new PdfReportFormat() },
            { "Excel", new ExcelReportFormat() },
            { "CSV", new CsvReportFormat() }
        };
    }
    
    public string Generate(string type, ReportData data) {
        if (_formats.TryGetValue(type, out var format)) {
            return format.Generate(data);
        }
        throw new ArgumentException($"Unsupported format: {type}");
    }
    
    // Add new formats without changing this class
    public void RegisterFormat(string type, IReportFormat format) {
        _formats[type] = format;
    }
}
```

#### 4. Utility Libraries

Create reusable utility modules:

```typescript
// utils/string-utils.ts
export class StringUtils {
    static capitalize(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    
    static truncate(str: string, maxLength: number): string {
        return str.length > maxLength 
            ? str.substring(0, maxLength - 3) + '...' 
            : str;
    }
    
    static slugify(str: string): string {
        return str.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
}

// utils/date-utils.ts
export class DateUtils {
    static formatISO(date: Date): string {
        return date.toISOString();
    }
    
    static addDays(date: Date, days: number): Date {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }
    
    static daysBetween(start: Date, end: Date): number {
        const diff = end.getTime() - start.getTime();
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    }
}

// Use everywhere in your application
import { StringUtils, DateUtils } from './utils';

const slug = StringUtils.slugify('My Project Title');
const dueDate = DateUtils.addDays(new Date(), 7);
```

---

## Logging Standards

### Log Levels (0-5)

**Source**: [Logging in .NET](https://learn.microsoft.com/en-us/dotnet/core/extensions/logging#log-level)

**Standard 6-level system** (Microsoft .NET standard):

| Level | Value | Method | Use Case | Production |
|-------|-------|--------|----------|------------|
| **0 - None** | 6 | - | No logging (disable all) | When logging not needed |
| **1 - Critical** | 5 | `LogCritical()` | Unrecoverable failures, data loss, out of disk space | ✅ Always enabled |
| **2 - Error** | 4 | `LogError()` | Errors that can't be handled, operation failures | ✅ Always enabled |
| **3 - Warning** | 3 | `LogWarning()` | Abnormal events that don't cause failure | ✅ Recommended |
| **4 - Information** | 2 | `LogInformation()` | General flow tracking, long-term value | ⚠️ Selective (high-volume) |
| **5 - Debug** | 1 | `LogDebug()` | Development/troubleshooting details | ❌ Disable in production |
| **5+ - Trace** | 0 | `LogTrace()` | Most verbose, sensitive data | ❌ Never in production |

**IMPORTANT**: In production:
- **Enable**: Critical (1), Error (2), Warning (3)
- **Selective**: Information (4) - only for key events
- **Disable**: Debug (5), Trace (5+) - too verbose, potential security risk

### Configuration Examples

#### .NET/C# (appsettings.json)
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft": "Warning",
      "Microsoft.AspNetCore": "Warning"
    },
    "Console": {
      "LogLevel": {
        "Default": "Information"
      }
    }
  }
}
```

#### TypeScript/Node.js
```typescript
export enum LogLevel {
    None = 0,
    Critical = 1,
    Error = 2,
    Warning = 3,
    Information = 4,
    Debug = 5,
    Trace = 6
}

export interface ILogger {
    logLevel: LogLevel;
    
    critical(message: string, error?: Error): void;
    error(message: string, error?: Error): void;
    warning(message: string): void;
    info(message: string): void;
    debug(message: string): void;
    trace(message: string, data?: any): void;
}

export class Logger implements ILogger {
    constructor(public logLevel: LogLevel = LogLevel.Information) {}
    
    critical(message: string, error?: Error): void {
        if (this.logLevel < LogLevel.Critical) return;
        console.error(`[CRITICAL] ${message}`, error);
    }
    
    error(message: string, error?: Error): void {
        if (this.logLevel < LogLevel.Error) return;
        console.error(`[ERROR] ${message}`, error);
    }
    
    warning(message: string): void {
        if (this.logLevel < LogLevel.Warning) return;
        console.warn(`[WARNING] ${message}`);
    }
    
    info(message: string): void {
        if (this.logLevel < LogLevel.Information) return;
        console.log(`[INFO] ${message}`);
    }
    
    debug(message: string): void {
        if (this.logLevel < LogLevel.Debug) return;
        console.log(`[DEBUG] ${message}`);
    }
    
    trace(message: string, data?: any): void {
        if (this.logLevel < LogLevel.Trace) return;
        console.log(`[TRACE] ${message}`, data);
    }
}
```

#### Python
```python
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,  # Set minimum level
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

# Standard Python levels (0-50)
# NOTSET = 0 (equivalent to None)
# DEBUG = 10 (equivalent to Debug/Trace)
# INFO = 20 (equivalent to Information)
# WARNING = 30 (equivalent to Warning)
# ERROR = 40 (equivalent to Error)
# CRITICAL = 50 (equivalent to Critical)

logger.critical('Unrecoverable failure')  # Level 50
logger.error('Operation failed')          # Level 40
logger.warning('Unusual condition')       # Level 30
logger.info('Normal flow event')          # Level 20
logger.debug('Debugging details')         # Level 10
```

#### PowerShell
```powershell
enum LogLevel {
    None = 0
    Critical = 1
    Error = 2
    Warning = 3
    Information = 4
    Debug = 5
    Trace = 6
}

function Write-Log {
    param(
        [LogLevel]$Level,
        [string]$Message,
        [System.Exception]$Exception
    )
    
    $script:LogLevel = [LogLevel]::Information
    
    if ($Level -gt $script:LogLevel) { return }
    
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $levelName = $Level.ToString().ToUpper()
    $logMessage = "$timestamp [$levelName] $Message"
    
    switch ($Level) {
        ([LogLevel]::Critical) { Write-Host $logMessage -ForegroundColor Red }
        ([LogLevel]::Error) { Write-Host $logMessage -ForegroundColor Red }
        ([LogLevel]::Warning) { Write-Host $logMessage -ForegroundColor Yellow }
        ([LogLevel]::Information) { Write-Host $logMessage -ForegroundColor Green }
        ([LogLevel]::Debug) { Write-Host $logMessage -ForegroundColor Cyan }
        ([LogLevel]::Trace) { Write-Host $logMessage -ForegroundColor Gray }
    }
    
    if ($Exception) {
        Write-Host "  Exception: $($Exception.Message)" -ForegroundColor Red
    }
}

# Usage
Write-Log -Level ([LogLevel]::Error) -Message "Failed to connect" -Exception $_.Exception
Write-Log -Level ([LogLevel]::Info) -Message "Operation completed successfully"
```

### Best Practices

**Source**: [Observability Patterns](https://learn.microsoft.com/en-us/dotnet/architecture/cloud-native/observability-patterns#when-to-use-logging)

1. **Production Guidance**:
   - **Critical/Error/Warning**: Always enabled, low-cost storage
   - **Information**: Selective (key events only), consider costs
   - **Debug/Trace**: DISABLE (high volume, sensitive data risk)

2. **Development Guidance**:
   - Default to **Warning** level
   - Add **Debug** when troubleshooting specific issues
   - Use **Trace** sparingly (very verbose)

3. **Log Message Quality**:
   ```csharp
   // BAD: Not useful
   logger.LogError("Error occurred");
   
   // GOOD: Actionable with context
   logger.LogError(ex, 
       "Failed to process order {OrderId} for customer {CustomerId}. " +
       "Reason: {Reason}",
       orderId, customerId, ex.Message);
   ```

4. **Structured Logging**:
   ```typescript
   // Use structured data (not string concatenation)
   logger.info('User logged in', {
       userId: user.id,
       username: user.name,
       ipAddress: request.ip,
       timestamp: new Date()
   });
   ```

5. **Sensitive Data**:
   ```python
   # NEVER log passwords, tokens, PII in production
   # BAD
   logger.info(f"User login: {username}, password: {password}")
   
   # GOOD
   logger.info(f"User login: {username}, authenticated: True")
   ```

---

## Error Handling & Resilience

**Sources**: 
- [Circuit Breaker Pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker)
- [Implement Resilient Applications](https://learn.microsoft.com/en-us/dotnet/architecture/microservices/implement-resilient-applications/implement-circuit-breaker-pattern)

### 1. Try-Catch-Finally

```csharp
public async Task<Result> ProcessOrderAsync(Order order) {
    try {
        _logger.LogInformation("Processing order {OrderId}", order.Id);
        
        await ValidateOrderAsync(order);
        await SaveOrderAsync(order);
        await NotifyCustomerAsync(order);
        
        _logger.LogInformation("Successfully processed order {OrderId}", order.Id);
        return Result.Success();
    }
    catch (ValidationException ex) {
        // Specific exception handling
        _logger.LogWarning(ex, "Validation failed for order {OrderId}", order.Id);
        return Result.Failure("Invalid order data");
    }
    catch (DbException ex) {
        // Database errors
        _logger.LogError(ex, "Database error processing order {OrderId}", order.Id);
        return Result.Failure("Failed to save order");
    }
    catch (Exception ex) {
        // Catch-all for unexpected errors
        _logger.LogCritical(ex, "Unexpected error processing order {OrderId}", order.Id);
        throw;  // Re-throw critical errors
    }
    finally {
        // Cleanup (always runs)
        await CleanupResourcesAsync();
    }
}
```

### 2. Retry Pattern

**Use Case**: Transient failures (network timeouts, temporary unavailability)

```typescript
interface RetryOptions {
    maxAttempts: number;
    delayMs: number;
    exponentialBackoff: boolean;
}

async function retryAsync<T>(
    operation: () => Promise<T>,
    options: RetryOptions,
    logger: ILogger
): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= options.maxAttempts; attempt++) {
        try {
            logger.debug(`Attempt ${attempt}/${options.maxAttempts}`);
            return await operation();
        }
        catch (error) {
            lastError = error;
            
            if (attempt < options.maxAttempts) {
                const delay = options.exponentialBackoff
                    ? options.delayMs * Math.pow(2, attempt - 1)
                    : options.delayMs;
                
                logger.warning(`Attempt ${attempt} failed, retrying in ${delay}ms`);
                await sleep(delay);
            }
        }
    }
    
    logger.error(`All ${options.maxAttempts} attempts failed`, lastError);
    throw lastError;
}

// Usage
const result = await retryAsync(
    () => fetchDataFromApi(),
    { maxAttempts: 3, delayMs: 1000, exponentialBackoff: true },
    logger
);
```

### 3. Circuit Breaker Pattern

**Use Case**: Prevent cascading failures, protect failing services

```csharp
public enum CircuitState {
    Closed,      // Normal operation
    Open,        // Failing, blocking requests
    HalfOpen     // Testing if service recovered
}

public class CircuitBreaker {
    private CircuitState _state = CircuitState.Closed;
    private int _failureCount = 0;
    private DateTime _lastFailureTime;
    private readonly int _failureThreshold;
    private readonly TimeSpan _timeout;
    private readonly ILogger _logger;
    
    public CircuitBreaker(int failureThreshold, TimeSpan timeout, ILogger logger) {
        _failureThreshold = failureThreshold;
        _timeout = timeout;
        _logger = logger;
    }
    
    public async Task<T> ExecuteAsync<T>(Func<Task<T>> operation) {
        if (_state == CircuitState.Open) {
            // Check if timeout expired
            if (DateTime.UtcNow - _lastFailureTime >= _timeout) {
                _logger.LogInformation("Circuit breaker entering half-open state");
                _state = CircuitState.HalfOpen;
            }
            else {
                _logger.LogWarning("Circuit breaker is open, rejecting request");
                throw new CircuitBreakerOpenException("Service unavailable");
            }
        }
        
        try {
            T result = await operation();
            
            // Success: reset failure count
            if (_state == CircuitState.HalfOpen) {
                _logger.LogInformation("Circuit breaker closing (service recovered)");
                _state = CircuitState.Closed;
            }
            _failureCount = 0;
            
            return result;
        }
        catch (Exception ex) {
            _failureCount++;
            _lastFailureTime = DateTime.UtcNow;
            
            _logger.LogError(ex, "Operation failed (failure {Count}/{Threshold})", 
                _failureCount, _failureThreshold);
            
            if (_failureCount >= _failureThreshold) {
                _logger.LogWarning("Circuit breaker opening due to repeated failures");
                _state = CircuitState.Open;
            }
            
            throw;
        }
    }
}

// Usage
var circuitBreaker = new CircuitBreaker(
    failureThreshold: 5,
    timeout: TimeSpan.FromSeconds(30),
    logger
);

try {
    var result = await circuitBreaker.ExecuteAsync(() => CallExternalServiceAsync());
}
catch (CircuitBreakerOpenException) {
    // Service temporarily unavailable
    return CachedResult();
}
```

### 4. Defensive Programming

```python
def process_user_data(user_id: int, data: dict) -> bool:
    """
    Process user data with defensive checks.
    
    Args:
        user_id: User identifier (must be positive)
        data: User data dictionary
    
    Returns:
        True if processing succeeded
    
    Raises:
        ValueError: If inputs are invalid
        DatabaseError: If database operation fails
    """
    # Input validation
    if user_id <= 0:
        raise ValueError(f"Invalid user_id: {user_id}")
    
    if not data or not isinstance(data, dict):
        raise ValueError("data must be a non-empty dictionary")
    
    required_fields = ['name', 'email']
    missing = [f for f in required_fields if f not in data]
    if missing:
        raise ValueError(f"Missing required fields: {missing}")
    
    try:
        # Sanitize inputs
        name = str(data['name']).strip()
        email = str(data['email']).strip().lower()
        
        if not name or len(name) > 100:
            raise ValueError("Name must be 1-100 characters")
        
        if '@' not in email or len(email) > 255:
            raise ValueError("Invalid email format")
        
        # Process with logging
        logger.info(f"Processing data for user {user_id}")
        result = save_to_database(user_id, name, email)
        
        logger.info(f"Successfully processed user {user_id}")
        return result
        
    except DatabaseError as ex:
        logger.error(f"Database error for user {user_id}: {ex}")
        raise
    except Exception as ex:
        logger.critical(f"Unexpected error processing user {user_id}: {ex}")
        raise
```

### 5. Error Response Standards

```typescript
// Standard error response structure
interface ErrorResponse {
    success: false;
    error: {
        code: string;           // Machine-readable error code
        message: string;        // Human-readable message
        details?: any;          // Additional context (dev only)
        timestamp: string;      // ISO timestamp
        requestId: string;      // Correlation ID for tracing
    };
}

class ErrorHandler {
    static handle(error: Error, requestId: string, logger: ILogger): ErrorResponse {
        // Log the error
        logger.error('Request failed', {
            requestId,
            error: error.message,
            stack: error.stack
        });
        
        // Determine error type
        let code: string;
        let statusCode: number;
        
        if (error instanceof ValidationError) {
            code = 'VALIDATION_ERROR';
            statusCode = 400;
        } else if (error instanceof AuthenticationError) {
            code = 'AUTHENTICATION_FAILED';
            statusCode = 401;
        } else if (error instanceof NotFoundError) {
            code = 'RESOURCE_NOT_FOUND';
            statusCode = 404;
        } else {
            code = 'INTERNAL_ERROR';
            statusCode = 500;
            logger.critical('Unhandled error type', { error });
        }
        
        // Return sanitized error (never expose stack traces in production)
        return {
            success: false,
            error: {
                code,
                message: error.message,
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
                timestamp: new Date().toISOString(),
                requestId
            }
        };
    }
}
```

---

## Code Comments

### Guidelines

**Good comments explain WHY, not WHAT**

```typescript
// BAD: Redundant (code is self-explanatory)
// Increment i by 1
i++;

// Set user name to John
const userName = 'John';

// GOOD: Explains reasoning
// Use exponential backoff to avoid overwhelming the API during outages
const delay = baseDelay * Math.pow(2, attempt);

// Cache for 5 minutes - balance between freshness and performance
const CACHE_TTL = 5 * 60 * 1000;

// Azure Storage has 500 requests/sec limit per account
if (requestCount > 500) {
    await throttle();
}
```

### Documentation Comments (JSDoc/TSDoc/Docstrings)

```typescript
/**
 * Calculates the velocity for a sprint based on completed story points.
 * 
 * Uses the Azure DevOps recommended 3-sprint rolling average for forecasting.
 * Falls back to current sprint velocity if insufficient history exists.
 * 
 * @param sprintHistory - Array of completed sprints (most recent first)
 * @param method - Calculation method: 'rolling-3' (recommended), 'rolling-6', or 'current'
 * @returns Calculated velocity in story points per sprint
 * @throws {Error} If sprintHistory is empty or method is invalid
 * 
 * @example
 * ```typescript
 * const history = [
 *   { completedPoints: 24 },
 *   { completedPoints: 28 },
 *   { completedPoints: 22 }
 * ];
 * const velocity = calculateVelocity(history, 'rolling-3');  // Returns 24.67
 * ```
 * 
 * @see {@link https://learn.microsoft.com/en-us/azure/devops/report/dashboards/team-velocity}
 */
export function calculateVelocity(
    sprintHistory: Sprint[],
    method: 'rolling-3' | 'rolling-6' | 'current' = 'rolling-3'
): number {
    if (!sprintHistory || sprintHistory.length === 0) {
        throw new Error('Sprint history cannot be empty');
    }
    
    // Implementation...
}
```

### Inline Comments for Complex Logic

```csharp
public DateTime EstimateCompletion(int remainingPoints, double velocity) {
    // Azure DevOps forecasting algorithm:
    // 1. Calculate sprints needed (round up - can't complete partial sprint)
    int sprintsNeeded = (int)Math.Ceiling(remainingPoints / velocity);
    
    // 2. Convert to days (assume 2-week sprints per Scrum standard)
    const int SPRINT_DURATION_DAYS = 14;
    int daysNeeded = sprintsNeeded * SPRINT_DURATION_DAYS;
    
    // 3. Skip weekends (5 business days per week)
    //    Formula: (daysNeeded / 7) * 2 additional days for weekends
    int totalDays = daysNeeded + ((daysNeeded / 7) * 2);
    
    return DateTime.Today.AddDays(totalDays);
}
```

### TODO Comments

```python
# TODO: Implement caching to improve performance (GitHub Issue #123)
# Expected impact: Reduce database queries by 80%
# Blocked by: Need to finalize cache invalidation strategy
def get_user_data(user_id: int):
    # Current implementation: Direct database query
    return db.query(f"SELECT * FROM users WHERE id = {user_id}")

# FIXME: Race condition when multiple requests update same record simultaneously
# Reproduces when >10 concurrent requests
# Priority: HIGH - causes data corruption
# Proposed fix: Use database-level locking or optimistic concurrency
def update_inventory(product_id: int, quantity: int):
    current = get_inventory(product_id)
    new_quantity = current + quantity  # Race condition here!
    save_inventory(product_id, new_quantity)
```

---

## Language-Specific Guidelines

### C# / .NET

**Follow Microsoft conventions**: [C# Coding Conventions](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/coding-style/coding-conventions)

```csharp
// ✅ PascalCase for public members
public class UserService {
    // ✅ camelCase with underscore for private fields
    private readonly ILogger<UserService> _logger;
    
    // ✅ PascalCase for properties
    public string ConnectionString { get; set; }
    
    // ✅ PascalCase for methods
    public async Task<User> GetUserAsync(int userId) {
        // ✅ camelCase for local variables
        var user = await _repository.FindAsync(userId);
        return user;
    }
}

// ✅ Use async/await for I/O operations
// ❌ Don't block with .Result or .Wait()
```

### TypeScript / JavaScript

**Follow industry standards**: [TypeScript Do's and Don'ts](https://www.typescriptlang.com/docs/handbook/declaration-files/do-s-and-don-ts.html)

```typescript
// ✅ Use interfaces for object shapes
interface IUser {
    id: number;
    name: string;
    email: string;
}

// ✅ camelCase for variables, functions
export class UserService {
    // ✅ Use readonly for immutability
    constructor(private readonly logger: ILogger) {}
    
    // ✅ Async functions return Promise
    async getUserAsync(userId: number): Promise<IUser> {
        this.logger.info(`Fetching user ${userId}`);
        const user = await this.repository.find(userId);
        return user;
    }
}

// ✅ Use const/let, never var
const API_URL = 'https://api.example.com';
let retryCount = 0;
```

### Python

**Follow PEP 8**: [Style Guide for Python Code](https://peps.python.org/pep-0008/)

```python
# ✅ snake_case for functions, variables
# ✅ PascalCase for classes
# ✅ UPPER_CASE for constants

MAX_RETRIES = 3

class UserService:
    """Service for managing user operations."""
    
    def __init__(self, logger: ILogger):
        # ✅ Private members start with underscore
        self._logger = logger
    
    def get_user(self, user_id: int) -> User:
        """
        Retrieve user by ID.
        
        Args:
            user_id: The user's unique identifier
            
        Returns:
            User object if found
            
        Raises:
            ValueError: If user_id is invalid
            UserNotFoundError: If user doesn't exist
        """
        if user_id <= 0:
            raise ValueError('user_id must be positive')
        
        self._logger.info(f'Fetching user {user_id}')
        return self._repository.find(user_id)
```

### PowerShell

**Follow PowerShell best practices**:

```powershell
# ✅ Use approved verbs (Get, Set, New, Remove, etc.)
function Get-UserData {
    [CmdletBinding()]  # ✅ Use CmdletBinding for advanced functions
    param(
        [Parameter(Mandatory=$true)]  # ✅ Mark required parameters
        [ValidateRange(1, [int]::MaxValue)]  # ✅ Validate inputs
        [int]$UserId,
        
        [Parameter(Mandatory=$false)]
        [LogLevel]$LogLevel = [LogLevel]::Information
    )
    
    begin {
        # ✅ Setup phase
        Write-Log -Level $LogLevel -Message "Starting Get-UserData"
    }
    
    process {
        # ✅ Main logic
        try {
            $user = Invoke-DatabaseQuery -Query "SELECT * FROM Users WHERE Id = $UserId"
            return $user
        }
        catch {
            # ✅ Proper error handling
            Write-Log -Level ([LogLevel]::Error) -Message "Failed to get user" -Exception $_.Exception
            throw
        }
    }
    
    end {
        # ✅ Cleanup phase
        Write-Log -Level $LogLevel -Message "Completed Get-UserData"
    }
}
```

---

## Quality Metrics

### Code Quality Targets

| Metric | Target | Tool | Why |
|--------|--------|------|-----|
| **Test Coverage** | ≥90% | Vitest, Jest, xUnit | Ensures code is tested |
| **Code Duplication** | <5% | SonarQube, ReSharper | Validates DRY principle |
| **Cyclomatic Complexity** | ≤10 per method | ESLint, SonarQube | Maintainability |
| **Technical Debt Ratio** | <5% | SonarQube | Long-term health |
| **Bug Density** | <1 per KLOC | Static analysis | Code quality |
| **Documentation Coverage** | 100% public APIs | TSDoc, JSDoc, XML docs | Usability |

### Code Review Checklist

Before submitting code for review:

- [ ] **Documentation written FIRST** (JSDoc/TSDoc/docstrings for all public APIs)
- [ ] **Tests written SECOND** (90%+ coverage)
- [ ] **Code follows SOLID principles**
- [ ] **DRY principle applied** (no duplicate code)
- [ ] **Logging added** (appropriate levels 1-5)
- [ ] **Error handling implemented** (try-catch, retries where appropriate)
- [ ] **Comments explain WHY, not WHAT**
- [ ] **No sensitive data in logs** (passwords, tokens, PII)
- [ ] **Performance considered** (no obvious bottlenecks)
- [ ] **Security validated** (no SQL injection, XSS, etc.)

---

## Summary

### Development Flow

```
1. Write Documentation (JSDoc/TSDoc/Docstrings)
   ↓
2. Write Tests (90%+ coverage)
   ↓
3. Write Code (SOLID, DRY, OOP)
   ↓
4. Add Logging (Levels 0-5)
   ↓
5. Implement Error Handling (Try-Catch, Retry, Circuit Breaker)
   ↓
6. Add Comments (WHY, not WHAT)
   ↓
7. Code Review (checklist above)
   ↓
8. Deploy & Monitor
```

### Key Principles

1. **Documentation → Test → Code**: This order ensures clarity and quality
2. **SOLID Principles**: Write maintainable, flexible code
3. **DRY (Don't Repeat Yourself)**: Maximize code reuse
4. **Composition over Inheritance**: Prefer composition for flexibility
5. **Logging Levels 0-5**: Appropriate verbosity for each environment
6. **Error Resilience**: Retry patterns, circuit breakers, defensive programming
7. **Meaningful Comments**: Explain WHY, not WHAT

---

**Document Status**: Complete  
**Last Updated**: November 17, 2025  
**Location**: `STANDARDS/CODING/CODING_STANDARDS.md`
