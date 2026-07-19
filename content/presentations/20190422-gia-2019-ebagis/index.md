---
title: "Interfacing ArcGIS Desktop and GIS Server for Web-Based Basin Analysis GIS"
slug: "gis-in-action-2019-ebagis"
date: 2019-04-22
ptype: "talk"
event: "GIS in Action 2019"
eventUrl: "https://gisinaction2019.sched.com/event/KTIH/deployment"
location: "Portland, OR, USA"
coauthors: ["Lesley Bross", "Geoffrey Duh"]
representing: "Portland State University"
note: >
  presented in the "Deployment" session; at the time a Senior Programmer in
  the PSU Geography Department
tags: ["arcgis", "python"]
---

The Center for Spatial Analysis and Research (CSAR) at PSU is currently
engaged in a multi-year agreement with the USDA-NRCS, National Water and
Climate Center (NWCC) to develop a spatial decision support system (SDSS) for
improving water forecast accuracy. One of the goals of the SDSS is to make the
GIS data used in the analysis available to government and public users. We
designed and developed a data repository framework (eBAGIS) that integrates
the geoprocessing capabilities of an existing desktop basin analysis GIS
(BAGIS) and an internet-based GIS server to share the basin analysis GIS data.
This presentation introduces the PostgreSQL-based GIS repository developed in
Django, a high-level Python web framework, and the REST APIs developed for
interfacing with ArcGIS Desktop addins implemented with VB .NET framework. The
internet GIS repository allows NWCC water supply forecasters and hydrologists
to upload their basin analysis GIS data created on their desktop ArcMap and
share these data with water managers and the public over the internet.
