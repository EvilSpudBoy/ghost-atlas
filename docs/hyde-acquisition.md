# HYDE data acquisition

## Status (2026-11-04)
**Source identified; actual raster download NOT completed or verified.**

HYDE 3.3 provides global gridded population counts at 5 arcminutes for
10,000 BCE–2023 CE. Its baseline, lower, and upper scenarios should be
investigated. The demo visualization still uses **synthetic** data.

Official entry points:
- https://hyde-portal.geo.uu.nl/
- https://dataportaal.pbl.nl/downloads/HYDE/
- https://doi.org/10.24416/UU01-AEZZIT

## Next acquisition steps
1. Open the official HYDE download portal and select HYDE 3.3 baseline
   **total population count** rasters (not density, urban, or land use).
2. Record the exact file URL, archive version, indicator, time range,
   units, checksum if published, and license/redistribution conditions.
3. Run `python scripts/download_hyde.py --url 'EXACT_HTTPS_URL' --output data/raw/hyde-pop.zip`.
4. Inspect the archive format and metadata. Verify a few global totals
   against published HYDE values before building the death model.
5. Keep raw large data out of Git; commit processing scripts and small
   derived map assets only after redistribution terms are checked.

**Important:** HYDE is a model of population at residence, not a dataset
of deaths at their actual geographic locations. Ghost counts require
additional assumptions about mortality, migration and the initial epoch.

Scientific background: Klein Goldewijk et al. (2017),
https://doi.org/10.5194/essd-9-927-2017
