import { useState, useRef, useCallback, useEffect } from 'react';
import {
  Upload, FileText, AlertCircle, Zap, Settings, Clock,
  Trash2, TrendingUp, TrendingDown, Minus, Play,
  ShieldCheck, Search, BookOpen, ArrowRight
} from 'lucide-react';
import { extractTextFromPDF } from '../lib/pdfExtractor.js';
import { analyzeFilingText, detectFilingType, clearApiKey } from '../lib/analyzer.js';
import { DEMO_REPORT } from '../lib/demoData.js';
import { getHistory, deleteFromHistory } from '../lib/history.js';
import styles from './UploadScreen.module.css';

const VERDICT_ICON = { strong: TrendingUp, mixed: Minus, risky: TrendingDown };
const VERDICT_CLS  = { strong: styles.vStrong, mixed: styles.vMixed, risky: styles.vRisky };

const FEATURES = [
  {
    icon: Search,
    title: 'Red flag detection',
    desc: 'Promoter pledging, auditor qualifications, rising debt, and hidden related-party transactions — surfaced automatically.',
  },
  {
    icon: BookOpen,
    title: 'Plain English always',
    desc: 'Every ratio, every term, translated. No finance degree needed to understand what\'s happening in your investment.',
  },
  {
    icon: ShieldCheck,
    title: 'DRHP / IPO decoder',
    desc: 'Before you apply to an IPO, know exactly where the money is going, who the promoters are, and what the risks are.',
  },
];

const FILING_TYPES = ['Quarterly results', 'Annual reports', 'DRHP / RHP', 'Board meeting outcomes'];

