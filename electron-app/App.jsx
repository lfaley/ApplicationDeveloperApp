import React, { useState } from 'react';
import { Box, Button, Checkbox, Dialog, DialogContent, DialogTitle, FormControlLabel, Modal, Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import lottiePenguin from './penguin-lottie.json'; // Placeholder, add your Lottie JSON
import { Player } from 'lottie-react';

const ACTIONS = [
  { name: 'detect-drift', label: 'Detect Drift', default: true },
  { name: 'health-check', label: 'Health Check', default: true },
  { name: 'suggest-updates', label: 'Suggest Updates', default: true },
  { name: 'auto-sync', label: 'Auto Sync', default: false },
];

export default function App() {
  const [repoPath, setRepoPath] = useState('');
  const [selected, setSelected] = useState(ACTIONS.map(a => a.default));
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

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

  return (
    <Box sx={{ p: 4, fontFamily: 'Segoe UI, sans-serif', bgcolor: '#181c24', minHeight: '100vh', color: '#fff' }}>
      <Typography variant="h4" gutterBottom>Project Assessment</Typography>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
        <input
          type="text"
          value={repoPath}
          onChange={e => setRepoPath(e.target.value)}
          placeholder="Repository Path"
          style={{ flex: 1, padding: 8, borderRadius: 4, border: '1px solid #444', background: '#222', color: '#fff' }}
        />
        <Button variant="contained" onClick={handleBrowse}>Browse</Button>
      </Box>
      <Box sx={{ mb: 2 }}>
        {ACTIONS.map((action, i) => (
          <FormControlLabel
            key={action.name}
            control={<Checkbox checked={selected[i]} onChange={e => {
              const arr = [...selected];
              arr[i] = e.target.checked;
              setSelected(arr);
            }} sx={{ color: '#fff' }} />}
            label={action.label}
            sx={{ color: '#fff' }}
          />
        ))}
      </Box>
      <Button variant="contained" color="primary" onClick={handleAssess} disabled={loading || !repoPath} sx={{ minWidth: 180, fontWeight: 600, fontSize: 18 }}>
        Assess Project
      </Button>
      <Modal open={loading} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ bgcolor: 'rgba(24,28,36,0.95)', p: 4, borderRadius: 2, textAlign: 'center' }}>
          <Player autoplay loop src={lottiePenguin} style={{ height: 120 }} />
          <Typography variant="h6" sx={{ mt: 2 }}>Assessing project... <span role="img" aria-label="penguin">??</span></Typography>
        </Box>
      </Modal>
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Assessment Report</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
            <Button onClick={handleCopy} variant="outlined">Copy Markdown</Button>
            <Button onClick={handleDownload} variant="outlined">Download .md</Button>
            {/* Share/HTML/Email features can be added here */}
          </Box>
          <Box sx={{ bgcolor: '#222', p: 2, borderRadius: 2, maxHeight: 500, overflow: 'auto' }}>
            <ReactMarkdown
              children={result?.markdown || ''}
              components={{
                code({ node, inline, className, children, ...props }) {
                  return !inline ? (
                    <SyntaxHighlighter language="text" PreTag="div" {...props}>
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code {...props} style={{ background: '#333', color: '#fff', borderRadius: 2, padding: '2px 4px' }}>{children}</code>
                  );
                }
              }}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
