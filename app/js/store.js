// Saved progress for the Leonida Platinum tracker: which trophies are earned,
// the running counters for trophies with a target, and the spoiler setting.
// Everything lives in localStorage; export writes it to a file, import reads one back.
export const STORAGE_KEY = 'leonida-platinum-v1';

export function blankProgress() {
  return { earned: new Set(), counts: {}, spoiler: false };
}

export function loadProgress() {
  const state = blankProgress();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return state;
    const data = JSON.parse(raw);
    if (Array.isArray(data.earned)) state.earned = new Set(data.earned.filter((n) => typeof n === 'string'));
    if (data.counts && typeof data.counts === 'object') {
      for (const [name, value] of Object.entries(data.counts)) {
        const n = Number(value);
        if (Number.isFinite(n) && n > 0) state.counts[name] = Math.floor(n);
      }
    }
    state.spoiler = data.spoiler === true;
  } catch {
    // A corrupt save is ignored: the tracker starts empty rather than breaking.
  }
  return state;
}

export function saveProgress(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      earned: [...state.earned],
      counts: state.counts,
      spoiler: state.spoiler,
    }));
  } catch {
    // Storage full or unavailable: the page still works for this session.
  }
}

export function exportProgress(state) {
  const payload = {
    app: 'leonida-platinum',
    game: 'Grand Theft Auto VI',
    exportedAt: new Date().toISOString(),
    earned: [...state.earned],
    counts: state.counts,
    spoiler: state.spoiler,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'leonida-platinum-progress.json';
  a.click();
  URL.revokeObjectURL(url);
}

export function parseImportedProgress(text, knownNames) {
  const data = JSON.parse(text);
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('not an object');
  const earned = new Set();
  const source = Array.isArray(data.earned) ? data.earned : [];
  for (const name of source) {
    if (typeof name === 'string' && knownNames.has(name)) earned.add(name);
  }
  const counts = {};
  if (data.counts && typeof data.counts === 'object') {
    for (const [name, value] of Object.entries(data.counts)) {
      const n = Number(value);
      if (knownNames.has(name) && Number.isFinite(n) && n > 0) counts[name] = Math.floor(n);
    }
  }
  return { earned, counts, spoiler: data.spoiler === true };
}
