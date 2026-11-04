# 👻 Ghost Atlas

**12,000 years of humanity, living and dead.** An open-source TypeScript map exploring living population, modeled cumulative deaths, and their ratio.

> **Prototype only.** Bundled data are **synthetic**, NOT HYDE or measured deaths. Do not interpret the demo map as historical evidence.

## Run locally
```bash
npm install
npm run dev
```

## GitHub Pages
Set **Settings → Pages → Build and deployment → GitHub Actions**. The workflow builds and deploys from main.

## Data format
`public/data/atlas.json`: `{metadata,frames:[{year,cells:[{lat,lon,pop,deaths}]}]}`. `deaths` means cumulative deaths through that year, not annual deaths. Counts are persons, not densities.

## Roadmap
- Download and document HYDE 3.3 historical population rasters and license.
- Model mortality with explicit historical assumptions and uncertainty.
- Validate global totals and cellwise nondecreasing cumulative deaths.
- Export appropriately aggregated geographic data and improve map rendering.
- Distinguish deaths at location from historical residential population; exclude pre-10,000 BCE deaths from the initial model.

Ghost Atlas is a speculative demographic visualization, not evidence of paranormal activity.
