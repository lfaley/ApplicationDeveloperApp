# 🤖 MCP Agent Development Standards

**Comprehensive standards for building Model Context Protocol servers and AI agents**

---

## Files in This Directory

### Core Standards
- **MCP_AGENT_DEVELOPMENT_STANDARDS.md** (39,000+ lines)
  - Complete MCP/AI agent development reference
  - Industry standards from Microsoft, Anthropic, OpenAI
  - Security best practices (OWASP, MCP spec)
  - Responsible AI principles
  - Testing and validation strategies
  - Conversation/prompt management
  - Implementation checklists

- **DOCUMENTATION_AGENT_PLAN.md** (370+ lines)
  - Technical design for documentation automation agent
  - 6 core tools for workspace analysis and updates
  - Architecture and implementation details
  - 17-hour implementation timeline

---

## What is MCP?

**Model Context Protocol (MCP)** is an open standard for connecting AI assistants to external tools and data sources. Think of it as a universal API for AI.

### Key Concepts
- **MCP Server**: Provides tools/resources to AI assistants
- **MCP Client**: AI assistant (GitHub Copilot, Claude Desktop, etc.)
- **Tools**: Functions the AI can invoke (like analyzing files, generating summaries)
- **Resources**: Data sources the AI can read (files, databases, APIs)
- **Prompts**: Pre-written instructions the AI can use

---

## Quick Start

### For New MCP Servers
1. Read **MCP_AGENT_DEVELOPMENT_STANDARDS.md** sections 1-3 (Overview, Planning, Security)
2. Use the Agent Planning Template (Section 2.1)
3. Follow the 7-Phase Implementation Checklist (Section 8)
4. Implement security best practices from the start (Section 3)
5. Test thoroughly using provided test scenarios (Section 5)

### For Existing Agents
1. Assess against **MCP_AGENT_DEVELOPMENT_STANDARDS.md**
2. Review security checklist (Section 3)
3. Implement missing safeguards
4. Add comprehensive testing (Section 5)
5. Document according to standards (Section 6)

---

## Standards Overview

### 1. Planning & Design (Section 2)
**Define before coding:**
- **Objectives**: What problem does this agent solve?
- **Capabilities**: What tools/resources does it provide?
- **Context**: What data sources does it access?
- **Users**: Who will use this agent?
- **Success Metrics**: How do you measure success?

### 2. Security Best Practices (Section 3)
**Critical for all agents:**

#### Input Validation
- ✅ Use zod for schema validation
- ✅ Sanitize all user inputs
- ✅ Validate file paths (prevent directory traversal)
- ✅ Rate limit requests

#### Authentication & Authorization
- ✅ Implement JWT-based authentication
- ✅ Role-based access control (RBAC)
- ✅ Validate token audience
- ✅ Session binding to prevent hijacking

#### Audit Logging
- ✅ Log all tool invocations
- ✅ Sanitize sensitive data before logging
- ✅ Include timestamp, user, action, result
- ✅ Tamper-proof logging

### 3. Responsible AI (Section 4)
**Ethical considerations:**
- **Transparency**: Clearly state capabilities and limitations
- **Appropriate Expectations**: Don't oversell agent abilities
- **Prevent Overreliance**: Include validation checkpoints
- **Security & Privacy**: Protect user data, comply with regulations
- **Governance**: Document decisions, maintain accountability
- **Feedback**: Collect user input, iterate improvements

### 4. Testing & Validation (Section 5)
**Comprehensive testing strategy:**

#### Unit Tests
- Test each tool in isolation
- Mock external dependencies
- Cover edge cases and errors
- Aim for 90%+ coverage

#### Integration Tests
- Test tool chains (multiple tools together)
- Use test databases/files
- Verify error propagation
- Check state management

#### Security Tests
- Test against OWASP Top 10
- Injection attacks (SQL, command, prompt)
- Authentication bypass attempts
- Authorization escalation
- Input validation bypass

