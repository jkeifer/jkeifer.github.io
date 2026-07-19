---
title: "Let's solve the problem of object storage"
slug: "pangeo-showcase-2025-object-storage"
date: 2025-10-01
ptype: "talk"
event: "Pangeo Showcase"
eventUrl: "https://discourse.pangeo.io/t/pangeo-showcase-lets-solve-the-problem-of-object-storage-october-1-2025-at-12-pm-et/5417"
location: "virtual"
tags: ["ccrp", "cloud-native", "zarr", "cog", "data-formats"]
links:
  - name: "recording (youtube)"
    href: "https://www.youtube.com/watch?v=66n-wScNBbI"
---

Object storage transformed data at planetary scale, giving us cheap, durable,
elastic storage. But in geospatial, it also turned chunking into everyone's
problem. Misaligned queries waste time, compute, and money, while producers
struggle to optimize datasets for all users. This talk reframes our problems
with chunking as a limitation of the object model itself. We'll look at why
object storage makes chunking visible, what that means for usability and
efficiency, and how the Coalesced Chunk Retrieval Protocol (CCRP) could
restore transparent, efficient access — this time at cloud scale.

For the full story behind CCRP, see the blog post
[Redefining cloud native with the Coalesced Chunk Retrieval Protocol]({{< ref "/posts/20250923-ccrp" >}}).
