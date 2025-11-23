import React, { useState } from 'react';

const ProjectSelector: React.FC<{ onSelect: (project: string) => void }> = ({ onSelect }) => {
  const [projectPath, setProjectPath] = useState('');
  return (
    <div className="project-selector">
      <h2 style={{ color: '#2B6CB0' }}>Select or Create Project</h2>
      <input
        type="text"
        placeholder="Enter project path or name..."
        value={projectPath}
        onChange={e => setProjectPath(e.target.value)}
        style={{ padding: '0.5em', fontSize: '1em', borderRadius: '4px', border: '1px solid #CBD5E0', width: '60%' }}
      />
      <button
        style={{ marginLeft: '1em', background: '#38B2AC', color: '#fff', padding: '0.5em 1.5em', borderRadius: '6px', border: 'none', fontSize: '1em' }}
        onClick={() => projectPath && onSelect(projectPath)}
      >
        Continue
      </button>
    </div>
  );
};

export default ProjectSelector;
