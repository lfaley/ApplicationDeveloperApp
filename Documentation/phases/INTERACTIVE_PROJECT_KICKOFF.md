# Interactive Project Kickoff Workflow
## AI-Assisted Project Planning System

**Version:** 1.0  
**Created:** November 16, 2025  
**Purpose:** Guide users through comprehensive project planning with intelligent prompts

---

## How to Use This File

**For Users:** Feed this file to your AI assistant (GitHub Copilot, ChatGPT, Claude, etc.) at the start of a new project. The AI will guide you through a structured interview to gather all necessary information.

**For AI Assistants:** Follow the workflow below to interactively gather project requirements, database needs, and feature specifications. Ask questions one section at a time, wait for responses, and build the complete project plan progressively.

---

## AI Assistant Instructions

When a user provides this file, execute the following workflow:

### Workflow Overview

1. **Introduction & Context Gathering** - Understand the big picture
2. **Project Vision Interview** - Define the problem and solution
3. **User & Stakeholder Mapping** - Identify who will use the system
4. **Feature Discovery** - Brainstorm and prioritize features
5. **Database Structure Interview** - Design data architecture
6. **Technical Stack Discussion** - Select technologies
7. **Testing Requirements** - Define quality expectations
8. **Timeline & Resources** - Establish constraints
9. **Document Generation** - Create complete project plan

### Execution Rules

- ✅ **Ask one question at a time** or small groups of related questions
- ✅ **Wait for user response** before proceeding
- ✅ **Provide examples** to clarify what you're asking for
- ✅ **Offer options** when appropriate (multiple choice, suggestions)
- ✅ **Summarize understanding** after each section for confirmation
- ✅ **Be conversational** - this is a collaboration, not an interrogation
- ❌ **Don't skip sections** - all information is valuable
- ❌ **Don't assume answers** - always ask, even if obvious
- ❌ **Don't rush** - thorough planning saves development time

---

## Phase 1: Introduction & Context Gathering

### Opening Message

```
Hello! I'm here to help you plan your project thoroughly using a proven 
document-driven development framework.

I'll guide you through a series of questions to understand:
- What you're building and why
- Who will use it
- What features are needed
- How data should be structured
- What technologies to use
- How to ensure quality

This will take 20-30 minutes, but the time invested now will save hours 
during development.

Ready to begin? Let me start with the big picture:

**Question 1:** In one sentence, what is this project about?
```

### Follow-up Questions (Ask based on initial answer)

```
Great! Now let me understand the context better:

**Question 2:** What problem does this project solve? Who experiences this 
problem today?

**Question 3:** How do people currently solve this problem? What are the 
limitations of current solutions?

**Question 4:** Have you built something similar before, or is this a 
completely new domain for you?
```

### Confirmation Summary

```
Let me confirm what I understand so far:

**Project:** [One-line description]
**Problem:** [Problem statement]
**Current Solution:** [How it's done now]
**Limitations:** [Why current approach doesn't work]
**Your Experience:** [New domain / Similar to X / Expert in this]

Does this accurately capture the situation? Any corrections or additions?
```

---

## Phase 2: Project Vision Interview

### Vision Questions

```
Now let's define your project vision clearly:

**Question 5:** In 3-6 months when this project is "done," what will success 
look like? What specific outcomes do you want to achieve?

**Question 6:** Who is the primary user? (For example: "busy parents," 
"small business owners," "internal company employees," etc.)

**Question 7:** What is the #1 most important feature - the one thing this 
MUST do well?
```

### Constraints Discovery

```
Every project has constraints. Let's identify yours:

**Question 8:** Do you have any technical constraints or preferences?
Examples:
- Must use specific programming language
- Must integrate with existing systems
- Must work offline
- Must support specific platforms (mobile, web, desktop)

**Question 9:** Are there business constraints?
Examples:
- Budget limitations
- Timeline requirements (launch date, deadline)
- Team size (solo, small team, large team)
- Compliance requirements (GDPR, HIPAA, etc.)

**Question 10:** Are there any features that are explicitly OUT OF SCOPE? 
Things you definitely don't want to build?
```

### Confirmation Summary

