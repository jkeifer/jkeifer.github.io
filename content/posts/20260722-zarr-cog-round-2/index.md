---
title: "Is Zarr the new COG? Round 2!"
url: /posts/2026/07/22/is-zarr-the-new-cog-round-2
date: 2026-07-22T12:00:00-00:00
lastmod: 2026-07-22T12:00:00-00:00
draft: false
summary: |
  We revisit the question: is Zarr the new COG? We review changes from the past
  year and discuss the shrinking gap between the two data formats.
note: |
  This post was originally published on the [Element 84
  blog](https://element84.com/blog) where you can also find other related
  content. Images of the formats holding hands created by [Julia Signell](https://github.com/jsignell).
tags:
  - raster
  - cog
  - zarr
  - array
  - data-formats
  - metadata
  - geotiff
  - cylf
toc: false
showSummary: true
showRelated: true
canonicalUrl: https://element84.com/software-engineering/is-zarr-the-new-cog-round-2/
image: zarr-vs-cog.svg?bg=fff
---

Still no, sorry. A little over a year ago Julia and I asked, "Is Zarr the new
COG?". We had the same answer then, it was our answer nine months ago when we
wrote about metadata, it was my answer at the beginning of this paragraph, and
it is still my answer: no. But a lot has happened in the last year and change,
so it seems worth asking again: has Zarr evolved enough to replace COG? Has
Zarr become the "superior" data format? Is Zarr the new COG now?

You'd be forgiven for thinking the answer *could* have changed, because,
honestly, I even started to think that *maybe* it *had*. In fact, the reasoning
behind the "no" has materially changed; while Zarr vs COG is still technically
an apples-and-oranges comparison, it doesn't feel quite so much like it
anymore. A year ago, Zarr was missing concrete capabilities that COG users
depend on: a standard way to express geospatial metadata, overviews or any
clear equivalent for performant visualization, and a compatibility story.
Today, much of the gap has closed, and closed far faster than I could have ever
expected. What remains is primarily not a feature gap, but rather something
conceivably more akin to a "history gap".

The question still lingers: is Zarr the new COG? Let's first take stock of
where we landed when Julia and I first asked that question. Then we can review
what's changed, what's stayed the same, and how, specifically, the gap has
shrunk. We'll end discussing what's left, and why I think this isn't
necessarily the best question to be asking, despite it being an effective title
and narrative device. My answer, as I've made clear, is still no, and, quite
possibly, will always be no. But, with the way things now stand, I think no may
actually be the right answer.

## Where we left off

In our posts Julia and I never explicitly composed a clear feature matrix
comparing COG and Zarr. We did have a table in our FOSS4G/FOSS4G NA talks that
started to converge on something in this vein. I've taken the liberty to flesh
that matrix out further, to give us a clear summary of the differences between
the two formats, specifically as it was (or as I remember it, at least) at the
time of the original post. This table is my take on the most important
dimensions to classify, curated intentionally (the confusing "declarative,
self-describing description" is confusing on purpose, I promise); you might
have a different view, and that's okay (and let me know if you think I am
missing anything important). ✅ means the format supports a feature, natively,
in-the-box. ⛔️ means the format alone has no reasonable means of supporting a
feature. ⚠️ is something between these two extremes, while 🤷, well, that
speaks for itself I think.

| Feature | COG, a year ago | Zarr, a year ago |
| :---- | :---- | :---- |
| N-dimensional arrays | ⚠️ 3D, but 2D in practice | ✅ native |
| Datacube assembly | ⛔️ outside the format | ✅ native |
| Declarative, self-describing description | ⛔️ opaque, externally-defined tags | ✅ it's JSON |
| Extensibility | ⛔️ TIFF is effectively frozen, COG adds even more structure on top | ⚠️it's JSON |
| Codified geospatial metadata | ✅ GeoTIFF, standardized since 1994 | ⛔️ none standard; informal only |
| Visualization | ✅ the IFD-chain convention for overviews | ⛔️ none standard |
| Single-file portability | ✅ yes, it's a file | 🤷♀️it's a filesystem tree, but maybe? |
| Compatibility / interoperability | ✅ everywhere | ⛔️ varying degrees of nascent |

Notably, this matrix highlights what is dissimilar, leaving out where they are
equal. Remember, as we showed in the first ["Is Zarr the new
COG?"](zarr-cog-round-1) post, these are both array formats that store the same
bytes on disk. The real differences effectively boil down to the [metadata
format and what that format can express](metadata), and the structure and
organization of bytes on disk (which, in my opinion, also boils down to a mere
difference in metadata).

Also note: this is not a scoreboard. Having all greens in a column may not be
valuable nor a worthy goal. But more on that later; now, let's walk through
each of these categories to see what they're all about and to see how much has
or hasn't changed over the past year.

### N-dimensional arrays

Nothing much happened here, as expected. COG, for a single file, is still
effectively 2D; TIFF can theoretically support anything one could want via
multiple Image File Directories (IFDs), but in practice—especially with COG's
constraints on the purpose of IFDs—2D is common, 3D not so much. Beyond three
dimensions one should probably just use Zarr.

Zarr declares the shape of an array using a…well, a JSON array, which is
effectively unbounded in length, giving it support for true N-dimensional
shapes:

```json
{
  "shape": [3, 145, 10980, 10980, ...],
  ...
}
```

I said not much happened: one interesting thing that *did* happen is GDAL 3.11
adding support to the COG driver for tile-level interleaving, in addition to
the common band and pixel options (technically this feature dropped in early
May 2025, shortly before our original post, but I was unaware of it then). [The
docs note](https://gdal.org/en/stable/drivers/raster/cog.html) "such a layout
may be useful for writing hyperspectral datasets
(several hundred of bands), to get a compromise between efficient spatial
query, and partial band selection." COG is really quite stable and slow-moving,
but that's not to say no new ideas are possible.

**Assessment:** COG still ⚠️ 3D, but 2D in practice, though tile interleaving is
interesting. Zarr, still ✅ native.

### Datacube assembly

I debated about including this row in the table. Early drafts included two
different concerns, multiple variables/grouping and appendability/updatability,
which, on the surface, seem to have little to do with one another. The more I
thought about them though, the more I came to the conclusion that these
concerns are two consequences of one question: what is the physical
relationship between a format's metadata and the bytes described by that
metadata? The answer to that question effectively defines what "datacube
assembly" means for a given format, and datacube assembly touches both grouping
and updates.

Let's start by recapping the appendability/update support of these formats.
None of this has changed in the past year, so we'll keep this part brief.

COG, in practice, is essentially read only. Files generally cannot be updated
in place, because the spec mandates that all metadata be included at the
beginning of the file, such that updating the metadata to append more data
requires rewriting the whole file (one can, if they know they will need to
update, write a COG with empty space between the IFDs and data, to allow
in-place updates, but tooling to do this would have to be custom today).

Zarr, conversely, doesn't require chunks be grouped into a larger "write unit":
chunks can be managed/appended/updated independently, and metadata can be
updated in place without having to touch data. This ability is enabled by
Zarr's physical decoupling of metadata bytes from data bytes. In fact, adding
or updating chunks doesn't have to update Zarr's metadata at all (because Zarr
does not maintain a chunk index, instead deferring to the storage layer to
track that index via predictable chunk file paths; sharding adds a bit of a
wrinkle but I won't touch that here).

When it comes to multiple variables and grouping them into a datacube, a Zarr
store *is* a datacube. That, of course, is a core point of the format. It
accomplishes this by using zarr.json metadata files to describe arbitrary trees
of objects. COG? Not so much. TIFF's metadata describes a single file, the one
containing it, and we've already established the limits of what can and can't
be modeled well with a single COG.

Yet there *are* effective ways to build datacubes with TIFF/COG:

* [GDAL VRTs](https://gdal.org/en/stable/drivers/raster/vrt.html)
* STAC in Xarray (via [odc-stac](https://odc-stac.readthedocs.io/en/latest/),
  [stackstac](https://stackstac.readthedocs.io/en/latest/),
  [intake-stac](https://intake-stac.readthedocs.io/en/latest/),
  [easystac](https://easystac.readthedocs.io/en/latest/),
  [lazycogs](https://developmentseed.org/lazycogs/)…)
* [Rasteret](https://terrafloww.github.io/rasteret/)
* [tacoTIFF](https://github.com/tacofoundation/tacoTIFF)
* [virtual-tiff](https://virtual-tiff.readthedocs.io/en/latest/)
* [osml-imagery-io](https://github.com/awslabs/osml-imagery-io)

VRTs and datacubes from STAC have been a thing for a while, so I'm going to
skip over those. The latter items in this list are more interesting; all four
of which have grown into real things worth talking about over the last year.

Rasteret and tacoTIFF both come out of the AI/ML space, and are similar in
their goals: make repeated reads of many TIFF files much more performant. Both
extract TIFF metadata from many files and cache it all into a database to build
a persistent index over many files, i.e., a datacube. Rasteret has its own
tooling, where tacoTIFF takes the approach of being a GDAL driver. This
approach is not dissimilar to kerchunk/virtual Zarr on top of TIFF, which
effectively also extract and cache TIFF metadata and chunk locations, but they
do so by reprojecting TIFF metadata into the Zarr model and leveraging Zarr's
    tooling. Rasteret and tacoTIFF instead keep the metadata TIFF-shaped to
    retain compatibility with traditional TIFF tooling.

On the virtual Zarr front, virtual-tiff and osml-imagery-io are both notable
additions. Zarr's standard codecs are not 100% compatible with TIFF, notably
because the Zarr delta codec calculates its delta after linearizing an array to
a single dimension, where TIFF's equivalent predictor 2 acts along the
horizontal dimension of an array, resetting after every row. virtual-tiff
addresses this gap with a custom Zarr codec emulating the same predictor 2
behavior, and also includes all the tooling required to read COG/TIFF metadata
(via [async-tiff](https://developmentseed.org/async-tiff/latest/)) and
reproject it into the Zarr metadata format, complete with support for overviews
via Zarr multiscales (but more on that later). osml-imagery-io has a slightly
different aim, with a core focus on providing cloud support via virtual Zarr
for the National Imagery Transmission Format (NITF) format. That said, it also
    includes COG/GeoTIFF support (and JPEG 2000 files), again with a custom
    codec to address the TIFF predictor 2 incompatibility.

What's clear from all these tools is that COGs can be composed into a datacube,
even if a single COG cannot model a datacube itself. These tools make such
composition possible by providing a means of building a metadata store *across*
COGs, external to each. In such an arrangement, a COG effectively represents a
group of dataset chunks managed as a single write unit, meaning that we *can*
support appends and updates as long as they align with the shape of individual
COGs.

**Assessment:** COG, by itself, has no solution to these concerns ⛔️ outside the
format. Other tools can combine with COG to get a ✅, but we're not really
evaluating that, are we? Zarr, still ✅ native; but maybe this is a place where
*composability* is more valuable than native support? Food for thought.

### Declarative, self-describing description

We often talk about file formats as being "self-describing"; TIFF is a clear,
early example of this (and if you really want to fall down the rabbit hole like
we did, go check out Julia's and my post on the [history of chunks in array
formats](chunking-part-2)). That is, it includes metadata in the file that
describes the data in
the file and how to read it, via TIFF tags, as defined in the TIFF
specification.

Except TIFF's self-description is, er, not well described. I can't, for
instance, print the first whatever bytes of a COG file and have any clue what
is in the file (though, if you want to get closer to being able to read those
bytes with your eyes, check out the COG exercise in [my CNG raster format
workshop](https://github.com/jkeifer/cng-raster-formats)). To make sense of the
metadata, I have to consult the TIFF specification, to know what IFDs are, how
they are structured, and what the tag IDs even mean. Actually using them to
read data from the file requires yet more spec-level knowledge, to understand
how to compose the tag values together into the proper sequence of data
decoding operations.

Zarr, on the other hand, has human-readable metadata because it uses JSON, a
plain text format, to store it. Within that JSON it uses descriptive key names,
preferring to make meanings clear to the uninformed reader, rather than
deferring to more compact but entirely opaque codes. And Zarr's metadata model
takes full advantage of JSONs data structures, to declaratively specify things
like the order of codecs applied to the data, making decoding significantly
less reliant on out-of-band knowledge about how to compose various bits of
metadata together to read the data.

(Again, go check out the [metadata post](metadata) for a deeper dive into all of
this.)

This is what I mean about "self-describing description": not only is Zarr's
metadata self-describing what is in the store, it also describes *itself*.

And we do have meaningful change here: [the Conventions
idea](https://github.com/zarr-conventions/zarr-conventions-spec) that came out
of the Zarr summit in October 2025 describes yet another layer of the metadata.
Now, users can add custom-yet-not-arbitrary metadata to Zarr, describing it via
the Convention extension point. Conventions effectively open up the
specification to anyone, onto which they can build the bits and pieces they
want, specified in a way that enables others to adopt the same and to build
interoperability around a shared need.

TIFF has nothing quite comparable in-the-box. GDAL bolts a slab of
self-describing XML into a TIFF tag to carry its own metadata; GeoTIFF had to
invent a whole private enumeration mechanism (GeoKeys) to express reference
systems and grid transforms. Such is the power of building one's metadata
description on top of a common, flexible, and standardized format rather than a
custom binary format (an aside: we see parquet use thrift for this same reason,
it provides a way to build a binary metadata format from a flexible set of
description abstractions; just pointing out this property isn't limited to
text-based formats like JSON).

**Assessment:** COG, yep, still ⛔️ opaque, externally-defined tags. Zarr,
✅ still JSON, now with Conventions! If I were giving out points (and I'm not),
Zarr would get one, conventions have been a clear turning point for the format.

### Extensibility

Extensibility is a dimension we didn't evaluate a year ago, because a year ago
we had nothing to evaluate. What do I mean by that? Allow me to more precisely
define extensibility here: can users and tooling authors add new capabilities
to a format without breaking it, without central permission, and without
colliding with each other? A year ago, neither COG nor Zarr offered
extensibility in accordance with this definition.

For COGs, nothing really changed. The GDAL 3.11 tile-interleaving change is
about it, and classifying that as extensibility is a stretch. The thing is,
TIFF is an extremely extensible format via custom tags, enum values, private
IFDs (as used by EXIF, for example), you name it. It's just not extensible in a
way that matches my definition above; using any of these mechanisms will break
compatibility and risk collisions (cue the obligatory TIFF joke "Thousands of
Incompatible File Formats"). The community has recognized this, and every time
fragmentation threatened the usability of TIFF, the answer was to constrain, to
freeze on a blessed profile: TIFF classes in 1988, Baseline TIFF in 1992,
GeoTIFF in 1995. TIFF's main remaining extension point, IFDs, is reserved by
COG exclusively for overviews, the fourth freeze in this sequence. Sure, one
could get creative with a COG and do some crazy things…but then it wouldn't
really be a COG, would it?

Zarr, on the other hand, has changed wildly. I've already mentioned how:
Conventions.

Conventions are the first array-format extension model with the properties we
actually want: namespaced, versioned, self-describing, schema-validated,
advertised in the metadata, and requiring nobody's permission. And the
significance is not hypothetical; in nine months we already have many
Conventions defined, including this notable subset I think are particularly
interesting:

* [proj](https://github.com/zarr-conventions/proj) for CRS metadata (covered
  below)
* [spatial](https://github.com/zarr-conventions/spatial) for spatial coordinate
  information (covered below)
* [multiscales](https://github.com/zarr-conventions/multiscales) for
  reduced-resolution pyramids (covered below)
* [CF](https://github.com/zarr-conventions/CF) for CF conventions
* [dependent-arrays](https://github.com/zarr-conventions/dependent-arrays) to
  express relationships between arrays
* [dggs](https://github.com/zarr-conventions/dggs) enabling the storage of
  discrete global grid system data
* [stac](https://github.com/zarr-conventions/stac) to put STAC metadata in Zarr
* And plenty exist outside the zarr-conventions organization, e.g.
  [geo-embeddings](https://github.com/geo-embeddings/embeddings-zarr-convention),
  [zarr-coords](https://medium.com/@christophe.noel/zarr-coords-convention-65036eeab7b4)

Sure, everything on this list is an early version, at proposal or pilot
maturity. But to see such a variety of Conventions spanning georeferencing,
climate science, DGGS, cataloging, and ML/embeddings, in under a year, from a
community that spent years failing to ship a GeoZarr spec…the velocity is the
story, not the maturity.

**Assessment:** COG, still ⛔️ TIFF is effectively frozen, COG adds even more
structure on top. But maybe that's a good thing? Zarr, now ✅ clear Convention
framework, young but proven (6+ shipped in less than 1 year)!

### Codified geospatial metadata

When Julia and I wrote our metadata post last November, the Zarr community had
just codified its Conventions framework. We were optimistic. That optimism has
been justified faster than I could have imagined.

GeoZarr, the effort to standardize geospatial metadata in Zarr the way GeoTIFF
did for TIFF, had stalled for years under the weight of trying to satisfy
everyone at once. Conventions broke the logjam. Within weeks of the framework
landing we saw `proj` (CRS via EPSG/WKT2/PROJJSON, modeled on the STAC
Projection extension) and `spatial` (spatial coordinate metadata generally).
For those of us with data happily projected into a simple affine transform, the
pair of these two Conventions solved for Zarr what GeoTIFF solved for TIFF in
the 90s. In fact GDAL already supports both these Conventions, as of the 3.13
release.

Here's an example of `proj` and `spatial` Convention attributes from a Sentinel
2 scene in Zarr format:

```json
{
  "spatial:dimensions": ["y", "x"],
  "spatial:bbox": [600000.0, 4990200.0, 709800.0, 5100000.0],
  "spatial:transform_type": "affine",
  "spatial:transform": [10.0, 0.0, 600000.0, 0.0, -10.0, 5100000.0],
  "spatial:shape": [10980, 10980],
  "spatial:registration": "pixel",
  "proj:code": "EPSG:32610",
  "zarr_conventions": [
    {
      "uuid": "689b58e2-cf7b-45e0-9fff-9cfc0883d6b4",
      "schema_url": "https://raw.githubusercontent.com/zarr-conventions/spatial/refs/tags/v0.1/schema.json",
      "spec_url": "https://github.com/zarr-conventions/spatial/blob/v0.1/README.md",
      "name": "spatial:",
      "description": "Spatial coordinate information"
    },
    {
      "uuid": "f17cb550-5864-4468-aeb7-f3180cfb622f",
      "schema_url": "https://raw.githubusercontent.com/zarr-conventions/proj/refs/tags/v0.1/schema.json",
      "spec_url": "https://github.com/zarr-conventions/proj/blob/v0.1/README.md",
      "name": "proj:",
      "description": "Coordinate reference system information for geospatial data"
    }
  ]
}
```

COG via GeoTIFF supports some geospatial metadata these Conventions do not.
Rational Polynomial Coefficients (RPCs) are supported via `RPCCoefficientTag`,
though camera models are not. The `ModelTiepointTag` provides a mechanism to
encode an arbitrary number of tie points for things like Ground Control Points
(GCPs) to facilitate warping/rubber sheet transformations; the ability to
specify a transformation algorithm is notably missing.

Yet, with the authoring of two Conventions, Zarr could support both of these
better than COG. Interestingly, the aforementioned osml-imagery-io project
includes support for NITF RPCs in the virtual Zarrs it constructs: RPC data is
being read into the ecosystem, it's just that no one has yet standardized how
to store it. Zarr also has the `CF` and `dggs` Conventions, which provide *two*
means of specifying positional metadata that GeoTIFF and thus COG cannot
accommodate.

**Assessment:** COG, still ✅ GeoTIFF, standardized since 1994. Zarr, now with
✅ `proj` / `spatial` / `CF` / `dggs` Conventions (RPCs/tie-points still open,
but now tractable)!

### Visualization

As has already been said repeatedly, COG codifies additional TIFF IFDs to be
overview images, providing reduced resolution pyramids for more efficient and
thus quick reads of data for performant visualizations. Combining those
overviews with partial reads via tiles, COG is an excellent format to back any
visualization needs. And it better be: it was *designed* for this.

Zarr, conversely, was designed for analysis, where the native resolution is the
only thing that matters, and visualization is an afterthought. Attempts had
been made to piece together a performant visualization strategy for Zarr,
including using [Xarray's
DataTrees](https://docs.xarray.dev/en/stable/user-guide/hierarchical-data.html)
to emulate the same structure that COG overviews provide. Yet the problem was
how to encode this into Zarr in a way that allowed interoperability and wasn't
just another one-off. Enter the `multiscales` Convention, a declarative way to
define the hierarchical relationships between a set of Zarr groups that form
pyramids, like a COG's overviews but with greater control, specificity, and
explicitness:

```json
{
  "zarr_conventions": [
    {
      "uuid": "d35379db-88df-4056-af3a-620245f8e347",
      "schema_url": "https://raw.githubusercontent.com/zarr-conventions/multiscales/refs/tags/v0.1/schema.json",
      "spec_url": "https://github.com/zarr-conventions/multiscales/blob/v0.1/README.md",
      "name": "multiscales",
      "description": "Multiscale layout of zarr datasets"
    }
  ],
  "multiscales": {
    "layout": [
      {"asset": "0"},
      {"asset": "1", "derived_from": "0", "transform": {"scale": [2.0, 2.0]}},
      {"asset": "2", "derived_from": "1", "transform": {"scale": [2.0, 2.0]}},
      {"asset": "3", "derived_from": "2", "transform": {"scale": [2.0, 2.0]}},
      {"asset": "4", "derived_from": "3", "transform": {"scale": [2.0, 2.0]}}
    ],
    "resampling_method": "average"
  }
}
```

A year ago Zarr had no standard overview story. Today, `multiscales` has been
released and is being used in production to power the [EOPF Sentinel Zarr
Explorer](https://explorer.eopf.copernicus.eu/).

**Assessment:** COG, still has ✅ the IFD-chain convention for overviews. Zarr,
now has the ✅ `multiscales` Convention!

### Single-file portability

Let's be clear: cloud-native geospatial is amazing! But sometimes you just
need a file…

When you do, COG is the only real option, right? You get one file, one file
that can likely be opened by software ten, twenty, perhaps even thirty years
old (depending on encodings).

Zarr has…ZipStore? Alright, look, here's the deal: I like that Zarr is
cloud-native, not that it is a single file. I don't use this. I don't know
anyone who does. So this was actually a surprise to find that zarr-python
exposes a ZipStore abstraction for single file stores via zip files. Searching
around to try to learn more I found a number of open issues about it and
reports of "compatibility issues". But that's beside the point: Zarr
*seemingly* does have an answer to COG:

```py
import numpy as np
import zarr

store = zarr.storage.ZipStore("data.zip", mode="w")
z = zarr.create_array(
    store=store,
    shape=(1024, 1024),
    chunks=(256, 256),
    dtype="uint16",
)
z[:] = np.random.randint(0, 10_000, size=(1024, 1024), dtype="uint16")
store.close()

store = zarr.storage.ZipStore("data.zip", mode="r")
zarr.open_array(store=store)
# <Array zip://data.zip shape=(1024, 1024) dtype=uint16>
```

And look, it really is a Zarr tree, in a single zipfile:

```
$ unzip -l data.zip
  Length      Date    Time    Name
---------  ---------- -----   ----
      642  07-14-2026 19:07   zarr.json
   120235  07-14-2026 19:07   c/0/0
   120185  07-14-2026 19:07   c/0/1
                ...
---------                     -------
  1923677                     17 files
```

Even GDAL can read it using `/vsizip/`:

```
$ gdalinfo /vsizip/data.zip
Driver: Zarr/Zarr
Files: /vsizip/data.zip/zarr.json
       /vsizip/data.zip
Size is 1024, 1024
Corner Coordinates:
Upper Left  (    0.0,    0.0)
Lower Left  (    0.0, 1024.0)
Upper Right ( 1024.0,    0.0)
Lower Right ( 1024.0, 1024.0)
Center      (  512.0,  512.0)
Band 1 Block=256x256 Type=UInt16, ColorInterp=Undefined
  NoData Value=0
```

Except one problem: ZipStore is not spec. [The PR to add such a feature to the
spec](https://github.com/zarr-developers/zarr-specs/pull/311) dates back to
2024. It's up for debate whether or not zip is the right format to target:
Zarr is a filesystem tree, something that could be packaged any number of
different ways. Is this really a Zarr concern, or one that should be addressed
at a different layer? I'd argue the latter, but that's not really the point.
The point is, rather, that Zarr-the-format does not currently codify support
for any single-file representation, regardless of whether it should or not.

**Assessment:** COG, ✅ still just a file. Zarr apparently has supported this
for some time via tooling, but that's not the spec, so I think per the rules it
    has to be ⛔️ ZipStore exists, but it's not actually spec.

### Compatibility / interoperability

On the TIFF timescale, Zarr—at least the Zarr we've been talking about—is
still an infant. Zarr has been around for a bit more than a decade, but Zarr
v3's reference implementation shipped in *January 2025*, and datasets actually
written as v3 seem to remain the minority even within the Zarr world (at least
based on my experience trying to find public v3 data to use for updates for my
CNG Raster Workshop). We're literally still in that window where parents are
gonna tell you their kid's age in months—eighteen months, at best, for those
not counting. Conventions, the very mechanism that has closed all the gaps
above, are themselves at most nine months old, based on the age of the
Conventions spec itself. Every new convention—and all conventions are
necessarily new—adds a new compatibility question: does your tooling know this
convention, in the version your data declares? I cannot point a colleague to a
Zarr store using these features and assume they'll be able to leverage them
with whatever tooling they have laying around. COG just works, and may well
work forever.

I want to affirm that this isn't a criticism of Zarr *in any way whatsoever*.
It's just what new means. The current TIFF version (6) is old enough to be
having a midlife crisis; Zarr v3 is starting to walk; Conventions are just
figuring out how to stand up. Compatibility is bought with time, specifically
time spent unmoving, and no spec, however good, can buy it faster. Hence, the
history gap is all that remains, and that's literally just a matter of time.

Writing this section I realized something: compatibility is a common COG
talking point, but how truthful is it? I honestly couldn't say. I worked on the
last major revisions to the Sentinel 2 COG processor that we run as part of the
Earth Search data ingest pipeline for populating the sentinel2-cogs bucket, and
compatibility was something we optimized for. But I can't say we tested that.
How would one anyway? Get some decades-old software and try to read one???

Actually, yeah, that's a great idea. Instead of just parroting this talking
point about compatibility, I decided to put this claim to the test. To do so, I
figured I'd get the oldest version of GDAL that I could find and try reading
one of the Sentinel 2 COGs from Earth Search. Did we really succeed with our
goal of compatibility? Let's find out.

I dug around in the GDAL repo on GitHub, and the oldest tag I could find there
was v1.1.5. Next was figuring out how old that was, which was not as
straightforward as I would have thought. I dug through a bunch of different
sources to try to work out the age of that release, and I ended up at [a commit
by Frank Warmerdam from 12 January
2002](https://github.com/OSGeo/gdal/commit/a91aaf9022f4c4a890483052b548a6d0aa15c595)
that added the original NEWS file, including the release notes for both v1.1.5
and v1.1.6. So best I can figure, v1.1.5 likely dates back to late 2001.

With a 25-year-old target identified, I knew I was in for a rough time getting
this to compile. I wasn't even sure it would be possible. Lacking the time and
patience required, I grabbed a random COG off the newest Sentinel 2 scene
ingested into Earth Search at the time (`B04.tif` from scene
`S2B_T51PYQ_20260717T021230_L2A`), and prompted Claude Opus 4.8 to run
`gdalinfo` and `gdal_translate` on the COG to extract both the metadata and a
tile, and verify the results by doing the same with GDAL 3.13. I pushed it
towards docker, it agreed, and half an hour or so later I had a 32-bit x86
Debian-Woody-based (circa 2002) container running on my ARM Mac via QEMU
emulation, running GDAL 1.1.5.

```sh
❯ gdal-config --version
1.1.5
❯ gdalinfo S2B_T51PYQ_20260717T021230_L2A_B04.tif
Driver: GTiff/GeoTIFF
Size is 10980, 10980
Coordinate System is:
PROJCS["WGS 84 / UTM zone 51N",
    GEOGCS["WGS 84",
        DATUM["WGS_1984",
            SPHEROID["WGS 84",6378137,298.257223562997]],
        PRIMEM["Greenwich",0],
        UNIT["degree",0.0174532925199433]],
    PROJECTION["Transverse_Mercator"],
    PARAMETER["latitude_of_origin",0],
    PARAMETER["central_meridian",123],
    PARAMETER["scale_factor",0.9996],
    PARAMETER["false_easting",500000],
    PARAMETER["false_northing",0],
    UNIT["metre",1]]
Origin = (699960.000000,1500000.000000)
Pixel Size = (10.000000,-10.000000)
Corner Coordinates:
Upper Left  (  699960.000, 1500000.000)
Lower Left  (  699960.000, 1390200.000)
Upper Right (  809760.000, 1500000.000)
Lower Right (  809760.000, 1390200.000)
Center      (  754860.000, 1445100.000)
Band 1 Block=1024x1024 Type=UInt16, ColorInterp=Gray
  Min=0.000/0, Max=65535.000/0
  Overviews: 5490x5490, 2745x2745, 1373x1373, 687x687
```

COG didn't exist in 2001, but because COG is just a profile on top of GeoTIFF,
GDAL v1.1.5 has no problem reading the metadata. Reading the data, however, is
another concern entirely. libtiff has added support for new codecs over the
years, like Zstandard, LERC, and WebP, all of which have come after this
version of GDAL was released. The Sentinel 2 COGs, on the other hand, use
DEFLATE, which it turns out *is* supported by this GDAL version. Using the
`-srcwin` option to `gdal_translate` dumped a single tile, which succeeded.
Yet, running a checksum on that result and the same tile read with GDAL 3.13
led to two different values, meaning the two GDAL versions were reading
different data values! Is this compatibility story a lie!?!

I have to admit, I was just a spectator here. Claude continued iterating on
this without my input, eventually narrowing down the discrepancy to the first
row in a window read with `-srcwin`. That row would always end up with values
alternating between 8192 and 0. Outside that row though, the data values
always decoded correctly. So GDAL v1.1.5 has a bug in its `-srcwin`
implementation, probably long fixed now. But it *can* read the data.

So, again, is the compatibility story a lie? No, but it isn't totally truthful
either. Obviously, nothing helps against bugs in tooling. Bugs aren't the
format's fault though, right? Yet if the COG I had selected had used Zstandard
compression, for example, then this test would have failed. In fact, I tried
exactly that: I rewrote the COG using Zstandard, and loaded it up again.
`gdalinfo` still worked the same, as that only touches the TIFF metadata, which
was unchanged. But `gdal_translate` failed, as expected, with `ERROR 1:
Compression scheme 50000 tile decoding is not implemented` (50000 notably being
the TIFF compression tag enum value that libtiff self-assigned to Zstandard
given the collapse of the formal TIFF registry). The clear lesson here: a base
format may be compatible, but encodings may not. Or really any extension on top
of a base format (like that new tile interleaving mode GDAL 3.11 added to the
COG driver).

I like Zarr's Conventions as a way to codify each of these extension points on
top of the base format separately, in a composable manner. As we see with COG
and Zstandard, every new extension on top of a base format is its own
compatibility story, each with its own compatibility clock. I expect the
Convention approach will do a lot to help ensure these fiddly things on top of
the base format can have their own, formally-specified compatibility stories.

But Zarr doesn't do any better than COG when it comes to codec versioning, and
the codecs available in a given software environment are disconnected from the
Zarr metadata version in use. I still think the "many small versions" idea
behind Conventions needs to be taken even further. If that happens are we still
talking about formats anymore? Certainly not in the same way. Or maybe we end
up with the pieces we need to build "Thousands of *Compatible* File Formats"...

**Assessment:** COG, ✅ still everywhere, though codecs are a wrinkle. Maybe it
should be ⚠️, but it's hard to argue with actually testing a 25-year-old tool
and seeing it work. Zarr, ⛔️ still nascent, but nothing can help except time.

## How do COG and Zarr stack up now?

Let's update the table to see how things land now.

| Feature | COG, unchanged | Zarr, now |
| :---- | :---- | :---- |
| N-dimensional arrays | ⚠️3D, but 2D in practice, though tile interleaving is interesting | ✅ native |
| Datacube assembly | ⛔️ outside the format | ✅ native |
| Declarative, self-describing description | ⛔️ opaque, externally-defined tags | ✅ still JSON, now with Conventions! |
| Extensibility | ⛔️ TIFF is effectively frozen, COG adds even more structure on top | ✅ clear Convention framework, young but proven |
| Codified geospatial metadata | ✅ GeoTIFF, standardized since 1994 | ✅ `proj` / `spatial` / `CF` / `dggs` Conventions (RPCs/tie-points still open, but now tractable) |
| Visualization | ✅ the IFD-chain convention for overviews | ✅ `multiscales` Convention |
| Single-file portability | ✅ still just a file | ⛔️ ZipStore exists, but it's not actually spec |
| Compatibility / interoperability | ✅ still everywhere, though codecs are a wrinkle | ⛔️ still nascent, needs time |

Zarr has a lot more green. The one thing in the table that slipped was Zarr's
single-file portability story, but that's not because anything regressed there.
Rather, I went and checked the spec, and found this was always a ⛔️; the year
ago 🤷♀️was me not knowing any better.

COG didn't really move. But here's the thing: stillness is a feature, and the
⛔️ for extensibility is how COG earns its ✅ for compatibility. A format that
doesn't move year-over-year is doing the one thing Zarr cannot buy at any
price. Clearly Zarr does some things COG can't do alone, and the movement from
Conventions has earned it strong consideration across the board.

All this said, I specifically omitted one row from this table that I initially
wanted to add: search and discovery. Why? Because we're talking about array
formats, and neither COG nor Zarr can solve search and discovery alone, so this
isn't really a feature to evaluate. But if we were to do so, they'd both get a
⛔️.

STAC is the clear answer to search and discovery today. Except, if we're
talking about adding STAC, then we're talking about metadata that can be used
with a big long list of tools to construct datacubes, solving the datacube
assembly concern. Even without STAC, we saw that virtual Zarr can be used to
build data cubes from COG data. And approaches like Rasteret and tacoTIFF also
show us new ways of building datacubes from COGs.

Realistically, based on the comparisons we've looked at, the only two
requirements that Zarr can meet that COG+tooling can't are support for single
data variables with more than three dimensions and data using CF coordinate
arrays or DGGS grids. Yes, I was careful to assess these formats based on what
they can do alone, and just moved the goal posts to include format+tooling. But
that's the reality of how these formats are being used, and the tooling is
perhaps the most important piece in all of this. This fact doesn't change my
assessment of each format, but it does suggest that this whole discussion about
format is perhaps misguided, and that maybe what we really should be talking
about is tooling.

Sure, the metadata format itself is another matter, where Zarr gets another ✅
beyond COG. Frankly, I suspect this isn't a dimension most users are going to
care about in their technology evaluations. That said, it's worth being honest
here: Zarr's declarative metadata format is the reason why Conventions allowed
the gaps to close within months, not years. It's a powerful asset, and the key
thing that will allow Zarr to move further into uncharted territory in the
future.

Interesting to note is where COG hasn't been staying still: in the tooling
(see, it's important). Iteration and implementation continues throughout the
community, both on revisions to existing tooling (i.e., the GDAL tile
interleaving) and a whole host of new tools. async-tiff was mentioned in
passing, and is a notable development in the TIFF tooling space. Even more
relevant is the new
[async-geotiff](https://developmentseed.org/async-geotiff/latest/) package
built on top of async-tiff, which exposes geospatial metadata from GeoTIFF
files. Both are worth looking at if building out TIFF/GeoTIFF/COG processing in
python.

## What does Zarr need to replace COG?

Back in November 2025, at FOSS4G Auckland, I received a request. I was asked to
write another post, one explaining what Zarr would need in order for me to
recommend it unreservedly. I've been thinking about this question ever since.
I've had a number of ideas how to respond to this, I've gone back and forth
about it, brainstorming and collecting notes. I was excited about the prospect
of such a post for some time.

But the more I've thought about it, the more I've started to think that this is
just another way of asking if Zarr is not the new COG, what does it need
to be? What would it take for Zarr to *win*? Now I'm editorializing intent with
that reframe that may not be fair to the requester; after all, this was only a
few weeks after Conventions were codified and we were only just beginning to
get a glimpse of what impact that was going to have. As this post reflects,
certainly a lot has changed with Zarr in the interim, and Zarr as a geospatial
data format is now more compelling than ever.

Yet that *winning* thing, it sticks out to me for a clear reason: my motivation
to partner with Julia to write the first "Is Zarr the new COG?" post was
specifically to fight the overwhelming feeling of competition here, that Zarr
has to win and COG has to lose for the effort to be successful. I think that's
wrong. I don't think we need a winner. Not everything has to be Zarr, nor COG.
I think having multiple effective technologies is a much bigger win for the
community than picking just one. "Is Zarr the new COG?" is catchy, but I think
it's the wrong question. "What are the strengths and weaknesses of Zarr and COG
and how should I pick one or the other for a new data product?" just doesn't
have the same ring to it, I know, but that's probably the better question.
That's why I'm sticking with my answer: no, Zarr is not the new COG. I don't
think my answer will change, it will always be no. And that's okay, good even:
they're two different technologies that I believe can and should coexist
together.

## But tell us how you *really* feel

I sidestepped the actual question, didn't I? It turns out I do have a number of
thoughts regarding Zarr.

As it so happens, I *really* like Zarr as an array format. Specifically:
Conventions. The Zarr developers have knocked it out of the park
here. Conventions are almost exactly the shape I had been thinking was needed
to break away from monolithic, messy formats and get to a place where we can be
building granular capabilities on top of data. STAC pioneered this direction,
but did so at a distance. We're seeing the attempts to collapse that distance
(e.g., the `stac` Convention called out in the Extensibility section above),
and I'm interested to see where we land, though I suspect there's strong value
in retaining some degree of a layered approach.

Virtual Zarr is also great. It shows that the Zarr model is made to coexist
with existing formats. It's really my inspiration for everything I've been
saying about metadata and codecs and how the data is all the same, it's just a
matter of projecting metadata into a compatible format to be consumed by
whatever tooling one is using.

The thing about Zarr for me though is that it doesn't go far enough. The Zarr
community acknowledges this too, in places. Chunk homogeneity is a clear pain
point. How many reimplementations of the TIFF predictor 2 codec are there now?
Data access is implicit, maybe a little less so where sharding is involved, but
then sharding is modeled as a data codec, not a separate, access layer concern.
A simple linear codec pipeline is perhaps too simplistic. A lot of interesting
codecs are popping up on the tabular/columnar format side of things, but over
here with our arrays it feels like we're 15 years behind (or more: I don't know
how many people I've talked to that tell me they saved 10% or more on their
cloud storage costs by using a predictor). And, frankly, I think it a bit
unfortunate we're still talking about array formats instead of *chunk* formats.

Except what Zarr also shows is that *it doesn't have to solve all these
problems*. I think Zarr is a great compromise where it is, solving a clear set
of use-cases well. It gets 90% of the way; the remaining 10% might not be worth
the cost, complexity, and churn to what is already there. If we're not focused
on a winner, then it's okay to stop and say something is good enough, and
something else can be built specifically to fill the uncovered gap. The allure
of consolidation is strong, I too fall for it not infrequently. Yet I genuinely
believe smaller, focused, and composable solutions are better than trying to
build all the features into one thing.

That winning thing though? I suspect some have a strong case why they want that
to happen, driven primarily by economics. If Zarr is seen to win, then the
debate about where to invest is simple: invest in Zarr. Winning means more
money, more resources. Money put towards these tools is good for the community,
because we end up with better, more performant solutions. One format unifies
the community around one tool chain; investment concentrates instead of
diluting; every improvement benefits everyone. Except this benefit is one of
shared *tooling*, not a shared *format*.

This is what Julia and I called for last year, and I am happy to say I see this
playing out, even if not yet to the level I think we can achieve. We continue
to see investment in COG-related tooling, moving towards unifying TIFF and Zarr
on top of a common set of low-level libraries. The format layer is shrinking,
converging towards a thin veneer, just porcelain. If the format is just this
thin top layer, then what does it matter what format people use? Who cares if
it's COG or if it's Zarr? The tool chain can be the same, and then the
performance will be the same. Virtual Zarr makes this nearly explicit: every
new virtualizable format is another demonstration that one tool chain can serve
many encodings.

I still have one deeper architectural reservation about Zarr, specifically
regarding the way it couples data organization to the array format. However,
this is more an argument about how we model access to data generally that just
so happens to intersect with Zarr specifically. It deserves more room than I
can give it here, so I'll leave it at this for now.

## Towards thousands of *compatible* file formats

![A stick figure version of zarr holding hands with a stick figure version of
COG.](image2.png "A Zarr and a COG living together in harmony")

If I'm evaluating format choice today versus a year ago, I'm more likely to
reach for Zarr now than I was before. Zarr's biggest gaps have been filled over
the past year, and not with workarounds but good answers. Zarr is now much more
competitive with COG, despite this not being a competition. That said, I truly
believe Zarr should not have "replace COG" as a goal. I'd go further: that's an
anti-goal. The goal of the Zarr developers should be making Zarr as good as it
can be within its own vision. If, in doing so, COG becomes irrelevant, great.
There's no choice left to make, and nothing is lost. But we're far from that
today, and I'm frankly still using COG for many things, because it works for
those things, and works well. And virtual Zarr makes a fairly convincing
argument that maybe the choice is artificial anyway.

Both of these formats are valuable to our community—and let me be clear, this
is, largely, one community. We share conferences, share tools, and share
people. Formats are cheap, communities are not, and this community does not
need to split itself over a false choice.

If there's one belief I want to push on before closing, it's the idea
that COG and Zarr are so deeply different that a shared stack between them is
impossible. That belief is self-fulfilling: nobody funds a bridge they're
convinced can't be built, and then the absence of the bridge gets cited as
proof of the chasm. Except we keep watching the bridge get built the moment
someone has a reason to pay for it. AWS needed NITF and JPEG 2000 readable as
virtual Zarr, so the codecs got written and shipped in osml-imagery-io.
virtual-tiff needed predictor 2, so now Zarr reads it. The missing shared codec
layer isn't evidence of a thick boundary between these formats; it's evidence
of a coordination failure. The winner-take-all framing is part of the failure,
because money that believes it must pick a winner doesn't fund the seam between
them.

After wrestling and writing and working through all of this, I have two asks.

First, the sincere one: if you still believe Zarr needs to win, tell me why.
Not what Zarr needs to do to win, but why there needs to be a winner at all.
What does a winner give this community that coexistence doesn't? I've only come
up with one answer so far, the economics of concentrated investment, and I've
given my response: that's an argument for shared tooling, not a shared format.
[If you have another answer, I genuinely want to hear
it](https://element84.com/who-we-are/contact-us/).

Second, the constructive one: invest at the seam. The places where these
formats meet—shared low-level readers, shared codec implementations,
conventions with tooling behind them—are where a dollar helps both ecosystems
at once. obstore, async-tiff, VirtualiZarr, even GDAL at times: these all show the
veneer can thin in different ways. Let's capitalize on the good ideas these
demonstrate.

And me? I'm trying to put my money where my mouth is. I said above I think it's
a bit unfortunate we're still talking about array formats at all. Neither COG
nor Zarr gives us a chunk format: in both, a chunk is a bare blob that can't
describe itself. And the codec duplication I keep pointing at isn't even a
COG-versus-Zarr problem: every Zarr implementation maintains its own codec
suite, and simple transforms like shuffle and delta are reimplemented outright.
We see virtual-tiff, osml-imagery-io, and my own notebooks reimplementing a
TIFF predictor 2 codec. Zarr's own community has been pushing toward shared
codec infrastructure for years (numcodecs first, now zarrs), and that push is
exactly the right instinct.

Take that push to its logical end and the codecs drop out of the format
entirely, into a shared layer any format can target. That's the idea I've been
pursuing with [cylf](https://github.com/cylf-dev/protospec/tree/main/spec), an
experimental codec layer with a design inspired by Zarr and driven by the needs
uncovered by [CCRP](https://ccrp.dev/docs/ccrp-intro). Extract the pipeline
from the format and even Zarr becomes a veneer, with its metadata model laid
over the same shared machinery. We'll be continuing this conversation at
FOSS4G, CNG, and FOSS4G North America later this year. If you have feedback,
your own thoughts on this topic, or just want to say hi, come see us at an
in-person event or [reach out to us
here](https://element84.com/who-we-are/contact-us/).
