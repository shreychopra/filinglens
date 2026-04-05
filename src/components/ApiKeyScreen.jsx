import { useState } from 'react';
import { Key, ExternalLink, Eye, EyeOff, Zap, ArrowRight } from 'lucide-react';
import { saveApiKey } from '../lib/analyzer.js';
import styles from './ApiKeyScreen.module.css';

export default function ApiKeyScreen({ onKeySet }) {
  const [key, setKey] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = key.trim();
    if (!trimmed.startsWith('sk-ant-')) {
      setError('This doesn\'t look like an Anthropic API key. It should start with "sk-ant-"');
      return;
    }

    setLoading(true);
    setError('');

    // Quick validation call
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': trimmed,
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 10,
          messages: [{ role: 'user', content: 'Hi' }],
        }),
      });

      if (res.status === 401) {
        setError('Invalid API key. Please check and try again.');
        setLoading(false);
        return;
      }

      saveApiKey(trimmed);
      onKeySet();
    } catch (err) {
      setError('Connection failed: ' + (err?.message || String(err)));
    }
    setLoading(false);
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Zap size={18} strokeWidth={2.5} />
          FilingLens
        </div>

        <div className={styles.card}>
          <div className={styles.iconWrap}>
            <Key size={22} strokeWidth={1.5} />
          </div>

          <h1 className={styles.title}>Connect your Anthropic API key</h1>
          <p className={styles.sub}>
            FilingLens uses Claude to analyse your filings. You'll need an Anthropic API key — it stays in your browser only, never sent to any server.
          </p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputWrap}>
              <input
                type={show ? 'text' : 'password'}
                value={key}
                onChange={e => { setKey(e.target.value); setError(''); }}
                placeholder="sk-ant-api03-..."
                className={styles.input}
                autoComplete="off"
                spellCheck={false}
              />
              <button
                type="button"
                className={styles.toggleShow}
                onClick={() => setShow(s => !s)}
                tabIndex={-1}
              >
                {show ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={!key.trim() || loading}
            >
              {loading ? 'Verifying…' : (
                <>Start analysing <ArrowRight size={14} /></>
              )}
            </button>
          </form>

          <div className={styles.howTo}>
            <p className={styles.howToTitle}>How to get a key</p>
            <ol className={styles.howToSteps}>
              <li>Go to <a href="https://console.anthropic.com" target="_blank" rel="noreferrer">console.anthropic.com <ExternalLink size={11} /></a></li>
              <li>Sign up or log in</li>
              <li>Go to API Keys → Create key</li>
              <li>Paste it above</li>
            </ol>
            <p className={styles.costNote}>
              Each filing analysis costs approximately ₹0.30–₹1.50 in API credits depending on document size.
            </p>
          </div>
        </div>

        <p className={styles.privacy}>
          Your key is stored only in your browser's local storage. FilingLens has no backend — all API calls go directly from your browser to Anthropic.
        </p>
      </div>
    </div>
  );
}