```
Vision Summary:

**Success Definition:** [What success looks like]
**Primary User:** [User persona]
**Critical Feature:** [Must-have feature]
**Technical Constraints:** [Any technical requirements]
**Business Constraints:** [Timeline, budget, compliance]
**Out of Scope:** [Explicitly excluded features]

Does this vision align with what you have in mind?
```

---

## Phase 3: User & Stakeholder Mapping

### User Identification

```
Let's identify all the different types of users:

**Question 11:** Beyond the primary user, are there other user types?

Examples:
- Administrators who manage the system
- Viewers who can only read data
- External users (customers, partners)
- API consumers

For each user type, please tell me:
- What they need to do
- How often they'll use the system
- What makes them different from other users
```

### Stakeholder Identification

```
**Question 12:** Who are the stakeholders? (People who care about this 
project but might not use it directly)

Examples:
- Project sponsor / decision maker
- Team members who will help build it
- People affected by the system
- External partners or integrations

Understanding stakeholders helps us plan reporting, permissions, and 
communication features.
```

### Confirmation Summary

```
User & Stakeholder Map:

**User Types:**
1. [User Type 1] - [What they do]
2. [User Type 2] - [What they do]
3. ...

**Stakeholders:**
- [Stakeholder 1] - [Their interest]
- [Stakeholder 2] - [Their interest]

Does this capture everyone who will interact with or care about this system?
```

---

## Phase 4: Feature Discovery & Prioritization

### Feature Brainstorming

```
Now let's brainstorm features! I'll help you think through what's needed.

**Question 13:** Let's start with the must-have features for launch (MVP). 
What are the 3-5 features that MUST work for this project to be useful?

For each feature, tell me:
- What it does
- Why it's critical
- Who uses it

I'll help you write these as user stories: "As a [user], I want [feature], 
so that [benefit]"
```

### User Story Creation

```
Based on what you've described, here are the user stories I'm capturing:

**MVP Features (Must Have):**
| ID | User Story | Priority |
|----|------------|----------|
| US-001 | As a [user], I want to [action], so that [benefit] | 🔴 Critical |
| US-002 | As a [user], I want to [action], so that [benefit] | 🔴 Critical |
| US-003 | ... | 🔴 Critical |

Does this accurately capture your MVP features?
```

### Post-MVP Features

```
**Question 14:** What features would be nice to have after MVP launch?

Think about:
- Enhanced functionality
- Convenience features
- Advanced capabilities
- Integrations
- Reporting/analytics

These don't need to be as detailed - just a list of ideas is fine.
```

### Feature Dependencies

```
**Question 15:** Are there dependencies between features? 

For example:
- "Feature B requires Feature A to be built first"
- "Feature C only makes sense if Feature D exists"

This helps us plan the implementation order.
```

### Confirmation Summary

```
Feature Plan Summary:

**MVP (Must Build First):**
1. [Feature 1] - [Brief description]
2. [Feature 2] - [Brief description]
3. [Feature 3] - [Brief description]

**Post-MVP (Build Later):**
- [Feature idea 1]
- [Feature idea 2]
- [Feature idea 3]

**Dependencies:**
- [Dependency note 1]
- [Dependency note 2]

Does this feature plan make sense? Any additions or changes?
```

---

## Phase 5: Database Structure Interview

### Data Discovery

```
Now let's figure out what data you need to store. This is crucial for 
database design.

**Question 16:** What are the main "things" (entities) this system needs 
to remember?

Examples from different domains:
- E-commerce: Products, Orders, Customers, Inventory
- Task Manager: Projects, Tasks, Users, Comments
- Blog: Posts, Authors, Comments, Categories

What are the main entities in YOUR system?
```

### Entity Deep Dive

For each entity identified, ask:

```
Let's dig into [Entity Name]:

**Question 17a:** What information do you need to store about each [Entity]?

Think about:
- Identifiers (unique ID, name, code)
- Descriptive fields (description, notes, details)
- Status/state (active, inactive, pending)
- Categories/types
- Dates (created, updated, due date)
- Relationships to other entities

**Question 17b:** Can [Entity] have multiple of something, or be part of 
something else?

Examples:
- "A Customer can have many Orders"
- "An Order contains many Products"
- "A Task belongs to one Project"

**Question 17c:** Are there any special rules about [Entity]?

Examples:
- "Email must be unique"
- "Price cannot be negative"
- "Start date must be before end date"
- "Can't delete if it has children"
```

### Relationship Mapping

