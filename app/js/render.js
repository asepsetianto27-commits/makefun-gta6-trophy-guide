// Rendering for the Leonida Platinum tracker: the progress header, the roadmap
// stages, the missable list and the trophy checklist cards with their guides.
import { KINDS, spoilerHides, trophyMatches } from './filters.js';
import { ROADMAP_STAGES, roadmapOrder } from './roadmap.js';

const GRADE_LABEL = { platinum: 'Platinum', gold: 'Gold', silver: 'Silver', bronze: 'Bronze' };
const KIND_LABEL = { story: 'Story', missable: 'Missable', collectibles: 'Collectibles', activities: 'Activities', online: 'Online' };

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function medalMark(grade) {
  const mark = el('span', `medal medal-${grade}`, grade === 'platinum' ? '◆' : '●');
  mark.title = GRADE_LABEL[grade];
  return mark;
}

export function renderProgress(state, trophies) {
  const earned = state.earned.size;
  document.getElementById('earned-count').textContent = String(earned);
  const fill = document.getElementById('progress-fill');
  fill.style.width = `${Math.round((earned / trophies.length) * 100)}%`;
  const bar = document.getElementById('progress-bar');
  bar.setAttribute('aria-valuenow', String(earned));
  const counts = {};
  for (const grade of Object.keys(GRADE_LABEL)) {
    const total = trophies.filter((t) => t.grade === grade).length;
    const got = trophies.filter((t) => t.grade === grade && state.earned.has(t.name)).length;
    counts[grade] = `${got}/${total}`;
  }
  const line = document.getElementById('grade-counts');
  line.replaceChildren();
  for (const grade of ['platinum', 'gold', 'silver', 'bronze']) {
    if (line.childNodes.length) line.append(document.createTextNode(' · '));
    const b = el('b', null, `${GRADE_LABEL[grade]} ${counts[grade]}`);
    line.append(b);
  }
  const next = roadmapOrder(trophies).find((t) => !state.earned.has(t.name));
  const nextUp = document.getElementById('next-up');
  nextUp.replaceChildren();
  if (next) {
    nextUp.append(document.createTextNode('Next up: '));
    nextUp.append(el('b', null, next.name));
    nextUp.append(document.createTextNode(` — ${next.description}`));
  } else {
    nextUp.append(el('b', null, 'Platinum earned — you are a Leonida Legend.'));
  }
}

export function renderKindCounts(trophies) {
  for (const kind of KINDS) {
    const node = document.getElementById(`n-${kind}`);
    if (!node) continue;
    const n = kind === 'all'
      ? trophies.length
      : kind === 'missable'
        ? trophies.filter((t) => t.missable).length
        : trophies.filter((t) => t.kind === kind).length;
    node.textContent = `(${n})`;
  }
}

export function renderRoadmap(state, trophies, onJump) {
  const wrap = document.getElementById('roadmap-stages');
  wrap.replaceChildren();
  const byId = new Map(trophies.map((t) => [t.id, t]));
  for (const stage of ROADMAP_STAGES) {
    const card = el('div', 'stage');
    const h = el('h3');
    h.append(el('span', 'stage-n', `Stage ${stage.n}`));
    h.append(document.createTextNode(` — ${stage.title}`));
    card.append(h);
    const earnedInStage = stage.ids.filter((id) => state.earned.has(byId.get(id)?.name)).length;
    const meta = el('p', 'stage-meta', `${stage.time} · `);
    meta.append(el('span', 'stage-count', `${earnedInStage} / ${stage.ids.length} earned`));
    card.append(meta);
    card.append(el('p', 'stage-meta', stage.note));
    const list = el('ul');
    for (const id of stage.ids) {
      const t = byId.get(id);
      if (!t) continue;
      const li = el('li');
      if (state.earned.has(t.name)) li.classList.add('done');
      const jump = el('button', 'stage-jump', spoilerHides(t, state.spoiler, state.earned) ? 'Hidden story trophy' : t.name);
      jump.type = 'button';
      jump.addEventListener('click', () => onJump(t));
      li.append(jump);
      list.append(li);
    }
    card.append(list);
    wrap.append(card);
  }
}

