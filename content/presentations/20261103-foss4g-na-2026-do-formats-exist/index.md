---
title: "Do formats exist? Towards a unified foundation for data tooling"
slug: "foss4g-na-2026-do-formats-exist"
date: 2026-11-03
# TODO: FOSS4G NA 2026 runs 2026-11-02/04; set exact date and add eventUrl
# once the talk schedule is published
ptype: "talk"
talks: ["do formats exist"]
event: "FOSS4G NA 2026"
location: "Sacramento, CA, USA"
tags: ["data-formats", "cloud-native", "open-source", "wasm"]
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
effort to build format-agnostic data tooling on a shared foundation. In cylf,
codecs can be sandboxed WASM modules that can be specified declaratively and
resolved on demand, whether by registry identifier or by URI, fetched and
executed the same way a browser fetches and runs code from the web. Data
producers declare which codecs their data requires; data consumers resolve and
run them automatically, with no environment setup required and no out-of-band
coordination.

This is more than packaging convenience. Codecs can be registered with metadata
describing their capabilities and target architectures. Clients run them
chained together into pipelines with zero-copy memory sharing. The same model
can extend upward to format drivers and storage drivers, enabling a modular and
decoupled architecture where support for formats, access protocols, and codecs
can be developed independently, each with its own lifecycle. The runtime
handles orchestration, memory, and multithreaded execution, so format drivers
don't have to.

We demonstrate this architecture with COG support and a growing set of WASM
codec implementations, with Parquet support in progress. The project includes a
Python library as a proof of concept. We are seeking collaborators, feedback,
and engagement from the standards and data formats communities to help shape
what we believe could be a unified foundation for the next generation of data
tooling.