#### Red Team Tests
- Prompt injection attacks
- Jailbreaking attempts
- Data exfiltration scenarios
- Command injection
- Use Azure AI Red Teaming Agent or PYRIT

### 5. Conversation Management (Section 7)
**Answer to "Should we capture prompts?"**

✅ **YES** - But with intelligent summarization, NOT full transcripts

#### What to Capture:
- **Session metadata**: ID, user, timestamp, objective
- **Decisions made**: Key choices and their rationale
- **Artifacts created**: Files generated, code written
- **Tool invocations**: Which tools used, parameters, results
- **Issues encountered**: Errors, warnings, failures
- **Metrics**: Duration, token usage, success/failure

#### What NOT to Capture:
- ❌ Full conversation transcripts (token waste, privacy risk)
- ❌ Sensitive data (PII, credentials, secrets)
- ❌ Transient context (regeneratable information)
- ❌ Redundant information (duplicate summaries)

#### Implementation:
```typescript
interface ConversationSummary {
  sessionId: string;
  userId: string;
  startTime: Date;
  endTime: Date;
  objective: string;
  outcome: string;
  decisionsMade: Array<{ decision: string; rationale: string }>;
  artifactsCreated: Array<{ type: string; path: string; description: string }>;
  toolsInvoked: Array<{ tool: string; parameters: any; result: string }>;
  warnings: string[];
  errors: string[];
  metrics: { duration: number; tokensUsed: number; success: boolean };
}
```

#### Storage & Retention:
- **Daily summaries**: Human-readable markdown, 1-year retention
- **Session data**: Machine-readable JSON, 90-day retention
- **Audit logs**: Security events, 90-day retention
- **Full transcripts**: NEVER stored (privacy + token efficiency)

---

## Architecture Patterns

### MCP Server Structure
```
mcp-server/
├── src/
│   ├── index.ts              # Server entry point
│   ├── tools/                # Tool implementations
│   │   ├── analyze.ts
│   │   ├── generate.ts
│   │   └── update.ts
│   ├── services/             # Business logic
│   │   ├── fileScanner.ts
│   │   ├── contextBuilder.ts
│   │   └── validator.ts
│   └── utils/                # Utilities
│       ├── fileUtils.ts
│       ├── validation.ts
│       └── logging.ts
├── tests/                    # Comprehensive tests
│   ├── tools/
│   ├── services/
│   └── security/
├── package.json
├── tsconfig.json
├── README.md
└── SECURITY.md
```

### Tool Design Pattern
```typescript
import { z } from 'zod';

// 1. Define schema
const InputSchema = z.object({
  filePath: z.string().min(1),
  options: z.object({
    recursive: z.boolean().optional()
  }).optional()
});

// 2. Implement tool
export async function analyzeTool(input: unknown) {
  // 2a. Validate input
  const validated = InputSchema.parse(input);
  
  // 2b. Authorize (check permissions)
  await checkPermissions(validated.filePath);
  
  // 2c. Execute logic
  const result = await analyze(validated.filePath, validated.options);
  
  // 2d. Audit log
  await logToolInvocation('analyze', validated, result);
  
  // 2e. Return result
  return result;
}
```

---

## Common Pitfalls

### ❌ Security Anti-Patterns
- Trusting user input without validation
- Allowing arbitrary file system access
- Missing authentication/authorization
- Logging sensitive data in plain text
- No rate limiting (DoS vulnerability)
- Using eval() or exec() with user input

### ❌ Design Anti-Patterns
- Too many tools in one server (poor separation of concerns)
- Tools with side effects without confirmation
- No error handling or recovery
- Unclear tool descriptions
- Missing input validation
- Poor naming conventions

### ❌ Testing Anti-Patterns
- Only testing happy paths
- No security testing
- Skipping integration tests
- Ignoring edge cases
- No red team testing

