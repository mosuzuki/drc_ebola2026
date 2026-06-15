# Data notes

This simplified dashboard uses reported confirmed Ebola cases and deaths extracted from DRC SitRep PDFs.

## UI data

- `data/report_summary.csv` is used for the four top indicators and cumulative case chart.
- `data/cases_by_hz.csv` is used for health-zone case bubbles on the map.
- `data/final_size_projection.json` is used for short-term projection and final-size estimation.
- `data/health_zones.geojson` is retained as a geographic reference layer, although the current simplified map uses health-zone centroid coordinates from `cases_by_hz.csv`.

## Automation support data

- `data/population_by_hz.csv` is retained for health-zone name, province, latitude, longitude and zone ID lookup during SitRep extraction.
- `data/response_indicators.csv` is retained because the extraction script can update response-related fields even though the simplified UI does not display them.
- `data/historical_matching_library.json` supports final-size projection generation.
- Historical matching CSV files are retained for provenance and future recalculation.

## Removed from the UI

Mobility, risk layers, RWI/SES layers, Uganda projection, response timeline, destination ranking, AI risk assessment, research/R&D panels and French UI were removed from the simplified dashboard.
