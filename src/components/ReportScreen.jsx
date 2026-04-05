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
  strong: { label: 'Strong', color: styles.verdictStrong, icon: TrendingUp },
  mixed:  { label: 'Mixed',  color: styles.verdictMixed,  icon: Minus },
  risky:  { label: 'Risky',  color: styles.verdictRisky,  icon: TrendingDown },
};
const STATUS_CONFIG = {
  clear:   { label: 'Clear',   cls: styles.flagClear },
  watch:   { label: 'Watch',   cls: styles.flagWatch },
  concern: { label: 'Concern', cls: styles.flagConcern },
};
const SEV_CONFIG    = { high: styles.riskHigh, medium: styles.riskMed, low: styles.riskLow };
const ASSESS_CONFIG = { strong: styles.ratioStrong, ok: styles.ratioOk, weak: styles.ratioWeak, na: styles.ratioNa };

function pct(curr, prev) {
  if (curr == null || prev == null || prev === 0) return null;
  return ((curr - prev) / Math.abs(prev) * 100).toFixed(1);
}
function fmt(n) {
  if (n == null) return '—';
  if (Math.abs(n) >= 1000) return `₹${(n/1000).toFixed(1)}K Cr`;
  if (Math.abs(n) >= 1)    return `₹${n.toFixed(1)} Cr`;
  return `₹${n.toFixed(2)} Cr`;
}
function fmtPct(n) {
  if (n == null) return '—';
  return `${parseFloat(n).toFixed(1)}%`;
}
function ppChange(curr, prev) {
  if (curr == null || prev == null) return null;
  return (curr - prev).toFixed(1) + ' pp';
}

function CollapsibleSection({ title, icon: Icon, children, defaultOpen = true, badge, col }) {
  const [open, setOpen] = useState(defaultOpen);
  const colClass = col === 'left' ? styles.colLeft : col === 'right' ? styles.colRight : '';
  return (
    <div className={`${styles.section} ${colClass}`}>
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

function ToggleRow({ options, value, onChange }) {
  return (
    <div className={styles.toggleRow}>
      {options.map(o => (
        <button
          key={o.key}
          className={`${styles.toggleBtn} ${value === o.key ? styles.toggleActive : ''}`}
          onClick={() => onChange(o.key)}
        >{o.label}</button>
      ))}
    </div>
  );
}

function MetricCard({ label, value, change, prevLabel, prevValue, isAbsolute }) {
  const changeNum = parseFloat(change);
  const isPos = changeNum > 0;
  const isNeg = changeNum < 0;
  const changeLabel = change == null ? null : isAbsolute ? change : `${isPos ? '+' : ''}${change}%`;
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
        <p className={styles.metricPrev}>{prevLabel || 'Prior period'}: {prevValue}</p>
      )}
    </div>
  );
}

