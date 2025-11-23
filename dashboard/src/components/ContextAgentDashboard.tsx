import React from 'react';

const ContextAgentDashboard: React.FC<{ project: string; onNext: () => void }> = ({ project, onNext }) => (
  <div className="context-agent-dashboard">
    <h2 style={{ color: '#2B6CB0' }}>Context Agent</h2>
    <p style={{ color: '#4A5568' }}>Project: <b>{project}</b></p>
    <ul style={{ color: '#2D3748' }}>
      <li>Drift Detection</li>
      <li>Health Check</li>
      <li>Sync Recommendations</li>
    </ul>
    <button style={{ background: '#805AD5', color: '#fff', padding: '0.7em 1.5em', borderRadius: '6px', border: 'none', fontSize: '1em' }} onClick={onNext}>
      Next: Orchestration Agent
    </button>
  </div>
);

export default ContextAgentDashboard;
