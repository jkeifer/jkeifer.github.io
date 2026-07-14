---
title: "(Re)Making Cirrus: Reflections on five years spent building an open-source data orchestrator"
url: /posts/2026/02/23/remaking-cirrus-reflections-on-five-years-spent-building-an-open-source-data-orchestrator
date: 2026-02-23T12:00:00-00:00
lastmod: 2026-02-23T12:00:00-00:00
draft: false
summary: |
  Cirrus, Element 84's open-source data orchestration framework, recently turned
  five years old — and we've rebuilt it at least three times along the way. This
  is a retrospective on where Cirrus came from, from its origins in NASA's
  Cumulus through the STAC Workflows idea, the project CLI, the SWOOP detour, and
  finally the v1.0.0 release, plus a look at where it's headed next.
note: |
  This post was originally published on the [Element 84
  blog](https://element84.com/blog) where you can also find other related
  content.
tags:
  - cirrus
  - data-orchestration
  - stac
  - aws
  - open-source
  - swoop
  - serverless
toc: true
showSummary: true
showRelated: true
canonicalUrl: "https://element84.com/software-engineering/remaking-cirrus-reflections-on-five-years-spent-building-an-open-source-data-orchestrator/"
---

*This post is based on the author's talk (Re)Making Cirrus: Five Years Building a
Data Orchestration Framework, presented at FOSS4G NA 2025 and FOSS4G 2025.*

We've remade [Cirrus](https://github.com/cirrus-geo/cirrus-geo) at least three
times. Maybe four, depending on how you count.

Cirrus, a data orchestration framework we develop and use here at Element 84,
recently celebrated its five-year anniversary of being open-sourced. Despite being
a critical component of our infrastructure, we haven't discussed it much publicly.
Given the years we've spent building Cirrus, it seems like we're well past the time
to write about it. And, because we've been working on it for so long now and this
isn't just a write-up on a new thing, it felt like the right thing to do was to
take a retrospective look at Cirrus' history and where we plan to go from here.

## What is Cirrus?

Cirrus is the data orchestration component of Element 84's FilmDrop suite of open
source tools for building geospatial data lakes. FilmDrop combines projects we
maintain—like Cirrus, of course, and stac-server—with other community open source
projects to provide an end-to-end solution for data providers and processors. We
use Cirrus to orchestrate data processing, with a key focus on building metadata
for said data, enabling indexing for search and discovery.

Cirrus supports many of our projects at a wide range of scales. From tiny projects,
maybe processing a few hundred images a year, to massive scale processing tens of
thousands of items a day for catalogs of many millions of items, sometimes with
historical processing bursts to over one hundred thousand items per hour! Cirrus
has proven effective and efficient at both ends of the spectrum.

Costs also scale well, approaching zero at idle. The design allows users to select
the smallest viable compute for any given task, helping to keep costs down even
under load. The system is relatively easy to use—though I recognize my bias in
saying so—and learning it isn't much more than learning the handful of AWS services
it leverages. Like any technology, users need to understand some specific concepts
to "get it", but the entry-level barrier is low, and most complexity tends to be a
function of user-defined workflows rather than the system itself.

The core system is simple and opinionated, which makes it easy to get started
quickly, while remaining flexible enough to accommodate advanced needs with minor
configuration. It's also extensible, so truly advanced use-cases can build custom
systems around the core infrastructure to handle even more complex or stateful
workloads.

With that conceptual introduction out of the way, let's jump into Cirrus's history.
We'll dive deeper into the technical details of Cirrus as we go along.

## The evolution of Cirrus

To better understand Cirrus, it helps to trace its evolution over the years.

### 2017: First, there was Cumulus

While Cirrus has been an open source project for five years, this story actually
begins in 2017. That's when [Cumulus](https://github.com/nasa/cumulus) was first
conceived by a handful of engineers from Development Seed and Element 84, who came
together to design a new cloud-based event-driven orchestration solution for NASA's
DAACs. The system was designed to process data and generate metadata for NASA's
Common Metadata Repository (CMR). Among those who contributed to the original idea
were Alireza Jazayeri, Patrick Quinn, Joe Flasher, and Matt Hanson.

![Flow chart depicting the Cumulus architecture. On the left the lines stem from
End Users and Cumulus Operators into AWS NGAP Account and Application VPC, and then
branches out into Authorizations, Cloud Metrics, Data Discovery, CMR, and EOSIS
Metrics System.](diagram-cumulus.png?bg)

*Cumulus Architecture Diagram*

Cumulus aimed to be a simple solution. In some ways, given the multitude of legacy
requirements it must meet to be viable across all the DAACs, it is. But those
various requirements led to complexity that compromised key tenets of the original
vision. That, combined with the design centered around CMR, means Cumulus is
limited in its application outside NASA.

### 2019: Towards a lighter Cumulus

By 2019, Matt Hanson had joined Element 84, where he found himself involved with
three projects needing a scalable data orchestration solution. Scale was the
operative word: one project for an early-stage commercial SAR provider had low, but
growing, data volumes with significant compute requirements. Another project
required back-processing the entire Sentinel-2 archive into cloud-optimized
GeoTIFFs and forward-processing all new Sentinel-2 data in near real time.

This latter project ultimately formed the foundation for what is now [our Earth
Search data
catalog](https://element84.com/geospatial/introducing-earth-search-v1-new-datasets-now-available/),
which we orchestrate entirely with Cirrus. At time of writing, the Earth Search v1
deployment processes some 30-some-thousand scenes a day into a catalog of around 77
million STAC items backed by over 30 petabytes of data assets.

[STAC](https://stacspec.org/), that's a key concept here worth emphasizing. In
2019, STAC—an effort that had also started in 2017—was rapidly developing. Not just
into a viable metadata specification, but into an entire ecosystem of tooling. In
retrospect, STAC was a key piece missing from the design of Cumulus, which was
tightly coupled to NASA's CMR and its metadata format. Recognizing the value of
STAC, and seeing that Cumulus had diverged from the lightweight architecture
originally envisioned, Matt decided to build a new data orchestrator around his
concept of *STAC Workflows*, calling it "Cirrus", because it is a *lighter* Cumulus.

#### STAC Workflows

![Diagram illustrating STAC Workflows, showing STAC metadata payloads passing
between processing tasks.](diagram-stac-workflows.png?bg)

STAC Workflows emphasizes that payloads in and out of processing tasks and
workflows should leverage STAC as a stateful messaging format. That is, instead of
putting various bits of processing state in a central database or the like and
passing around opaque links to data files, use STAC metadata to track the
processing state. STAC inherently includes both the state—what items exist, what
assets they have, what properties have been enriched–and data pointers (via asset
HREFs), and allows messages between processes to themselves track the state of the
system, all using a standardized metadata format with a vibrant open source
ecosystem of compatible tooling.

STAC Workflows matter because:

- **Workflows become composable**: The output of one workflow can be the input to another. Chain them together naturally.
- **Processing becomes metadata-driven**: If you can search for it in a STAC catalog, you can process it. Query for "all Sentinel-2 scenes from last week" and kick off processing for each result.
- **Debugging becomes simpler**: Messages between processes carry the state. No need to correlate database records with log files—the metadata tells you exactly what was processed and when.
- **They leverage the STAC ecosystem**: Tasks can use standardized STAC tooling—pystac for reading and writing Items, stac-task to handle processing boilerplate, and various other stac-utils packages that provide a whole collection of building blocks for STAC-related work.

### 2020: Cirrus open sourced

Development of Cirrus started in private, but it was released to the public in 2020,
under the Apache 2.0 open source license.

![Flow chart of the Cirrus system architecture.](diagram-architecture.png?bg)

*Cirrus System Architecture*

Cirrus was, and remains, quite lightweight: the core components are two AWS Lambda
functions, Process and Update State, that manage system state in a DynamoDB table.
Around them we have an input SQS queue—where users enqueue payloads to be
processed—and published items and workflow event flow to output SNS topics.
Workflows are orchestrated via AWS Step Functions, and tasks within those workflows
generally leverage either AWS Lambda or AWS Batch for compute.

![Diagram of an example Cirrus workflow.](diagram-workflow.png?bg)

*Example Cirrus Workflow*

#### How all this works

This seems a good time to interject with a deeper dive into the Cirrus
architecture. For the sake of simplicity, we'll look at the system as it exists
today, which does have some differences from Cirrus as it was in 2020.

*Feeders* are anything that builds and sends payloads into the system. Typically
they trigger off an event for new data. This could be a Lambda function triggered by
new files appearing in S3, or messages published to an SNS topic representing new
data. Feeders publish payloads to the process queue (SQS), which provides buffering
to allow millions of payloads to be enqueued and processed as capacity/rate limits
allow (like the fact that only one million step function executions can be running
simultaneously in one account, a limit we have hit on more than one occurrence 😁).

The Process Lambda picks payloads off the queue and checks the state database to see
if it has processed this payload before. If it was previously processed
successfully, it's skipped. This check makes it easy and cheap to address failures
by rerunning batches of payloads without having to worry about reprocessing
successful ones. For new or failed payloads, Process looks at the workflow specified
in the payload and starts the corresponding Workflow execution.

*Workflows*, as previously mentioned, are AWS Step Functions state machines, where
each processing step is a STAC Workflows Task. *Tasks* are executed as a Lambda
function or AWS Batch job, depending on resource needs: Lambda is easier to manage,
cheap, and fast, but unsuitable for long-running or resource-intensive processing;
Batch has a higher operational complexity, but allows for indefinite processing
and/or the specification of specialized compute resources (large disks, more memory,
GPU processing, etc). Convert to COG. Generate a thumbnail. Calculate statistics.
Each Task enriches or modifies the metadata based on the processing result(s), and
passes the metadata along to the next step.

The [Amazon States Language](https://states-language.net/) leveraged by Step
Functions allows for complex and expressive retry logic and error handling. It also
provides a number of useful non-processing step primitives, including control flow
steps like the Choice, Map, and Parallel states.

Parallelism in Cirrus can then be implemented in two ways: within a given workflow
using the Map or Parallel states, or at the workflow level by running many separate
executions in parallel. Each has its advantages, but we typically recommend keeping
executions as one-to-one with product generation as possible. That is, for each
product to be generated, it's generally (but not always) best practice to have a
single workflow per product, and to have each workflow execution generate one Item
of that product type.

Why? Because of Cirrus's state tracking. Keeping the processing in a given workflow
execution confined to a single product means that failure has the smallest impact
surface, and reprocessing can be as granular as possible.

State tracking happens across two databases: a DynamoDB table tracks workflow
execution status ("what's running?" or "what failed?") and various other
payload/execution details, while a timeseries database logs state changes to provide
operational metrics and help with debugging.

Cirrus produces messages for consumers via two SNS topics: the Workflow Event topic
and the Publish topic. These topics provide extension points by which to integrate
other components, in a loosely-coupled manner. All state transitions and other
events are emitted from the system as messages via the Workflow Event SNS topic,
which can be used to allow external systems to track the processing of certain items
or to facilitate more complex integrations. All output STAC items are published by
Cirrus to the Publish topic for downstream systems, like a STAC API ingest function.

It is a simple but robust and featureful system.

#### The original distribution

All of this was distributed, originally, as a single project directory downloaded as
a zip file from the GitHub repo. It leveraged Serverless Framework as an
infrastructure-as-code (IaC) solution. Users would download and extract the zip file
to create a new project, then add their own code and resources directly into the
Serverless project, sometimes modifying the core code to fix bugs or make
customizations.

An open source Python library called cirrus-lib was also released at the time to
help Task authors. This packaged up a number of helper functions and convenience
classes to make it easier to write Tasks in Python.

### 2021: The Cirrus Project Model

The copy-the-directory-around model worked well initially, and was, admittedly, a
pragmatic solution for proving out the idea across various projects (there's a
valuable takeaway here that I think lives somewhere between JFDI (Just Freakin' Do
It) and the saying "perfect is the enemy of good"). That said, it had a significant
flaw: projects struggled to track which parts of the codebase were proprietary
versus core, as everyone had their own copy of everything and struggled to untangle
owned vs upstream code. Bug fixes and features frequently failed to be committed
back to the open source repo, and even when they were, projects couldn't easily
integrate the changes.

This was the situation when I started working on Cirrus development. My education is
in geography and geospatial, but I'd spent the prior seven years in network
engineering and network software development. When I joined Element 84 in 2021, I
was immediately tasked with untangling project code from core code. I didn't have
the full context, but that didn't stop me. For better or worse, I thought, "Great, I
can fix this!"

Having built numerous custom network configuration and troubleshooting tools in
prior years, CLI development was familiar territory. Maybe it'd be called a
bias–maybe some would say I had a hammer, so Cirrus was obviously a nail. In any
case, I did what I knew. I made Cirrus into a CLI, roughly inspired by git: make a
directory, initialize a project inside it by creating some state the tooling can
reference, and voila! The CLI can support project-specific commands.

![Cirrus command line screenshot.](cli-screenshot.png)

This approach effectively solved the immediate need: the built-in code and resources
were packaged into a Python tool, and project-specific config and code lived in the
project alone. But it propagated—indeed, doubled down on—the coupling to Serverless
Framework. The entire structure of a project, all the configurations, and all the
CLI code were entirely dependent on Serverless.

### 2022 to 2024: Continued iteration

Over the next couple of years, the project CLI approach worked well. We were able to
focus development on bug fixes and operational improvements to increase system
stability. We made good progress on documentation, covering most topics end users
needed to get started with and understand Cirrus. We built a plugin system for the
CLI to enable add-on functionality, including a project documentation build tool and
a management CLI for interacting with and operating Cirrus deployments. We added
observability features, including time series metrics and event notifications. We
also handled the Serverless v2 to v3 upgrade and migration.

Also during this time we deprecated cirrus-lib, replacing it with a Python library
called [stac-task](https://github.com/stac-utils/stac-task). This library aimed to
both simplify Task authorship through a new set of abstractions that further
minimized Task boilerplate, and to create a non-Cirrus-specific library to support
authoring STAC Workflows Tasks. This decoupling of STAC Workflows from Cirrus was
decidedly intentional, driven by the realization that Cirrus was just one
implementation of that broader concept.

#### A detour into SWOOP

During this timeframe, we also detoured significantly into [SWOOP: the STAC Workflow
Open Orchestration Platform](https://github.com/Element84/swoop). This was an
experiment in reimagining Cirrus as a cloud-agnostic "meta-orchestrator". Instead of
DynamoDB, SWOOP used PostgreSQL for state storage, with an API built around the OGC
Processes API specification. We implemented [two backend components in
Go](https://github.com/Element84/swoop-go) that integrated the system with Argo
Workflows on Kubernetes as the first supported workflow orchestration solution.

The motivation behind SWOOP was two-fold: address Cirrus's pain points, and make a
solution that didn't require AWS. Per the latter, we had funding with the
requirement that we target Kubernetes, which drove a number implementation
decisions, such as the integration with Argo Workflows. That said, throughout the
project, an overarching goal was to build a solution that would support pluggable
orchestration backends, to allow future support for workflow orchestration via Step
Functions on AWS, Logic Apps on Azure, or other self-hosted solutions like Prefect
or Airtable.

##### An experimental exploration, now on pause

At this point I struggle to classify SWOOP's status; to me it isn't deprecated nor
abandoned. I'm still invested in the idea. We completed a proof-of-concept. We
successfully processed data. But funding ran out before we could close the gaps on
production readiness. Maybe it's best labeled as an experiment, one I hope to resume
at some point. But for now SWOOP is on pause, waiting for a patron to support its
completion.

Meanwhile, Cirrus couldn't be retired. One can't replace a production solution with
something that isn't production-ready, no matter how promising (though we all know
that doesn't stop organizations from trying now and again). Cirrus has had to
continue on.

#### What SWOOP taught us

At the time, the shelving of SWOOP was disappointing. But reflecting on events now,
the disappointment is tinted positively with the realization that SWOOP was, in
effect, a rare reconnaissance mission. We got to try a bunch of crazy ideas. We got
to do the fabled greenfield rewrite. We experimented with new and different
technologies. We challenged our assumptions and questioned our beliefs. The
experience provided valuable insights not just for SWOOP, but also for Cirrus. Ideas
that spun out of that project have driven the development of some recent Cirrus
features, and continue to guide the Cirrus roadmap in a variety of ways.

### 2025: version 1.0.0!

In 2025, we achieved a significant milestone with Cirrus: we got to a version 1.0.0
release! Two major factors led to calling this v1.0.0:

- We had been working on this long enough that we had tackled all the known significant bugs in the system, and gotten it to a reliable and robust state.
- We stripped all of the CLI and Serverless from the core project!

The latter was a *massive* change.

The backstory: in 2024 Serverless v4 was announced, bringing with it a significant
licensing change and shift to a paid usage model. Serverless v3, the last open
source release, was only to be supported through the year's end. This situation was
untenable: we couldn't have an open-source solution dependent on a closed-source
build tool. In April 2024, we drafted the plan to remove Serverless and reach a
Cirrus v1 release. A month later, the initial PR for the rework was up for review,
with a net 4,400 lines deleted from the repo.

The entire project-based CLI was gone. Everything Serverless was deleted. We decided
to remove all the IaC configuration from the repo entirely, making the project
"bring-your-own-IaC". The core code left was just the central set of Lambda
functions, now built into a single zip file for distribution.

We still needed a way to manage deployments via an IaC solution, so we created a
Cirrus module in our FilmDrop Terraform modules repo to replace Serverless'
functionality. The Terraform module development and testing led to bugfixes and
other improvements making their way back into Cirrus.

Finally, on February 28, 2025, we released version 1.0.0.

## What's next for Cirrus

We've been busy since the version 1.0.0 release, and continue to make improvements
and targeted features. A few of the highlights:

- **New management CLI commands:** we still have a Cirrus CLI, but it is now specifically focused on operational needs. Originally a plugin for the project CLI, the management CLI continues to increase in functionality as we make common operational tasks more conveniently supported.
- **Runtime optimizations:** we've done a fair bit of work profiling the performance of the core lambda functions and have made improvements to reduce both cold and warm start times.
- **Entirely new time series solution:** AWS deprecated the original Amazon Timestream service last year, and made it unavailable for new accounts. We've since implemented a solution leveraging CloudWatch Log Insights as a cost-effective replacement requiring no additional or complex infrastructure.

Looking forward, we are discussing some potentially large changes. Ideas include a
complete rework of the DynamoDB state database to enable tracking more aspects of the
pipeline with a more robust data model, a rearchitecture of the systems event
handling via a simpler, more extensible and modular architecture, continued core
lambda performance optimizations, and even some major efforts like redesigning the
payload message format or creating a code-based SDK to allow for modular and reusable
code-based components declaring a project architecture.

## Try it for yourself

So, that's Cirrus, and the journey we've taken to make it what it is today. As an
open source project freely available on GitHub anyone can [take a look at the
code](https://github.com/cirrus-geo/cirrus-geo), run it themselves, and even get
involved and contribute back to it. If you are interested in running Cirrus
yourself, learning from our mistakes, or simply just want to see what we've done, go
dive into the repo. I'm always happy to hear from anyone using Cirrus or to answer
any questions that arise, so please reach out and let me know what you think! And
stay tuned for [the upcoming part 2 of this post](cirrus-part-2), where I'll reflect
on this history to pull out three core lessons from the Cirrus experience we've
found useful to consider in our other work.
