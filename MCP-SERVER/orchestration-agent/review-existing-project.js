#!/usr/bin/env node

// review-existing-project.js
// CLI entry point for running the existing project review workflow with interactive guided prompts

const { orchestrateWorkflow } = require('./dist/tools.js');
const { existingProjectReviewWorkflow } = require('./dist/existingProjectReviewWorkflow.js');
const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');

function logDebug(message, ...args) {
  // Simple debug logger, can be enhanced or redirected as needed
  // eslint-disable-next-line no-console
  console.debug('[DEBUG]', message, ...args);
}

async function runGuidedPrompt() {
  try {
    // Example: ask user for goals interactively
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'userGoals',
        message: 'What do you want to improve or accomplish in this project?',
      },
      {
        type: 'input',
        name: 'modules',
        message: 'Which modules or areas do you want to focus on?',
      },
      {
        type: 'input',
        name: 'docStyle',
        message: 'What documentation style or standards do you prefer?',
      },
      {
        type: 'input',
        name: 'priority',
        message: 'What is your top priority for improvement?',
      },
    ]);
    // Save to output files for workflow consumption
    const userGoalsPath = path.join(process.cwd(), 'CONTEXT-SUMMARY', 'user_goals.json');
    logDebug('Saving user goals to', userGoalsPath, answers);
    fs.writeFileSync(userGoalsPath, JSON.stringify(answers, null, 2));
    return answers;
  } catch (err) {
    logDebug('Error in runGuidedPrompt:', err);
    throw err;
  }
}

async function main() {
  try {
    console.log('Starting Existing Project Review Workflow...');
    // Run guided prompt interactively
    const userGoals = await runGuidedPrompt();
    // Inject user goals into workflow args if needed
    // (You may need to adapt this to your workflow's structure)
    const workflow = { ...existingProjectReviewWorkflow };
    workflow.agents = workflow.agents.map(agent => {
      if (agent.agentId === 'context-agent') {
        return {
          ...agent,
          args: {
            ...agent.args,
            userGoals,
          },
        };
      }
      return agent;
    });
    logDebug('Running orchestrateWorkflow with workflow:', workflow);
    // Run the workflow
    const result = await orchestrateWorkflow(workflow);
    logDebug('Workflow result:', result);
    // Output summary
    console.log('\nWorkflow complete. Results:');
    console.log(JSON.stringify(result, null, 2));
    // Optionally, show links to output files
    console.log('\nSee CONTEXT-SUMMARY/user_goals.json and CONTEXT-SUMMARY/prompt_results.md for details.');
  } catch (err) {
    logDebug('Error in main():', err);
    console.error('Error running review workflow:', err);
    process.exit(1);
  }
}

main();
