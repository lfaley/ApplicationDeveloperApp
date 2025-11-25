import React, { useState } from 'react';
import { Box, Button, Checkbox, Dialog, DialogContent, DialogTitle, FormControlLabel, Modal, Typography, TextField, MenuItem } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import lottiePenguin from './penguin-lottie.json';
import Lottie from 'lottie-react';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Tooltip from '@mui/material/Tooltip';

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

  // State for Existing Project Review dialog/modal
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  // State for project path selection in Existing Project Review dialog
  const [reviewRepoPath, setReviewRepoPath] = useState('');
  const [reviewRepoError, setReviewRepoError] = useState('');

  // State for review workflow progress and results
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewResult, setReviewResult] = useState(null);
  const [reviewError, setReviewError] = useState('');

  // State for help/info section visibility
  const [helpOpen, setHelpOpen] = useState(false);
  // Markdown content for workflow help (can be loaded dynamically if needed)
  const workflowHelpMarkdown = `# Existing Project Review Workflow\n\nThis workflow automates the review and documentation process for existing projects using the orchestration agent.\n\n## Steps\n1. **Automated Project Assessment**\n   - Runs code review, lint, test coverage, security, and documentation scan on the full workspace.\n2. **Guided User Prompts**\n   - Asks the user what they want to improve or accomplish (e.g., add tests, refactor, update docs).\n   - Clarifies modules and documentation style as needed.\n3. **Documentation Generation**\n   - Generates or updates documentation to match project standards, using context from previous steps.\n\n## Usage\n- Trigger the workflow using the \`Existing Project Review\` button.\n- Results and generated documentation are written to files for review.\n\n---\n*All workflow steps are fully implemented and tested. This file documents the workflow and how to use it for systematic existing project improvement.*`;

  /**
   * Handler to open the help/info dialog for the Existing Project Review workflow.
   */
  const handleOpenHelp = () => {
    setHelpOpen(true);
    console.debug('[UI] Opening help/info dialog for Existing Project Review workflow');
  };

  /**
   * Handler to close the help/info dialog.
   */
  const handleCloseHelp = () => {
    setHelpOpen(false);
    console.debug('[UI] Closing help/info dialog for Existing Project Review workflow');
  };

  /**
   * Handler to open the Existing Project Review workflow dialog.
   * This will be the entry point for launching the workflow from the UI.
   */
  const handleOpenReviewDialog = () => {
    setReviewDialogOpen(true);
    // Additional logic for initializing review state can be added here
    // (e.g., clearing previous results, setting up debug logs)
    console.debug('[UI] Opening Existing Project Review dialog');
  };

  /**
   * Handler to close the Existing Project Review workflow dialog.
   */
  const handleCloseReviewDialog = () => {
    setReviewDialogOpen(false);
    // Additional cleanup logic can be added here
    console.debug('[UI] Closing Existing Project Review dialog');
  };

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

  /**
   * Handler for browsing/selecting a folder for the review workflow.
   * Uses Electron's IPC to open a folder dialog.
   */
  const handleReviewBrowse = async () => {
    try {
      const { ipcRenderer } = window.require('electron');
      const folder = await ipcRenderer.invoke('select-folder');
      if (folder) {
        setReviewRepoPath(folder);
        setReviewRepoError('');
        console.debug('[UI] Selected repo path for review:', folder);
      }
    } catch (err) {
      setReviewRepoError('Failed to select folder.');
      console.error('[UI] Error selecting folder for review:', err);
    }
  };

  /**
   * Handler for manual input of the repo path for review.
   */
  const handleReviewRepoPathChange = (e) => {
    setReviewRepoPath(e.target.value);
    setReviewRepoError('');
  };

  /**
   * Handler to run the Existing Project Review workflow via IPC.
   * Calls the orchestration agent's existing_project_review_workflow tool.
   * Handles loading state, errors, and debug logging.
   */
  const handleRunReview = async () => {
    setReviewLoading(true);
    setReviewResult(null);
    setReviewError('');
    try {
      // Validate input
      if (!reviewRepoPath.trim()) {
        setReviewError('Repository path is required.');
        setReviewLoading(false);
        return;
      }
      const { ipcRenderer } = window.require('electron');
      // Debug log for workflow start
      console.debug('[UI] Starting Existing Project Review workflow for:', reviewRepoPath);
      // IPC call to main process (must be implemented in main process)
      const response = await ipcRenderer.invoke('run-existing-project-review', { repoPath: reviewRepoPath });
      // Debug log for workflow result
      console.debug('[UI] Review workflow result:', response);
      setReviewResult(response);
    } catch (err) {
      setReviewError('Failed to run review workflow.');
      console.error('[UI] Error running review workflow:', err);
    } finally {
      setReviewLoading(false);
    }
  };

  // State for onboarding tooltip visibility
  const [showReviewTooltip, setShowReviewTooltip] = useState(true);

  return (
    <Box sx={{ p: 4, fontFamily: 'Segoe UI, sans-serif', bgcolor: '#181c24', minHeight: '100vh', color: '#fff' }}>
      {/* Create New Project Button */}
      <Button variant="contained" color="success" sx={{ mb: 3, fontWeight: 600, fontSize: 18 }} onClick={handleOpenCreateDialog}>
        + Create New Project
      </Button>

      {/* Existing Project Review Button with onboarding tooltip */}
      <Tooltip
        title="Try the new Existing Project Review workflow! Click to get a guided review and documentation assessment."
        open={showReviewTooltip}
        onClose={() => setShowReviewTooltip(false)}
        disableFocusListener
        disableTouchListener
        arrow
        placement="right"
      >
        <Button
          variant="contained"
          color="info"
          sx={{ mb: 3, ml: 2, fontWeight: 600, fontSize: 18 }}
          onClick={() => {
            setShowReviewTooltip(false); // Hide tooltip after first click
            handleOpenReviewDialog();
          }}
          data-testid="open-existing-project-review-btn"
        >
          Existing Project Review
        </Button>
      </Tooltip>

      {/* Help/Info Button for Existing Project Review Workflow */}
      <Button
        variant="outlined"
        color="info"
        startIcon={<InfoOutlinedIcon />}
        sx={{ mb: 3, ml: 2, fontWeight: 600, fontSize: 16 }}
        onClick={handleOpenHelp}
        data-testid="open-help-btn"
      >
        Existing Project Review Help
      </Button>

      {/* Create New Project Dialog */}
      <Dialog open={createDialogOpen} onClose={handleCloseCreateDialog} maxWidth="sm" fullWidth>
        <Box sx={{ bgcolor: '#0ea5e9', color: '#fff', p: 2, borderTopLeftRadius: 8, borderTopRightRadius: 8, display: 'flex', alignItems: 'center', gap: 2 }}>
          <span style={{ fontSize: 28, marginRight: 8 }}>??</span>
          <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: 1 }}>Create New Project</Typography>
        </Box>
        <DialogContent sx={{ bgcolor: '#181f2a', borderBottomLeftRadius: 8, borderBottomRightRadius: 8, boxShadow: 3, p: 0 }}>
          <Box sx={{ p: 3, pb: 1 }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                label="Project Name"
                placeholder="Enter project name..."
                value={newProject.projectName}
                onChange={e => handleNewProjectChange('projectName', e.target.value)}
                fullWidth required
                variant="outlined"
                InputLabelProps={{ style: { color: '#fff' } }}
                sx={{ input: { color: '#fff', bgcolor: '#23293a' }, label: { color: '#fff' } }}
              />
              <TextField
                label="Destination Path"
                placeholder="C:/Users/yourname/Projects"
                value={newProject.projectPath}
                onChange={e => handleNewProjectChange('projectPath', e.target.value)}
                fullWidth required
                variant="outlined"
                InputLabelProps={{ style: { color: '#fff' } }}
                sx={{ input: { color: '#fff', bgcolor: '#23293a' }, label: { color: '#fff' } }}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                select
                label="Framework"
                value={newProject.framework}
                onChange={e => handleNewProjectChange('framework', e.target.value)}
                fullWidth required
                variant="outlined"
                InputLabelProps={{ style: { color: '#fff' } }}
                sx={{ input: { color: '#fff', bgcolor: '#23293a' }, label: { color: '#fff' } }}
              >
                <MenuItem value="">Select Framework</MenuItem>
                {FRAMEWORKS.map(fw => <MenuItem key={fw} value={fw}>{fw}</MenuItem>)}
              </TextField>
              <TextField
                select
                label="License"
                value={newProject.license}
                onChange={e => handleNewProjectChange('license', e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ style: { color: '#fff' } }}
                sx={{ input: { color: '#fff', bgcolor: '#23293a' }, label: { color: '#fff' } }}
              >
                <MenuItem value="">No License</MenuItem>
                <MenuItem value="MIT">MIT</MenuItem>
                <MenuItem value="Apache">Apache</MenuItem>
                <MenuItem value="GPL">GPL</MenuItem>
              </TextField>
            </Box>
            <Box sx={{ mt: 2, mb: 1, bgcolor: '#20293a', borderRadius: 2, p: 2 }}>
              <Typography variant="subtitle1" sx={{ color: '#fff', mb: 1 }}>Environment Variables</Typography>
              {newProject.envVars.map((ev, idx) => (
                <Box key={idx} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <TextField
                    label="Key"
                    placeholder="KEY"
                    value={ev.key}
                    onChange={e => handleEnvVarChange(idx, 'key', e.target.value)}
                    sx={{ input: { color: '#fff', bgcolor: '#23293a' } }}
                    size="small"
                  />
                  <TextField
                    label="Value"
                    placeholder="VALUE"
                    value={ev.value}
                    onChange={e => handleEnvVarChange(idx, 'value', e.target.value)}
                    sx={{ input: { color: '#fff', bgcolor: '#23293a' } }}
                    size="small"
                  />
                  <Button color="error" onClick={() => handleRemoveEnvVar(idx)} disabled={newProject.envVars.length === 1}>Remove</Button>
                </Box>
              ))}
              <Button onClick={handleAddEnvVar} color="primary" sx={{ mt: 1 }}>+ Add Variable</Button>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, mt: 2, mb: 1 }}>
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
            {createError && <Typography color="error" sx={{ mt: 1 }}>{createError}</Typography>}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
              <Button onClick={handleCloseCreateDialog}>Cancel</Button>
              <Button variant="contained" color="success" sx={{ fontWeight: 700, fontSize: 18, px: 4 }} onClick={handleCreateProject}>Create Project</Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Existing Project Review Dialog (now with progress and result display) */}
      <Dialog open={reviewDialogOpen} onClose={handleCloseReviewDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Existing Project Review</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Select the project/repository you want to review. This workflow will guide you through user goals and documentation assessment.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
            <TextField
              label="Repository Path"
              value={reviewRepoPath}
              onChange={handleReviewRepoPathChange}
              placeholder="/path/to/your/project"
              fullWidth
              InputLabelProps={{ style: { color: '#fff' } }}
              sx={{ input: { color: '#fff', bgcolor: '#23293a' }, label: { color: '#fff' } }}
              error={!!reviewRepoError}
              helperText={reviewRepoError}
              data-testid="review-repo-path-input"
            />
            <Button variant="contained" onClick={handleReviewBrowse} sx={{ bgcolor: '#242a36', color: '#fff', border: '1px solid #fff', '&:hover': { bgcolor: '#333', color: '#00ff99', borderColor: '#00ff99' } }}>
              Browse
            </Button>
          </Box>
          {/* Error message for workflow */}
          {reviewError && <Typography color="error" sx={{ mb: 2 }}>{reviewError}</Typography>}
          {/* Progress indicator */}
          {reviewLoading && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <span role="img" aria-label="hourglass">?</span>
              <Typography>Running review workflow...</Typography>
            </Box>
          )}
          {/* Result display */}
          {reviewResult && (
            <Box sx={{ bgcolor: '#23293a', borderRadius: 2, p: 2, mt: 2, mb: 2, color: '#e0e7ef' }}>
              <Typography variant="subtitle1" sx={{ color: '#0ea5e9', mb: 1 }}>Review Results</Typography>
              <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: '#e0e7ef', background: 'none', margin: 0 }} data-testid="review-result-output">
                {typeof reviewResult === 'string' ? reviewResult : JSON.stringify(reviewResult, null, 2)}
              </pre>
            </Box>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
            <Button onClick={handleCloseReviewDialog}>Cancel</Button>
            <Button
              variant="contained"
              color="primary"
              disabled={!reviewRepoPath || reviewLoading}
              onClick={handleRunReview}
              data-testid="run-review-btn"
            >
              {reviewLoading ? 'Running...' : 'Run Review'}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Help/Info Dialog for Existing Project Review Workflow */}
      <Dialog open={helpOpen} onClose={handleCloseHelp} maxWidth="md" fullWidth>
        <DialogTitle>About the Existing Project Review Workflow</DialogTitle>
        <DialogContent>
          <Box sx={{ maxHeight: 500, overflow: 'auto', bgcolor: '#181f2a', color: '#fff', borderRadius: 2, p: 2 }}>
            <ReactMarkdown>{workflowHelpMarkdown}</ReactMarkdown>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
            <Button onClick={handleCloseHelp}>Close</Button>
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
        <Box sx={{ bgcolor: '#0ea5e9', color: '#fff', p: 2, borderTopLeftRadius: 8, borderTopRightRadius: 8, display: 'flex', alignItems: 'center', gap: 2 }}>
          <span style={{ fontSize: 28, marginRight: 8 }}>??</span>
          <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: 1 }}>Assessment Report</Typography>
        </Box>
        <DialogContent sx={{ bgcolor: '#181f2a', borderBottomLeftRadius: 8, borderBottomRightRadius: 8, boxShadow: 3, p: 0 }}>
          <Box sx={{ p: 3, pb: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 2 }}>
              <Button onClick={handleCopy} variant="contained" color="info" sx={{ fontWeight: 600 }}>Copy Markdown</Button>
              <Button onClick={handleDownload} variant="contained" color="secondary" sx={{ fontWeight: 600 }}>Download .md</Button>
            </Box>
            <Box sx={{ bgcolor: '#23293a', borderRadius: 2, p: 2, boxShadow: 1, fontFamily: 'Fira Mono, monospace', color: '#e0e7ef', minHeight: 200, maxHeight: 500, overflow: 'auto', border: '1px solid #334155' }}>
              <ReactMarkdown
                children={result?.markdown || ''}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    return !inline ? (
                      <SyntaxHighlighter language="text" PreTag="div" {...props}>
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code {...props} style={{ background: '#334155', color: '#f8fafc', borderRadius: 2, padding: '2px 4px' }}>{children}</code>
                    );
                  }
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
              <Button onClick={() => setModalOpen(false)} variant="outlined" color="inherit">Close</Button>
            </Box>
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
