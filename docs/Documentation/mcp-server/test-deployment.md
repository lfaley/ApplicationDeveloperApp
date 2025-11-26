# Orchestration Agent - Deployment Test Guide

**Purpose**: Verify that the orchestration agent is properly configured and accessible in Claude Desktop.

**Date**: November 19, 2025  
**Status**: Ready for Testing

---

## Prerequisites

✅ Claude Desktop installed (v1.0.734)  
✅ Orchestration agent built (`npm run build` completed)  
✅ Configuration file updated with orchestration agent  
✅ Backup created: `claude_desktop_config.json.backup`

---

## Test Procedure

### Step 1: Restart Claude Desktop

1. **Close Claude Desktop** completely (check system tray)
2. **Reopen Claude Desktop** from Start menu
3. **Wait** for initialization (10-15 seconds)
4. **Sign in** if prompted

### Step 2: Verify MCP Server Connection

Ask Claude Desktop:
```
Can you list all available MCP tools?
```

**Expected**: You should see tools from 4 agents:
- `code-documentation` tools
- `code-review` tools  
- `test-generator` tools
- `orchestration` tools ← **NEW!**

### Step 3: Test Orchestration Tools

#### Test 3.1: List Patterns
Ask Claude:
```
Use the list_patterns tool to show me all available orchestration patterns
```

**Expected Output**: Should return 4 patterns:
- Sequential
- Concurrent
- Handoff
- Group Chat

#### Test 3.2: Get Pattern Info
Ask Claude:
```
Use pattern_info tool to get details about the sequential pattern
```

**Expected Output**: Should return:
- Pattern type, name, description
- Use cases
- Example configuration
- Best practices

#### Test 3.3: List Available Agents
Ask Claude:
```
Use list_agents tool to show what agents are available for orchestration
```

**Expected Output**: Should list registered agents:
- code-documentation
- code-review
- test-generator

#### Test 3.4: Validate a Workflow
Ask Claude:
```
Use validate_workflow to check this configuration:
{
  "pattern": "sequential",
  "agents": [
    {
      "agentId": "code-documentation",
      "toolName": "analyze_code",
      "args": {"code": "function test() {}"}
    }
  ]
}
```

**Expected Output**: Should return validation result with:
- `valid: true/false`
- `errors: []` array
- `warnings: []` array

---

## Test Scenarios

### Scenario 1: Simple Sequential Workflow

Ask Claude:
```
Use orchestrate_workflow to run a sequential workflow:
1. code-documentation agent to analyze this code: "function add(a, b) { return a + b; }"
2. code-review agent to review the same code

Use the sequential pattern with passResults enabled.
```

**What to Check**:
- Both agents execute in order
- Results are captured
- No errors occur
- Execution completes successfully

### Scenario 2: Concurrent Workflow

Ask Claude:
```
Use orchestrate_workflow with the concurrent pattern to:
- Analyze code with code-documentation agent
- Review code with code-review agent
- Generate tests with test-generator agent

All for this code: "const multiply = (x, y) => x * y;"
```

**What to Check**:
- All 3 agents run in parallel
- Results come back from all agents
- Faster than sequential execution
- All results are aggregated

### Scenario 3: Pattern Information Query

Ask Claude:
```
Show me information about all orchestration patterns using pattern_info for each pattern type
```

**What to Check**:
- Can retrieve info for all 4 patterns
- Each pattern returns complete information
- Examples are included
- Use cases are clear

---

## Troubleshooting

### Issue: Orchestration tools not available

**Symptoms**: Claude says it doesn't have access to orchestration tools

**Solutions**:
1. Verify config file:
   ```powershell
   Get-Content "$env:APPDATA\Claude\claude_desktop_config.json" -Raw
   ```
   - Should include `"orchestration"` entry
   
2. Check build output exists:
   ```powershell
   Test-Path "C:\Users\faley\Desktop\Code\Repos\ProjectPlanner\MCP-SERVER\orchestration-agent\dist\index.js"
   ```
   - Should return `True`

3. Restart Claude Desktop again (complete shutdown)

4. Check Claude Desktop logs:
   ```powershell
   Get-Content "$env:APPDATA\Claude\logs\mcp*.log" -Tail 50
   ```

### Issue: Agent execution fails

**Symptoms**: Workflow starts but agents fail to execute

**Cause**: Currently using simulated execution (this is expected!)

