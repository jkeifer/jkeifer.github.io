---
title: "Is Zarr the new COG?"
slug: "foss4g-2025-is-zarr-the-new-cog"
date: 2025-11-19
ptype: "talk"
talks: ["is zarr the new cog"]
event: "FOSS4G 2025"
eventUrl: "https://talks.osgeo.org/foss4g-2025/talk/VFK79A/"
location: "Auckland, NZ"
coauthors: ["Julia Signell"]
tags: ["zarr", "cog", "cloud-native", "data-formats"]
links:
  - name: "recording (youtube)"
    href: "https://www.youtube.com/watch?v=qF6ZFomRZb4"
  - name: "slides (gdoc)"
    href: "https://docs.google.com/presentation/d/1puWMKDCvJTdXKyOcioRXeWHxWlwBmfsE8XRQqmzEUPY"
summary: |
  Zarr is gaining traction in geospatial workflows—but is it replacing COG,
  complementing it, or something else entirely? We’ll unpack the formats’
  shared foundations, explore their tradeoffs, and offer a path toward better
  community guidance, tooling, and support.
---

Cloud-Optimized GeoTIFF (COG) and Zarr have each earned their place in modern
geospatial workflows. While often framed in opposition—raster vs. analysis,
imagery vs. data cube—they are in fact deeply complementary. In this talk,
we’ll unpack how they address similar challenges from different angles, and why
they should be considered parts of a shared toolkit rather than competing
paradigms.

We’ll highlight where Zarr and COG overlap, where they differ, and how
decisions around chunking, compression, tiling strategies, and metadata design
affect both formats. We'll discuss implementation pitfalls, emerging best
practices, and the still-unanswered questions that data producers and tool
builders face.

More than a comparison, this talk is a call to action: the community lacks
clear guidance and consistent support for practitioners working to produce data
in either format. We’ll highlight concrete gaps in the tooling landscape, share
ideas from our own work on how to improve decision-making and best practices,
and invite others to collaborate on building a healthier, more cooperative open
geospatial data ecosystem.
