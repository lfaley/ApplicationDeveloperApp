import { useState } from 'react';
import Home from './components/Home';
import ProjectSelector from './components/ProjectSelector';
import ContextAgentDashboard from './components/ContextAgentDashboard';
import OrchestrationAgentDashboard from './components/OrchestrationAgentDashboard';
import CodeReviewAgentDashboard from './components/CodeReviewAgentDashboard';
import './App.css';

function App() {
  const [step, setStep] = useState<'home' | 'project' | 'context' | 'orchestration' | 'codeReview'>('home');
  const [project, setProject] = useState<string | null>(null);

  return (
    <div className="app-root">
      {step === 'home' && <Home onNext={() => setStep('project')} />}
      {step === 'project' && <ProjectSelector onSelect={proj => { setProject(proj); setStep('context'); }} />}
      {step === 'context' && project && <ContextAgentDashboard project={project} onNext={() => setStep('orchestration')} />}
      {step === 'orchestration' && project && <OrchestrationAgentDashboard project={project} onNext={() => setStep('codeReview')} />}
      {step === 'codeReview' && project && <CodeReviewAgentDashboard project={project} />}
    </div>
  );
}

export default App;
