import React from 'react';

const OrchestrationAgentDashboard: React.FC<{ project: string; onNext: () => void }> = ({ project, onNext }) => (
  <div className="orchestration-agent-dashboard">
    <h2 style={{ color: '#2B6CB0' }}>Orchestration Agent</h2>
    <p style={{ color: '#4A5568' }}>Project: <b>{project}</b></p>
    <ul style={{ color: '#2D3748' }}>
      <li>Agent Coordination</li>
      <li>Workflow Management</li>
      <li>Integration with other agents</li>
    </ul>
    <button style={{ background: '#F6AD55', color: '#2D3748', padding: '0.7em 1.5em', borderRadius: '6px', border: 'none', fontSize: '1em' }} onClick={onNext}>
      Next: Code Review Agent
    </button>
  </div>
);

export default OrchestrationAgentDashboard;
