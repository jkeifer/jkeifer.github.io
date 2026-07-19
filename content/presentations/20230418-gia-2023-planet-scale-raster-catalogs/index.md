---
title: "Planet-scale raster catalogs with STAC"
slug: "gis-in-action-2023-planet-scale-raster-catalogs"
date: 2023-04-18
ptype: "talk"
event: "GIS in Action 2023"
eventUrl: "https://gisinaction2023.sched.com/event/1LSoB/planet-scale-raster-catalogs-with-stac-photogrammetry-and-imagery-advancements-room-206"
location: "Portland, OR, USA"
representing: "Element 84"
tags: ["stac", "raster", "cloud-native", "aws"]
---

SpatioTemporal Asset Catalogs (STAC) is a set of standards defining geospatial
metadata, catalog organization, and search APIs. With a growing set of tooling
and support from the open-source community, STAC is making it easier and more
efficient to discover, search, and analyze geospatial data. Element 84 operates
EarthSearch, a STAC catalog of the complete Sentinel-2 archive in
Cloud-Optimized GeoTIFF (COG) format, as part of the Registry of Open Data on
AWS.

This talk will explore STAC and uncover what makes it a powerful technological
foundation for building large data catalogs like Element 84's EarthSearch. An
overview of the EarthSearch architecture will be presented, including
processing items into a STAC catalog using cirrus-geo, and indexing and search
using stac-server.

A key point of the talk will be to examine the value of STAC for cloud-based
workflows. Querying EarthSearch using open-source STAC tooling to discover
scenes and access data chunks will be shown to illustrate this value.
