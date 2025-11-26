import React, { useState } from 'react';
import { Box, Button, Stepper, Step, StepLabel, Typography, TextField, MenuItem, Checkbox, FormControlLabel, IconButton, InputAdornment, Paper } from '@mui/material';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import DescriptionIcon from '@mui/icons-material/Description';
import GitHubIcon from '@mui/icons-material/GitHub';
import GavelIcon from '@mui/icons-material/Gavel';
import StorageIcon from '@mui/icons-material/Storage';

const FRAMEWORKS = [
  { label: 'React', value: 'React', icon: <DescriptionIcon color="primary" /> },
  { label: 'Next.js', value: 'Next.js', icon: <DescriptionIcon color="primary" /> },
  { label: 'Node.js', value: 'Node.js', icon: <StorageIcon color="success" /> },
  { label: 'Python', value: 'Python', icon: <GavelIcon color="secondary" /> },
  { label: 'C#', value: 'C#', icon: <GavelIcon color="secondary" /> },
];

const LICENSES = [
  { label: 'No License', value: '' },
  { label: 'MIT', value: 'MIT' },
  { label: 'Apache', value: 'Apache' },
  { label: 'GPL', value: 'GPL' },
];

const steps = [
  'Project Info',
  'Framework & Options',
  'Environment & License',
  'Summary',
];

