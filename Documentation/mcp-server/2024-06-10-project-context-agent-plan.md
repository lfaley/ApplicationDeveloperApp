# Project Context Agent – Phase 2: Detailed Plan & Repo Hygiene

**Date:** 2024-06-10

---

## 1. Project Setup & Hygiene

### 1.1. .gitignore Assessment & Improvements
Your current `.gitignore` (in `dashboard/`) is good, but you should ensure a similar or stricter `.gitignore` exists in `MCP-SERVER/project-context-agent/`.

**Recommended patterns:**
- `node_modules/`
- `dist/`, `.vite/`, `.temp/`, `*.tmp`
- `*.log`, `npm-debug.log*`, `yarn-debug.log*`
- `.env`, `.env.*`, `*.local`
- `coverage/`, `*.lcov`
- `*.swp`, `*.swo`, `*~`
- `.DS_Store`, `Thumbs.db`
- `.vscode/`, `.idea/`
- `package-lock.json`, `yarn.lock` (if not using lockfiles in repo)
- `test-results/`, `jest-*.json`
- `*.tsbuildinfo`
- Any IDE-specific or OS-specific files

**Action:**
- Ensure a `.gitignore` exists in `MCP-SERVER/project-context-agent/` with the above rules.

---

## 2. Dependency & Script Setup

### 2.1. `package.json`
- Ensure dependencies: `simple-git`, `@modelcontextprotocol/sdk`, `zod`
- Dev dependencies: `typescript`, `jest`, `ts-jest`, `@types/jest`
- Scripts:
  - `build`, `start`, `test`, `test:coverage`, `watch`, `test:watch`

### 2.2. TypeScript & Jest Configs
- `tsconfig.json` with strict mode
- `jest.config.cjs` for ESM and TypeScript

---

## 3. Implementation Roadmap

### 3.1. Types & Validation
- Create `src/types.ts` with all interfaces and Zod schemas
- Document with JSDoc

### 3.2. Git Integration
- Implement `src/git-integration.ts` (wrap `simple-git`)
- Handle non-git gracefully (fallback to fs)
- Write 15+ tests

### 3.3. Drift Detection Engine
- Implement `src/drift-detection.ts`
- Timestamp, signature, and orphaned doc detection
- Severity calculation
- 30+ tests

### 3.4. Content Analyzer
- Implement `src/content-analyzer.ts`
- Parse code/docs, match, and compare
- 20+ tests

### 3.5. Sync Engine
- Implement `src/sync-engine.ts`
- Generate/apply recommendations, approval workflow
- 15+ tests

### 3.6. MCP Tools
- Implement all 4 tools in `src/tools/`
- 20+ tests

### 3.7. Entry Point
- Implement `src/index.ts` to register tools and start MCP server
- Add error handling and integration tests

### 3.8. Documentation
- Write `README.md` and `CONTRIBUTING.md`
- API docs, usage, troubleshooting

---

## 4. Testing & Quality

- Achieve 80%+ code coverage
- No TypeScript or lint errors
- Performance test on large workspaces

---

## 5. Repo Hygiene & Workflow

- **Push code frequently** (after each major step or test pass)
- **Never commit/push**: node_modules, build output, logs, .env, coverage, IDE files, test results, lockfiles (unless required)
- **Review git status** before every commit
- **Automate lint/test on pre-commit** (optional: use Husky or similar)
- **Document workflow** in `CONTRIBUTING.md`

---

## 6. Next Steps

1. Add/verify `.gitignore` in `MCP-SERVER/project-context-agent/`
2. Audit/create `package.json`, `tsconfig.json`, `jest.config.cjs`
3. Scaffold missing files/folders per HANDOFF.md
4. Implement features in order above, pushing code after each milestone

---

*This plan ensures a clean, maintainable, and scalable project setup with best practices for code and repository hygiene.*
