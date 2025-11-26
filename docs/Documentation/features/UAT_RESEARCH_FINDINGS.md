# User Acceptance Testing (UAT) Research Findings

**Date**: November 18, 2025  
**Purpose**: Document industry standards and best practices for UAT integration into FeatureSet3  
**Source**: Microsoft Learn documentation on UAT, BDD, and test case management

---

## 🎯 Executive Summary

Based on Microsoft's industry-standard UAT practices, we should integrate a **User Acceptance Testing Agent** as a new phase in FeatureSet3. This agent will:

1. **Generate AI-powered test scenarios** from user stories and requirements
2. **Allow users to add custom test cases** through a GUI interface
3. **Combine automated and manual testing** approaches
4. **Provide BDD/Gherkin format support** for test scenarios
5. **Track test execution results** and generate reports
6. **Integrate with project context** for realistic test data

---

## 📚 Key Industry Standards Identified

### 1. **Test Case Structure** (Microsoft Best Practice)

Every UAT test case should include:
- **Process/Requirements**: What is being tested
- **Prerequisites**: Entry criteria, data dependencies, configuration
- **Test Steps**: Detailed reproduction steps
- **Expected Outcome**: Exit criteria and validation points
- **Test Data**: Specific values to use
- **Actual Results**: Populated during execution

### 2. **Test Case Guidelines** (Dynamics 365 Standard)

- **80% transactional tests**: Focus on business transactions and source documents
- **20% master data tests**: Limit configuration/setup tests
- **1-2 tasks per test case**: Keep test cases atomic and maintainable
- **At least one validation**: Every test must validate critical fields
- **Positive and negative scenarios**: Test both success and failure paths
- **End-to-end coverage**: Combine test cases to cover complete business processes

### 3. **BDD (Behavior-Driven Development) Format**

Industry standard for writing test scenarios (Gherkin syntax):

```gherkin
Feature: Test tagging compliance
    Scenario: Ensure all resources have tags
        Given a resource that supports tags
        When I create the resource
        Then it must contain a tag
        And its value must not be null
```

### 4. **User Story to Test Case Mapping**

User stories should follow this template:
```
As a [user role]
I want to [perform action]
So that [business value]
```

Each user story generates multiple test scenarios:
- **Happy path**: Expected successful execution
- **Edge cases**: Boundary conditions, optional parameters
- **Error handling**: Invalid inputs, failure scenarios
- **Validation**: Field-level and business rule validation

### 5. **Test Suite Organization**

Tests should be organized hierarchically:
```
Test Plan (e.g., "Release 1.0 UAT")
├── Test Suite 1 (e.g., "Authentication")
│   ├── Test Case 1: Login with valid credentials
│   ├── Test Case 2: Login with invalid password
│   └── Test Case 3: Password reset flow
├── Test Suite 2 (e.g., "Code Review")
│   ├── Test Case 4: Review Python file
│   └── Test Case 5: Review with security focus
└── Test Suite 3 (e.g., "Test Generation")
    └── ...
```

### 6. **UAT Best Practices** (Microsoft Guidance)

1. **Thorough Planning**: Define clear objectives, scope, success criteria
2. **Collaboration**: Engage stakeholders early, cross-functional teams
3. **Realistic Scenarios**: Mimic real-world use cases with actual data
4. **Comprehensive Documentation**: Test plans, scripts, issue logs
5. **Tool Integration**: Azure DevOps, Jira, test automation frameworks

### 7. **Test Execution Approaches**

**Manual Testing** (20-30% of tests):
- User navigates through application
- Validates UI/UX experience
- Tests edge cases and exploratory scenarios
- Documents bugs with screenshots/recordings

**Automated Testing** (70-80% of tests):
- Regression test suites run automatically
- CI/CD pipeline integration
- Fast feedback on code changes
- Consistent, repeatable execution

### 8. **Acceptance Criteria Format**

Each test case should have clear acceptance criteria:
```
Given [initial context]
When [action occurs]
Then [expected outcome]
And [additional validation]
```

---

## 🏗️ Proposed UAT Agent Architecture

