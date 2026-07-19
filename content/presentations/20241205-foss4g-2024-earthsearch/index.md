---
title: "Earth-Search: A STAC API of Open datasets on AWS"
slug: "foss4g-2024-earth-search-stac-api"
date: 2024-12-05
ptype: "talk"
event: "FOSS4G 2024"
eventUrl: "https://talks.osgeo.org/foss4g-2024/talk/XHJYEA/"
location: "Belém, Brazil"
affiliation: "Element 84"
tags: ["stac", "raster", "cloud-native", "aws", "cog"]
links:
  - name: "slides (pdf)"
    href: "https://talks.osgeo.org/media/foss4g-2024/submissions/XHJYEA/resources/2024_FOSS4G_-_Earth-Search_and_Public_Datasets_NFl1DAw.pdf"
---

Earth-Search is a publicly-accessible SpatioTemporal Asset Catalog (STAC)
index and API providing data discovery and access for several major
geospatial data collections as part of the AWS Registry of Open Data (RODA),
including Sentinel-1, Sentinel-2, Landsat Collection 2, and NAIP imagery.
Items are backed by data assets accessible in cloud-native formats such as
Cloud-Optimized GeoTIFF (COG).

This talk will provide an overview of the Earth-Search STAC catalog, how to
search it to discover items, and how best to access the backing data assets.
We'll look at recent changes to catalog and discuss the progress and
challenges of the Sentinel-2 reprocessing/reindexing effort. We'll also
briefly discuss the architecture of the data orchestration pipeline and what
open source tooling underlies its operation.
