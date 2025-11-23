# Project Structure

## Project Overview
**Project Name:** [Your Project Name]  
**Created:** [Date]  
**Last Updated:** [Date]  
**Primary Language:** [e.g., TypeScript, Python, etc.]  
**Framework:** [e.g., React Native, Next.js, etc.]

## Purpose
[Brief description of what this project does and why it exists]

## Architecture

### High-Level Architecture
```
[Describe the overall architecture - e.g., client-server, microservices, monolithic, etc.]
```

### Technology Stack

**Frontend:**
- Framework: [e.g., React Native, React, Vue, etc.]
- State Management: [e.g., Redux, Context API, etc.]
- UI Components: [e.g., Custom, Material-UI, etc.]
- Build Tool: [e.g., Expo, Webpack, Vite, etc.]

**Backend:**
- Runtime: [e.g., Node.js, Python, .NET, etc.]
- Framework: [e.g., Express, FastAPI, ASP.NET, etc.]
- Database: [e.g., PostgreSQL, MongoDB, SQLite, etc.]
- Authentication: [e.g., OAuth, JWT, Firebase Auth, etc.]

**Infrastructure:**
- Hosting: [e.g., Azure, AWS, Vercel, etc.]
- CI/CD: [e.g., GitHub Actions, Azure Pipelines, etc.]
- Monitoring: [e.g., Application Insights, Sentry, etc.]

## Folder Structure

```
ProjectRoot/
├── src/                    # Source code
│   ├── components/         # Reusable UI components
│   ├── screens/            # Application screens/pages
│   ├── services/           # Business logic and API calls
│   ├── utils/              # Helper functions and utilities
│   ├── types/              # TypeScript type definitions
│   └── config/             # Configuration files
├── assets/                 # Static assets (images, fonts, etc.)
├── tests/                  # Test files
├── scripts/                # Build and utility scripts
├── docs/                   # Documentation
├── Context-Summaries/      # Context summary files
├── ProjectPlanning/        # Planning and design docs
└── package.json            # Dependencies and scripts
```

### Key Directories Explained

**`src/components/`**
- Purpose: [Description]
- Key Files: [List important files]
- Naming Convention: [e.g., PascalCase for components]

**`src/screens/`**
- Purpose: [Description]
- Key Files: [List important files]
- Navigation: [How navigation works]

**`src/services/`**
- Purpose: [Description]
- Key Services: [List main services]
- Patterns: [e.g., Singleton, Factory, etc.]

**`src/utils/`**
- Purpose: [Description]
- Key Utilities: [List important utilities]

## Key Components

### [Component Name 1]
**Location:** `path/to/component`  
**Purpose:** [What it does]  
**Dependencies:** [Other components/services it relies on]  
**Key Methods/Props:** [Important interfaces]

### [Component Name 2]
**Location:** `path/to/component`  
**Purpose:** [What it does]  
**Dependencies:** [Other components/services it relies on]  
**Key Methods/Props:** [Important interfaces]

## Data Flow

### State Management
[Describe how state is managed across the application]

```
User Action → Action Creator → Reducer → Store → UI Update
```

### API Communication
[Describe how the app communicates with backend services]

```
Component → Service → API Client → Backend → Response Processing
```

## Configuration

### Environment Variables
```
ENV_VAR_1=description
ENV_VAR_2=description
ENV_VAR_3=description
```

### Build Configurations
- Development: [Description]
- Staging: [Description]
- Production: [Description]

## Dependencies

### Core Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| [package-1] | [version] | [purpose] |
| [package-2] | [version] | [purpose] |
| [package-3] | [version] | [purpose] |

### Development Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| [dev-package-1] | [version] | [purpose] |
| [dev-package-2] | [version] | [purpose] |

## Build and Deployment

### Development
```bash
npm install
npm start
```

### Testing
```bash
npm test
npm run test:coverage
```

### Production Build
```bash
npm run build
npm run deploy
```

## Coding Standards

### File Naming
- Components: PascalCase (e.g., `UserProfile.tsx`)
- Utilities: camelCase (e.g., `formatDate.ts`)
- Constants: SCREAMING_SNAKE_CASE (e.g., `API_ENDPOINTS.ts`)

### Code Organization
- One component per file
- Co-locate tests with source files
- Group related functionality in folders

### TypeScript Guidelines
- Prefer interfaces over types for objects
- Use strict mode
- Avoid `any` type

## Testing Strategy

### Unit Tests
- Location: [Where unit tests are located]
- Framework: [e.g., Jest, Vitest, etc.]
- Coverage Target: [e.g., 80%]

### Integration Tests
- Location: [Where integration tests are located]
- Framework: [e.g., Testing Library, etc.]

### E2E Tests
- Location: [Where E2E tests are located]
- Framework: [e.g., Playwright, Cypress, etc.]

## Security Considerations

### Authentication
[How authentication is implemented]

### Data Protection
[How sensitive data is protected]

### API Security
[How APIs are secured]

## Performance Considerations

### Optimization Strategies
- [Strategy 1]
- [Strategy 2]
- [Strategy 3]

### Monitoring
- [What metrics are monitored]
- [Tools used for monitoring]

## Known Limitations

1. **[Limitation 1]:** [Description and potential workarounds]
2. **[Limitation 2]:** [Description and potential workarounds]
3. **[Limitation 3]:** [Description and potential workarounds]

## Future Enhancements

- [ ] [Enhancement 1]
- [ ] [Enhancement 2]
- [ ] [Enhancement 3]

## Related Documentation

- [Context Summary Rules](../Context-Summaries/ContextSummaryRules.md)
- [Project Overview](../ProjectPlanning/ProjectOverview.md)
- [Implementation Plans](../ProjectPlanning/)

## Maintenance Notes

### Regular Tasks
- Update dependencies monthly
- Review and update documentation quarterly
- Clean up deprecated code as identified

### Update History
| Date | Changes | Updated By |
|------|---------|------------|
| [date] | [changes] | [name] |

---

**Note:** Keep this document updated as the project evolves. Reference it in Context_Summary files when making architectural changes.
