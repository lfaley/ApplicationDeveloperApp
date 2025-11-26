# Contributing to Project Context Agent

Thank you for your interest in contributing! This guide covers development setup, code style, testing, branching, PRs, and release process for the Project Context Agent.

## Development Setup
1. Clone the repo:
   ```bash
   git clone https://github.com/lfaley/ProjectPlanner.git
   cd MCP-SERVER/project-context-agent
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the project:
   ```bash
   npm run build
   ```
4. Run tests:
   ```bash
   npm run test
   npm run test:coverage
   ```
5. Lint the code:
   ```bash
   npx eslint src
   ```

## Code Style
- TypeScript strict mode
- Use Zod for runtime validation
- Prefer explicit types, avoid `any`
- Use ESM imports/exports
- Run `npx eslint src` before committing

## Testing
- All new features must include tests
- Use Jest for unit and integration tests
- Target 80%+ code coverage
- Run `npm run test` and `npm run test:coverage` before PRs

## Branching & PRs
- Use feature branches: `feature/<short-description>`
- Keep PRs focused and atomic
- Write clear commit messages (e.g. `feat(context-agent): add drift detection`)
- Reference issues in PRs if applicable
- Ensure all tests and lint checks pass before merging

## Release & Deployment
- Build with `npm run build`
- Tag releases with semantic versioning
- Update documentation for major changes
- Deploy to Claude Desktop as described in the README

## Adding New Features/Tools
- Add new MCP tools in `src/tools/`
- Update `src/index.ts` to register the tool
- Add tests in `tests/`
- Document API changes in README

## Debugging & Troubleshooting
- Check Jest and TypeScript error output for details
- Use `console.log` for debugging
- If ESLint fails, check config and run from project directory
- For git issues, ensure your workspace is a valid repo

## Support
- For questions, open an issue or contact lfaley
- See [README.md](README.md) for usage and troubleshooting

---