Based on industry standards, here's the recommended architecture:

### **Component 1: Test Scenario Generator**

**Inputs**:
- User stories from project context
- Code analysis results from existing agents
- Business requirements documentation
- API specifications

**Outputs**:
- BDD/Gherkin test scenarios
- Test case templates with:
  - Prerequisites
  - Test steps
  - Expected outcomes
  - Test data suggestions

**AI Capabilities**:
- Analyze user stories and extract testable scenarios
- Generate positive/negative test cases
- Identify edge cases from code analysis
- Suggest test data based on function parameters
- Create test scenarios for each MCP tool

### **Component 2: Custom Test Case Manager**

**Features**:
- Add/edit/delete custom test cases
- Import test cases from files (CSV, JSON, YAML)
- Export test suite to Azure DevOps format
- Tag test cases by priority/severity
- Link test cases to requirements/user stories

**Storage Format** (JSON):
```json
{
  "testPlan": {
    "id": "UAT-001",
    "name": "MCP Server UAT",
    "description": "User acceptance tests for all MCP servers",
    "testSuites": [
      {
        "id": "TS-001",
        "name": "Code Documentation Agent",
        "testCases": [
          {
            "id": "TC-001",
            "title": "Generate documentation for Python class",
            "userStory": "As a developer, I want to document my Python classes automatically",
            "type": "automated",
            "priority": "high",
            "prerequisites": [
              "Python file with at least one class",
              "Code Documentation Agent running"
            ],
            "steps": [
              {
                "action": "Call analyze_and_generate tool",
                "data": { "filePath": "test_class.py", "format": "markdown" },
                "expectedOutcome": "Markdown documentation returned"
              }
            ],
            "acceptanceCriteria": [
              "Documentation includes class name",
              "All methods are documented",
              "Parameters are listed",
              "Return types are specified"
            ],
            "testData": {
              "filePath": "tests/fixtures/sample_class.py",
              "expectedOutput": "tests/fixtures/expected_docs.md"
            }
          }
        ]
      }
    ]
  }
}
```

### **Component 3: Test Execution Engine**

**Capabilities**:
- Execute automated test cases against MCP servers
- Track manual test execution (pass/fail/blocked)
- Capture test results with timestamps
- Screenshot/log capture for failures
- Retry failed tests automatically
- Generate test execution reports

**Execution Modes**:
1. **Smoke Tests**: Quick validation (5-10 critical tests)
2. **Regression Suite**: Full test suite (all tests)
3. **Targeted Tests**: Selected test cases or suites
4. **Manual Execution**: Guide user through test steps

### **Component 4: Test Results Reporter**

**Report Types**:
1. **Summary Report**: Pass/fail/blocked counts, coverage %
2. **Detailed Report**: Individual test case results with logs
3. **Trend Report**: Test pass rate over time
4. **Coverage Report**: Requirements traced to test cases

**Export Formats**:
- HTML (interactive dashboard)
- PDF (shareable document)
- JSON (API integration)
- Azure DevOps format (for import)

---

## 🎨 GUI Integration Points

### **New Screen: "User Testing"**

Located in ProjectPlanner GUI alongside existing screens.

**Layout**:
```
┌─────────────────────────────────────────────────────────────┐
│  User Acceptance Testing                            [≡ Menu] │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌────────────────────────────────┐   │
│  │ Test Suites     │  │ Test Case Details              │   │
│  │                 │  │                                 │   │
│  │ ☐ Authentication│  │ TC-001: Login with valid creds │   │
│  │ ☑ Code Review   │  │ Type: Automated | Priority: High│   │
│  │   ├─ TC-004     │  │                                 │   │
│  │   ├─ TC-005     │  │ Prerequisites:                  │   │
│  │   └─ TC-006     │  │ • Code Review Agent running     │   │
│  │ ☐ Test Gen      │  │ • Sample Python file exists     │   │
│  │                 │  │                                 │   │
│  │ [+ New Suite]   │  │ Steps:                          │   │
│  │ [+ Import]      │  │ 1. Call review_code tool        │   │
│  └─────────────────┘  │ 2. Verify response structure    │   │
│                       │ 3. Check quality score > 60     │   │
│  [▶ Run Selected]    │                                 │   │
│  [📊 View Report]    │ Status: ✓ Passed (2m 15s ago)  │   │
│  [🤖 Generate Tests] │                                 │   │
└─────────────────────────────────────────────────────────────┘
```

