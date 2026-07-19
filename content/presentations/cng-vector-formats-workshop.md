---
title: "Exploring Cloud Native Geospatial Data Formats: Vectors"
date: 2025-11-05
ptype: "workshop"
representing: "Element 84"
summary: |
  Dig into geospatial vector formats—including GeoJSON, WKT/WKB, and
  cloud-native GeoParquet—using Python to see in detail how vector features are
  stored in each format and to understand what cloud-native means for vector
  data.
links:
  - name: github repository
    href: "https://github.com/cng-vector-formats"
presentations:
  - conference: "FOSS4G"
    location: "[**FOSS4G** | Auckland, NZ](https://talks.osgeo.org/foss4g-2025/talk/MHHJE7/)"
    date: 2025-11-18
    note: first presentation, a bit experimental
---

Ever wonder what DuckDB is doing under the hood when you open a Parquet table?
How can it so performantly chew through massive amounts data when executing
queries? How can it do so when running over the network against files stored in
object storage?

Cloud-native geospatial is all the rage these days, and for good reason. As
data sizes grow, layer counts increase, and analytical methods become more
complex, the traditional download-to-the-desktop approach is quickly becoming
untenable for many applications. It's no surprise then that users are turning
to cloud-based tools to scale out their analyses, or that traditional tooling
is adopting new ways of finding and accessing data from cloud-based sources.
But as we transition away from opening whole files to now grabbing ranges of
bytes off remote servers it seems all the more important to understand exactly
how cloud-native data formats actually store data and what tools are doing to
access it.

This workshop aims to dig into how cloud-native geospatial data formats are
enabling new operational paradigms, with a particular focus on (Geo)Parquet.
Participants do not need an existing familiarity with Parquet: we'll work
together to develop a understanding of the concepts behind the format, starting
with GeoJSON and progressing from there, roughly as follows:

* GeoJSON: what is it, what does it represent, and how it is not cloud-native
* Well-Known Text/Binary (WKT/WKB): how these vector formats work and why they
  are important in (Geo)Parquet
* (Geo)Parquet: how does parquet store data, how geo maps into that paradigm, and
  what it takes to read some subset of data from a parquet table

The content of this workshop aims to be not only theoretical but practical: a
strong goal is to be as hands-on with these formats as possible by working
with them in Python. We'll eschew common tools, opting to take a more manual
approach where possible. Using the educationally-focused Parquet library
[`por-que`](https://github.com/jkeifer/por-que) will give us a deeper view into
the process of reading Parquet files, their metadata, and techniques used to
performantly run queries. Throughout, we'll be building up working
understanding of what common higher-level tooling does under the hood and
abstracts away from users.

Working through the author's raster formats workshop is an encouraged but
optional prerequisite to this workshop.
