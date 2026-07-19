---
title: "On-ramp to CNG"
slug: "cng-2025-on-ramp-to-cng"
date: 2025-05-01
ptype: "workshop"
talks: ["cloud-native raster formats workshop"]
event: "CNG Conference 2025"
eventUrl: "https://web.archive.org/web/20250331202020/https://2025-ut.cloudnativegeo.org/agenda"
location: "Snowbird, UT, USA"
coauthors: ["Alex Leith"]
note: >
  a day-long, three-part workshop: part 1 presented by Alex Leith (Auspatious),
  parts 2–3 presented by Jarrett Keifer (Element 84)
tags: ["cloud-native", "raster", "cog", "zarr", "data-formats", "cng"]
links:
  - name: "slides (gdoc)"
    href: "https://docs.google.com/presentation/d/1oJ48g9Oc-60MlG2_wFTlAHo42SMYFGeiRG66Pc6cr48"
  - name: "github repository"
    href: "https://github.com/cng-raster-formats"
summary: |
  A day-long capacity-building workshop for professionals new to working with
  cloud-native formats and workflows: an introduction to cloud-native
  geospatial for Earth observation, followed by a deep dive into cloud-native
  raster formats.
---

The "On-ramp to CNG" workshop anchored the conference's capacity-building
track for professionals new to working with cloud-native formats and
workflows, delivered in three parts over a full day.

## Part 1: Cloud-Native Geospatial for Earth Observation

*Presented by Alex Leith.*

The cloud native geospatial paradigm has the potential to make Earth
observation analysis accessible to more people, more easily. In the simplest
terms, instead of downloading data before performing an analysis, it's now
possible to stream data directly from the cloud.

This workshop will explore this new capability using hands-on practical
exercises, introducing participants to the incredible global datasets
available online and an opinionated suite of tools that can be used to access
them. At the end of the workshop, participants will have gained insight into
how this cloud-native geospatial paradigm can simplify working with Earth
observation data, along with practical examples to assist in implementing
learnings going forward. The workshop will include a real-world use case
documenting land productivity metrics, which are used as part of monitoring
for the UN Sustainable Development Goal indicators for 15.3.1. We'll explore
this metric using NASA's Harmonized Landsat and Sentinel data accessed through
Earthdata.

## Parts 2–3: Deep Dive into Cloud-Native Geospatial Raster Formats

*Presented by Jarrett Keifer.*

Ever wonder what GDAL is doing under the hood when you read a GeoTIFF file?
Doubly so when the file is a Cloud-optimized GeoTIFF (COG) on a remote server
somewhere? Have you been wondering what this new GeoZarr thing is all about and
how it actually works? Then there's the whole Kerchunk/VirtualiZarr indexing to
get cloud-native access for non-cloud-native data formats, what's that about?

Cloud-native geospatial is all the rage these days, and for good reason. As
file sizes grow, layer counts increase, and analytical methods become more
complex, the traditional download-to-the-desktop approach is quickly becoming
untenable for many applications. It's no surprise then that users are turning
to cloud-based tools such as Dask to scale out their analyses, or that
traditional tooling is adopting new ways of finding and accessing data from
cloud-based sources. But as we transition away from opening whole files to now
grabbing ranges of bytes off remote servers it seems all the more important to
understand exactly how cloud native data formats actually store data and what
tools are doing to access it.

This workshop aims to dig into how cloud-native geospatial data formats are
enabling new operational paradigms, with a particular focus on raster data
formats. We'll start on the surface by surveying the current cloud-native
geospatial landscape to gain an understanding of why cloud native is important
and how it is being used, including:

* the core tenets of cloud-native geospatial formats
* cloud-native data formats for both raster and non-raster geospatial data
* SpatioTemporal Asset Catalogs (STAC) and how STAC is used for raster data
  discovery and access
* high-level tooling like odc-stac that can leverage STAC and Dask to scale
  processing of cloud-native data

Then we'll get hands-on and go deep to build up an in-depth understanding of
how cloud native raster formats work. We'll examine the COG format and read a
COG from a cloud source by hand using just Python, selectively extracting data
from the image without any geospatial dependencies. We'll repeat the same
exercise for geospatial data in Zarr format to see how that compares to our
experience with COGs. Lastly we'll turn our attention to Kerchunk/VirtualiZarr
to see how these technologies might allow us to optimize data access for
non-cloud-native formats.
