# URI Faculty Development Training Webpage

This package turns the curated faculty-development list into an interactive webpage with:

- Search, provider, topic, access, and semester filters
- Card, timeline, and table views
- CSV export
- Calendar file export
- Print view
- Clipboard-ready announcement copy
- A local updater server that refreshes provider source pages and records verification snapshots

## Run Locally

From this folder:

```bash
node server.mjs
```

Then open:

```text
http://localhost:4173
```

The page can also be served by any static web server, but the `Update now` button only works when `server.mjs` is running.

## Update the Data

Use either option:

```bash
node update-feeds.mjs
```

or open the webpage through `server.mjs` and use `Update now`.

The updater fetches sources listed in `data/sources.json`, writes verification snapshots into `data/trainings.json`, refreshes known source checks, and adds any new matches as `status: discovered`. Newly detected items should be reviewed before being advertised to faculty.

## Edit the Curated List

Edit:

```text
data/trainings.json
```

Recommended items use:

```json
"status": "recommended"
```

Items that should be held unless URI sponsors or confirms access use:

```json
"status": "hold"
```

Automatically detected items use:

```json
"status": "discovered"
```

## Deployment Notes

For a static CMS page, copy `index.html`, `styles.css`, `app.js`, and the `data/` folder. For automatic refreshes in production, run `node update-feeds.mjs` on a schedule and publish the updated `data/trainings.json`.

