// Filters for the trophy checklist: kind, grade and text search, plus the spoiler rule.
// Kinds are the ones the guide promises: story, missable, collectibles, activities and
// online (this game lists no online trophies, so that filter honestly shows zero).
export const KINDS = ['all', 'story', 'missable', 'collectibles', 'activities', 'online'];

export function createFilters() {
  return { kind: 'all', grade: 'all', search: '' };
}

export function trophyMatchesKind(trophy, kind) {
  if (kind === 'all') return true;
  if (kind === 'missable') return trophy.missable === true;
  if (kind === 'online') return trophy.kind === 'online';
  return trophy.kind === kind;
}

export function trophyMatches(trophy, filters) {
  if (!trophyMatchesKind(trophy, filters.kind)) return false;
  if (filters.grade !== 'all' && trophy.grade !== filters.grade) return false;
  if (filters.search) {
    const hay = `${trophy.name} ${trophy.description} ${trophy.guide}`.toLowerCase();
    if (!hay.includes(filters.search.toLowerCase())) return false;
  }
  return true;
}

// The spoiler rule: a story trophy stays hidden (name, description and guide)
// until it is earned. Anything already earned, and every non-story trophy, shows.
export function spoilerHides(trophy, spoilerOn, earned) {
  return spoilerOn && trophy.kind === 'story' && !earned.has(trophy.name);
}