export function renderMissables(state, trophies, onShowInList) {
  const wrap = document.getElementById('missable-list');
  wrap.replaceChildren();
  const missable = trophies.filter((t) => t.missable);
  if (!missable.length) {
    wrap.append(el('p', null, 'No missable trophies are flagged.'));
    return;
  }
  for (const t of missable) {
    const card = el('div', 'missable-card');
    const h = el('h3', null, t.name);
    h.append(el('span', 'badge-missable', 'Potentially missable'));
    card.append(h);
    if (t.missable_note) card.append(el('p', null, t.missable_note));
    card.append(el('p', null, t.guide));
    const btn = el('button', null, 'Show in checklist');
    btn.type = 'button';
    btn.addEventListener('click', () => onShowInList(t));
    card.append(btn);
    wrap.append(card);
  }
}

function guidePanel(trophy) {
  const panel = el('div', 'guide-panel');
  panel.append(el('h4', null, 'Guide'));
  panel.append(el('p', null, trophy.guide));
  const sources = el('p', 'sources', 'Sources: ');
  for (const s of trophy.sources ?? []) {
    const a = document.createElement('a');
    a.href = s.url;
    a.textContent = s.name;
    a.target = '_blank';
    a.rel = 'noopener';
    sources.append(a);
  }
  panel.append(sources);
  return panel;
}

export function renderList(ctx) {
  const { trophies, state, filters, openGuides } = ctx;
  const list = document.getElementById('trophy-list');
  list.replaceChildren();
  const shown = trophies.filter((t) => trophyMatches(t, filters));
  document.getElementById('list-count').textContent = `Showing ${shown.length} of ${trophies.length} trophies`;
  document.getElementById('empty-note').hidden = shown.length > 0;
  for (const t of shown) {
    const hidden = spoilerHides(t, state.spoiler, state.earned);
    const card = el('div', 'trophy' + (state.earned.has(t.name) ? ' earned' : ''));
    const head = el('div', 'trophy-head');
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = state.earned.has(t.name);
    box.setAttribute('aria-label', `Mark ${hidden ? 'hidden story trophy' : t.name} as earned`);
    box.addEventListener('change', () => ctx.onToggleEarned(t, box.checked));
    head.append(box);
    const main = el('div', 'trophy-main');
    const nameRow = el('div', 'trophy-name');
    nameRow.append(medalMark(t.grade));
    nameRow.append(document.createTextNode(hidden ? 'Hidden story trophy' : t.name));
    if (t.missable) nameRow.append(el('span', 'badge-missable', 'Missable'));
    main.append(nameRow);
    main.append(el('p', 'trophy-desc', hidden ? 'Hidden until earned — turn the spoiler setting off to see it, or tick it off once it pops.' : t.description));
    const tags = el('div', 'trophy-tags');
    tags.append(el('span', `tag kind-${t.kind}`, KIND_LABEL[t.kind] ?? t.kind));
    tags.append(el('span', 'tag', GRADE_LABEL[t.grade]));
    if (t.hidden) tags.append(el('span', 'tag hidden-flag', 'Hidden on PSN'));
    tags.append(el('span', 'tag', `Roadmap stage ${t.stage}`));
    if (!hidden) {
      const toggle = el('button', 'guide-toggle', openGuides.has(t.name) ? 'Hide guide' : 'Show guide');
      toggle.type = 'button';
      toggle.addEventListener('click', () => ctx.onToggleGuide(t));
      tags.append(toggle);
    }
    main.append(tags);
    if (t.count && !hidden) {
      const countBox = el('div', 'count-box');
      countBox.append(document.createTextNode('My progress: '));
      const input = document.createElement('input');
      input.type = 'number';
      input.min = '0';
      input.max = String(t.count);
      input.value = String(state.counts[t.name] ?? 0);
      input.setAttribute('aria-label', `Progress toward ${t.count} ${t.count_label ?? ''}`);
      input.addEventListener('change', () => ctx.onCountChange(t, Number(input.value)));
      countBox.append(input);
      countBox.append(document.createTextNode(`/ ${t.count.toLocaleString('en-US')} ${t.count_label ?? ''}`));
      if ((state.counts[t.name] ?? 0) >= t.count) countBox.append(el('span', 'count-done', 'Target reached'));
      main.append(countBox);
    }
    if (!hidden && openGuides.has(t.name)) main.append(guidePanel(t));
    head.append(main);
    card.append(head);
    list.append(card);
  }
}
