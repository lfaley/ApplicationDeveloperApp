import React, { useState } from 'react';
import { Box, Button, Checkbox, Dialog, DialogContent, DialogTitle, FormControlLabel, Modal, Typography, TextField, MenuItem } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import lottiePenguin from './penguin-lottie.json';
import Lottie from 'lottie-react';

const ACTIONS = [
  { name: 'detect-drift', label: 'Detect Drift', default: true },
  { name: 'health-check', label: 'Health Check', default: true },
  { name: 'suggest-updates', label: 'Suggest Updates', default: true },
  { name: 'auto-sync', label: 'Auto Sync', default: false },
];

// Framework options for new project creation
const FRAMEWORKS = [
  'React', 'Next.js', 'Node.js', 'Python', 'C#'
];

export default function App() {
  const [repoPath, setRepoPath] = useState('');
  const [selected, setSelected] = useState(ACTIONS.map(a => a.default));
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // State for Create New Project dialog
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    projectName: '',
    projectPath: '',
    framework: '',
    includeDocs: true,
    initGit: true,
    createGitHub: false,
    envVars: [{ key: '', value: '' }],
    license: ''
  });
  const [createError, setCreateError] = useState('');

  const handleBrowse = async () => {
    const { ipcRenderer } = window.require('electron');
    const folder = await ipcRenderer.invoke('select-folder');
    if (folder) setRepoPath(folder);
  };

  const handleAssess = async () => {
    setLoading(true);
    setResult(null);
    setModalOpen(false);
    const { ipcRenderer } = window.require('electron');
    const actions = ACTIONS.filter((_, i) => selected[i]);
    try {
      const response = await ipcRenderer.invoke('assess-project', {
        repoPath,
        actions,
      });
      setResult(response);
      setModalOpen(true);
    } catch (e) {
      setResult({ markdown: `**Error:** ${e.message}` });
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result?.markdown || '');
  };

  const handleDownload = () => {
    const blob = new Blob([result?.markdown || ''], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'assessment-report.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Handler to open Create New Project dialog
  const handleOpenCreateDialog = () => {
    setCreateDialogOpen(true);
    setCreateError('');
  };

  // Handler to close Create New Project dialog
  const handleCloseCreateDialog = () => {
    setCreateDialogOpen(false);
    setCreateError('');
  };

  // Handler for new project form field changes
  const handleNewProjectChange = (field, value) => {
    setNewProject(prev => ({ ...prev, [field]: value }));
  };

  // Handler for environment variable changes
  const handleEnvVarChange = (idx, field, value) => {
    setNewProject(prev => {
      const envVars = prev.envVars.map((ev, i) => i === idx ? { ...ev, [field]: value } : ev);
      return { ...prev, envVars };
    });
  };

  // Handler to add a new env var row
  const handleAddEnvVar = () => {
    setNewProject(prev => ({ ...prev, envVars: [...prev.envVars, { key: '', value: '' }] }));
  };

  // Handler to remove an env var row
  const handleRemoveEnvVar = (idx) => {
    setNewProject(prev => ({ ...prev, envVars: prev.envVars.filter((_, i) => i !== idx) }));
  };

  // Handler for Create Project form submission
  const handleCreateProject = async () => {
    setCreateError('');
    // Basic validation
    if (!newProject.projectName.trim() || !newProject.projectPath.trim() || !newProject.framework) {
      setCreateError('Please fill in all required fields and select a framework.');
      return;
    }
    // Prevent directory traversal
    if (newProject.projectName.includes('..') || newProject.projectPath.includes('..')) {
      setCreateError('Invalid path: directory traversal is not allowed.');
      return;
    }
    setLoading(true);
    try {
      // Prepare environment variables, filter out empty keys
      const envVars = newProject.envVars.filter(ev => ev.key.trim() !== '');
      // Prepare payload for IPC
      const payload = {
        ...newProject,
        envVars,
      };
      // Call Electron main process to create project
      const { ipcRenderer } = window.require('electron');
      const response = await ipcRenderer.invoke('create-project', payload);
      // Handle response
      if (response.success) {
        setResult({
          markdown: `**Project created:** ${response.projectPath}\n\n${response.githubResult || ''}`,
          setupLog: response.setupLog || [],
        });
        setModalOpen(true);
        setCreateDialogOpen(false);
      } else {
        setCreateError(response.error || 'Unknown error occurred.');
      }
    } catch (err) {
      setCreateError(`Error: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4, fontFamily: 'Segoe UI, sans-serif', bgcolor: '#181c24', minHeight: '100vh', color: '#fff' }}>
      {/* Create New Project Button */}
      <Button variant="contained" color="success" sx={{ mb: 3, fontWeight: 600, fontSize: 18 }} onClick={handleOpenCreateDialog}>
        + Create New Project
      </Button>

      {/* Create New Project Dialog */}
      <Dialog open={createDialogOpen} onClose={handleCloseCreateDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Project</DialogTitle>
        <DialogContent>
          {/* Project Name */}
          <TextField
            label="Project Name"
            placeholder="Enter project name..."
            value={newProject.projectName}
            onChange={e => handleNewProjectChange('projectName', e.target.value)}
            fullWidth margin="normal" required
            variant="outlined"
            InputLabelProps={{ style: { color: '#fff' } }}
            sx={{ input: { color: '#fff', bgcolor: '#242a36' }, label: { color: '#fff' } }}
          />
          {/* Project Path */}
          <TextField
            label="Destination Path"
            placeholder="C:/Users/yourname/Projects"
            value={newProject.projectPath}
            onChange={e => handleNewProjectChange('projectPath', e.target.value)}
            fullWidth margin="normal" required
            variant="outlined"
            InputLabelProps={{ style: { color: '#fff' } }}
            sx={{ input: { color: '#fff', bgcolor: '#242a36' }, label: { color: '#fff' } }}
          />
          {/* Framework */}
          <TextField
            select
            label="Framework"
            value={newProject.framework}
            onChange={e => handleNewProjectChange('framework', e.target.value)}
            fullWidth margin="normal" required
            variant="outlined"
            InputLabelProps={{ style: { color: '#fff' } }}
            sx={{ input: { color: '#fff', bgcolor: '#242a36' }, label: { color: '#fff' } }}
          >
            <MenuItem value="">Select Framework</MenuItem>
            {FRAMEWORKS.map(fw => <MenuItem key={fw} value={fw}>{fw}</MenuItem>)}
          </TextField>
          {/* License */}
          <TextField
            select
            label="License"
            value={newProject.license}
            onChange={e => handleNewProjectChange('license', e.target.value)}
            fullWidth margin="normal"
            variant="outlined"
            InputLabelProps={{ style: { color: '#fff' } }}
            sx={{ input: { color: '#fff', bgcolor: '#242a36' }, label: { color: '#fff' } }}
          >
            <MenuItem value="">No License</MenuItem>
            <MenuItem value="MIT">MIT</MenuItem>
            <MenuItem value="Apache">Apache</MenuItem>
            <MenuItem value="GPL">GPL</MenuItem>
          </TextField>
          {/* Env Vars */}
          <Box sx={{ mt: 2, mb: 1 }}>
            <Typography variant="subtitle1" sx={{ color: '#fff' }}>Environment Variables</Typography>
            {newProject.envVars.map((ev, idx) => (
              <Box key={idx} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  label="Key"
                  placeholder="KEY"
                  value={ev.key}
                  onChange={e => handleEnvVarChange(idx, 'key', e.target.value)}
                  sx={{ input: { color: '#fff', bgcolor: '#242a36' } }}
                  size="small"
                />
                <TextField
                  label="Value"
                  placeholder="VALUE"
                  value={ev.value}
                  onChange={e => handleEnvVarChange(idx, 'value', e.target.value)}
                  sx={{ input: { color: '#fff', bgcolor: '#242a36' } }}
                  size="small"
                />
                <Button color="error" onClick={() => handleRemoveEnvVar(idx)} disabled={newProject.envVars.length === 1}>Remove</Button>
              </Box>
            ))}
            <Button onClick={handleAddEnvVar} color="primary" sx={{ mt: 1 }}>+ Add Variable</Button>
          </Box>
          {/* Options */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2, mb: 1 }}>
            <FormControlLabel
              control={<Checkbox checked={newProject.includeDocs} onChange={e => handleNewProjectChange('includeDocs', e.target.checked)} />}
              label="Include Documentation Templates"
              sx={{ color: '#fff' }}
            />
            <FormControlLabel
              control={<Checkbox checked={newProject.initGit} onChange={e => handleNewProjectChange('initGit', e.target.checked)} />}
              label="Initialize Git Repository"
              sx={{ color: '#fff' }}
            />
            <FormControlLabel
              control={<Checkbox checked={newProject.createGitHub} onChange={e => handleNewProjectChange('createGitHub', e.target.checked)} />}
              label="Create GitHub Repository"
              sx={{ color: '#fff' }}
            />
          </Box>
          {/* Error message */}
          {createError && <Typography color="error" sx={{ mt: 1 }}>{createError}</Typography>}
          {/* Action buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
            <Button onClick={handleCloseCreateDialog}>Cancel</Button>
            <Button variant="contained" color="success" sx={{ fontWeight: 700, fontSize: 18, px: 4 }} onClick={handleCreateProject}>Create Project</Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Existing Project Assessment UI */}
      <Typography variant="h4" gutterBottom>Project Assessment</Typography>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
        <input
          type="text"
          value={repoPath}
          onChange={e => setRepoPath(e.target.value)}
          placeholder="Repository Path"
          style={{ flex: 1, padding: 8, borderRadius: 4, border: '1px solid #888', background: '#242a36', color: '#fff' }}
        />
        <Button variant="contained" onClick={handleBrowse} sx={{ bgcolor: '#242a36', color: '#fff', border: '1px solid #fff', '&:hover': { bgcolor: '#333', color: '#00ff99', borderColor: '#00ff99' } }}>Browse</Button>
      </Box>
      <Box sx={{ mb: 2 }}>
        {ACTIONS.map((action, i) => (
          <FormControlLabel
            key={action.name}
            control={<Checkbox checked={selected[i]} onChange={e => {
              const arr = [...selected];
              arr[i] = e.target.checked;
              setSelected(arr);
            }} sx={{ color: '#fff', '&.Mui-checked': { color: '#00ff99' } }} />}
            label={action.label}
            sx={{ color: '#fff' }}
          />
        ))}
      </Box>
      <Button
        variant="contained"
        onClick={handleAssess}
        disabled={loading || !repoPath}
        sx={{
          minWidth: 180,
          fontWeight: 600,
          fontSize: 18,
          color: '#fff',
          bgcolor: '#242a36',
          border: '1px solid #fff',
          '&:hover': { bgcolor: '#333', color: '#00ff99', borderColor: '#00ff99' },
          mb: 3
        }}
      >
        Assess Project
      </Button>
      <Modal open={loading} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ bgcolor: 'rgba(24,28,36,0.95)', p: 4, borderRadius: 2, textAlign: 'center' }}>
          <Lottie animationData={lottiePenguin} loop={true} autoplay={true} style={{ height: 120 }} />
          <Typography variant="h6" sx={{ mt: 2 }}>Assessing project... <span role="img" aria-label="penguin">??</span></Typography>
        </Box>
      </Modal>
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Assessment Report</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
            <Button onClick={handleCopy} variant="outlined">Copy Markdown</Button>
            <Button onClick={handleDownload} variant="outlined">Download .md</Button>
          </Box>
          <Box sx={{ bgcolor: '#292d3e', p: 2, borderRadius: 2, maxHeight: 500, overflow: 'auto' }}>
            <ReactMarkdown
              children={result?.markdown || ''}
              components={{
                code({ node, inline, className, children, ...props }) {
                  return !inline ? (
                    <SyntaxHighlighter language="text" PreTag="div" {...props}>
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code {...props} style={{ background: '#444', color: '#f8f8f2', borderRadius: 2, padding: '2px 4px' }}>{children}</code>
                  );
                }
              }}
            />
          </Box>
        </DialogContent>
      </Dialog>

      {/* Feedback Modal for Create Project */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Project Creation Result</DialogTitle>
        <DialogContent>
          {result?.markdown && (
            <Typography sx={{ mb: 2 }}>
              <ReactMarkdown>{result.markdown}</ReactMarkdown>
            </Typography>
          )}
          {result?.setupLog && Array.isArray(result.setupLog) && result.setupLog.length > 0 && (
            <Box sx={{ bgcolor: '#222', p: 2, borderRadius: 2, mb: 2 }}>
              <Typography variant="subtitle1" sx={{ color: '#00ff99' }}>Setup Log</Typography>
              <ul style={{ color: '#e0f2fe', marginLeft: 20 }}>
                {result.setupLog.map((log, i) => <li key={i}>{log}</li>)}
              </ul>
            </Box>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
            <Button onClick={() => setModalOpen(false)}>Close</Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
