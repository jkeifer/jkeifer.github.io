---
title: "Anatomy of a file"
date: 2026-09-02
summary: |
  What is a file? If
coauthors: ["Julia Signell"]
presentations:
  - location: "**FOSS4G** | Auckland, NZ"
    date: 2025-11-19
    links:
      - name: slides (google)
        href: "https://docs.google.com/presentation/d/1puWMKDCvJTdXKyOcioRXeWHxWlwBmfsE8XRQqmzEUPY"
      - name: talk submission
        href: "https://talks.osgeo.org/foss4g-2025/talk/VFK79A/"
  - location: "**FOSS4G NA** | Reston, VA, USA"
    date: 2025-11-04
    note: "co-presented with Julia Signell"
    links:
      - name: slides (google)
        href: "https://docs.google.com/presentation/d/1puWMKDCvJTdXKyOcioRXeWHxWlwBmfsE8XRQqmzEUPY"
---

What is a file?

* bytes
* data and data encoding
* compression
* metadata
* is a file just a file?

What if this is an interactive exercise? Let's build a file format together?
Say we have some simple data, we have some options how to chunk it, encode it?
We then need to index it.
Can we do this in python? Can we build up a dict or object based parser using struct?

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
