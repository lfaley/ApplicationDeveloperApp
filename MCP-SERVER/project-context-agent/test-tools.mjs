#!/usr/bin/env node

/**
 * Test script for project-context-agent MCP tools
 * Tests detect_drift, health_check, and suggest_updates
 */

import { GitIntegration } from './dist/git-integration.js';
import { DriftDetector } from './dist/drift-detection.js';
import { HealthChecker } from './dist/health-check.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_PATH = path.resolve(__dirname, '../..');

console.log('🧪 Testing Project Context Agent Tools\n');
console.log(`📁 Repository: ${REPO_PATH}\n`);

// Test 1: Detect Drift
console.log('=' .repeat(60));
console.log('Test 1: detect_drift tool');
console.log('=' .repeat(60));

const git = new GitIntegration(REPO_PATH);
const detector = new DriftDetector(git);
