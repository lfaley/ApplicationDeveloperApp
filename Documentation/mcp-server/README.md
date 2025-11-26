# 🗺️ Project Roadmap Agent

**MCP Server for Automated Project Roadmap Management**

## ✅ Build Status

**TypeScript Compilation**: ✅ SUCCESSFUL  
**Build Output**: `dist/` directory generated  
**Zero Errors**: All type checking passed  
**Total Code**: ~2,100 lines of TypeScript

## Overview

The Project Roadmap Agent automatically tracks project progress, maintains roadmaps, calculates velocity metrics, and forecasts completion dates based on industry standards from Azure DevOps, Scrum Guide, and Agile best practices.

## Features

✅ **Automatic Progress Tracking**
- Parses ROADMAP.md and feature files
- Updates completion percentages
- Tracks sprint progress

✅ **Velocity Metrics**
- Calculates team velocity
- Tracks sprint capacity
- Forecasts completion dates

✅ **Visual Roadmaps**
- Generates Mermaid Gantt charts
- Creates burndown/burnup charts
- Cumulative flow diagrams

✅ **Blocker Detection**
- Identifies dependencies
- Detects bottlenecks
- Surfaces risks early

## Installation

```bash
cd MCP-SERVER/project-roadmap-agent
npm install
npm run build
```

## Configuration

Add to your MCP settings:

```json
{
  "mcpServers": {
    "project-roadmap": {
      "command": "node",
      "args": ["path/to/project-roadmap-agent/dist/index.js"],
      "env": {}
    }
  }
}
```

## Tools

### 1. `analyze_roadmap`
Analyzes current roadmap status and calculates metrics

**Inputs:**
- `roadmapPath`: Path to ROADMAP.md
- `featuresDir`: Directory containing feature files

**Returns:**
- Current progress
- Velocity metrics
- Blockers
- Forecasts

### 2. `update_roadmap`
Updates ROADMAP.md with current progress

**Inputs:**
- `roadmapPath`: Path to ROADMAP.md
- `features`: Array of feature updates

**Returns:**
- Updated roadmap content
- Change summary

### 3. `generate_gantt`
Creates Mermaid Gantt chart from roadmap

**Inputs:**
- `roadmapPath`: Path to ROADMAP.md

**Returns:**
- Mermaid diagram code

### 4. `calculate_velocity`
Calculates team velocity metrics

**Inputs:**
- `sprintHistory`: Array of completed sprints

**Returns:**
- Average velocity
- Velocity trend
- Forecast

## Usage Examples

```typescript
// Analyze roadmap
const analysis = await analyze_roadmap({
  roadmapPath: "ROADMAP.md",
  featuresDir: "features/"
});

// Update roadmap
await update_roadmap({
  roadmapPath: "ROADMAP.md",
  features: [
    { id: "FEA-001", status: "completed", progress: 100 }
  ]
});

// Generate Gantt chart
const gantt = await generate_gantt({
  roadmapPath: "ROADMAP.md"
});
```

## Development

```bash
# Build
npm run build

# Watch mode
npm run watch

# Test
npm test
```

## Architecture

```
project-roadmap-agent/
├── src/
│   ├── index.ts          # MCP server setup
│   ├── tools/            # MCP tools
│   │   ├── analyze.ts
│   │   ├── update.ts
│   │   ├── gantt.ts
│   │   └── velocity.ts
│   ├── parsers/          # Roadmap parsers
│   │   ├── roadmap.ts
│   │   └── features.ts
│   ├── calculators/      # Metric calculators
│   │   ├── velocity.ts
│   │   ├── forecast.ts
│   │   └── burndown.ts
│   └── types.ts          # Type definitions
├── tests/
├── package.json
└── tsconfig.json
```

## License

MIT
