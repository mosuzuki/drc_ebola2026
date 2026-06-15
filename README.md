# DRC Ebola 2026 dashboard

A simplified static dashboard for the 2026 DRC Ebola outbreak.

Repository name intended for deployment:

```text
mosuzuki/drc_ebola2026
```

Expected GitHub Pages URL:

```text
https://mosuzuki.github.io/drc_ebola2026/
```

## What this simplified version keeps

- Four top indicators from the latest SitRep summary:
  - DRC confirmed cases
  - DRC confirmed deaths
  - Uganda confirmed cases
  - Uganda confirmed deaths
- Japanese / English language toggle
- 2 × 2 dashboard layout:
  - case bubble map by health zone
  - cumulative reported cases chart
  - short-term projection
  - estimated final outbreak size
- SitRep auto-update workflow using GitHub Actions
- OpenAI-assisted extraction fallback when `OPENAI_API_KEY` is configured

## What was removed from the previous mobility dashboard

- AI/risk assessment panel
- mobility arrows and origin/destination controls
- movement, population, RWI/SES, response-intensity, contact-gap and Uganda projection map layers
- destination ranking panel
- response timeline panel
- R&D / literature panels
- French language UI
- Uganda data fetch workflow script

Some non-UI data files are intentionally retained because the SitRep updater uses them as lookup/support tables.

## GitHub Actions

### `update-sitrep.yml`

Runs every 6 hours and can also be triggered manually. It:

1. searches the INSP SitRep category page;
2. downloads the latest SitRep PDF;
3. extracts DRC case and death data;
4. writes updates to `data/`, `raw/`, `extracted/`, `README.md`, `DATA_NOTES.md`, and `.sitrep_update_status.md`;
5. regenerates `data/final_size_projection.json`.

Set this repository secret after upload:

```text
OPENAI_API_KEY
```

If this secret is absent, deterministic extraction still runs. OpenAI is used only as a fallback when deterministic extraction fails validation.

### `pages.yml`

Deploys the static dashboard to GitHub Pages.

## Main files

```text
index.html
assets/app.js
assets/style.css
data/cases_by_hz.csv
data/report_summary.csv
data/final_size_projection.json
data/health_zones.geojson
scripts/update_from_insp_sitrep.py
scripts/generate_final_size_projection.py
.github/workflows/update-sitrep.yml
.github/workflows/pages.yml
```