export default function UploadScreen({ onAnalyzing, onReportReady, onError, errorMsg, onChangeKey }) {
  const [dragging, setDragging] = useState(false);
  const [history, setHistory] = useState([]);
  const fileRef = useRef();

  useEffect(() => { setHistory(getHistory()); }, []);

  const processFile = useCallback(async (file) => {
    if (!file || file.type !== 'application/pdf') { onError('Please upload a PDF file.'); return; }
    if (file.size > 30 * 1024 * 1024) { onError('File too large — please use a PDF under 30MB.'); return; }
    onAnalyzing();
    onAnalyzing();

    // DEV MODE: skip API, return demo data after fake delay
    if (import.meta.env.DEV) {
      await new Promise(r => setTimeout(r, 2200));
      onReportReady({ ...DEMO_REPORT, _isDemo: false });
      return;
    }
    
    try {
      const { text, pageCount } = await extractTextFromPDF(file);
      const filingType = detectFilingType(text);
      const result = await analyzeFilingText(text, `Filing type: ${filingType}. Pages: ${pageCount}.`);
      onReportReady(result);
    } catch (err) {
      onError(err.message || 'Something went wrong. Please try again.');
    }
  }, [onAnalyzing, onReportReady, onError]);

  const handleDrop = useCallback((e) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  function handleDelete(e, id) {
    e.stopPropagation();
    deleteFromHistory(id);
    setHistory(getHistory());
  }

  function fmtDate(iso) {
    return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  }

  return (
    <div className={styles.page}>
      {/* Nav */}
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <div className={styles.logo}><Zap size={18} strokeWidth={2.5} /><span>FilingLens</span></div>
          <div className={styles.navRight}>
            <button className={styles.navLink} onClick={() => onReportReady(DEMO_REPORT)}>
              See demo
            </button>
            <button className={styles.settingsBtn} onClick={() => { clearApiKey(); onChangeKey(); }}>
              <Settings size={13} /> API key
            </button>
          </div>
        </div>
      </nav>

      <div className={styles.container}>
        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeDot} />
            Built for Indian retail investors
          </div>
          <h1 className={styles.heroTitle}>
            Read any SEBI filing<br />
            <em>in plain English</em>
          </h1>
          <p className={styles.heroSub}>
            Drop in a quarterly result, annual report, or DRHP.
            Get a structured briefing — red flags, financials, management tone, and a clear verdict — in under 60 seconds.
          </p>
          <div className={styles.filingTypes}>
            {FILING_TYPES.map(t => (
              <span key={t} className={styles.filingTypeChip}>{t}</span>
            ))}
          </div>
        </section>

        {/* Upload zone */}
        <section className={styles.uploadSection}>
          <div
            className={`${styles.dropzone} ${dragging ? styles.dragging : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current.click()}
          >
            <input ref={fileRef} type="file" accept=".pdf" style={{ display: 'none' }}
              onChange={(e) => { const f = e.target.files[0]; if (f) processFile(f); e.target.value = ''; }} />

            <div className={styles.dropContent}>
              <div className={styles.dropIconWrap}>
                <FileText size={26} strokeWidth={1.5} />
              </div>
              <div className={styles.dropText}>
                <p className={styles.dropTitle}>{dragging ? 'Drop to analyse' : 'Upload your filing'}</p>
                <p className={styles.dropSub}>Drag & drop or click to browse · PDF only · Max 30MB</p>
              </div>
              <button className={styles.uploadBtn} type="button">
                <Upload size={14} strokeWidth={2} />
                Choose PDF
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className={styles.errorBanner}>
              <AlertCircle size={14} />{errorMsg}
            </div>
          )}

          <div className={styles.demoRow}>
            <button className={styles.demoBtn} onClick={() => onReportReady(DEMO_REPORT)}>
              <Play size={13} strokeWidth={2.5} />
              See a live example — Vibhor Steel Tubes Q3 FY26
              <ArrowRight size={13} />
            </button>
          </div>
        </section>

        {/* History */}
        {history.length > 0 && (
          <section className={styles.historySection}>
            <h3 className={styles.sectionHeading}>
              <Clock size={14} />
              Recent analyses
            </h3>
            <div className={styles.historyGrid}>
              {history.map(entry => {
                const VIcon = VERDICT_ICON[entry.verdict] || Minus;
                return (
                  <div key={entry.id} className={styles.historyCard} onClick={() => onReportReady(entry.report)}>
                    <div className={styles.historyCardTop}>
                      <div className={`${styles.verdictDot} ${VERDICT_CLS[entry.verdict] || ''}`}>
                        <VIcon size={10} strokeWidth={2.5} />
                      </div>
                      <span className={styles.historyDate}>{fmtDate(entry.savedAt)}</span>
                      <button className={styles.deleteBtn} onClick={(e) => handleDelete(e, entry.id)}>
                        <Trash2 size={11} />
                      </button>
                    </div>
                    <p className={styles.historyName}>{entry.company?.name || 'Unknown'}</p>
                    <p className={styles.historyPeriod}>{entry.company?.filing_period || ''}</p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Features */}
        <section className={styles.featuresSection}>
          <h2 className={styles.featuresHeading}>What you get in every report</h2>
          <div className={styles.featuresGrid}>
            {FEATURES.map(f => (
              <div key={f.title} className={styles.featureCard}>
                <div className={styles.featureIcon}><f.icon size={16} strokeWidth={1.75} /></div>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className={styles.howSection}>
          <h2 className={styles.featuresHeading}>How it works</h2>
          <div className={styles.stepsRow}>
            {[
              { n: '1', label: 'Upload any SEBI filing PDF', sub: 'Quarterly result, annual report, or DRHP' },
              { n: '2', label: 'AI reads it end to end', sub: 'Extracts financials, flags risks, decodes management tone' },
              { n: '3', label: 'You get a plain-English report', sub: 'With verdict, red flags, and a bear/bull breakdown' },
            ].map(s => (
              <div key={s.n} className={styles.step}>
                <div className={styles.stepNum}>{s.n}</div>
                <div>
                  <p className={styles.stepLabel}>{s.label}</p>
                  <p className={styles.stepSub}>{s.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Privacy note */}
        <section className={styles.privacyNote}>
          <ShieldCheck size={14} />
          <p>Your files never leave your browser. All PDF processing happens locally. The only data sent to any server is text — via the Anthropic API to generate the analysis.</p>
        </section>

        <footer className={styles.footer}>
          <p>FilingLens · For informational purposes only · Not investment advice</p>
        </footer>
      </div>

      <div className={styles.bgPattern} aria-hidden />
    </div>
  );
}