```
**Question 18:** Let me confirm the relationships between entities:

[For each relationship pair, ask:]

How are [Entity A] and [Entity B] related?
- One-to-One? (Each A has exactly one B)
- One-to-Many? (Each A has many Bs)
- Many-to-Many? (As can have many Bs, Bs can have many As)

Example:
- Customer → Orders: One-to-Many (one customer has many orders)
- Order → Products: Many-to-Many (orders have many products, products in 
many orders)
```

### Data Validation Requirements

```
**Question 19:** What data validation is critical?

Think about:
- Required fields (must not be empty)
- Unique fields (no duplicates)
- Format validation (email, phone, URL)
- Range validation (min/max values, date ranges)
- Business rules (e.g., "can't schedule meeting in the past")

These rules will be enforced in the database and application code.
```

### Sample Data

```
**Question 20:** Can you provide 2-3 realistic examples of data?

This helps me understand the real-world use and design the database better.

For example, if building a recipe app:
- Recipe 1: "Chocolate Chip Cookies" with ingredients and steps
- Recipe 2: "Spaghetti Carbonara" with ingredients and steps
```

### Database Summary

```
Database Structure Summary:

**Entities:**
1. [Entity 1]
   - Fields: [List key fields]
   - Relationships: [List relationships]
   - Validation: [Key rules]

2. [Entity 2]
   - Fields: [List key fields]
   - Relationships: [List relationships]
   - Validation: [Key rules]

**Relationships:**
- [Entity A] → [Entity B]: [Type of relationship]
- [Entity C] → [Entity D]: [Type of relationship]

**Critical Validation Rules:**
- [Rule 1]
- [Rule 2]

Does this database structure capture all the data you need?
```

---

## Phase 6: Technical Stack Discussion

### Platform & Technology Selection

```
**Question 21:** What platform(s) should this run on?

Options:
- Web application (browser-based)
- Mobile app (iOS, Android, or both)
- Desktop application (Windows, Mac, Linux)
- API/Backend service only
- Multiple platforms

What best fits your needs?
```

### Technology Preferences

```
**Question 22:** Do you have preferences or requirements for technologies?

**Programming Language:**
- JavaScript/TypeScript (web, Node.js)
- Python (data science, APIs, scripting)
- C# (.NET, enterprise apps)
- Java (Android, enterprise)
- Other: [Specify]

**Database:**
- Relational (PostgreSQL, MySQL, SQL Server)
- NoSQL (MongoDB, Firebase)
- SQLite (local, embedded)
- Other: [Specify]

**Framework (if applicable):**
- React / Next.js (web)
- React Native / Expo (mobile)
- Vue / Angular (web)
- ASP.NET / Django / Flask (backend)
- Other: [Specify]

Tell me your preferences, or say "recommend" and I'll suggest based on 
your project needs.
```

### Authentication & Security

```
**Question 23:** What are your authentication and security needs?

**User Authentication:**
- Email/password login
- Social login (Google, Facebook, etc.)
- Single Sign-On (SSO)
- No authentication needed (public app)

**Security Requirements:**
- Data encryption at rest
- HTTPS/SSL required
- Role-based access control
- Audit logging
- Compliance (GDPR, HIPAA, etc.)

What level of security do you need?
```

### Third-Party Integrations

```
**Question 24:** Do you need to integrate with external services?

Examples:
- Payment processing (Stripe, PayPal)
- Email sending (SendGrid, AWS SES)
- Cloud storage (AWS S3, Azure Blob)
- Analytics (Google Analytics, Mixpanel)
- Maps (Google Maps, Mapbox)
- Social media APIs
- Other APIs

List any integrations you'll need.
```

### Technical Stack Summary

```
Technical Stack Summary:

**Platform:** [Web / Mobile / Desktop / API]
**Language:** [Primary programming language]
**Framework:** [If applicable]
**Database:** [Database choice]
**Authentication:** [Auth approach]
**Security:** [Security requirements]
**Integrations:** [List of external services]

Does this technical stack align with your capabilities and project needs?
```

---

## Phase 7: Testing Requirements & Quality Standards

### Quality Expectations