export default function CreateProjectStepper({ open, onClose, onCreate }) {
  const [activeStep, setActiveStep] = useState(0);
  const [project, setProject] = useState({
    projectName: '',
    projectPath: '',
    framework: '',
    includeDocs: true,
    initGit: true,
    createGitHub: false,
    envVars: [{ key: '', value: '' }],
    license: '',
  });
  const [error, setError] = useState('');

  const handleNext = () => {
    setError('');
    if (activeStep === 0 && (!project.projectName.trim() || !project.projectPath.trim())) {
      setError('Project name and path are required.');
      return;
    }
    if (activeStep === 1 && !project.framework) {
      setError('Please select a framework.');
      return;
    }
    setActiveStep(prev => prev + 1);
  };
  const handleBack = () => setActiveStep(prev => prev - 1);
  const handleChange = (field, value) => setProject(prev => ({ ...prev, [field]: value }));
  const handleEnvVarChange = (idx, field, value) => setProject(prev => {
    const envVars = prev.envVars.map((ev, i) => i === idx ? { ...ev, [field]: value } : ev);
    return { ...prev, envVars };
  });
  const handleAddEnvVar = () => setProject(prev => ({ ...prev, envVars: [...prev.envVars, { key: '', value: '' }] }));
  const handleRemoveEnvVar = idx => setProject(prev => ({ ...prev, envVars: prev.envVars.filter((_, i) => i !== idx) }));

  const handleSubmit = () => {
    setError('');
    if (!project.projectName.trim() || !project.projectPath.trim() || !project.framework) {
      setError('Please fill in all required fields.');
      return;
    }
    onCreate(project);
  };

  return (
    <Paper elevation={6} sx={{ maxWidth: 540, mx: 'auto', mt: 6, p: 3, borderRadius: 3, bgcolor: '#181f2a', color: '#fff' }}>
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
        {steps.map(label => (
          <Step key={label}>
            <StepLabel sx={{ color: '#fff' }}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {activeStep === 0 && (
        <Box>
          <TextField
            label="Project Name"
            value={project.projectName}
            onChange={e => handleChange('projectName', e.target.value)}
            fullWidth required margin="normal"
            InputProps={{ style: { color: '#fff' } }}
            InputLabelProps={{ style: { color: '#fff' } }}
          />
          <TextField
            label="Destination Path"
            value={project.projectPath}
            onChange={e => handleChange('projectPath', e.target.value)}
            fullWidth required margin="normal"
            InputProps={{
              style: { color: '#fff' },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton tabIndex={-1} edge="end" sx={{ color: '#fff' }}>
                    <FolderOpenIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            InputLabelProps={{ style: { color: '#fff' } }}
          />
        </Box>
      )}
      {activeStep === 1 && (
        <Box>
          <Typography sx={{ mb: 1, color: '#fff' }}>Select Framework</Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            {FRAMEWORKS.map(fw => (
              <Button
                key={fw.value}
                variant={project.framework === fw.value ? 'contained' : 'outlined'}
                color={project.framework === fw.value ? 'primary' : 'inherit'}
                onClick={() => handleChange('framework', fw.value)}
                startIcon={fw.icon}
                sx={{ minWidth: 120, fontWeight: 600, bgcolor: project.framework === fw.value ? '#0ea5e9' : '#23293a', color: '#fff', borderColor: '#0ea5e9' }}
              >
                {fw.label}
              </Button>
            ))}
          </Box>
          <FormControlLabel
            control={<Checkbox checked={project.includeDocs} onChange={e => handleChange('includeDocs', e.target.checked)} />}
            label="Include Documentation Templates"
            sx={{ color: '#fff' }}
          />
          <FormControlLabel
            control={<Checkbox checked={project.initGit} onChange={e => handleChange('initGit', e.target.checked)} />}
            label="Initialize Git Repository"
            sx={{ color: '#fff' }}
          />
          <FormControlLabel
            control={<Checkbox checked={project.createGitHub} onChange={e => handleChange('createGitHub', e.target.checked)} />}
            label={<span><GitHubIcon sx={{ fontSize: 18, verticalAlign: 'middle', mr: 0.5 }} /> Create GitHub Repository</span>}
            sx={{ color: '#fff' }}
          />
        </Box>
      )}
      {activeStep === 2 && (
        <Box>
          <Typography sx={{ mb: 1, color: '#fff' }}>Environment Variables</Typography>
          {project.envVars.map((ev, idx) => (
            <Box key={idx} sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <TextField
                label="Key"
                value={ev.key}
                onChange={e => handleEnvVarChange(idx, 'key', e.target.value)}
                sx={{ input: { color: '#fff', bgcolor: '#23293a' } }}
                size="small"
              />
              <TextField
                label="Value"
                value={ev.value}
                onChange={e => handleEnvVarChange(idx, 'value', e.target.value)}
                sx={{ input: { color: '#fff', bgcolor: '#23293a' } }}
                size="small"
              />
              <Button color="error" onClick={() => handleRemoveEnvVar(idx)} disabled={project.envVars.length === 1}>Remove</Button>
            </Box>
          ))}
          <Button onClick={handleAddEnvVar} color="primary" sx={{ mt: 1 }}>+ Add Variable</Button>
          <TextField
            select
            label="License"
            value={project.license}
            onChange={e => handleChange('license', e.target.value)}
            fullWidth margin="normal"
            InputLabelProps={{ style: { color: '#fff' } }}
            sx={{ input: { color: '#fff', bgcolor: '#23293a' }, label: { color: '#fff' } }}
          >
            {LICENSES.map(l => <MenuItem key={l.value} value={l.value}>{l.label}</MenuItem>)}
          </TextField>
        </Box>
      )}
      {activeStep === 3 && (
        <Box>
          <Typography variant="h6" sx={{ mb: 2, color: '#0ea5e9' }}>Summary</Typography>
          <Typography sx={{ mb: 1 }}><b>Project Name:</b> {project.projectName}</Typography>
          <Typography sx={{ mb: 1 }}><b>Path:</b> {project.projectPath}</Typography>
          <Typography sx={{ mb: 1 }}><b>Framework:</b> {project.framework}</Typography>
          <Typography sx={{ mb: 1 }}><b>Include Docs:</b> {project.includeDocs ? 'Yes' : 'No'}</Typography>
          <Typography sx={{ mb: 1 }}><b>Init Git:</b> {project.initGit ? 'Yes' : 'No'}</Typography>
          <Typography sx={{ mb: 1 }}><b>Create GitHub:</b> {project.createGitHub ? 'Yes' : 'No'}</Typography>
          <Typography sx={{ mb: 1 }}><b>License:</b> {project.license || 'None'}</Typography>
          <Typography sx={{ mb: 1 }}><b>Env Vars:</b> {project.envVars.filter(ev => ev.key).length > 0 ? project.envVars.filter(ev => ev.key).map(ev => `${ev.key}=${ev.value}`).join(', ') : 'None'}</Typography>
        </Box>
      )}
      {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Box>
          {activeStep > 0 && <Button onClick={handleBack} sx={{ mr: 2 }}>Back</Button>}
          {activeStep < steps.length - 1 && <Button variant="contained" color="primary" onClick={handleNext}>Next</Button>}
          {activeStep === steps.length - 1 && <Button variant="contained" color="success" onClick={handleSubmit}>Create Project</Button>}
        </Box>
      </Box>
    </Paper>
  );
}
