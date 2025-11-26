import React from 'react';

const Home: React.FC<{ onNext: () => void }> = ({ onNext }) => (
  <div className="home-page">
    <h1 style={{ color: '#2D3748' }}>Welcome to ProjectPlanner</h1>
    <p style={{ color: '#4A5568' }}>Industry-standard agent platform for code, docs, and project health.</p>
    <button style={{ background: '#3182CE', color: '#fff', padding: '1em 2em', borderRadius: '8px', border: 'none', fontSize: '1.2em' }} onClick={onNext}>
      Start: New or Existing Project
    </button>
  </div>
);

export default Home;