### ✅ Best Practices
- Validate ALL inputs with zod
- Implement authentication & authorization
- Audit log all operations
- Rate limit requests
- Sanitize outputs
- Test security thoroughly
- Document comprehensively
- Use safety meta-prompts
- Conduct red team testing
- Monitor in production

---

## Implementation Checklist

### Phase 1: Planning (Week 1)
- [ ] Define agent objectives and success metrics
- [ ] Identify required capabilities (tools/resources)
- [ ] Document data sources and context
- [ ] Create security threat model
- [ ] Define responsible AI principles

### Phase 2: Security Setup (Week 1)
- [ ] Implement input validation (zod schemas)
- [ ] Set up authentication (JWT)
- [ ] Configure authorization (RBAC)
- [ ] Add rate limiting
- [ ] Implement audit logging

### Phase 3: Core Development (Week 2-3)
- [ ] Implement tool handlers
- [ ] Build business logic services
- [ ] Add error handling
- [ ] Create utilities
- [ ] Write comprehensive tests

### Phase 4: Testing & Validation (Week 3-4)
- [ ] Unit tests (90%+ coverage)
- [ ] Integration tests
- [ ] Security tests (OWASP Top 10)
- [ ] Red team testing
- [ ] Performance testing

### Phase 5: Documentation (Week 4)
- [ ] Agent manifest (YAML)
- [ ] README with examples
- [ ] Architecture Decision Records (ADRs)
- [ ] Security documentation
- [ ] API reference

### Phase 6: Deployment (Week 4)
- [ ] Package for distribution
- [ ] Configure VS Code integration
- [ ] Set up monitoring
- [ ] Deploy to production
- [ ] Announce launch

### Phase 7: Operations (Ongoing)
- [ ] Monitor usage and errors
- [ ] Collect user feedback
- [ ] Address security issues
- [ ] Update documentation
- [ ] Release improvements

---

## Tools and Resources

### MCP Specification
- **Official Spec**: https://modelcontextprotocol.io
- **Security Best Practices**: https://modelcontextprotocol.io/specification/2025-06-18/basic/security_best_practices
- **SDK Documentation**: https://modelcontextprotocol.io/docs/sdk

### Security Resources
- **OWASP Top 10**: https://owasp.org/www-project-top-ten/
- **OWASP AI Security**: https://owasp.org/www-project-ai-security-and-privacy-guide/
- **Azure AI Red Teaming**: https://learn.microsoft.com/en-us/azure/ai-services/openai/concepts/red-teaming
- **PYRIT**: https://github.com/Azure/PyRIT

### Microsoft Resources
- **Responsible AI Standard**: https://www.microsoft.com/en-us/ai/responsible-ai
- **Security Copilot Planning Guide**: https://learn.microsoft.com/copilot/security/developer/planning-guide
- **Azure AI Foundry**: https://learn.microsoft.com/en-us/azure/ai-studio/

### Testing Tools
- **Vitest**: https://vitest.dev
- **zod**: https://zod.dev
- **Supertest**: https://github.com/visionmedia/supertest

---

## Example: Documentation Agent

See **DOCUMENTATION_AGENT_PLAN.md** for a complete MCP server design that:
- Automatically analyzes workspace structure
- Generates context summaries
- Updates documentation
- Detects documentation drift
- Tracks changes over time

**6 Core Tools:**
1. `analyze_workspace` - Scan project structure
2. `generate_context_summary` - Create AI-friendly summaries
3. `update_structure_overview` - Maintain structure docs
4. `update_folder_readmes` - Keep READMEs current
5. `detect_documentation_drift` - Find outdated docs
6. `generate_change_summary` - Track changes

**Implementation:** 17 hours over 1-2 weeks

---

## Support

- **Issues**: https://github.com/lfaley/ProjectPlanner/issues
- **Discussions**: https://github.com/lfaley/ProjectPlanner/discussions
- **MCP Community**: https://github.com/modelcontextprotocol/discussions
- **Main Standards**: ../README.md

---

**Last Updated:** November 16, 2025  
**Version:** 5.0  
**License:** MIT
