# Presentation asset archival worklist

Goal: every externally-hosted asset gets archived into its delivery's page
bundle (`content/presentations/<delivery>/`), typically as an exported PDF for
slides or a downloaded video, with the bundle-relative file added to the page's
`links` (e.g. `- name: "slides (pdf)"` / `href: "slides.pdf"`). Keep the
original external link alongside the archive.

## Slides (Google Docs — highest link-rot risk)

- [ ] raster workshop deck (FOSS4G 2024 Belém):
      https://docs.google.com/presentation/d/1qFckA0prY604I4dMkQlF1ZM-QSKS2ou4-YttgGQHzOU/
      → `20241203-foss4g-2024-raster-workshop/`
      (the TNYSY9 pretalx page also has a "Slides (7.9 MB)" attachment — grab that too)
- [ ] raster workshop deck (Oceania virtual, 2025-01-15):
      https://docs.google.com/presentation/d/1k5m2eYV8Tv4YrTAL6pfjmZMhls51cChW_QO1vcXH_0U/
      → `20250115-oceania-2025-raster-workshop/`
- [ ] raster workshop deck (CNG 2025 / FOSS4G NA 2025 / FOSS4G 2025 — shared deck;
      archive once per delivery if the deck changed between them, else once and
      link from each):
      https://docs.google.com/presentation/d/1oJ48g9Oc-60MlG2_wFTlAHo42SMYFGeiRG66Pc6cr48
      → `20250501-cng-2025-on-ramp-to-cng/`, `20251103-foss4g-na-2025-raster-workshop/`,
        `20251117-foss4g-2025-raster-workshop/`
- [ ] "Is Zarr the new COG?" deck (FOSS4G NA 2025 + FOSS4G 2025 shared):
      https://docs.google.com/presentation/d/1puWMKDCvJTdXKyOcioRXeWHxWlwBmfsE8XRQqmzEUPY
      → `20251104-foss4g-na-2025-zarr-new-cog/`, `20251119-foss4g-2025-zarr-new-cog/`
- [ ] State of STAPI decks (no gdoc links on file; the FOSS4G NA 2025 pretalx page
      G3MHUZ has a slides link, and the FOSS4G 2024 GSAVCT page has a
      "Slides (5.6 MB)" attachment):
      → `20251120-foss4g-2025-stapi/`, `20251104-foss4g-na-2025-stapi/`,
        `20241204-foss4g-2024-stapi/`
- [ ] vector workshop materials (no deck link on file; repo only):
      → `20251118-foss4g-2025-vector-workshop/`
- [ ] Pangeo Showcase deck ("Let's solve the problem of object storage"):
      → `20251001-pangeo-showcase-object-storage/`
- [ ] ESIP CCRP deck: → `20260121-esip-2026-ccrp/`
- [ ] planet-scale raster catalogs slides (GIS in Action 2023 — locate in
      personal archives): → `20230418-gia-2023-planet-scale-raster-catalogs/`
- [ ] MODIS talk slides (posted to gisinaction.org as `keifer_gisInAction2.pptx`;
      linked from the archived program page:
      https://web.archive.org/web/20141029194344/http://gisinaction.org/content/program):
      → `20140417-gia-2014-modis-crop-classification/`
- [ ] HydrantTools poster PDF (locate in personal archives; not in conference
      record): → `20140416-gia-2014-hydranttools/`
- [ ] eBAGIS talk slides (GIS in Action 2019 — locate in personal archives):
      → `20190422-gia-2019-ebagis/`
- [ ] Earth-Search STAC API talk slides (no gdoc link on file; the FOSS4G 2024
      pretalx page XHJYEA has a "Slides (8.7 MB)" attachment — grab that):
      → `20241205-foss4g-2024-earthsearch/`

## Recordings (links added to pages; archive local copies)

- [x] find recordings — done; these exist and are linked:
  - FOSS4G 2025 Zarr talk: https://www.youtube.com/watch?v=qF6ZFomRZb4
  - FOSS4G NA 2025 Zarr talk: https://www.youtube.com/watch?v=Tm-mS39f8Kg
    (mirror: https://video.osgeo.org/videos/watch/949935b2-1a53-4eee-9901-2db69e05cb33)
  - FOSS4G 2025 STAPI talk: https://www.youtube.com/watch?v=C18FRsOpQPk
  - FOSS4G 2024 tasking talk: https://video.osgeo.org/videos/watch/c3241f2b-62bb-4894-bb36-9f84b0510f2c
  - Pangeo Showcase object storage talk: https://www.youtube.com/watch?v=66n-wScNBbI
- [ ] download/archive local copies of the five recordings above
- [ ] ESIP 2026 CCRP talk: session recordings are on the ESIP YouTube channel —
      find the "Bridging the Cloud Divide - Part 1" recording and add the link
      → `20260121-esip-2026-ccrp/`
- Confirmed no recording exists: all workshop deliveries (FOSS4G 2024/2025/NA
  2025, CNG 2025 — workshops were not recorded), FOSS4G NA 2025 STAPI talk,
  GIS in Action 2023/2014.
- No recording found (checked OSGeo PeerTube and the FOSS4G YouTube channel;
  not linked from the pretalx page): FOSS4G 2024 Earth-Search talk
  (`20241205-foss4g-2024-earthsearch/`) — recheck periodically in case it's
  mirrored later.

## Conference pages (lower risk, but pretalx instances do go away)

- [ ] snapshot the talks.osgeo.org pretalx pages (PDF print or single-file
      HTML): KZGHTZ, MN7NCT, TNYSY9, MHHJE7, VFK79A, YTCPRS, ASNWTC, G3MHUZ,
      GSAVCT, XHJYEA (2024/2025 events); CYWZVB, QEN3RF, A838QC, MPR9BD, 8ZUPMV (2026)
- [ ] snapshot the GIS in Action 2023 sched.com page:
      https://gisinaction2023.sched.com/event/1LSoB/planet-scale-raster-catalogs-with-stac-photogrammetry-and-imagery-advancements-room-206
- [ ] snapshot the ESIP sched.com page:
      https://2026januaryesipmeeting.sched.com/event/2CXOq/bridging-the-cloud-divide-part-1
- [ ] snapshot the GIS in Action 2019 sched.com page:
      https://gisinaction2019.sched.com/event/KTIH/deployment

## Open metadata gaps

The add-to-calendar button needs `start`/`end` (offset-aware) + a room-level
`address`. The talks below have `address` set but empty `start`/`end` (so the
button stays hidden) pending their published schedules; fill the times to
enable it. Already complete: FOSS4G 2026 raster workshop (2026-08-30 10:00,
Room 601), FOSS4G 2026 vector workshop (2026-08-31 14:00, Room 601), FOSS4G 2026
anatomy-of-a-file & do-formats-exist (2026-09-03, Room 4), and FOSS4G NA 2026
vector workshop (2026-11-02, Tofanelli).

- [ ] CNG Forum 2026 (Oct 6–9, Snowbird): exact "Anatomy of a file" session
      date + agenda URL once published; then fill `start`/`end` (−06:00 MDT) +
      room in `address` for the add-to-calendar button
      → `20261007-cng-forum-2026-anatomy-of-a-file/`
- [ ] FOSS4G NA 2026 "Do formats exist?" talk: exact date + pretalx page once
      the schedule publishes (week of Aug 1, 2026); then fill `start`/`end`
      (−08:00 PST) + room in `address` for the add-to-calendar button (venue
      Sheraton Grand Sacramento already set)
      → `20261103-foss4g-na-2026-do-formats-exist/`
- [ ] GIS in Action 2014 poster session date (conference ran Apr 16–17)