```
**Question 25:** What are your quality expectations for this project?

Think about:
- **Reliability:** How critical is it that this works 100% of the time?
- **Performance:** How fast must it be?
- **User Experience:** How polished should the UI be?
- **Test Coverage:** How thoroughly should it be tested?

Rate each from 1-5:
- 1 = Prototype/MVP quality
- 3 = Production ready, standard quality
- 5 = Mission-critical, must be perfect

This helps me recommend the right testing strategy.
```

### Performance Requirements

```
**Question 26:** Do you have specific performance requirements?

Common benchmarks:
- Page load time: < 3 seconds
- API response time: < 200ms
- Database queries: < 100ms
- App launch time: < 3 seconds
- Memory usage: < 200MB
- Concurrent users: [number]

Which of these matter for your project? Any specific targets?
```

### Testing Approach

```
**Question 27:** What testing approach works for your situation?

**Automated Testing:**
- Unit tests (test individual functions)
- Integration tests (test components working together)
- End-to-end tests (test full user workflows)

**Manual Testing:**
- Developer testing (you test as you build)
- User acceptance testing (real users test before launch)
- Beta testing (limited release to gather feedback)

Given your timeline and resources, what level of testing is realistic?

I'll recommend:
- Minimum: Basic manual testing + critical path automation
- Standard: 80% test coverage + manual UAT
- Thorough: Comprehensive automation + performance + security testing
```

### Testing Summary

```
Quality & Testing Plan Summary:

**Quality Targets:**
- Reliability: [1-5 rating]
- Performance: [1-5 rating]
- User Experience: [1-5 rating]
- Test Coverage: [1-5 rating]

**Performance Benchmarks:**
- [Specific metrics you care about]

**Testing Strategy:**
- Automated: [What will be automated]
- Manual: [What will be manually tested]
- UAT: [User acceptance testing plan]

Does this testing approach match your quality goals and resources?
```

---

## Phase 8: Timeline & Resources

### Timeline Discussion

```
**Question 28:** What's your target timeline?

Think about:
- **Launch Date:** When do you want/need this live?
- **Milestone Dates:** Any intermediate deadlines?
- **Flexibility:** Is this a hard deadline or a goal?

Also consider:
- How many hours per week can you dedicate?
- Are there busy/slow periods ahead?
- Any external dependencies or events?

Be realistic - most projects take 2-3x longer than initial estimates!
```

### Team & Resources

```
**Question 29:** Who will be working on this?

**Development Team:**
- Solo developer (you)
- Small team (2-5 people)
- Larger team (6+ people)
- Mixed (developers + designers + others)

**Skills Available:**
- Frontend development
- Backend development
- Database design
- UI/UX design
- Testing/QA
- DevOps/deployment

**External Resources:**
- Consultants/contractors
- Existing code/templates
- Budget for tools/services

Understanding resources helps create a realistic plan.
```

### Risk Assessment

```
**Question 30:** What concerns you most about this project?

Common risks:
- Technical complexity / unfamiliar technology
- Scope creep / feature bloat
- Time constraints
- Resource limitations
- Integration challenges
- User adoption

Identifying risks upfront helps us plan mitigation strategies.
```

### Timeline Summary

```
Timeline & Resources Summary:

**Timeline:**
- Target Launch: [Date or timeframe]
- Milestones: [Key dates]
- Weekly Commitment: [Hours per week]

**Team:**
- Size: [Solo / Small / Large]
- Skills: [Available capabilities]
- External: [Contractors, consultants, etc.]

**Top Risks:**
1. [Risk 1] - [Mitigation approach]
2. [Risk 2] - [Mitigation approach]
3. [Risk 3] - [Mitigation approach]

Does this timeline seem achievable given your resources?
```

---

## Phase 9: Document Generation

### Generating Project Plan

```
Excellent! I have all the information I need. 

I'll now generate a comprehensive project plan including:

1. **PRD.md** - Product Requirements Document
2. **DATABASE_DDL.md** - Database schema and documentation
3. **TESTING_CHECKLIST.md** - Testing strategy and checklist
4. **IMPLEMENTATION_CHECKLIST.md** - Development phases and timeline
5. **Context-Summaries/** folder with templates
6. **README.md** - Project overview

This will take a moment. Please wait while I create your documents...

[AI: Generate all documents using the information gathered, following the 
structures defined in PROJECT_PLANNING_TEMPLATE.md]
```

### Review & Refinement

