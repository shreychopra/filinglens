import { useState, useEffect } from 'react';
import UploadScreen from './components/UploadScreen.jsx';
import AnalyzingScreen from './components/AnalyzingScreen.jsx';
import ReportScreen from './components/ReportScreen.jsx';
import ApiKeyScreen from './components/ApiKeyScreen.jsx';
import { getApiKey } from './lib/analyzer.js';

export default function App() {
  const [screen, setScreen] = useState('loading');
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (import.meta.env.DEV) {
      setScreen('upload');
      return;
    }
    const key = getApiKey();
    setScreen(key ? 'upload' : 'apikey');
  }, []);

  function handleReportReady(data) {
    setReport(data);
    setScreen('report');
  }

  function handleError(msg) {
    if (msg === 'NO_API_KEY' || msg === 'INVALID_API_KEY') {
      setScreen('apikey');
      return;
    }
    setError(msg);
    setScreen('upload');
  }

  function handleReset() {
    setReport(null);
    setError(null);
    setScreen('upload');
  }

  if (screen === 'loading') return null;

  return (
    <>
      {screen === 'apikey' && (
        <ApiKeyScreen onKeySet={() => setScreen('upload')} />
      )}
      {screen === 'upload' && (
        <UploadScreen
          onAnalyzing={() => setScreen('analyzing')}
          onReportReady={handleReportReady}
          onError={handleError}
          errorMsg={error}
          onChangeKey={() => setScreen('apikey')}
        />
      )}
      {screen === 'analyzing' && <AnalyzingScreen />}
      {screen === 'report' && report && (
        <ReportScreen report={report} onReset={handleReset} />
      )}
    </>
  );
}
