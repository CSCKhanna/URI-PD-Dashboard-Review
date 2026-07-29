# Handoff: URI Faculty Development Training Calendar

## What It Is
An interactive dashboard listing professional development (PD) opportunities available to URI faculty from member organizations. Supports filtering by timing, topic, provider, and access type.

## Owner
April Khanna (april.khanna@uri.edu) — URI Academic Affairs / Faculty Development

## Live URL
https://mghp.osn.xsede.org/emri/faculty-training-webpage/index.html
*(Hosted on OSN — Open Storage Network — not GitHub Pages)*

## GitHub Repo
https://github.com/CSCKhanna/Faculty-PD

## Local Files
`workspace/projects/faculty-training-calendar/`

## Tech Stack
- Vanilla JavaScript (no framework, no build step)
- External feed ingestion via `update-feeds.mjs` (Node.js script)
- Plain CSS
- Self-contained single-page app

## Key Files
| File | Purpose |
|------|---------|
| `index.html` | Main app shell + layout |
| `app.js` | Dashboard logic, filtering, rendering |
| `styles.css` | All styling |
| `update-feeds.mjs` | Node.js script to pull/update external PD feed data |
| `data/` | Data files for PD listings |
| `assets/` | Images and static assets |

## Deployment
- Currently hosted on OSN (not GitHub Pages)
- No automated deploy pipeline — manual upload to OSN when updated
- Future hosting could move to GitHub Pages if desired

## Codex Source Archive
A full Codex working archive is stored at `codex-source/` — includes:
- `github-pages-package/` — clean deployable version (use this as deploy baseline)
- `faculty-training-spfx-dropin/` — SharePoint Framework (SPFx) version — **NOT in use, disregard**
- `uri_faculty_training_calendar_2026_27.md` — curated markdown export of all training listings
- `work/` — build scripts: `extract_docx_text.py`, `merge_docx_resources.mjs`, `build_spfx_calendar_html.mjs`, SharePoint upload scripts
- `embed-test.html` — standalone iframe embed test page

## Notes
- This was a draft site; OSN hosting was used for this project only
- Future projects should default to GitHub Pages for easier deployment
- The `data/trainings.json` file is the curated training list — edit this to add/update/remove entries
- `update-feeds.mjs` auto-discovers new entries from provider sources; newly found items need manual review before publishing

## Checkpoint: 2026-07-28

Saved after April and Sage's dashboard cleanup session.

Current state:
- 83 PD items in `data/trainings.json`: 79 recommended, 4 on hold.
- URI ATL Fall 2026 programming added.
- Provost Office mentoring/training-plan events added from the 2026 plan.
- Audience filter chips replaced the earlier list-style chips.
- Card and timeline views no longer show status/access chips for Verified, Advertise first, Confirm, Local, Paid, or Hold.
- The Verified/free only checkbox chip was removed.
- The Verified Access and Advertise First tally chips were removed.
- The table view and CSV download no longer include the Access column.
- GitHub Pages package copy and SPFx preview/generated files were synced after the cleanup.

To resume locally:

```bash
cd /home/sage/.openclaw/workspace/projects/faculty-training-calendar
node server.mjs
```

Then open `http://127.0.0.1:4173`.

Suggested next review:
- Visual scan of card, timeline, and table views after chip cleanup.
- Confirm whether the remaining metrics and filters are the right set for the mid-August live version.
- Decide whether to publish the current checkpoint to GitHub/OSN or keep it local until final review.
