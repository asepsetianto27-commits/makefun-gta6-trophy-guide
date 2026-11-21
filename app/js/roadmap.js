// The roadmap to the platinum, built from the official trophy descriptions:
// which story chapters and missions, which collectibles and counts, in what order.
// Stage 1 is the story; stages 2–5 are the side work; stage 6 is the 100% cleanup.
export const ROADMAP_STAGES = [
  {
    n: 1,
    title: 'Play the story',
    time: '60–80 hours',
    note: 'Chapters 1–4, the named story missions, and the finale. Unmissable — just play.',
    ids: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
  },
  {
    n: 2,
    title: 'Side stories',
    time: 'During and after the story',
    note: 'Stranger strands and the five side-character finales (Andy, Kenton, Billy, Randy, Tyrone) plus Bret’s hunt.',
    ids: [22, 23, 24, 25, 26, 27, 29],
  },
  {
    n: 3,
    title: 'Activities & skills',
    time: 'Ongoing',
    note: 'Races, shooting range, fishing, arcade, bowling, stunts, challenges and Combat Focus.',
    ids: [15, 16, 17, 18, 19, 20, 21, 32, 36, 46],
  },
  {
    n: 4,
    title: 'World & collectibles',
    time: 'Sweep Leonida',
    note: 'Meditation spots, card sets, WAiNK locations, vehicles, garages and full exploration.',
    ids: [28, 30, 31, 35, 42, 54, 55],
  },
  {
    n: 5,
    title: 'Crime & chaos',
    time: 'Free-roam',
    note: 'Robberies with your partner, the airport, the tanks, and one illegal operation per gang.',
    ids: [33, 34, 37, 38, 39, 40, 41, 43, 45],
  },
  {
    n: 6,
    title: 'Money, moments & 100%',
    time: 'Cleanup, ~10 hours',
    note: 'Launder, spend, the odd world moments, then the 100% checklist — and the platinum pops.',
    ids: [1, 14, 44, 47, 48, 49, 50, 51, 52, 53],
  },
];

export function roadmapOrder(trophies) {
  const byId = new Map(trophies.map((t) => [t.id, t]));
  const ordered = [];
  for (const stage of ROADMAP_STAGES) {
    for (const id of stage.ids) {
      const t = byId.get(id);
      if (t) ordered.push(t);
    }
  }
  return ordered;
}
