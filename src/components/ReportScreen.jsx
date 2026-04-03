import { useState, useEffect } from 'react';
import {
  ArrowLeft, TrendingUp, TrendingDown, Minus, AlertTriangle,
  CheckCircle, AlertCircle, ChevronDown, ChevronUp, BarChart2,
  FileText, Zap, Eye, MessageSquare, Shield, Target, Lightbulb,
  Share2, Check, Smile, Printer
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { saveToHistory } from '../lib/history.js';
import styles from './ReportScreen.module.css';

const VERDICT_CONFIG = {
  strong:  { label: 'Strong',  color: styles.verdictStrong,  icon: TrendingUp },
  mixed:   { label: 'Mixed',   color: styles.verdictMixed,   icon: Minus },
  risky:   { label: 'Risky',   color: styles.verdictRisky,   icon: TrendingDown },
};

const STATUS_CONFIG = {
  clear:   { label: 'Clear',   cls: styles.flagClear },
  watch:   { label: 'Watch',   cls: styles.flagWatch },
  concern: { label: 'Concern', cls: styles.flagConcern },
};

const SEV_CONFIG = {
  high:   styles.riskHigh,
  medium: styles.riskMed,
  low:    styles.riskLow,
};

const ASSESS_CONFIG = {
  strong: styles.ratioStrong,
  ok:     styles.ratioOk,
  weak:   styles.ratioWeak,
  na:     styles.ratioNa,
};

function pct(curr, prev) {
  if (!curr || !prev || prev === 0) return null;
  return ((curr - prev) / Math.abs(prev) * 100).toFixed(1);
}

function fmt(n) {
  if (n === null || n === undefined) return '—';
  if (Math.abs(n) >= 1000) return `₹${(n / 1000).toFixed(1)}K Cr`;
  if (Math.abs(n) >= 1) return `₹${n.toFixed(1)} Cr`;
  return `₹${n.toFixed(2)} Cr`;
}

function fmtPct(n) {
  if (n === null || n === undefined) return '—';
  return `${parseFloat(n).toFixed(1)}%`;
}

function CollapsibleSection({ title, icon: Icon, children, defaultOpen = true, badge }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={styles.section}>
      <button className={styles.sectionHeader} onClick={() => setOpen(o => !o)}>
        <div className={styles.sectionHeaderLeft}>
          <Icon size={15} strokeWidth={2} />
          <span>{title}</span>
          {badge && <span className={styles.badge}>{badge}</span>}
        </div>
        {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
      </button>
      {open && <div className={styles.sectionBody}>{children}</div>}
    </div>
  );
}

export default function ReportScreen({ report, onReset }) {
  const [copied, setCopied] = useState(false);
  const { company, tldr, financials, trend, business, risks, positives,
    management_commentary, ratios, red_flags, what_changed,
    hidden_insights, bear_bull, eli15, drhp_extras } = report;

  useEffect(() => {
    saveToHistory(report);
  }, [report]);

  const V = VERDICT_CONFIG[tldr?.verdict] || VERDICT_CONFIG.mixed;
  const VIcon = V.icon;

  const trendData = (trend?.data_points || []).filter(d => d.revenue || d.profit);

  const revenueChange = pct(financials?.revenue?.value, financials?.revenue?.prev);
  const profitChange = pct(financials?.net_profit?.value, financials?.net_profit?.prev);

  function handleShare() {
    const text = `${company?.name} — ${tldr?.verdict?.toUpperCase()} | FilingLens\n\n${tldr?.investor_takeaway || ''}\n\n${(tldr?.bullets || []).slice(0, 3).map(b => '• ' + b).join('\n')}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div className={styles.page}>
      <div className={styles.topbar}>
        <button className={styles.backBtn} onClick={onReset}>
          <ArrowLeft size={14} /> New filing
        </button>
        <div className={styles.logoSmall}>
          <Zap size={14} strokeWidth={2.5} />
          FilingLens
        </div>
        <button className={styles.shareBtn} onClick={handleShare}>
          {copied ? <Check size={13} /> : <Share2 size={13} />}
          {copied ? 'Copied!' : 'Share'}
        </button>
        <button className={styles.shareBtn} onClick={handlePrint} title="Save as PDF">
          <Printer size={13} />
          <span className={styles.printLabel}>Print</span>
        </button>
      </div>

      {report._isDemo && (
        <div className={styles.demoBanner}>
          This is a sample report — upload your own PDF to analyse any SEBI filing
        </div>
      )}

      <div className={styles.container}>
        {/* Company Header */}
        <div className={styles.companyHeader}>
          <div className={styles.companyAvatar}>
            {(company?.name || '?').split(' ').slice(0, 2).map(w => w[0]).join('')}
          </div>
          <div className={styles.companyInfo}>
            <h1 className={styles.companyName}>{company?.name || 'Company'}</h1>
            <div className={styles.companyMeta}>
              {company?.ticker && <span className={styles.chip}>{company.ticker}</span>}
              {company?.exchange && <span className={styles.chip}>{company.exchange}</span>}
              {company?.sector && <span className={styles.chip}>{company.sector}</span>}
              {company?.filing_period && <span className={styles.chip}>{company.filing_period}</span>}
            </div>
          </div>
        </div>

        {/* Verdict Hero */}
        <div className={`${styles.verdictHero} ${V.color}`}>
          <div className={styles.verdictLeft}>
            <div className={styles.verdictBadge}>
              <VIcon size={16} strokeWidth={2.5} />
              {V.label}
            </div>
            <p className={styles.verdictReason}>{tldr?.verdict_reason}</p>
          </div>
        </div>

        {/* TL;DR */}
        <CollapsibleSection title="TL;DR — Key highlights" icon={Zap}>
          <ul className={styles.bulletList}>
            {(tldr?.bullets || []).map((b, i) => (
              <li key={i} className={styles.bulletItem}>
                <span className={styles.bulletDot} />
                {b}
              </li>
            ))}
          </ul>
          {tldr?.investor_takeaway && (
            <div className={styles.takeaway}>
              <Eye size={13} />
              <span>{tldr.investor_takeaway}</span>
            </div>
          )}
        </CollapsibleSection>

        {/* Financial Snapshot */}
        <CollapsibleSection title="Financial snapshot" icon={BarChart2}>
          <div className={styles.metricsGrid}>
            <MetricCard
              label={`Revenue (${financials?.revenue?.period || ''})`}
              value={fmt(financials?.revenue?.value)}
              change={revenueChange}
              prevLabel={financials?.revenue?.prev_period}
              prevValue={fmt(financials?.revenue?.prev)}
            />
            <MetricCard
              label="Net profit"
              value={fmt(financials?.net_profit?.value)}
              change={profitChange}
              prevLabel="Prior period"
              prevValue={fmt(financials?.net_profit?.prev)}
            />
            <MetricCard
              label="Operating margin"
              value={fmtPct(financials?.operating_margin?.value)}
              change={financials?.operating_margin?.value != null && financials?.operating_margin?.prev != null
                ? (financials.operating_margin.value - financials.operating_margin.prev).toFixed(1) + ' pp'
                : null}
              isAbsolute
              prevLabel="Prior period"
              prevValue={fmtPct(financials?.operating_margin?.prev)}
            />
            <MetricCard
              label="EPS"
              value={financials?.eps?.value != null ? `₹${financials.eps.value}` : '—'}
              change={pct(financials?.eps?.value, financials?.eps?.prev)}
              prevLabel="Prior period"
              prevValue={financials?.eps?.prev != null ? `₹${financials.eps.prev}` : '—'}
            />
          </div>
          {financials?.commentary && (
            <p className={styles.commentary}>{financials.commentary}</p>
          )}
        </CollapsibleSection>

        {/* Trend Analysis */}
        {trendData.length > 1 && (
          <CollapsibleSection title="Performance trend" icon={TrendingUp}>
            <div className={styles.trendMeta}>
              <span className={`${styles.trendBadge} ${
                trend?.direction === 'improving' ? styles.trendUp :
                trend?.direction === 'deteriorating' ? styles.trendDown : styles.trendFlat
              }`}>
                {trend?.direction || 'mixed'}
              </span>
              {trend?.summary && <p className={styles.trendSummary}>{trend.summary}</p>}
            </div>
            <div className={styles.chartWrap}>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={trendData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <XAxis dataKey="period" tick={{ fontSize: 10, fill: 'var(--ink-4)' }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: 'var(--ink-4)' }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ background: 'var(--paper)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
                    formatter={(v) => [`₹${v} Cr`]}
                  />
                  <Bar dataKey="revenue" name="Revenue" radius={[3, 3, 0, 0]} maxBarSize={32}>
                    {trendData.map((_, i) => (
                      <Cell key={i} fill={i === trendData.length - 1 ? 'var(--accent)' : 'var(--paper-3)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <p className={styles.chartLabel}>Revenue (₹ Cr) — latest bar highlighted</p>
            </div>
          </CollapsibleSection>
        )}

        {/* Business Overview */}
        <CollapsibleSection title="What this company actually does" icon={FileText}>
          <p className={styles.bodyText}>{business?.what_they_do}</p>
          {business?.key_segments?.length > 0 && (
            <div className={styles.segmentList}>
              <p className={styles.subLabel}>Revenue segments</p>
              <div className={styles.chipRow}>
                {business.key_segments.map((s, i) => (
                  <span key={i} className={styles.segChip}>{s}</span>
                ))}
              </div>
            </div>
          )}
          {business?.key_customers_or_geographies && (
            <p className={styles.bodyTextSmall}>
              <strong>Key customers / geographies:</strong> {business.key_customers_or_geographies}
            </p>
          )}
          {business?.moat && (
            <div className={styles.moatBox}>
              <Shield size={13} />
              <div>
                <p className={styles.moatLabel}>Competitive moat</p>
                <p className={styles.moatText}>{business.moat}</p>
              </div>
            </div>
          )}
        </CollapsibleSection>

        {/* ELI15 — Explain Like I'm 15 */}
        {eli15 && (
          <CollapsibleSection title="Explain it like I'm 15" icon={Smile} defaultOpen={false}>
            <div className={styles.eli15Wrap}>
              <div className={styles.eli15Block}>
                <p className={styles.eli15Label}>What does this company do?</p>
                <p className={styles.eli15Text}>{eli15.company_in_one_line}</p>
              </div>
              <div className={styles.eli15Block}>
                <p className={styles.eli15Label}>What happened this quarter?</p>
                <p className={styles.eli15Text}>{eli15.what_happened}</p>
              </div>
              <div className={styles.eli15Block}>
                <p className={styles.eli15Label}>Should I care about this as an investor?</p>
                <p className={styles.eli15Text}>{eli15.should_i_care}</p>
              </div>
            </div>
          </CollapsibleSection>
        )}

        {/* Red Flags */}
        <CollapsibleSection title="Red flag check" icon={Shield}
          badge={red_flags?.filter(f => f.status !== 'clear').length || null}>
          <div className={styles.flagList}>
            {(red_flags || []).map((f, i) => {
              const cfg = STATUS_CONFIG[f.status] || STATUS_CONFIG.watch;
              return (
                <div key={i} className={styles.flagRow}>
                  <span className={`${styles.flagPill} ${cfg.cls}`}>{cfg.label}</span>
                  <div>
                    <p className={styles.flagTitle}>{f.flag}</p>
                    {f.detail && <p className={styles.flagDetail}>{f.detail}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </CollapsibleSection>

        {/* Risks */}
        <CollapsibleSection title="Risks to watch" icon={AlertTriangle}
          badge={risks?.filter(r => r.severity === 'high').length
            ? `${risks.filter(r => r.severity === 'high').length} high` : null}>
          {(risks || []).map((r, i) => (
            <div key={i} className={styles.riskItem}>
              <span className={`${styles.riskDot} ${SEV_CONFIG[r.severity] || ''}`} />
              <div>
                <p className={styles.riskTitle}>{r.title}</p>
                <p className={styles.riskDetail}>{r.detail}</p>
              </div>
            </div>
          ))}
        </CollapsibleSection>

        {/* Positives */}
        <CollapsibleSection title="Growth drivers & positives" icon={TrendingUp}>
          {(positives || []).map((p, i) => (
            <div key={i} className={styles.positiveItem}>
              <CheckCircle size={14} className={styles.positiveIcon} />
              <div>
                <p className={styles.riskTitle}>{p.title}</p>
                <p className={styles.riskDetail}>{p.detail}</p>
              </div>
            </div>
          ))}
        </CollapsibleSection>

        {/* What Changed */}
        {what_changed && (
          <CollapsibleSection title="What changed this period" icon={AlertCircle}>
            <p className={styles.bodyText}>{what_changed}</p>
          </CollapsibleSection>
        )}

        {/* Management Commentary */}
        <CollapsibleSection title="Management commentary — decoded" icon={MessageSquare} defaultOpen={false}>
          {management_commentary?.tone_note && (
            <p className={styles.toneNote}>
              <strong>Overall tone:</strong> {management_commentary.tone} — {management_commentary.tone_note}
            </p>
          )}
          <div className={styles.commentaryList}>
            {(management_commentary?.key_statements || []).map((s, i) => (
              <div key={i} className={styles.commentaryItem}>
                <p className={styles.commentarySaid}>"{s.said}"</p>
                <p className={styles.commentaryMeans}>
                  <span className={styles.meansLabel}>What this means:</span> {s.means}
                </p>
              </div>
            ))}
          </div>
        </CollapsibleSection>

        {/* Key Ratios */}
        <CollapsibleSection title="Key ratios — explained" icon={BarChart2} defaultOpen={false}>
          <div className={styles.ratioList}>
            {(ratios || []).map((r, i) => (
              <div key={i} className={styles.ratioRow}>
                <div className={styles.ratioLeft}>
                  <span className={styles.ratioName}>{r.name}</span>
                  <span className={styles.ratioBenchmark}>{r.benchmark}</span>
                </div>
                <div className={styles.ratioRight}>
                  <span className={styles.ratioValue}>{r.value}</span>
                  <span className={`${styles.ratioAssess} ${ASSESS_CONFIG[r.assessment] || ''}`}>
                    {r.assessment}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CollapsibleSection>

        {/* Bear / Bull */}
        <CollapsibleSection title="Bear case vs bull case" icon={Target} defaultOpen={false}>
          <div className={styles.bearBullGrid}>
            <div className={styles.bullBox}>
              <p className={styles.bbLabel}>3 reasons to be optimistic</p>
              {(bear_bull?.bull || []).map((b, i) => (
                <div key={i} className={styles.bbItem}>
                  <span className={styles.bbNum}>{i + 1}</span>
                  <span>{b}</span>
                </div>
              ))}
            </div>
            <div className={styles.bearBox}>
              <p className={styles.bbLabel}>3 reasons to be cautious</p>
              {(bear_bull?.bear || []).map((b, i) => (
                <div key={i} className={styles.bbItem}>
                  <span className={styles.bbNum}>{i + 1}</span>
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </div>
        </CollapsibleSection>

        {/* Hidden Insights */}
        {hidden_insights?.length > 0 && (
          <CollapsibleSection title="Hidden insights from the footnotes" icon={Lightbulb} defaultOpen={false}>
            <ul className={styles.insightList}>
              {hidden_insights.map((insight, i) => (
                <li key={i} className={styles.insightItem}>
                  <span className={styles.insightDot} />
                  {insight}
                </li>
              ))}
            </ul>
          </CollapsibleSection>
        )}

        {/* DRHP Extras */}
        {drhp_extras && (
          <CollapsibleSection title="IPO deep dive" icon={FileText}>
            <div className={styles.ipoGrid}>
              {drhp_extras.issue_size && (
                <div className={styles.ipoStat}>
                  <p className={styles.ipoStatLabel}>Issue size</p>
                  <p className={styles.ipoStatValue}>{drhp_extras.issue_size}</p>
                </div>
              )}
              {drhp_extras.issue_type && (
                <div className={styles.ipoStat}>
                  <p className={styles.ipoStatLabel}>Issue type</p>
                  <p className={styles.ipoStatValue}>{drhp_extras.issue_type}</p>
                </div>
              )}
            </div>

            {drhp_extras.use_of_funds?.length > 0 && (
              <div className={styles.ipoSection}>
                <p className={styles.ipoSectionLabel}>Use of IPO proceeds</p>
                <ul className={styles.ipoFundsList}>
                  {drhp_extras.use_of_funds.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
                {drhp_extras.use_of_funds_verdict && (
                  <p className={styles.ipoVerdict}>{drhp_extras.use_of_funds_verdict}</p>
                )}
              </div>
            )}

            {drhp_extras.promoters?.length > 0 && (
              <div className={styles.ipoSection}>
                <p className={styles.ipoSectionLabel}>Promoters</p>
                {drhp_extras.promoters.map((p, i) => (
                  <div key={i} className={styles.promoterRow}>
                    <span>{p.name}</span>
                    <span className={styles.promoterRole}>{p.role}</span>
                    {p.stake_pct != null && <span className={styles.promoterStake}>{p.stake_pct}%</span>}
                  </div>
                ))}
                {drhp_extras.promoter_assessment && (
                  <p className={styles.commentary}>{drhp_extras.promoter_assessment}</p>
                )}
              </div>
            )}

            {drhp_extras.related_party_concerns && (
              <div className={`${styles.flagRow} ${styles.flagRowAlert}`}>
                <span className={`${styles.flagPill} ${styles.flagWatch}`}>Related parties</span>
                <p className={styles.flagDetail}>{drhp_extras.related_party_concerns}</p>
              </div>
            )}

            {drhp_extras.ipo_verdict && (
              <div className={`${styles.verdictHero} ${
                drhp_extras.ipo_verdict === 'apply' ? styles.verdictStrong :
                drhp_extras.ipo_verdict === 'avoid' ? styles.verdictRisky : styles.verdictMixed
              }`} style={{ marginTop: '1rem' }}>
                <div className={styles.verdictBadge} style={{ textTransform: 'capitalize' }}>
                  IPO verdict: {drhp_extras.ipo_verdict}
                </div>
                {drhp_extras.ipo_verdict_reason && (
                  <p className={styles.verdictReason}>{drhp_extras.ipo_verdict_reason}</p>
                )}
              </div>
            )}
          </CollapsibleSection>
        )}

        <div className={styles.footer}>
          <p>FilingLens analyses SEBI filings using AI. This is not investment advice. Always do your own research before making any investment decision.</p>
          <button className={styles.newAnalysisBtn} onClick={onReset}>
            Analyse another filing
          </button>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, change, prevLabel, prevValue, isAbsolute }) {
  const changeNum = isAbsolute ? parseFloat(change) : parseFloat(change);
  const isPos = changeNum > 0;
  const isNeg = changeNum < 0;
  const changeLabel = isAbsolute ? change : change ? `${isPos ? '+' : ''}${change}%` : null;

  return (
    <div className={styles.metricCard}>
      <p className={styles.metricLabel}>{label}</p>
      <p className={styles.metricValue}>{value}</p>
      {changeLabel && (
        <p className={`${styles.metricChange} ${isPos ? styles.changePos : isNeg ? styles.changeNeg : styles.changeFlat}`}>
          {changeLabel} vs {prevLabel || 'prior'}
        </p>
      )}
      {prevValue && prevValue !== '—' && (
        <p className={styles.metricPrev}>Was: {prevValue}</p>
      )}
    </div>
  );
}
