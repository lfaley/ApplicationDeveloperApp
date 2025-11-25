import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';

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
  });

  it('shows loader and then modal with markdown after assessment', async () => {
    render(<App />);
    fireEvent.change(screen.getByPlaceholderText('Repository Path'), { target: { value: '/mock/path' } });
    fireEvent.click(screen.getByText('Assess Project'));
    expect(await screen.findByText(/Assessing project/i)).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText('Assessment Report')).toBeInTheDocument());
    expect(screen.getByText('Detect Drift')).toBeInTheDocument();
    expect(screen.getByText('Health Check')).toBeInTheDocument();
  });

  it('allows copying and downloading markdown', async () => {
    render(<App />);
    fireEvent.change(screen.getByPlaceholderText('Repository Path'), { target: { value: '/mock/path' } });
    fireEvent.click(screen.getByText('Assess Project'));
    await waitFor(() => expect(screen.getByText('Assessment Report')).toBeInTheDocument());
    expect(screen.getByText('Copy Markdown')).toBeInTheDocument();
    expect(screen.getByText('Download .md')).toBeInTheDocument();
  });
});
