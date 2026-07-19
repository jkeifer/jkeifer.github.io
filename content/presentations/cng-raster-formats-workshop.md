---
title: "Exploring Cloud Native Geospatial Data Formats: Hands-on with Raster Data"
date: 2025-11-05
ptype: "workshop"
links:
  - name: github repository
    href: "https://github.com/cng-raster-formats"
presentations:
  - location: "**FOSS4G** | Auckland, NZ"
    date: 2025-11-17
    links:
      - name: slides (gdoc)
        href: https://docs.google.com/presentation/d/1oJ48g9Oc-60MlG2_wFTlAHo42SMYFGeiRG66Pc6cr48
      - name: conference page
        href: https://talks.osgeo.org/foss4g-2025/talk/KZGHTZ/
  - location: "**FOSS4G NA** | Reston, VA"
    date: 2025-11-03
    links:
      - name: slides (gdoc)
        href: https://docs.google.com/presentation/d/1oJ48g9Oc-60MlG2_wFTlAHo42SMYFGeiRG66Pc6cr48
      - name: conference page
        href: https://talks.osgeo.org/foss4g-na-2025/talk/MN7NCT/
  - location: "**CNG Conference** | Snowbird, UT"
    date: 2025-05-01
    title: "CNG for EO and Deep Dive into Cloud-Native Geospatial Raster Formats"
    note: co-presented with Alex Leith as part of a broader workshop on cloud-native geo
    links:
      - name: slides (gdoc)
        href: https://docs.google.com/presentation/d/1oJ48g9Oc-60MlG2_wFTlAHo42SMYFGeiRG66Pc6cr48
      - name: conference page
        href: https://conference.cloudnativegeo.org/CNGConference2025#/workshops
  - location: "Virtual workshop for an Oceania geospatial user group"
    date: 2025-01-15
    links:
      - name: slides (gdoc)
        href: https://docs.google.com/presentation/d/1k5m2eYV8Tv4YrTAL6pfjmZMhls51cChW_QO1vcXH_0U/
  - location: "FOSS4G | Belém, Brazil"
    date: 2024-12-01
    title: Deep Dive into Cloud-Native Geospatial Raster Formats
    links:
      - name: slides (gdoc)
        href: https://docs.google.com/presentation/d/1qFckA0prY604I4dMkQlF1ZM-QSKS2ou4-YttgGQHzOU/
      - name: conference page
        href: https://talks.osgeo.org/foss4g-2024-workshop/talk/TNYSY9/
---

Ever wonder what GDAL is doing under the hood when you read a GeoTIFF file?
Doubly so when the file is a Cloud-optimized GeoTIFF (COG) on a remote server
somewhere? Have you been wondering what this Zarr thing is all about and
how it works? Then there's the whole Kerchunk/VirtualiZarr indexing to
get cloud-native access for non-cloud-native data formats, what's that about?

Cloud-native geospatial is all the rage these days, and for good reason. As
data sizes grow, layer counts increase, and analytical methods become more
complex, the traditional download-to-the-desktop approach is quickly becoming
untenable for many applications. It's no surprise then that users are turning
to cloud-based tools to scale out their analyses, or that traditional tooling
is adopting new ways of finding and accessing data from cloud-based sources.
But as we transition away from opening whole files to now grabbing ranges of
bytes off remote servers it seems all the more important to understand exactly
how cloud native data formats actually store data and what tools are doing to
access it.

This workshop aims to dig into how cloud-native geospatial data formats are
enabling new operational paradigms, with a particular focus on raster data
formats. We'll start on the surface by surveying the current cloud-native
geospatial landscape to gain an understanding of why cloud native is important
and how it is being used, including:

* the core tenets of cloud-native geospatial data formats
* cloud-native data formats for both raster and non-raster geospatial data
* introduction to SpatioTemporal Asset Catalogs (STAC) and how higher-level
  STAC-based tooling can leverage cloud-native formats for efficient raster
  data access processing of cloud-native data

Then we'll get hands-on and go deep to build up an in-depth understanding of
how cloud native raster formats work. We'll examine the COG format and read a
COG from a cloud source by hand using just Python, selectively extracting data
from the image without any geospatial dependencies. We'll repeat the same
exercise for geospatial data in Zarr format to see how that compares to our
experience with COGs. Lastly we'll turn our attention to Kerchunk/VirtualiZarr
to see how these technologies allow us to optimize data access for
non-cloud-native formats.
