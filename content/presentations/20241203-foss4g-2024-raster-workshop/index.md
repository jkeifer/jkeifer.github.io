---
title: "Deep Dive into Cloud-Native Geospatial Raster Formats"
slug: "foss4g-2024-raster-formats-workshop"
date: 2024-12-03
ptype: "workshop"
talks: ["cloud-native raster formats workshop"]
event: "FOSS4G 2024"
eventUrl: "https://talks.osgeo.org/foss4g-2024-workshop/talk/TNYSY9/"
location: "Belém, Brazil"
tags: ["cloud-native", "raster", "cog", "zarr", "data-formats"]
links:
  - name: "slides (gdoc)"
    href: "https://docs.google.com/presentation/d/1qFckA0prY604I4dMkQlF1ZM-QSKS2ou4-YttgGQHzOU/"
  - name: "github repository"
    href: "https://github.com/cng-raster-formats"
---

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

This workshop will be presented via a combination of lecture and hands-on code
notebooks.
