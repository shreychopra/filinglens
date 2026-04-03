import { useState, useEffect } from 'react';
import styles from './AnalyzingScreen.module.css';

const STAGES = [
  { label: 'Extracting text from filing…', duration: 3000 },
  { label: 'Reading financial statements…', duration: 4000 },
  { label: 'Scanning for red flags…', duration: 3500 },
  { label: 'Decoding management commentary…', duration: 3000 },
  { label: 'Building your briefing…', duration: 99999 },
];

export default function AnalyzingScreen() {
  const [stageIdx, setStageIdx] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let elapsed = 0;
    const interval = setInterval(() => {
      elapsed += 80;
      const totalTime = STAGES.slice(0, -1).reduce((a, s) => a + s.duration, 0);
      setProgress(Math.min((elapsed / totalTime) * 90, 90));

      let cumulative = 0;
      for (let i = 0; i < STAGES.length - 1; i++) {
        cumulative += STAGES[i].duration;
        if (elapsed < cumulative) { setStageIdx(i); break; }
        if (i === STAGES.length - 2) setStageIdx(STAGES.length - 1);
      }
    }, 80);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.spinnerWrap}>
          <div className={styles.spinner} />
          <div className={styles.spinnerInner} />
        </div>

        <h2 className={styles.title}>Analysing your filing</h2>
        <p className={styles.stage}>{STAGES[stageIdx].label}</p>

        <div className={styles.progressTrack}>
          <div className={styles.progressBar} style={{ width: `${progress}%` }} />
        </div>

        <p className={styles.hint}>
          Reading through the filing carefully. This takes 20–40 seconds.
        </p>
      </div>
    </div>
  );
}
