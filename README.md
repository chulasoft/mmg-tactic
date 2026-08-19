# Magic Maidens Tactic — Rework

A ground-up rework of the story-driven tactical RPG, currently focused on the
Prologue, narrative party selection, and Chapter 1 tutorial experience.

## Run locally

```bash
python3 -m http.server 8000
```

Open <http://localhost:8000>.

## Project map

- `index.html` — new application shell
- `styles.css` — new visual system and responsive UI
- `app.js` — new narrative, party-select, and tutorial prototype
- `docs/rework/` — story, gameplay, and progress source of truth
- `legacy/` — archived pre-rework game, source, tests, and assets

The new prototype intentionally references portraits under
`legacy/asset-tactic/` while the art pipeline for the rework is being decided.
