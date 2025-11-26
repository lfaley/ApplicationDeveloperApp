# Project Planning Template
## Document-Driven Development Framework

**Created:** November 16, 2025  
**Version:** 1.0  
**Based On:** Analysis of Meal Planner and EmailMonitor Projects  
**Purpose:** Comprehensive planning template for document/plan-driven development

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Requirements Definition](#requirements-definition)
3. [Database Architecture](#database-architecture)
4. [Testing Strategy](#testing-strategy)
5. [Implementation Phases](#implementation-phases)
6. [Context Summary System](#context-summary-system)
7. [Project Structure](#project-structure)
8. [Development Workflow](#development-workflow)

---

## Project Overview

### Basic Information
**Project Name:** [Your Project Name]  
**Created:** [Date]  
**Last Updated:** [Date]  
**Primary Language:** [e.g., TypeScript, Python, C#, etc.]  
**Framework:** [e.g., React Native, ASP.NET, Next.js, etc.]  
**Timezone:** [Your timezone for documentation]

### Purpose Statement
[2-3 sentences describing what this project does and why it exists]

### Key Stakeholders
- **Project Owner:** [Name]
- **Development Team:** [Names/Roles]
- **End Users:** [User personas]

---

## Requirements Definition

### Phase 1: PRD (Product Requirements Document)

#### 1.1 Product Vision
**Problem Statement:**
- What problem does this solve?
- Who experiences this problem?
- Current workarounds and their limitations

**Solution Overview:**
- How does this product solve the problem?
- Key differentiators
- Success criteria

#### 1.2 User Stories

**Format:** As a [role], I want [feature], so that [benefit]

**Priority Levels:** 
- 🔴 Critical (MVP)
- 🟡 Important (Post-MVP)
- 🟢 Nice-to-Have (Future)

**Example User Stories:**

| ID | Priority | User Story | Acceptance Criteria |
|----|----------|------------|-------------------|
| US-001 | 🔴 | As a user, I want to [action], so that [benefit] | - Criteria 1<br>- Criteria 2<br>- Criteria 3 |
| US-002 | 🔴 | As a user, I want to [action], so that [benefit] | - Criteria 1<br>- Criteria 2 |

#### 1.3 Functional Requirements

**Core Features (MVP):**
1. **[Feature Name]**
   - Description
   - User flows
   - Edge cases
   - Validation rules

2. **[Feature Name]**
   - Description
   - User flows
   - Edge cases
   - Validation rules

**Post-MVP Features:**
1. **[Feature Name]**
2. **[Feature Name]**

#### 1.4 Non-Functional Requirements

**Performance:**
- Response time requirements
- Concurrent user capacity
- Data volume handling

**Security:**
- Authentication requirements
- Authorization requirements
- Data encryption needs
- Compliance requirements

**Scalability:**
- Expected growth
- Resource scaling plans

**Availability:**
- Uptime requirements
- Backup requirements
- Disaster recovery

#### 1.5 Constraints & Limitations

**Technical Constraints:**
- Platform limitations
- Technology stack restrictions
- API rate limits
- Storage limitations

**Business Constraints:**
- Budget limitations
- Timeline requirements
- Resource availability

**Known Limitations:**
- Features explicitly out of scope
- Platform-specific limitations
- Temporary workarounds

---

## Database Architecture

### Phase 2: Database Design & Documentation

#### 2.1 Data Model Overview

**Entities and Relationships:**
```
[Create an entity-relationship diagram or description]

Example:
User (1) ─── (many) Orders
Order (1) ─── (many) OrderItems
OrderItem (many) ─── (1) Product
```

#### 2.2 Database Schema (DDL)

**File:** `DATABASE_DDL.md` (Create separate file)

For each table, document:

**Table: [TableName]**

**Purpose:** [What this table stores and why]

**Schema:**
```sql
CREATE TABLE table_name (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  field_name VARCHAR(255) NOT NULL,
  foreign_key_id INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (foreign_key_id) REFERENCES other_table(id)
);

CREATE INDEX idx_table_field ON table_name(field_name);
```

**Fields:**
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| field_name | VARCHAR(255) | NOT NULL | Description |

**Relationships:**
- Foreign keys and their relationships
- Cascade behavior

**Indexes:**
- Which fields are indexed
- Reasoning for index choices

**Sample Data:**
```sql
INSERT INTO table_name (field_name) VALUES ('Sample Value');
```

#### 2.3 Database Operations (CRUD API)

Document all database operations:

**Create Operations:**
```typescript
// Example TypeScript interface
interface CreateUserInput {
  email: string;
  name: string;
}

function createUser(input: CreateUserInput): Promise<User>
```

**Read Operations:**
```typescript
function getUserById(id: number): Promise<User | null>
function getUsersByRole(role: string): Promise<User[]>
```

**Update Operations:**
```typescript
function updateUser(id: number, updates: Partial<User>): Promise<User>
```

**Delete Operations:**
```typescript
function deleteUser(id: number): Promise<boolean>
```

#### 2.4 Data Integrity Rules

**Foreign Key Relationships:**
- Cascade delete rules
- Orphan record handling
- Referential integrity

**Data Validation:**
- Required fields
- Format validation (email, phone, etc.)
- Range validation (dates, numbers)
- Uniqueness constraints

**Business Rules:**
- State transitions
- Dependent data requirements
- Calculated fields

#### 2.5 Migration Strategy

**Initial Setup:**
- Database creation scripts
- Initial seed data

**Version Control:**
- Migration naming convention
- Rollback procedures

---

## Testing Strategy

### Phase 3: Comprehensive Testing Plan

#### 3.1 Testing Philosophy

**Testing Levels:**
1. Unit Tests (Individual functions)
2. Integration Tests (Component interactions)
3. End-to-End Tests (User workflows)
4. Performance Tests (Load and stress)
5. Security Tests (Vulnerability scanning)

#### 3.2 Test Planning Checklist

Create `TESTING_CHECKLIST.md` with these phases:

**Phase 1: Environment Setup**
- [ ] Development environment configured
- [ ] Test database initialized
- [ ] Test data generators ready
- [ ] Logging configured for debugging

**Phase 2: Unit Testing**

For each module/service:
- [ ] Happy path tests
- [ ] Error handling tests
- [ ] Edge case tests
- [ ] Boundary condition tests
- [ ] Mock external dependencies

**Phase 3: Database Testing**
- [ ] CRUD operations verified
- [ ] Foreign key constraints tested
- [ ] Index performance validated
- [ ] Transaction handling tested
- [ ] Data integrity maintained
- [ ] Large dataset performance (<100ms queries)

**Example Database Test Structure:**
```typescript
describe('User Database Operations', () => {
  beforeEach(async () => {
    // Setup: Clear test database, seed data
  });
  
  it('should create user with valid data', async () => {
    // Test creation
  });
  
  it('should enforce unique email constraint', async () => {
    // Test constraint
  });
  
  it('should cascade delete related records', async () => {
    // Test cascade
  });
});
```

**Phase 4: API/Service Testing**
- [ ] Authentication flows
- [ ] Authorization checks
- [ ] Input validation
- [ ] Error responses
- [ ] Rate limiting
- [ ] Timeout handling

**Phase 5: Integration Testing**
- [ ] Multi-step workflows
- [ ] Cross-component communication
- [ ] State management
- [ ] Data persistence across sessions

**Phase 6: UI/UX Testing (If applicable)**
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Browser compatibility
- [ ] Loading states
- [ ] Empty states
- [ ] Error states
- [ ] Accessibility (WCAG 2.1)
- [ ] Keyboard navigation
- [ ] Screen reader compatibility

**Phase 7: Performance Testing**
- [ ] Page load time < 3 seconds
- [ ] API response time < 200ms
- [ ] Database queries < 100ms
- [ ] Memory usage < [threshold]
- [ ] No memory leaks
- [ ] Concurrent user handling

**Benchmarks to Measure:**
| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| App Launch | < 3s | - | ⏳ |
| DB Queries | < 100ms | - | ⏳ |
| API Response | < 200ms | - | ⏳ |
| Memory Usage | < 200MB | - | ⏳ |

**Phase 8: Security Testing**
- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] CSRF protection
- [ ] Authentication security
- [ ] Authorization security
- [ ] Data encryption
- [ ] Secure API keys
- [ ] Input sanitization

**Phase 9: Edge Cases & Error Scenarios**
- [ ] Network failures
- [ ] Database connection loss
- [ ] Invalid input handling
- [ ] Race conditions
- [ ] Concurrent operations
- [ ] Data corruption scenarios

**Phase 10: User Acceptance Testing (UAT)**
- [ ] Real-world usage scenarios
- [ ] Beta user feedback
- [ ] Common user workflows
- [ ] Usability testing
- [ ] Performance monitoring

#### 3.3 Test Data Requirements

**Test Fixtures:**
```typescript
// Example test data generators
const testUsers = {
  valid: {
    email: 'test@example.com',
    name: 'Test User'
  },
  invalid: {
    email: 'not-an-email',
    name: ''
  }
};
```

**Data Volume Testing:**
- Small dataset (< 10 records)
- Medium dataset (100 records)
- Large dataset (1000+ records)

#### 3.4 Test Execution Order

**Critical:** Tests must run in specific order when they depend on data:

**Phase 1: Infrastructure**
- Test database connectivity
- Test environment variables
- Test logging

**Phase 2: Foundation**
- Test core utilities
- Test helper functions
- Test validation

**Phase 3: Data Layer**
- Test CRUD operations
- Test relationships
- Test constraints

**Phase 4: Business Logic**
- Test services
- Test calculations
- Test workflows

**Phase 5: Integration**
- Test end-to-end flows
- Test API endpoints
- Test UI components

#### 3.5 Testing Tools & Framework

**Unit Testing:**
- Framework: [Jest, Vitest, xUnit, etc.]
- Coverage target: 80%+

**Integration Testing:**
- Framework: [Supertest, Playwright, etc.]

**E2E Testing:**
- Framework: [Cypress, Selenium, Playwright]

**Performance Testing:**
- Tools: [Lighthouse, k6, JMeter]

**Code Quality:**
- Linter: [ESLint, Pylint, etc.]
- Formatter: [Prettier, Black, etc.]
- Type Checker: [TypeScript, mypy, etc.]

---

## Implementation Phases

### Phase 4: Development Roadmap

#### 4.1 Phase 0: Planning & Design ✅
**Duration:** [X weeks]  
**Deliverables:**
- [ ] PRD complete
- [ ] Database schema designed
- [ ] Testing strategy defined
- [ ] Architecture diagrams created
- [ ] Technology stack selected

#### 4.2 Phase 1: Project Setup ⏳
**Duration:** [X days]  
**Deliverables:**
- [ ] Repository created
- [ ] Dependencies installed
- [ ] Project structure created
- [ ] Development environment configured
- [ ] CI/CD pipeline setup

**Tasks:**
```bash
# Example setup commands
npm init
npm install [dependencies]
mkdir -p src/{components,services,utils,types}
```

#### 4.3 Phase 2: Database Implementation ⏳
**Duration:** [X weeks]  
**Deliverables:**
- [ ] Database schemas created
- [ ] Migration scripts written
- [ ] CRUD operations implemented
- [ ] Database tests passing
- [ ] Seed data prepared

**Checklist:**
- [ ] Create all tables
- [ ] Implement foreign keys
- [ ] Add indexes
- [ ] Write CRUD functions
- [ ] Test data integrity
- [ ] Document all operations

#### 4.4 Phase 3: Core Features Implementation ⏳
**Duration:** [X weeks]

**For each feature:**
- [ ] Feature branch created
- [ ] Business logic implemented
- [ ] Unit tests written
- [ ] Integration tests written
- [ ] Code reviewed
- [ ] Merged to main

**Feature Template:**
```markdown
### Feature: [Feature Name]

**User Story:** US-XXX

**Implementation Steps:**
1. Create models/interfaces
2. Implement service layer
3. Add database operations
4. Create API endpoints (if applicable)
5. Implement UI (if applicable)
6. Write tests
7. Update documentation

**Acceptance Criteria:**
- [ ] Criteria 1
- [ ] Criteria 2
- [ ] Criteria 3

**Testing:**
- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] Manual testing complete

**Status:** ⏳ Not Started / 🔄 In Progress / ✅ Complete
```

#### 4.5 Phase 4: Integration & Testing ⏳
**Duration:** [X weeks]  
**Deliverables:**
- [ ] All features integrated
- [ ] All tests passing
- [ ] Performance optimized
- [ ] Security hardened
- [ ] Documentation complete

#### 4.6 Phase 5: Deployment Preparation ⏳
**Duration:** [X week]  
**Deliverables:**
- [ ] Production environment setup
- [ ] Deployment scripts created
- [ ] Monitoring configured
- [ ] Backup procedures established
- [ ] Rollback procedures documented

#### 4.7 Phase 6: User Acceptance Testing ⏳
**Duration:** [X weeks]  
**Deliverables:**
- [ ] Beta users onboarded
- [ ] Feedback collected
- [ ] Critical issues fixed
- [ ] Documentation updated
- [ ] Training materials created

#### 4.8 Phase 7: Production Launch ⏳
**Duration:** [X days]  
**Deliverables:**
- [ ] Production deployment
- [ ] Monitoring active
- [ ] Support procedures established
- [ ] Post-launch review scheduled

---

## Context Summary System

### Phase 5: Documentation & Session Tracking

#### 5.1 Context Summary Rules

Create `Context-Summaries/ContextSummaryRules.md`

**Purpose:** Maintain project continuity across sessions

**Required Sections in Every Context Summary:**

1. **Session Overview**
   - Goal of the session
   - Context (why this work)
   - Status summary

2. **Previous Context**
   - Link to previous session
   - Key decisions from past
   - Ongoing blockers

3. **Current Work**
   - Active feature/task
   - Implementation approach
   - Progress checklist

4. **File Changes**
   - Created files with purpose
   - Modified files with changes
   - Deleted files with reason

5. **Important Notes**
   - Technical decisions with WHY
   - Trade-offs considered
   - Blockers and workarounds
   - Next steps

6. **Timeline**
   - Timestamped entries for each action
   - Format: `[YYYY-MM-DD | HH:MM TZ]`

**Documentation Standards:**

**Timestamps:**
```markdown
[2025-11-16 | 09:30 CT] Started database implementation
```

**Status Indicators:**
- ✅ Complete
- 🔄 In Progress
- ⏳ Pending/Blocked
- ❌ Failed/Cancelled
- ⚠️ Warning/Issue
- 💡 Idea/Note
- 🔥 Critical/Urgent

**Code Snippets:**
````markdown
```typescript
// src/services/userService.ts
export async function createUser(data: CreateUserInput) {
  return await db.users.create(data);
}
```
````

**Decision Documentation:**
```markdown
**DECISION:** Use PostgreSQL instead of MySQL
**WHY:** 
- Better JSON support needed for flexible schemas
- Superior full-text search
- Strong community support
**ALTERNATIVES CONSIDERED:**
- MySQL: More widely known but limited JSON support
- MongoDB: NoSQL flexibility but less ACID guarantees
**TRADE-OFFS:**
- PRO: Advanced features, strong typing
- CON: Slightly steeper learning curve
```

#### 5.2 Copilot Conversation Starter

Create `Context-Summaries/CopilotConversationStarter.md`

**Instructions for AI Assistant at Session Start:**

**STEP 1:** Review Context-Summaries folder
- Read ContextSummaryRules.md first
- Read most recent Context_Summary file
- Read previous Context_Summary files (newest to oldest)

**STEP 2:** Review ProjectPlanning folder
- PRD.md
- DATABASE_DDL.md
- TESTING_CHECKLIST.md
- Architecture docs

**STEP 3:** Extract Key Information
- Current project status
- Recent decisions
- Active blockers
- Technology stack
- Next planned steps

**STEP 4:** Ask User for Focus
Present options based on current state:
```markdown
Based on my review, I see you're working on [current phase].

What would you like to focus on?
1. Continue [current task]
2. Review and fix [known issue]
3. Start [next planned feature]
4. Review testing coverage
5. Something else
```

**STEP 5:** Update Context Summary
- Add timestamped entries after each action
- Document decisions made
- Track file changes
- Never delete existing entries

#### 5.3 Daily Workflow with Context Summaries

**Start of Day:**
1. Create new Context_Summary file: `Context_Summary_YYYY-MM-DD.md`
2. Copy template structure
3. Link to previous day's summary
4. Note session goals

**During Work:**
1. Add timeline entries for each significant action
2. Document decisions as they're made
3. Track file changes
4. Note blockers immediately

**End of Day:**
1. Review session accomplishments
2. Update "Next Steps" section
3. Ensure all changes documented
4. Link to relevant files/commits

**Starting New Conversation:**
```
"Hello friend. Please review the CopilotConversationStarter.md file and 
perform every action and sub-action it refers to."
```

#### 5.4 File Naming Conventions

**Context Summaries:**
- Single session per day: `Context_Summary_YYYY-MM-DD.md`
- Multiple sessions: `Context_Summary_YYYY-MM-DD_01.md`, `_02.md`, etc.
- Archive in subfolders if needed: `YYYY-MM-DD/Context_Summary_YYYY-MM-DD_01.md`

**Planning Documents:**
- Product Requirements: `PRD.md`
- Database: `DATABASE_DDL.md`
- Testing: `TESTING_CHECKLIST.md`
- Implementation: `IMPLEMENTATION_CHECKLIST.md`

---

## Project Structure

### Phase 6: Folder Organization

#### 6.1 Recommended Structure

```
ProjectRoot/
├── README.md                          # Project overview
├── PRD.md                             # Product requirements
├── DATABASE_DDL.md                    # Database documentation
├── TESTING_CHECKLIST.md               # Testing plan
├── IMPLEMENTATION_CHECKLIST.md        # Development phases
│
├── Context-Summaries/                 # Session documentation
│   ├── README.md                      # Context system overview
│   ├── ContextSummaryRules.md         # Documentation standards
│   ├── CopilotConversationStarter.md  # AI assistant instructions
│   ├── Context_Summary_YYYY-MM-DD.md  # Daily summaries
│   └── YYYY-MM-DD/                    # Archived sessions
│
├── ProjectPlanning/                   # Planning documents
│   ├── README.md                      # Planning overview
│   ├── Architecture.md                # System architecture
│   ├── TechnicalSpec.md              # Technical specifications
│   ├── Implementation_Plan.md         # Detailed plan
│   └── Decision_Log.md               # Technical decisions
│
├── src/                               # Source code
│   ├── components/                    # UI components
│   ├── services/                      # Business logic
│   ├── database/                      # Data layer
│   │   ├── models/                    # Data models
│   │   ├── migrations/                # DB migrations
│   │   └── seeds/                     # Seed data
│   ├── utils/                         # Helper functions
│   ├── types/                         # Type definitions
│   ├── constants/                     # Constants
│   └── config/                        # Configuration
│
├── tests/                             # Test files
│   ├── unit/                          # Unit tests
│   ├── integration/                   # Integration tests
│   ├── e2e/                           # End-to-end tests
│   └── fixtures/                      # Test data
│
├── docs/                              # Additional documentation
│   ├── api/                           # API documentation
│   ├── guides/                        # User guides
│   └── architecture/                  # Architecture diagrams
│
├── scripts/                           # Build/deployment scripts
├── .github/workflows/                 # CI/CD workflows
└── package.json                       # Dependencies
```

#### 6.2 Documentation Files

**Root Level (Frequently Accessed):**
- `README.md` - Project overview, quick start
- `PRD.md` - Product requirements
- `DATABASE_DDL.md` - Database schema
- `TESTING_CHECKLIST.md` - Testing plan
- `IMPLEMENTATION_CHECKLIST.md` - Development roadmap
- `CONTRIBUTING.md` - Contribution guidelines
- `CHANGELOG.md` - Version history

**Context-Summaries/** (Session History):
- `ContextSummaryRules.md` - Documentation standards
- `CopilotConversationStarter.md` - AI workflow
- Daily summaries with complete project history

**ProjectPlanning/** (High-Level Plans):
- Architecture and design documents
- Technical specifications
- Implementation plans
- Decision logs

---

## Development Workflow

### Phase 7: Development Process

#### 7.1 Feature Development Cycle

**1. Planning**
- [ ] Define user story
- [ ] Define acceptance criteria
- [ ] Design database changes (if needed)
- [ ] Design API/service interfaces
- [ ] Identify testing requirements
- [ ] Estimate effort

**2. Design**
- [ ] Create technical design document
- [ ] Review with team
- [ ] Document decisions
- [ ] Update architecture docs

**3. Implementation**
- [ ] Create feature branch
- [ ] Implement database changes
- [ ] Implement business logic
- [ ] Implement UI (if applicable)
- [ ] Write unit tests
- [ ] Write integration tests
- [ ] Update documentation

**4. Testing**
- [ ] Run unit tests
- [ ] Run integration tests
- [ ] Manual testing
- [ ] Performance testing
- [ ] Security testing

**5. Code Review**
- [ ] Self-review code
- [ ] Create pull request
- [ ] Address review comments
- [ ] Update based on feedback

**6. Deployment**
- [ ] Merge to main
- [ ] Run full test suite
- [ ] Deploy to staging
- [ ] Verify in staging
- [ ] Deploy to production

**7. Documentation**
- [ ] Update README
- [ ] Update API docs
- [ ] Update user guides
- [ ] Update Context Summary
- [ ] Create release notes

#### 7.2 Code Quality Standards

**Comments:**
```typescript
/**
 * Creates a new user in the database
 * 
 * @param input - User data including email and name
 * @returns Promise resolving to created user with generated ID
 * @throws Error if email already exists
 * 
 * Example:
 * ```
 * const user = await createUser({ 
 *   email: 'test@example.com', 
 *   name: 'Test User' 
 * });
 * ```
 */
export async function createUser(input: CreateUserInput): Promise<User> {
  // Validate email format
  if (!isValidEmail(input.email)) {
    throw new Error('Invalid email format');
  }
  
  // Check for existing user
  const existing = await getUserByEmail(input.email);
  if (existing) {
    throw new Error('Email already in use');
  }
  
  // Create user
  return await db.users.create(input);
}
```

**Comment Guidelines:**
- **DO:** Explain WHY, not just WHAT
- **DO:** Document complex logic
- **DO:** Include usage examples
- **DO:** Document edge cases
- **DON'T:** State the obvious
- **DON'T:** Leave commented-out code

**Naming Conventions:**
- Classes: `PascalCase`
- Functions: `camelCase`
- Constants: `SCREAMING_SNAKE_CASE`
- Files: `kebab-case.ts` or `camelCase.ts`

**Error Handling:**
```typescript
try {
  const result = await riskyOperation();
  return result;
} catch (error) {
  // Log with context
  logger.error('Failed to perform operation', {
    error,
    context: { userId, operationId }
  });
  
  // Throw user-friendly error
  throw new Error('Unable to complete operation. Please try again.');
}
```

#### 7.3 Git Workflow

**Branching Strategy:**
- `main` - Production-ready code
- `develop` - Integration branch
- `feature/feature-name` - Feature branches
- `fix/bug-description` - Bug fixes
- `hotfix/critical-fix` - Production hotfixes

**Commit Messages:**
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `test:` Tests
- `refactor:` Code refactoring
- `chore:` Maintenance

**Example:**
```
feat(auth): Add password reset functionality

- Implement reset token generation
- Add email sending service
- Create reset password API endpoint
- Add tests for reset flow

Closes #123
```

#### 7.4 Continuous Integration

**PR Checklist:**
- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] New tests added for new features
- [ ] Documentation updated
- [ ] No console.log statements
- [ ] No commented-out code
- [ ] TypeScript errors resolved
- [ ] Performance implications considered

**CI Pipeline:**
1. Lint code
2. Run type checker
3. Run unit tests
4. Run integration tests
5. Check test coverage
6. Build project
7. Deploy to staging (if main branch)

---

## Best Practices Summary

### Key Principles from Both Projects

#### From Meal Planner:
1. **Comprehensive Documentation** - Every feature has its own guide
2. **Progressive Enhancement** - Features added incrementally with testing
3. **User-Centric Design** - Comments reference actual user workflows
4. **Structured Testing** - Clear test execution order with dependencies
5. **Context Preservation** - Historical context files maintained

#### From EmailMonitor:
1. **Detailed Testing Phases** - 18-phase testing checklist
2. **Implementation Tracking** - Clear progress indicators throughout
3. **Error-First Design** - Every phase has error scenarios documented
4. **Real-World Test Data** - Specific, concrete examples for testing
5. **Comprehensive Planning** - Three levels of planning docs (Overview, Quick Start, Implementation)

#### Combined Best Practices:

**1. Plan Before Code**
- Write PRD first
- Design database schema
- Create testing strategy
- Document everything

**2. Test-Driven Development**
- Write tests before/with code
- Test execution order matters
- Cover happy path AND edge cases
- Maintain >= 80% coverage

**3. Document Continuously**
- Update Context Summaries daily
- Document WHY, not just WHAT
- Link related documentation
- Keep README current

**4. Maintain Context**
- Use Context Summary system
- Start each session with AI review
- Never delete historical context
- Link decisions to implementation

**5. Structure for Scale**
- Organize by feature/domain
- Keep related files together
- Clear separation of concerns
- Consistent naming conventions

---

## Quick Start Checklist

### Setting Up a New Project

#### Week 1: Planning Phase
- [ ] Create project repository
- [ ] Copy this template to your project
- [ ] Fill out Project Overview section
- [ ] Write PRD with user stories
- [ ] Define acceptance criteria
- [ ] Identify constraints and limitations

#### Week 2: Design Phase
- [ ] Design database schema
- [ ] Write DATABASE_DDL.md
- [ ] Document all CRUD operations
- [ ] Define data validation rules
- [ ] Create ERD diagrams
- [ ] Plan migration strategy

#### Week 3: Testing Strategy
- [ ] Create TESTING_CHECKLIST.md
- [ ] Define test phases (adapt 18-phase template)
- [ ] Identify test data requirements
- [ ] Set performance benchmarks
- [ ] Plan security testing
- [ ] Define UAT criteria

#### Week 4: Implementation Planning
- [ ] Break project into phases
- [ ] Create IMPLEMENTATION_CHECKLIST.md
- [ ] Estimate durations
- [ ] Identify dependencies
- [ ] Plan milestones
- [ ] Define success criteria

#### Ongoing: Context System
- [ ] Create Context-Summaries folder
- [ ] Copy ContextSummaryRules.md
- [ ] Copy CopilotConversationStarter.md
- [ ] Create first Context_Summary file
- [ ] Use AI assistant workflow daily

---

## Template Customization

### Adapt This Template

**For Different Project Types:**

**Web Application:**
- Add API documentation section
- Include frontend/backend separation
- Add deployment strategies

**Mobile Application:**
- Add platform-specific considerations (iOS/Android)
- Include app store requirements
- Add device testing matrix

**Desktop Application:**
- Add OS-specific requirements
- Include distribution methods
- Add installer/packaging plans

**Library/SDK:**
- Add API surface documentation
- Include versioning strategy
- Add breaking change policy

**Data Science/ML Project:**
- Add model documentation
- Include dataset requirements
- Add model evaluation metrics

**Microservices:**
- Add service boundaries
- Include inter-service communication
- Add deployment orchestration

---

## Success Metrics

### How to Know This Template Is Working

**1. Developer Onboarding**
- New developers understand project in < 2 hours
- Clear entry points in documentation
- Self-service capability

**2. Session Continuity**
- Resume work after days/weeks without confusion
- Context preserved across sessions
- Decisions documented and findable

**3. Quality Metrics**
- Test coverage >= 80%
- No critical bugs in production
- Performance targets met
- Security standards maintained

**4. Documentation Health**
- README up to date
- All decisions documented
- Context Summaries current
- Testing checklist accurate

**5. Development Velocity**
- Features completed on schedule
- Minimal rework required
- Low bug escape rate
- Fast PR reviews

---

## Additional Resources

### Templates to Create

Based on this master template, create:

1. **PRD_TEMPLATE.md** - Product Requirements Document structure
2. **DATABASE_DDL_TEMPLATE.md** - Database documentation format
3. **TESTING_CHECKLIST_TEMPLATE.md** - 18-phase testing framework
4. **Context_Summary_Template.md** - Daily summary structure
5. **Feature_Guide_Template.md** - Per-feature documentation
6. **Implementation_Checklist_Template.md** - Development phases

### Recommended Reading

**From Meal Planner Project:**
- Context-Summaries/ContextSummaryRules.md
- TEMPLATE_FEATURE_GUIDE.md
- TESTING.md
- ProjectPlanning/README.md

**From EmailMonitor Project:**
- TESTING_CHECKLIST.md (18 phases)
- IMPLEMENTATION_CHECKLIST.md (19 phases)
- ProjectPlanning/ProjectOverview.md
- ProjectPlanning/Expo_QuickStart_Guide.md

---

## Conclusion

This template combines the best practices from two successful projects:

**Document-Driven Development:**
1. Write requirements FIRST
2. Design database SECOND
3. Plan testing THIRD
4. Then start coding

**Benefits:**
- Clear project scope
- Reduced rework
- Better testing coverage
- Faster onboarding
- Preserved context
- Higher quality

**Remember:**
- Documentation is code
- Tests are documentation
- Context is currency
- Planning prevents problems

---

**Template Version:** 1.0  
**Last Updated:** November 16, 2025  
**Inspired By:** Meal Planner (lfaley/meal-planner-shoppin) and EmailMonitor (lfaley/EmailMonitor)  
**License:** Free to use and adapt

---

## Next Steps

1. **Copy this template** to your new project
2. **Customize sections** for your project type
3. **Start with PRD** - Define requirements
4. **Design database** - Create schema
5. **Plan testing** - Adapt 18-phase checklist
6. **Implement Context System** - Copy templates
7. **Begin development** - Follow phases
8. **Document continuously** - Update Context Summaries

**Good luck with your project! 🚀**
