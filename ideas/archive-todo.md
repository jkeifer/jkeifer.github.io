# Presentation asset archival worklist

Goal: every externally-hosted asset gets archived into its delivery's page
bundle (`content/presentations/<delivery>/`), typically as an exported PDF for
slides, with the bundle-relative file added to the page's `links` (e.g.
`- name: "slides (pdf)"` / `href: "slides.pdf"`). Keep the original external
link alongside the archive.

## Slides (Google Docs — highest link-rot risk)

- [ ] raster workshop deck (used for FOSS4G 2024 Belém):
      https://docs.google.com/presentation/d/1qFckA0prY604I4dMkQlF1ZM-QSKS2ou4-YttgGQHzOU/
      → `20241202-foss4g-2024-raster-workshop/`
- [ ] raster workshop deck (Oceania virtual, 2025-01-15):
      https://docs.google.com/presentation/d/1k5m2eYV8Tv4YrTAL6pfjmZMhls51cChW_QO1vcXH_0U/
      → `20250115-oceania-2025-raster-workshop/`
- [ ] raster workshop deck (CNG 2025 / FOSS4G NA 2025 / FOSS4G 2025 — shared deck;
      archive once per delivery if the deck changed between them, else once and
      link from each):
      https://docs.google.com/presentation/d/1oJ48g9Oc-60MlG2_wFTlAHo42SMYFGeiRG66Pc6cr48
      → `20250501-cng-2025-raster-workshop/`, `20251103-foss4g-na-2025-raster-workshop/`,
        `20251117-foss4g-2025-raster-workshop/`
- [ ] "Is Zarr the new COG?" deck (FOSS4G NA 2025 + FOSS4G 2025 shared):
      https://docs.google.com/presentation/d/1puWMKDCvJTdXKyOcioRXeWHxWlwBmfsE8XRQqmzEUPY
      → `20251104-foss4g-na-2025-zarr-new-cog/`, `20251119-foss4g-2025-zarr-new-cog/`
- [ ] State of STAPI decks (no slide links on file at all — locate and archive):
      → `20251120-foss4g-2025-stapi/`, `20251104-foss4g-na-2025-stapi/`,
        `20241204-foss4g-2024-stapi/`
- [ ] vector workshop materials (no deck link on file; repo only):
      → `20251118-foss4g-2025-vector-workshop/`
- [ ] planet-scale raster catalogs slides (GIS in Action 2023 — locate):
      → `20230418-gia-2023-planet-scale-raster-catalogs/`
- [ ] 2014 GIS in Action materials (MODIS talk slides, HydrantTools poster PDF —
      locate in personal archives if they still exist):
      → `20140401-gia-2014-modis-crop-classification/`, `20140401-gia-2014-hydranttools/`

## Recordings

- [ ] "Is Zarr the new COG?" FOSS4G NA 2025 — a recording reportedly exists on
      YouTube; find, verify, and add link → `20251104-foss4g-na-2025-zarr-new-cog/`
- [ ] FOSS4G 2025 Auckland talks (Zarr talk 11-19, STAPI talk 11-20) —
      presentations were recorded and posted to the OSGeo Oceania YouTube
      channel (workshops were NOT recorded); find and add links
- [ ] FOSS4G NA 2025 STAPI talk — check for recording
- [ ] FOSS4G 2024 Belém STAPI talk — check for recording

## Conference pages (lower risk, but pretalx instances do go away)

- [ ] Consider snapshotting the talks.osgeo.org pretalx pages (PDF print or
      single-file HTML) for: KZGHTZ, MN7NCT, TNYSY9, MHHJE7, VFK79A, ASNWTC
      (2025/2024 events), CYWZVB, QEN3RF, A838QC (2026)
- [ ] GIS in Action 2023 sched.com page (already indexed; snapshot recommended):
      https://gisinaction2023.sched.com/event/1LSoB/planet-scale-raster-catalogs-with-stac-photogrammetry-and-imagery-advancements-room-206

## Open metadata gaps

- [ ] exact date of CNG Conference 2025 workshop (currently 2025-05-01 placeholder)
- [ ] exact date of FOSS4G 2024 Belém workshop (currently 2024-12-02) and STAPI
      talk (currently 2024-12-04)
- [ ] exact dates for GIS in Action 2014 (currently 2014-04-01 placeholders)
- [ ] FOSS4G NA 2025 talk pages for the Zarr and STAPI talks (eventUrl missing)
- [ ] FOSS4G 2024 Belém STAPI talk page + original abstract (body currently a
      placeholder summary)
- [ ] CNG Forum 2026 (Oct 6–9, Snowbird UT): Jarrett + Julia Signell confirmed
      as speakers, but session titles not yet published — add delivery page(s)
      once the agenda is public: https://2026.cloudnativegeo.org/
- [ ] second conference for "Anatomy of a file" (only FOSS4G 2026 confirmed)
