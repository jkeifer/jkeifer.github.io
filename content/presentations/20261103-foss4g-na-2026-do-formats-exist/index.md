---
title: "Do formats exist? Towards a unified foundation for data tooling"
slug: "foss4g-na-2026-do-formats-exist"
date: 2026-11-03
eventUrl: "https://talks.osgeo.org/foss4g-na-2026/talk/8UWAYU/"
ptype: "talk"
talks: ["do formats exist"]
event: "FOSS4G NA 2026"
location: "Sacramento, CA, USA"
start: "2026-11-03T11:00:00-08:00"
end: "2026-11-03T11:25:00-08:00"
address: "Sheraton Grand Sacramento, 1230 J St, Sacramento, CA 95814"
affiliation: "Element 84"
tags: ["data-formats", "cloud-native", "open-source", "wasm"]
links:
  - name: "slides (gdoc)"
    href: "https://docs.google.com/presentation/d/1h2rURRCmRC90JEH8kKoGEoxYZD24AmwBviKnnSJdo8c"
summary: |
  What if data formats didn't need their own libraries? The cylf ecosystem
  leverages WebAssembly to make codecs, format drivers, and storage drivers
  modular, sandboxed, and fetchable on-demand. Each can be developed
  independently and on its own lifecycle. We'll demo a working proof of
  concept.
---

Zarr, Parquet, COG: we treat different formats as distinct, each requiring its
own libraries, its own codecs, its own tooling. But look closer: each one
chunks data, encodes those chunks, linearizes them into a stream, and attaches
metadata that explains how to read it back. The differences are real, but they
are surface-level. The underlying structure is shared. If that's true, why do
we build tooling as if these formats are fundamentally different things?

The cylf ecosystem takes this question seriously. It is a new open-source
effort to build a shared, format-agnostic codec layer. Codecs are specified
declaratively and resolved on demand from a bundled native standard library, or
as sandboxed WASM modules fetched by registry identifier or by URI, the same
way a browser fetches and runs code from the web. Data producers declare which
codecs their data requires; consumers resolve and run them automatically, with
no environment setup, no out-of-band coordination, and no need to trust the
codec author.

Codecs compose into pipelines defined as JSON DAGs, with typed ports and
explicitly declared encode and decode directions. Asymmetric codecs, where the
two directions have genuinely different shapes, are wired naturally rather than
inverted by the runtime. Data copies are accounted for at every step boundary,
down to zero where adjacent steps use native implementations. Looking further
out, the same model could extend upward to format and storage drivers, letting
formats, access protocols, and codecs each evolve on their own lifecycle.

The project includes a spec and a Python proof-of-concept library, both
developed with partial support from the NASA-IMPACT VEDA project. We demo the
library with COG encode and decode, with Parquet as the next target. Along the
way we present a survey of 60+ codecs across Zarr, TIFF, Parquet, ORC, HDF5 and
others with their signatures and composition properties, and a taxonomy of what
those codecs must know about the data—bytes only, stride, dtype, or full
dimensional structure—which is where our answer to the opening question comes
from. We also present preliminary benchmarks, including one result that turned
out to measure something quite different from what we set out to measure. We
are seeking collaborators, critical feedback from the standards and data
formats communities, and institutional support to build a native reference
runtime.