export default function ReportScreen({ report, onReset }) {
  const [copied, setCopied]             = useState(false);
  const [snapshotView, setSnapshotView] = useState('quarterly');
  const [trendMetric, setTrendMetric]   = useState('revenue');
  const [trendPeriod, setTrendPeriod]   = useState('quarterly');

  const { company, tldr, financials, trend, business, risks, positives,
    management_commentary, ratios, red_flags, what_changed,
    hidden_insights, bear_bull, eli15, drhp_extras } = report;

  useEffect(() => { saveToHistory(report); window.scrollTo(0, 0); }, [report]);

  const V     = VERDICT_CONFIG[tldr?.verdict] || VERDICT_CONFIG.mixed;
  const VIcon = V.icon;
  const f     = financials || {};
  const yt    = f.ytd || {};

  const hasYtd         = Boolean(yt.revenue);
  const quarterlyTrend = (trend?.data_points     || []).filter(d => d.revenue != null || d.profit != null);
  const ytdTrend       = (trend?.ytd_data_points || []).filter(d => d.revenue != null || d.profit != null);
  const trendData      = trendPeriod === 'ytd' && ytdTrend.length > 0 ? ytdTrend : quarterlyTrend;
  const hasEbitdaTrend = trendData.some(d => d.ebitda != null);
  const hasMgmtComm    = management_commentary?.available !== false
                      && (management_commentary?.key_statements?.length > 0);

  function handleShare() {
    const text = `${company?.name} — ${tldr?.verdict?.toUpperCase()} | FilingLens\n\n${tldr?.investor_takeaway || ''}\n\n${(tldr?.bullets || []).slice(0, 3).map(b => '• ' + b).join('\n')}`;
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  }

  function renderMetricCards(view) {
    if (view === 'quarterly') {
      return (
        <div className={styles.metricsGrid}>
          <MetricCard label="Revenue"
            value={fmt(f.revenue?.value)} change={pct(f.revenue?.value, f.revenue?.prev)}
            prevLabel={f.revenue?.prev_period} prevValue={fmt(f.revenue?.prev)} />
          <MetricCard label="EPS"
            value={f.eps?.value != null ? `₹${f.eps.value}` : '—'} change={pct(f.eps?.value, f.eps?.prev)}
            prevLabel={f.eps?.prev_period} prevValue={f.eps?.prev != null ? `₹${f.eps.prev}` : '—'} />
          {f.ebitda?.value != null && (
            <MetricCard label="EBITDA"
              value={fmt(f.ebitda.value)} change={pct(f.ebitda.value, f.ebitda.prev)}
              prevLabel={f.revenue?.prev_period} prevValue={fmt(f.ebitda.prev)} />
          )}
          {f.ebitda?.margin != null && (
            <MetricCard label="EBITDA margin"
              value={fmtPct(f.ebitda.margin)} change={ppChange(f.ebitda.margin, f.ebitda.prev_margin)} isAbsolute
              prevLabel={f.revenue?.prev_period} prevValue={fmtPct(f.ebitda.prev_margin)} />
          )}
          <MetricCard label="Net profit"
            value={fmt(f.net_profit?.value)} change={pct(f.net_profit?.value, f.net_profit?.prev)}
            prevLabel={f.net_profit?.prev_period} prevValue={fmt(f.net_profit?.prev)} />
          <MetricCard label="Net margin"
            value={fmtPct(f.net_margin?.value)} change={ppChange(f.net_margin?.value, f.net_margin?.prev)} isAbsolute
            prevLabel={f.revenue?.prev_period} prevValue={fmtPct(f.net_margin?.prev)} />
        </div>
      );
    }
    // YTD — same structure, same order
    return (
      <div className={styles.metricsGrid}>
        <MetricCard label="Revenue"
          value={fmt(yt.revenue)} change={pct(yt.revenue, yt.revenue_prev)}
          prevLabel={yt.prev_period_label} prevValue={fmt(yt.revenue_prev)} />
        <MetricCard label="EPS"
          value={yt.eps != null ? `₹${yt.eps}` : '—'} change={pct(yt.eps, yt.eps_prev)}
          prevLabel={yt.prev_period_label} prevValue={yt.eps_prev != null ? `₹${yt.eps_prev}` : '—'} />
        {yt.ebitda != null && (
          <MetricCard label="EBITDA"
            value={fmt(yt.ebitda)} change={pct(yt.ebitda, yt.ebitda_prev)}
            prevLabel={yt.prev_period_label} prevValue={fmt(yt.ebitda_prev)} />
        )}
        {yt.ebitda_margin != null && (
          <MetricCard label="EBITDA margin"
            value={fmtPct(yt.ebitda_margin)} change={ppChange(yt.ebitda_margin, yt.ebitda_margin_prev)} isAbsolute
            prevLabel={yt.prev_period_label} prevValue={fmtPct(yt.ebitda_margin_prev)} />
        )}
        {yt.net_profit != null && (
          <MetricCard label="Net profit"
            value={fmt(yt.net_profit)} change={pct(yt.net_profit, yt.net_profit_prev)}
            prevLabel={yt.prev_period_label} prevValue={fmt(yt.net_profit_prev)} />
        )}
        {yt.net_margin != null && (
          <MetricCard label="Net margin"
            value={fmtPct(yt.net_margin)} change={ppChange(yt.net_margin, yt.net_margin_prev)} isAbsolute
            prevLabel={yt.prev_period_label} prevValue={fmtPct(yt.net_margin_prev)} />
        )}
      </div>
    );
  }

  return (
    <>
      <div className={styles.topbar}>
        <button className={styles.backBtn} onClick={onReset}><ArrowLeft size={14} /> New filing</button>
        <div className={styles.logoSmall}><Zap size={14} strokeWidth={2.5} />FilingLens</div>
        <button className={styles.shareBtn} onClick={handleShare}>
          {copied ? <Check size={13} /> : <Share2 size={13} />}{copied ? 'Copied!' : 'Share'}
        </button>
        <button className={styles.shareBtn} onClick={() => window.print()} title="Save as PDF">
          <Printer size={13} /><span className={styles.printLabel}>Print</span>
        </button>
      </div>

      {report._isDemo && (
        <div className={styles.demoBanner}>
          This is a sample report — upload your own PDF to analyse any SEBI filing
        </div>
      )}

      <div className={styles.page}>
        <div className={styles.container}>

          {/* ── Full width: Company header ── */}
          <div className={styles.fullWidth}>
            <div className={styles.companyHeader}>
              <h1 className={styles.companyName}>{company?.name || 'Company'}</h1>
              <div className={styles.companyMeta}>
                {company?.ticker      && <span className={styles.chip}>{company.ticker}</span>}
                {company?.exchange    && <span className={styles.chip}>{company.exchange}</span>}
                {company?.sector      && <span className={styles.chip}>{company.sector}</span>}
                {company?.filing_period && <span className={styles.chip}>{company.filing_period}</span>}
                {company?.filing_type && (
                  <span className={styles.chipType}>
                    {company.filing_type==='quarterly'?'Quarterly result':company.filing_type==='annual'?'Annual report':company.filing_type==='drhp'?'DRHP':''}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ── Full width: Verdict ── */}
          <div className={styles.fullWidth}>
            <div className={`${styles.verdictHero} ${V.color}`}>
              <p className={styles.verdictLabel}>Our assessment</p>
              <div className={styles.verdictBadge}><VIcon size={16} strokeWidth={2.5}/>{V.label}</div>
              <p className={styles.verdictReason}>{tldr?.verdict_reason}</p>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════
              TWO-COLUMN SECTIONS — fixed left/right assignments
              Left col:  1=TL;DR, 3=Trend, 5=Red flags, 7=Growth drivers, 7b=Mgmt, 9=Ratios, 11=ELI15
              Right col: 2=Snapshot, 4=Business, 6=Risks, 8=What changed, 10=Bear/Bull, 12=Insights
          ══════════════════════════════════════════════════════ */}

          {/* 1. TL;DR — LEFT */}
          <CollapsibleSection col="left" title="TL;DR — Key highlights" icon={Zap}>
            <ul className={styles.bulletList}>
              {(tldr?.bullets||[]).map((b,i)=>(
                <li key={i} className={styles.bulletItem}><span className={styles.bulletDot}/>{b}</li>
              ))}
            </ul>
            {tldr?.investor_takeaway && (
              <div className={styles.takeaway}><Eye size={13}/><span>{tldr.investor_takeaway}</span></div>
            )}
          </CollapsibleSection>

          {/* 2. Financial Snapshot — RIGHT */}
          <CollapsibleSection col="right" title="Financial snapshot" icon={BarChart2}>
            {hasYtd && (
              <ToggleRow
                options={[
                  { key: 'quarterly', label: f.revenue?.period || 'Quarterly' },
                  { key: 'ytd',       label: yt.period_label  || 'Year to date' },
                ]}
                value={snapshotView} onChange={setSnapshotView}
              />
            )}
            {renderMetricCards(snapshotView)}
            {f.ebitda?.calculation_note && (
              <p className={styles.ebitdaNote}>EBITDA = PBT + Finance Cost + Depreciation − Other Income</p>
            )}
            {snapshotView==='quarterly' && f.commentary  && <p className={styles.commentary}>{f.commentary}</p>}
            {snapshotView==='ytd'       && yt.commentary && <p className={styles.commentary}>{yt.commentary}</p>}
          </CollapsibleSection>

          {/* 3. Performance Trend — LEFT */}
          {quarterlyTrend.length > 1 && (
            <CollapsibleSection col="left" title="Performance trend" icon={TrendingUp}>
              <div className={styles.trendMeta}>
                <span className={`${styles.trendBadge} ${trend?.direction==='improving'?styles.trendUp:trend?.direction==='deteriorating'?styles.trendDown:styles.trendFlat}`}>
                  {trend?.direction||'mixed'}
                </span>
                {trend?.summary && <p className={styles.trendSummary}>{trend.summary}</p>}
              </div>
              {ytdTrend.length > 0 && (
                <ToggleRow
                  options={[
                    { key: 'quarterly', label: 'Quarterly' },
                    { key: 'ytd',       label: yt.period_label || 'Year to date' },
                  ]}
                  value={trendPeriod}
                  onChange={(v) => { setTrendPeriod(v); setTrendMetric('revenue'); }}
                />
              )}
              <ToggleRow
                options={[
                  { key: 'revenue', label: 'Revenue' },
                  ...(hasEbitdaTrend ? [{ key: 'ebitda', label: 'EBITDA' }] : []),
                  { key: 'profit',  label: 'Net profit' },
                ]}
                value={trendMetric} onChange={setTrendMetric}
              />
              <div className={styles.chartWrap}>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={trendData} margin={{ top:4, right:4, left:-20, bottom:0 }}>
                    <XAxis dataKey="period" tick={{ fontSize:10, fill:'var(--ink-4)' }} tickLine={false} axisLine={false}/>
                    <YAxis tick={{ fontSize:10, fill:'var(--ink-4)' }} tickLine={false} axisLine={false}/>
                    <Tooltip
                      contentStyle={{ background:'var(--paper)', border:'1px solid var(--border)', borderRadius:8, fontSize:12 }}
                      formatter={(v) => v!=null?[`₹${v} Cr`]:['—']}
                    />
                    <Bar dataKey={trendMetric}
                      name={trendMetric==='revenue'?'Revenue':trendMetric==='ebitda'?'EBITDA':'Net profit'}
                      radius={[3,3,0,0]} maxBarSize={32}>
                      {trendData.map((_,i)=>(
                        <Cell key={i} fill={i===trendData.length-1?'var(--accent)':'var(--paper-3)'}/>
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <p className={styles.chartLabel}>
                  {trendMetric==='revenue'?'Revenue':trendMetric==='ebitda'?'EBITDA':'Net profit'} (₹ Cr) — latest bar highlighted
                </p>
              </div>
            </CollapsibleSection>
          )}

          {/* 4. What this company does — RIGHT */}
          <CollapsibleSection col="right" title="What this company actually does" icon={FileText}>
            <p className={styles.bodyText}>{business?.what_they_do}</p>
            {business?.key_segments?.length>0 && (
              <div className={styles.segmentList}>
                <p className={styles.subLabel}>Revenue segments</p>
                <div className={styles.chipRow}>
                  {business.key_segments.map((s,i)=><span key={i} className={styles.segChip}>{s}</span>)}
                </div>
              </div>
            )}
            {business?.key_customers_or_geographies && (
              <p className={styles.bodyTextSmall}><strong>Key customers / geographies:</strong> {business.key_customers_or_geographies}</p>
            )}
            {business?.moat && (
              <div className={styles.moatBox}>
                <Shield size={13}/>
                <div>
                  <p className={styles.moatLabel}>Competitive moat</p>
                  <p className={styles.moatText}>{business.moat}</p>
                </div>
              </div>
            )}
          </CollapsibleSection>

          {/* 5. Red flag check — LEFT */}
          <CollapsibleSection col="left" title="Red flag check" icon={Shield}
            badge={red_flags?.filter(f=>f.status!=='clear').length||null}>
            <div className={styles.flagList}>
              {(red_flags||[]).map((f,i)=>{
                const cfg=STATUS_CONFIG[f.status]||STATUS_CONFIG.watch;
                return (
                  <div key={i} className={styles.flagRow}>
                    <span className={`${styles.flagPill} ${cfg.cls}`}>{cfg.label}</span>
                    <div>
                      <p className={styles.flagTitle}>{f.flag}</p>
                      {f.detail&&<p className={styles.flagDetail}>{f.detail}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </CollapsibleSection>

          {/* 6. Risks to watch — RIGHT */}
          <CollapsibleSection col="right" title="Risks to watch" icon={AlertTriangle}
            badge={risks?.filter(r=>r.severity==='high').length?`${risks.filter(r=>r.severity==='high').length} high`:null}>
            {(risks||[]).map((r,i)=>(
              <div key={i} className={styles.riskItem}>
                <span className={`${styles.riskDot} ${SEV_CONFIG[r.severity]||''}`}/>
                <div>
                  <p className={styles.riskTitle}>{r.title}</p>
                  <p className={styles.riskDetail}>{r.detail}</p>
                </div>
              </div>
            ))}
          </CollapsibleSection>

          {/* 7. Growth drivers — LEFT */}
          <CollapsibleSection col="left" title="Growth drivers & positives" icon={TrendingUp}>
            {(positives||[]).map((p,i)=>(
              <div key={i} className={styles.positiveItem}>
                <CheckCircle size={14} className={styles.positiveIcon}/>
                <div>
                  <p className={styles.riskTitle}>{p.title}</p>
                  <p className={styles.riskDetail}>{p.detail}</p>
                </div>
              </div>
            ))}
          </CollapsibleSection>

          {/* 7b. Management commentary — LEFT (only when applicable) */}
          {hasMgmtComm && (
            <CollapsibleSection col="left" title="Management commentary — decoded" icon={MessageSquare} defaultOpen={false}>
              {management_commentary?.tone_note && (
                <p className={styles.toneNote}>
                  <strong>Overall tone:</strong> {management_commentary.tone} — {management_commentary.tone_note}
                </p>
              )}
              <div className={styles.commentaryList}>
                {(management_commentary.key_statements||[]).map((s,i)=>(
                  <div key={i} className={styles.commentaryItem}>
                    <p className={styles.commentarySaid}>"{s.said}"</p>
                    <p className={styles.commentaryMeans}>
                      <span className={styles.meansLabel}>What this means:</span> {s.means}
                    </p>
                  </div>
                ))}
              </div>
            </CollapsibleSection>
          )}

          {/* 8. What changed — RIGHT */}
          {what_changed && (
            <CollapsibleSection col="right" title="What changed this period" icon={AlertCircle}>
              <p className={styles.bodyText}>{what_changed}</p>
            </CollapsibleSection>
          )}

          {/* 9. Key ratios — LEFT */}
          <CollapsibleSection col="left" title="Key ratios — explained" icon={BarChart2} defaultOpen={false}>
            <div className={styles.ratioList}>
              {(ratios||[]).map((r,i)=>(
                <div key={i} className={styles.ratioRow}>
                  <div className={styles.ratioLeft}>
                    <span className={styles.ratioName}>{r.name}</span>
                    <span className={styles.ratioBenchmark}>{r.benchmark}</span>
                  </div>
                  <div className={styles.ratioRight}>
                    <span className={styles.ratioValue}>{r.value}</span>
                    <span className={`${styles.ratioAssess} ${ASSESS_CONFIG[r.assessment]||''}`}>{r.assessment}</span>
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleSection>

          {/* 10. Bear / Bull — RIGHT */}
          <CollapsibleSection col="right" title="Bear case vs bull case" icon={Target} defaultOpen={false}>
            <div className={styles.bearBullGrid}>
              <div className={styles.bullBox}>
                <p className={styles.bbLabel}>3 reasons to be optimistic</p>
                {(bear_bull?.bull||[]).map((b,i)=>(
                  <div key={i} className={styles.bbItem}><span className={styles.bbNum}>{i+1}</span><span>{b}</span></div>
                ))}
              </div>
              <div className={styles.bearBox}>
                <p className={styles.bbLabel}>3 reasons to be cautious</p>
                {(bear_bull?.bear||[]).map((b,i)=>(
                  <div key={i} className={styles.bbItem}><span className={styles.bbNum}>{i+1}</span><span>{b}</span></div>
                ))}
              </div>
            </div>
          </CollapsibleSection>

          {/* 11. ELI15 — LEFT */}
          {eli15 && (
            <CollapsibleSection col="left" title="Explain it like I'm 15" icon={Smile} defaultOpen={false}>
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

          {/* 12. Hidden insights — RIGHT */}
          {hidden_insights?.length>0 && (
            <CollapsibleSection col="right" title="Hidden insights from the footnotes" icon={Lightbulb} defaultOpen={false}>
              <ul className={styles.insightList}>
                {hidden_insights.map((insight,i)=>(
                  <li key={i} className={styles.insightItem}><span className={styles.insightDot}/>{insight}</li>
                ))}
              </ul>
            </CollapsibleSection>
          )}

          {/* DRHP — full width */}
          {drhp_extras && (
            <div className={styles.fullWidth}>
              <CollapsibleSection title="IPO deep dive" icon={FileText}>
                <div className={styles.ipoGrid}>
                  {drhp_extras.issue_size&&<div className={styles.ipoStat}><p className={styles.ipoStatLabel}>Issue size</p><p className={styles.ipoStatValue}>{drhp_extras.issue_size}</p></div>}
                  {drhp_extras.issue_type&&<div className={styles.ipoStat}><p className={styles.ipoStatLabel}>Issue type</p><p className={styles.ipoStatValue}>{drhp_extras.issue_type}</p></div>}
                </div>
                {drhp_extras.use_of_funds?.length>0&&(
                  <div className={styles.ipoSection}>
                    <p className={styles.ipoSectionLabel}>Use of IPO proceeds</p>
                    <ul className={styles.ipoFundsList}>{drhp_extras.use_of_funds.map((f,i)=><li key={i}>{f}</li>)}</ul>
                    {drhp_extras.use_of_funds_verdict&&<p className={styles.ipoVerdict}>{drhp_extras.use_of_funds_verdict}</p>}
                  </div>
                )}
                {drhp_extras.promoters?.length>0&&(
                  <div className={styles.ipoSection}>
                    <p className={styles.ipoSectionLabel}>Promoters</p>
                    {drhp_extras.promoters.map((p,i)=>(
                      <div key={i} className={styles.promoterRow}>
                        <span>{p.name}</span>
                        <span className={styles.promoterRole}>{p.role}</span>
                        {p.stake_pct!=null&&<span className={styles.promoterStake}>{p.stake_pct}%</span>}
                      </div>
                    ))}
                    {drhp_extras.promoter_assessment&&<p className={styles.commentary}>{drhp_extras.promoter_assessment}</p>}
                  </div>
                )}
                {drhp_extras.related_party_concerns&&(
                  <div className={`${styles.flagRow} ${styles.flagRowAlert}`}>
                    <span className={`${styles.flagPill} ${styles.flagWatch}`}>Related parties</span>
                    <p className={styles.flagDetail}>{drhp_extras.related_party_concerns}</p>
                  </div>
                )}
                {drhp_extras.ipo_verdict&&(
                  <div className={`${styles.verdictHero} ${drhp_extras.ipo_verdict==='apply'?styles.verdictStrong:drhp_extras.ipo_verdict==='avoid'?styles.verdictRisky:styles.verdictMixed}`} style={{marginTop:'1rem'}}>
                    <div className={styles.verdictBadge} style={{textTransform:'capitalize'}}>IPO verdict: {drhp_extras.ipo_verdict}</div>
                    {drhp_extras.ipo_verdict_reason&&<p className={styles.verdictReason}>{drhp_extras.ipo_verdict_reason}</p>}
                  </div>
                )}
              </CollapsibleSection>
            </div>
          )}

          {/* Footer — full width */}
          <div className={styles.fullWidth}>
            <div className={styles.footer}>
              <p>FilingLens analyses SEBI filings using AI. This is not investment advice. Always do your own research before making any investment decision.</p>
              <button className={styles.newAnalysisBtn} onClick={onReset}>Analyse another filing</button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}