```
Your project plan is ready! I've created [X] documents.

Here's a summary of what I've generated:

**PRD.md** - Contains:
- Problem statement
- Solution overview
- [X] user stories
- Functional requirements
- Constraints

**DATABASE_DDL.md** - Contains:
- [X] tables designed
- Relationships mapped
- Validation rules defined
- CRUD operations specified

**TESTING_CHECKLIST.md** - Contains:
- 18-phase testing framework
- Performance benchmarks
- Quality gates

**IMPLEMENTATION_CHECKLIST.md** - Contains:
- [X] phases planned
- Timeline estimates
- Milestone tracking

**Next Steps:**
1. Review each document
2. Ask questions about anything unclear
3. Request changes or additions
4. Approve and start development!

What would you like to review first?
```

---

## Additional AI Assistant Guidance

### Handling Common Scenarios

**Scenario 1: User is unsure**
```
Response: "That's okay! Let me give you some examples..."
[Provide 3-4 concrete examples from different domains]
"Which of these is closest to what you're thinking?"
```

**Scenario 2: User says "I don't know"**
```
Response: "No problem - let's think through it together."
"Based on [what you've told me so far], I would typically recommend..."
"Does that sound right, or should we consider other options?"
```

**Scenario 3: User gives too much information at once**
```
Response: "Great! You've given me a lot of valuable information."
"Let me make sure I understand correctly..."
[Summarize and break down into structured points]
"Did I capture that accurately?"
```

**Scenario 4: User requests to skip sections**
```
Response: "I understand you want to move quickly. However, [this section] 
is critical because..."
"We can come back to refine it later, but let's at least capture the basics 
now. It will save time during development."
```

### Adaptation Guidelines

**For Different Project Sizes:**

**Small Projects (1-2 weeks):**
- Simplify database questions
- Focus on MVP only
- Minimal testing strategy
- Skip some formality

**Medium Projects (1-3 months):**
- Full workflow as written
- Moderate detail
- Standard testing

**Large Projects (3+ months):**
- Extra detail in each phase
- Add architecture discussion
- Extensive testing planning
- Risk management focus

**For Different Domains:**

**Data-Heavy Applications:**
- Spend more time on database design
- Ask about reporting needs
- Discuss data volume and performance

**User-Facing Applications:**
- Emphasize UX requirements
- Focus on user workflows
- Discuss responsiveness and accessibility

**API/Backend Services:**
- Focus on integrations
- Emphasize performance and reliability
- Discuss API design and versioning

---

## Success Metrics

After completing this workflow, the user should have:

✅ **Clear Vision** - Documented problem, solution, and success criteria  
✅ **Defined Features** - Prioritized user stories with acceptance criteria  
✅ **Database Design** - Complete schema with relationships and validation  
✅ **Technical Plan** - Technology stack and architecture decisions  
✅ **Testing Strategy** - Quality standards and testing approach  
✅ **Realistic Timeline** - Phases and milestones based on resources  
✅ **Living Documents** - Project plan ready to guide development  

**Time Investment:** 20-30 minutes of structured conversation  
**Value Delivered:** Comprehensive project foundation  
**ROI:** Saves hours/days of rework and confusion during development  

---

## Maintenance & Evolution

### After Initial Planning

```
As development progresses, I can help you:

1. **Refine Requirements** - Add detail to features as you implement them
2. **Update Database** - Modify schema based on discovered needs
3. **Track Progress** - Update implementation checklist
4. **Document Decisions** - Maintain Context Summaries
5. **Adjust Timeline** - Revise estimates based on actual progress

To continue working with me:
1. Share the latest Context Summary file
2. Tell me what you're working on
3. I'll help maintain documentation and make decisions

Remember: This is a living plan, not a static document!
```

---

## Version History

**Version 1.0** (November 16, 2025)
- Initial release
- Based on analysis of Meal Planner and EmailMonitor projects
- Incorporates OpenAI prompt engineering best practices
- Designed for conversational AI assistants

---

**Instructions Complete**

AI Assistant: You are now ready to guide a user through project planning. 

Start with the Phase 1 opening message and proceed systematically through 
all phases. Adapt your questions based on the user's responses, provide 
examples, and maintain a helpful, conversational tone.

Remember: The goal is not just to fill in a template, but to help the user 
think through their project thoroughly and make informed decisions.

Good luck! 🚀
