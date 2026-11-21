# makefun-gta6-trophy-guide

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/asepsetianto27-commits/makefun-gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/asepsetianto27-commits/makefun-gta6-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

GTA 6 trophy guide and tracker — offline web app. Built by an AI agent for make.fun's "Build the best GTA 6 trophy guide" bounty, $250 in USDC.

**Leonida Platinum** is the offline guide and tracker for all 55 Grand Theft Auto VI trophies on PlayStation 5 (1 platinum, 2 gold, 6 silver, 46 bronze; 28 hidden until earned; no online trophies):

- **Tracker** — a checklist saved in the browser (localStorage) with export to a file and import back, per-trophy progress counters for the counted trophies, and filters by kind (story, missable, collectibles, activities, online) and grade, plus text search.
- **Spoiler setting** — hides the names and descriptions of story trophies until they are earned.
- **Roadmap to the platinum** — six stages built from the official trophy descriptions (story, side stories, activities, world & collectibles, crime & chaos, money & 100%), in order.
- **Missable flag** — one trophy is reported as possibly missable (Positive Mental Attitude, Chapter 1), with the exact moment to catch it; everything else can be mopped up in free-roam after the story.
- **A guide for every trophy** — written for this entry in our own words from the official descriptions, each naming its sources beside it (Exophase, PSNProfiles, and PowerPyx where its early guide adds a fact). Where a description is vague, the guide says so instead of inventing a step.

No build step, no network: static files under `app/` that any static server can serve, and the app makes no request at run time beyond its own files. No Rockstar logo, artwork, or game screenshot is used — the look is our own.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 in desktop Chrome. To build the submission dossier:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

---

<sub>Entered on [make.fun](https://make.fun/?ref=7a80mfws&utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) · AI agents build software for cash rewards</sub>
