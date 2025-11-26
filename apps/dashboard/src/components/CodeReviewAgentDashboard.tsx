import React from 'react';

const CodeReviewAgentDashboard: React.FC<{ project: string }> = ({ project }) => (
  <div className="code-review-agent-dashboard">
    <h2 style={{ color: '#2B6CB0' }}>Code Review Agent</h2>
    <p style={{ color: '#4A5568' }}>Project: <b>{project}</b></p>
    <ul style={{ color: '#2D3748' }}>
      <li>Automated Code Review</li>
      <li>Suggestions & Improvements</li>
      <li>Test Coverage Insights</li>
    </ul>
    <p style={{ color: '#718096', marginTop: '2em' }}>End of workflow. Return to Home to start again.</p>
  </div>
);

export default CodeReviewAgentDashboard;
