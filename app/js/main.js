// Leonida Platinum — boot: load the trophy data, restore saved progress,
// wire the controls, and render the tracker. The app fetches only its own
// data file and never makes a network request.
import { createFilters } from './filters.js';
import { renderKindCounts, renderList, renderMissables, renderProgress, renderRoadmap } from './render.js';
import { exportProgress, loadProgress, parseImportedProgress, saveProgress } from './store.js';

const state = loadProgress();
const filters = createFilters();
const openGuides = new Set();
const doc = await (await fetch('data/trophies.json')).json();
const trophies = doc.trophies;
const knownNames = new Set(trophies.map((t) => t.name));
const saveNote = document.getElementById('save-note');

function renderAll() {
  renderProgress(state, trophies);
  renderKindCounts(trophies);
  renderRoadmap(state, trophies, jumpToTrophy);
  renderMissables(state, trophies, showInList);
  renderList({ trophies, state, filters, openGuides, onToggleEarned, onCountChange, onToggleGuide });
}

function onToggleEarned(trophy, checked) {
  if (checked) state.earned.add(trophy.name);
  else state.earned.delete(trophy.name);
  saveProgress(state);
  renderAll();
}

function onCountChange(trophy, value) {
  const clamped = Math.max(0, Math.min(trophy.count, Math.floor(Number(value) || 0)));
  if (clamped > 0) state.counts[trophy.name] = clamped;
  else delete state.counts[trophy.name];
  if (clamped >= trophy.count) state.earned.add(trophy.name);
  else if (state.counts[trophy.name] !== undefined && clamped < trophy.count) state.earned.delete(trophy.name);
  saveProgress(state);
  renderAll();
}

function onToggleGuide(trophy) {
  if (openGuides.has(trophy.name)) openGuides.delete(trophy.name);
  else openGuides.add(trophy.name);
  renderList({ trophies, state, filters, openGuides, onToggleEarned, onCountChange, onToggleGuide });
}

function jumpToTrophy(trophy) {
  filters.search = trophy.name;
  filters.kind = 'all';
  document.getElementById('search').value = trophy.name;
  document.querySelectorAll('#kind-chips .chip').forEach((chip) => {
    chip.classList.toggle('active', chip.dataset.kind === 'all');
  });
  renderList({ trophies, state, filters, openGuides, onToggleEarned, onCountChange, onToggleGuide });
  document.getElementById('list-heading').scrollIntoView({ behavior: 'smooth' });
}

function showInList(trophy) {
  filters.kind = 'missable';
  filters.search = '';
  document.getElementById('search').value = '';
  document.querySelectorAll('#kind-chips .chip').forEach((chip) => {
    chip.classList.toggle('active', chip.dataset.kind === 'missable');
  });
  renderList({ trophies, state, filters, openGuides, onToggleEarned, onCountChange, onToggleGuide });
  document.getElementById('list-heading').scrollIntoView({ behavior: 'smooth' });
}

document.getElementById('search').addEventListener('input', (event) => {
  filters.search = event.target.value;
  renderList({ trophies, state, filters, openGuides, onToggleEarned, onCountChange, onToggleGuide });
});

document.getElementById('grade').addEventListener('change', (event) => {
  filters.grade = event.target.value;
  renderList({ trophies, state, filters, openGuides, onToggleEarned, onCountChange, onToggleGuide });
});

document.querySelectorAll('#kind-chips .chip').forEach((chip) => {
  chip.addEventListener('click', () => {
    filters.kind = chip.dataset.kind;
    document.querySelectorAll('#kind-chips .chip').forEach((c) => c.classList.toggle('active', c === chip));
    renderList({ trophies, state, filters, openGuides, onToggleEarned, onCountChange, onToggleGuide });
  });
});

const spoilerBox = document.getElementById('spoiler');
spoilerBox.checked = state.spoiler;
spoilerBox.addEventListener('change', () => {
  state.spoiler = spoilerBox.checked;
  saveProgress(state);
  renderAll();
});

document.getElementById('export').addEventListener('click', () => {
  exportProgress(state);
  saveNote.textContent = 'Progress exported — keep the file to import it back later.';
});

document.getElementById('import').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    const imported = parseImportedProgress(await file.text(), knownNames);
    state.earned = imported.earned;
    state.counts = imported.counts;
    state.spoiler = imported.spoiler;
    spoilerBox.checked = state.spoiler;
    saveProgress(state);
    renderAll();
    saveNote.textContent = `Imported ${state.earned.size} earned trophies from ${file.name}.`;
  } catch {
    saveNote.textContent = 'That file is not a Leonida Platinum progress export — nothing was changed.';
  }
  event.target.value = '';
});

document.getElementById('reset').addEventListener('click', () => {
  if (!window.confirm('Clear all earned trophies and counters? This cannot be undone.')) return;
  state.earned.clear();
  state.counts = {};
  openGuides.clear();
  saveProgress(state);
  renderAll();
  saveNote.textContent = 'Progress reset.';
});

renderAll();
