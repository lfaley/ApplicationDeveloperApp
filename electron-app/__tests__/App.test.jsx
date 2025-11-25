import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

// Mock Electron's ipcRenderer for all IPC calls
jest.mock('electron', () => ({
  ipcRenderer: {
    invoke: jest.fn(async (channel, args) => {
      if (channel === 'assess-project') {
        return {
          markdown: '# Assessment\n\n## Detect Drift\noutput\n## Health Check\noutput',
          results: [
            { name: 'detect-drift', label: 'Detect Drift', success: true, output: 'output', error: '' },
            { name: 'health-check', label: 'Health Check', success: true, output: 'output', error: '' }
          ]
        };
      }
      if (channel === 'select-folder') {
        return '/mock/path';
      }
      if (channel === 'run-existing-project-review') {
        // Simulate a successful review workflow result
        return {
          status: 'success',
          agentResults: [
            { agentId: 'context-agent', toolName: 'guided_prompt', output: 'User goals and prompt results.' },
            { agentId: 'code-documentation', toolName: 'batch_process', output: 'Documentation generated.' }
          ],
          CONTEXT_SUMMARY: {
            user_goals: { focusAreas: ['core'], docStyle: 'Microsoft', topPriority: 'API completeness' },
            prompt_results: '# Prompt Results\n- Focus: core\n- Style: Microsoft\n- Priority: API completeness'
          }
        };
      }
      return {};
    })
  }
}));

describe('App UI', () => {
  it('renders input, checkboxes, and button', () => {
    render(<App />);
    expect(screen.getByPlaceholderText('Repository Path')).toBeInTheDocument();
    expect(screen.getByText('Assess Project')).toBeInTheDocument();
    expect(screen.getByLabelText('Detect Drift')).toBeInTheDocument();
    // Existing Project Review button should be present
    expect(screen.getByText('Existing Project Review')).toBeInTheDocument();
  });

  it('opens Existing Project Review dialog and allows repo selection', async () => {
    render(<App />);
    fireEvent.click(screen.getByText('Existing Project Review'));
    expect(screen.getByText('Existing Project Review')).toBeInTheDocument();
    // Simulate entering a repo path
    fireEvent.change(screen.getByTestId('review-repo-path-input').querySelector('input'), { target: { value: '/mock/path' } });
    expect(screen.getByDisplayValue('/mock/path')).toBeInTheDocument();
    // Simulate clicking Browse
    fireEvent.click(screen.getByText('Browse'));
    await waitFor(() => expect(screen.getByDisplayValue('/mock/path')).toBeInTheDocument());
  });

  it('runs review workflow and displays results', async () => {
    render(<App />);
    fireEvent.click(screen.getByText('Existing Project Review'));
    // Enter repo path
    fireEvent.change(screen.getByTestId('review-repo-path-input').querySelector('input'), { target: { value: '/mock/path' } });
    // Click Run Review
    fireEvent.click(screen.getByTestId('run-review-btn'));
    // Should show progress indicator
    expect(await screen.findByText(/Running review workflow/i)).toBeInTheDocument();
    // Should show results after workflow completes
    await waitFor(() => expect(screen.getByText('Review Results')).toBeInTheDocument());
    expect(screen.getByTestId('review-result-output')).toBeInTheDocument();
    expect(screen.getByText('User goals and prompt results.', { exact: false })).toBeInTheDocument();
  });

  it('shows error if Run Review is clicked with no repo path', async () => {
    render(<App />);
    fireEvent.click(screen.getByText('Existing Project Review'));
    // Click Run Review with no path
    fireEvent.click(screen.getByTestId('run-review-btn'));
    expect(await screen.findByText('Repository path is required.')).toBeInTheDocument();
  });

  it('opens help/info dialog for Existing Project Review workflow', async () => {
    render(<App />);
    // Click the help/info button
    fireEvent.click(screen.getByTestId('open-help-btn'));
    // Help dialog should open and display markdown content
    expect(await screen.findByText('About the Existing Project Review Workflow')).toBeInTheDocument();
    expect(screen.getByText('Existing Project Review Workflow')).toBeInTheDocument();
    expect(screen.getByText('Automated Project Assessment', { exact: false })).toBeInTheDocument();
    // Close the dialog
    fireEvent.click(screen.getByText('Close'));
    await waitFor(() => expect(screen.queryByText('About the Existing Project Review Workflow')).not.toBeInTheDocument());
  });

  it('shows onboarding tooltip for Existing Project Review button and hides after click', async () => {
    render(<App />);
    // Tooltip should be visible initially
    expect(screen.getByText(/Try the new Existing Project Review workflow/i)).toBeInTheDocument();
    // Click the button (should hide tooltip)
    fireEvent.click(screen.getByTestId('open-existing-project-review-btn'));
    await waitFor(() => expect(screen.queryByText(/Try the new Existing Project Review workflow/i)).not.toBeInTheDocument());
  });

  it('has no accessibility violations in main dialogs and modals', async () => {
    const { container } = render(<App />);
    // Open Existing Project Review dialog
    fireEvent.click(screen.getByTestId('open-existing-project-review-btn'));
    // Open Create Project dialog
    fireEvent.click(screen.getByText('+ Create New Project'));
    // Open Help dialog
    fireEvent.click(screen.getByTestId('open-help-btn'));
    // Run axe accessibility checks
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('allows keyboard navigation and focus in Existing Project Review dialog', async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('open-existing-project-review-btn'));
    // Tab to the repo path input
    const repoInput = screen.getByTestId('review-repo-path-input').querySelector('input');
    repoInput.focus();
    expect(document.activeElement).toBe(repoInput);
    // Tab to the Browse button
    fireEvent.keyDown(repoInput, { key: 'Tab', code: 'Tab' });
    // Focus should move to the Browse button or next focusable element
    // (This is a basic check; more advanced focus management can be tested with user-event)
  });
});