**Note**: The orchestration agent is working correctly. The actual agent execution uses simulation stubs until real MCP client integration is implemented (Phase 2).

**What you'll see**:
- Workflow structure works correctly
- Agents execute in proper order/pattern
- Results are captured with simulated data
- Timing and metadata are tracked

**To test failures**: Add `"shouldFail": true` in agent args

### Issue: Build errors

**Solution**: Rebuild the agent
```powershell
cd "C:\Users\faley\Desktop\Code\Repos\ProjectPlanner\MCP-SERVER\orchestration-agent"
npm run build
```

### Issue: Configuration not loading

**Solution**: Validate JSON syntax
```powershell
Get-Content "$env:APPDATA\Claude\claude_desktop_config.json" -Raw | ConvertFrom-Json
```

If this fails, restore backup:
```powershell
Copy-Item "$env:APPDATA\Claude\claude_desktop_config.json.backup" "$env:APPDATA\Claude\claude_desktop_config.json"
```

---

## Success Criteria

✅ **All 5 orchestration tools accessible** in Claude Desktop  
✅ **Can list patterns** and get pattern information  
✅ **Can validate workflows** before execution  
✅ **Can execute workflows** using all 4 patterns  
✅ **Results are returned** with proper structure  
✅ **No crashes** or configuration errors  

---

## Configuration Reference

**Your Current Setup**:
```json
{
  "mcpServers": {
    "code-documentation": {...},
    "code-review": {...},
    "test-generator": {...},
    "orchestration": {
      "command": "node",
      "args": [
        "c:\\Users\\faley\\Desktop\\Code\\Repos\\ProjectPlanner\\MCP-SERVER\\orchestration-agent\\dist\\index.js"
      ]
    }
  }
}
```

**Backup Location**: `%APPDATA%\Claude\claude_desktop_config.json.backup`

---

## Quick Test Commands for PowerShell

```powershell
# Check if orchestration agent is in config
Get-Content "$env:APPDATA\Claude\claude_desktop_config.json" | Select-String "orchestration"

# Verify dist file exists
Test-Path "C:\Users\faley\Desktop\Code\Repos\ProjectPlanner\MCP-SERVER\orchestration-agent\dist\index.js"

# Run tests locally (should pass 113/113)
cd "C:\Users\faley\Desktop\Code\Repos\ProjectPlanner\MCP-SERVER\orchestration-agent"
npm test

# Rebuild if needed
npm run build

# View recent Claude logs
Get-Content "$env:APPDATA\Claude\logs\mcp-server-orchestration.log" -Tail 20 -Wait
```

---

## Next Steps After Successful Testing

1. ✅ **Validate deployment** - All tests pass
2. 📝 **Document results** - Note any issues or observations
3. 🚀 **Use in production** - Start orchestrating real workflows
4. 🔄 **Phase 2 Planning** - Consider real MCP client integration
5. 📊 **Performance monitoring** - Track workflow execution times

---

## Support

**Documentation**:
- README.md - User guide with all patterns and examples
- CONTRIBUTING.md - Developer guide for modifications
- HANDOFF.md - Project context and architecture

**Test Suite**:
```powershell
npm test                                    # All tests
npm test -- --testPathPattern=sequential   # Just sequential pattern
npm test -- --testPathPattern=tools        # Just MCP tools
```

**Issues**: Check `tests/` directory for expected behavior examples

---

## Test Results Log

**Date**: ___________  
**Tested By**: ___________  
**Claude Desktop Version**: 1.0.734  

| Test | Status | Notes |
|------|--------|-------|
| Tools Available | ⬜ Pass / ⬜ Fail | |
| List Patterns | ⬜ Pass / ⬜ Fail | |
| Pattern Info | ⬜ Pass / ⬜ Fail | |
| List Agents | ⬜ Pass / ⬜ Fail | |
| Validate Workflow | ⬜ Pass / ⬜ Fail | |
| Sequential Workflow | ⬜ Pass / ⬜ Fail | |
| Concurrent Workflow | ⬜ Pass / ⬜ Fail | |
| Handoff Pattern | ⬜ Pass / ⬜ Fail | |
| Group Chat Pattern | ⬜ Pass / ⬜ Fail | |

**Overall Status**: ⬜ PASS / ⬜ FAIL  
**Ready for Production**: ⬜ YES / ⬜ NO  

**Notes**:
___________________________________________________________________________
___________________________________________________________________________
___________________________________________________________________________
