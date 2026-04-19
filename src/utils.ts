export interface HistoryEntry {
  doi: string;
  bib: string;
  fetchedAt: string;
}

const HISTORY_CAP = 50;

export function looksLikeDoi(text: string): boolean {
  const trimmed = text.trim();
  return trimmed.length > 0 && trimmed.includes("/");
}

export function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hr ago`;
  const diffDays = Math.floor(diffHr / 24);
  return `${diffDays} days ago`;
}

export function addToHistory(history: HistoryEntry[], entry: HistoryEntry): HistoryEntry[] {
  const filtered = history.filter((h) => h.doi !== entry.doi);
  const sorted = filtered.sort((a, b) => new Date(b.fetchedAt).getTime() - new Date(a.fetchedAt).getTime());
  const updated = [entry, ...sorted];
  return updated.slice(0, HISTORY_CAP);
}
