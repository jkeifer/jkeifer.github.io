---
title: "Anatomy of a file"
slug: "cng-forum-2026-anatomy-of-a-file"
date: 2026-10-07
# TODO: conference runs 2026-10-06/09; set exact session date once the CNG
# Forum 2026 agenda is published
ptype: "talk"
talks: ["anatomy of a file"]
event: "CNG Forum 2026"
eventUrl: "https://2026.cloudnativegeo.org/"
location: "Snowbird, UT, USA"
# TODO: fill start/end once the CNG Forum 2026 schedule is published
start: ""
end: ""
address: "Snowbird Ski and Summer Resort, 9385 S Snowbird Center Dr, Snowbird, UT 84092, USA"
affiliation: "Element 84"
tags: ["data-formats", "cloud-native", "raster", "vector", "cng"]
summary: |
  Raster, vector, point cloud: every geospatial format solves the same core
  problems, including linearization, chunking, compression, and metadata. Let's
  build a format from scratch to see these concerns in practice.
---

Every geospatial format exists to solve the same fundamental problem: how do we
persist spatial (and sometimes temporal) data so it can be efficiently stored,
shared, and queried? These concerns apply to all data types: raster, vector,
point cloud, etc. Yet as a community, we often treat formats as islands, each
with its own ecosystem, tooling, and mental model.

In this talk, we start from data. We have geospatial data and we need to
persist it. How do we linearize multidimensional data into bytes? How do we
chunk it for partial reads? Are we going to support writing in parallel? What
encoding and compression strategies will we use and what tradeoffs do they
carry? As we work through these questions, the need for metadata
arises—coordinate systems, data types, spatial indices, encoding
indicators—because without it, the data is useless. Piece by piece, we build up
the anatomy of a file.

We then map what we've built to real formats. The same structures appear in
each: chunking strategies, index structures, encoding schemes, metadata
organization. The specific tradeoffs differ, but the underlying anatomy is
consistent across raster, vector, and beyond.

This consistency raises a question worth confronting: if formats share this
much of their architecture, why does our tooling treat them as fundamentally
different things? Perhaps we should be recognizing our ecosystems have built
walls around format tradeoffs that the underlying anatomy doesn't justify.
