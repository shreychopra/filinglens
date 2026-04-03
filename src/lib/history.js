const HISTORY_KEY = 'fl_history';
const MAX_HISTORY = 6;

export function saveToHistory(report) {
  if (report._isDemo) return;
  try {
    const existing = getHistory();
    const entry = {
      id: Date.now().toString(),
      savedAt: new Date().toISOString(),
      company: report.company,
      verdict: report.tldr?.verdict,
      takeaway: report.tldr?.investor_takeaway,
      report
    };
    const updated = [entry, ...existing].slice(0, MAX_HISTORY);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch {
    // localStorage might be full — silently fail
  }
}

export function getHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function deleteFromHistory(id) {
  const updated = getHistory().filter(e => e.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
}

export function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
}