**Key Features**:
1. **Generate Tests** button calls UAT Agent to create test scenarios
2. **Import** allows loading test cases from files
3. **Run Selected** executes chosen test cases
4. **View Report** shows test results dashboard
5. **Manual test execution** guides user through steps with checkboxes

### **Wizard: "Generate Test Scenarios"**

**Step 1: Select Source**
- [ ] User stories from Project Context Agent
- [ ] Analyzed code from Code Documentation Agent
- [ ] API specifications from manual input
- [ ] Existing requirements documents

**Step 2: Configure Generation**
- Test type: [ ] Happy path [ ] Edge cases [ ] Error handling
- Automation level: [Slider: 0% manual ─────●─── 100% automated]
- Priority: [ ] All [ ] High only [ ] Critical only

**Step 3: Review & Edit**
- Shows generated test cases in editable table
- Add/remove/modify test cases
- Preview BDD/Gherkin format

**Step 4: Save & Execute**
- Save to test suite
- Optionally run tests immediately
- Export to Azure DevOps / Jira

---

## 📋 Recommended Tool Structure

### **MCP Tools for UAT Agent (5 tools)**

1. **`generate_test_scenarios`**
   - Input: user stories, code analysis, requirements
   - Output: Test cases in JSON/Gherkin format
   - Options: testTypes, automationLevel, priority

2. **`add_custom_test_case`**
   - Input: Test case details (title, steps, expected outcome)
   - Output: Confirmation and test case ID
   - Validates format and completeness

3. **`execute_test_suite`**
   - Input: Test suite ID or test case IDs
   - Output: Test results with pass/fail/blocked status
   - Options: mode (smoke/regression/targeted)

4. **`get_test_results`**
   - Input: Test run ID or date range
   - Output: Detailed results with logs and screenshots
   - Options: format (summary/detailed/trend)

5. **`export_test_plan`**
   - Input: Test plan ID
   - Output: Exported file in specified format
   - Options: format (JSON/YAML/AzureDevOps/Jira)

---

## 🔄 Integration with Existing Agents

### **Code Documentation Agent**
- **Input to UAT**: Generated documentation provides expected outcomes for tests
- **Output from UAT**: Test results identify documentation gaps

### **Code Review Agent**
- **Input to UAT**: Quality issues become negative test cases
- **Output from UAT**: Test failures trigger code review

### **Test Generator Agent**
- **Input to UAT**: Generated unit tests inform UAT scenarios
- **Output from UAT**: UAT scenarios generate integration tests

### **Orchestration Agent (FeatureSet3)**
- **Input to UAT**: Multi-agent workflows need end-to-end UAT
- **Output from UAT**: Test orchestration patterns validate workflows

### **Project Context Agent (FeatureSet3)**
- **Input to UAT**: User stories and requirements feed test generation
- **Output from UAT**: Test coverage metrics update project status

---

## 📈 Success Metrics

1. **Test Coverage**: % of user stories with test cases (target: 100%)
2. **Automation Rate**: % of tests automated (target: 70-80%)
3. **Pass Rate**: % of tests passing (target: 90%+)
4. **Execution Time**: Average time to run full regression suite
5. **Defect Detection**: # of bugs found before production
6. **User Satisfaction**: Feedback score from testers (1-10 scale)

---

## 🚀 Implementation Roadmap

### **Phase 6: User Acceptance Testing Agent** (NEW PHASE)

**Duration**: 12 hours  
**Priority**: High (enables customer confidence and production readiness)

**Tasks**:
1. **Task 6.1**: UAT Agent Planning & Design (2h)
   - Define types.ts for test cases, suites, results
   - Design test scenario generation algorithms
   - Plan BDD/Gherkin format support

2. **Task 6.2**: Test Scenario Generator (3h)
   - Analyze user stories and extract scenarios
   - Generate positive/negative test cases
   - Support multiple input formats (stories, code, requirements)

3. **Task 6.3**: Test Case Manager (2h)
   - CRUD operations for test cases
   - Import/export functionality
   - Test suite organization

4. **Task 6.4**: Test Execution Engine (3h)
   - Automated test execution against MCP servers
   - Manual test tracking
   - Results capture and logging

5. **Task 6.5**: GUI Integration (1.5h)
   - Add "User Testing" screen to ProjectPlanner GUI
   - Implement test generation wizard
   - Create test results dashboard

6. **Task 6.6**: Testing & Documentation (0.5h)
   - 50+ tests for UAT Agent
   - README with test scenario examples
   - Integration guide

**Deliverables**:
- UAT Agent with 5 MCP tools
- GUI screen for test management
- 50+ passing tests
- Comprehensive documentation

**Dependencies**:
- Requires Project Context Agent (Phase 2) for user stories
- Integrates with all existing agents for test scenario generation

---

## 🎯 Quick Decision Matrix

| Aspect | Recommended Approach |
|--------|---------------------|
| **Test Format** | BDD/Gherkin (industry standard, human-readable) |
| **Test Organization** | Hierarchical (Plan → Suite → Case) |
| **Automation Level** | 70% automated, 30% manual (realistic balance) |
| **Generation Source** | User stories + code analysis + requirements |
| **Storage Format** | JSON (flexible, API-friendly) |
| **Execution Framework** | Custom (MCP-integrated) + Azure DevOps export |
| **GUI Location** | New "User Testing" screen in ProjectPlanner |
| **Report Format** | HTML dashboard + PDF export |

---

## 📝 Sample Generated Test Scenario

**Input**: User story from Project Context Agent
```
As a developer
I want to review my Python code for security issues
So that I can identify vulnerabilities before deployment
```

**Generated Test Scenarios** (BDD Format):
```gherkin
Feature: Security Code Review
  As a developer
  I want to review my Python code for security issues
  So that I can identify vulnerabilities before deployment

  Scenario: Detect SQL injection vulnerability
    Given a Python file with SQL string concatenation
    When I call the review_code tool with securityFocus=true
    Then the response should contain a security issue
    And the issue severity should be "critical"
    And the issue type should be "SQL Injection"
    And the suggestion should mention parameterized queries

  Scenario: Detect hardcoded API key
    Given a Python file with an API key in source code
    When I call the security_review tool
    Then the response should contain a "Hardcoded Secret" issue
    And the issue should include the line number
    And the suggestion should recommend environment variables

  Scenario: No false positives on safe code
    Given a Python file with parameterized database queries
    When I call the review_code tool
    Then the response should not contain SQL injection issues
    And the quality score should be > 90
```

---

## 🔗 External References

1. **Microsoft Dynamics UAT Guide**: https://learn.microsoft.com/dynamics365/guidance/resources/data-migration-user-acceptance-tests
2. **Azure DevOps Test Plans**: https://learn.microsoft.com/azure/devops/test/create-a-test-plan
3. **BDD with Cucumber**: https://cucumber.io/docs/gherkin/reference/
4. **Terraform Compliance Testing**: https://learn.microsoft.com/azure/developer/terraform/best-practices-compliance-testing

---

## ✅ Recommendations

1. **Add Phase 6 to FeatureSet3**: User Acceptance Testing Agent (12 hours)
2. **Update MASTER_CHECKLIST.md**: Include Phase 6 tasks and deliverables
3. **Prioritize after Phase 2**: UAT Agent benefits from Project Context Agent's user stories
4. **GUI Enhancement**: Add "User Testing" screen to ProjectPlanner for test management
5. **Integration Testing**: Use UAT Agent to validate entire FeatureSet3 implementation

---

**Next Steps**:
1. Review and approve Phase 6 addition
2. Update FeatureSet3 planning documents
3. Continue with current Phase 1 implementation (orchestration-agent)
4. Plan UAT Agent design after Phase 2 completion

