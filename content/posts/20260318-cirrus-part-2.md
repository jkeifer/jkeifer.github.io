---
title: "(Re)Making Cirrus: Three lessons learned"
url: /posts/2026/03/18/remaking-cirrus-three-lessons-learned
date: 2026-03-18T12:00:00-00:00
lastmod: 2026-03-18T12:00:00-00:00
draft: false
summary: |
  Reflecting on five-plus years of building Cirrus, Element 84's data
  orchestration framework, three core lessons emerge that apply to software
  projects generally: follow the money to understand what drives development,
  expect the pendulum of overcorrection and iteration, and hold fast to an
  unchanging vision. Part 2 of 2.
note: |
  This post was originally published on the [Element 84
  blog](https://element84.com/blog) where you can also find other related
  content.
tags:
  - cirrus
  - data-orchestration
  - open-source
  - aws
  - swoop
toc: true
showSummary: true
showRelated: true
canonicalUrl: "https://element84.com/data-science/remaking-cirrus-three-lessons-learned/"
---

*This is part two of a discussion based on the author's talk (Re)Making Cirrus: Five
Years Building a Data Orchestration Framework, presented at FOSS4G NA 2025 and FOSS4G
2025.*

In the first part of this series, we published a blog recapping the history and
evolution of Cirrus, Element 84's data orchestration framework, over the past 8+
years. If you missed the first installment, [go take a read through that history of
Cirrus](cirrus-part-1), and then circle back!

Reflecting on the Cirrus story, three core lessons emerged that seem worth
discussion and that apply to software projects generally (and perhaps to any
technical endeavor). Recognizing these lessons helps us more fully articulate our
plans for Cirrus and projects like it, both open source and internal, and to think
more effectively about the work we do and how we can do it better.

## Lesson 1: Follow the money

Who is paying for development?

This is an important question because it often determines what will or won't be
prioritized for development. As a services company, Element 84's open source work is
primarily customer-funded. Our customers recognize that by supporting our work in
open source and using open source components they get higher software quality and
the support of the community. But for us, it means customer desires—and budgets—drive
our development, and often define what we can or can't do.

We can only influence that direction to a degree. Sometimes we work with flexible
customers willing to let us address tech debt because they recognize our debt is
ultimately theirs. Other times, we must find the easiest, and not necessarily best,
path to addressing customer needs.

Even at product companies, someone writes the check. Or, as in [the XKCD about that
one critical contributor in Nebraska](https://xkcd.com/2347/), open source often
depends on volunteers donating their time. Regardless of the model, understanding
who provides the resources reveals who ultimately pulls the strings.

![A marionette puppet suspended from its control strings.](puppet.jpg)

## Lesson 2: The pendulum is real

The journey from where we begin to where we want to be is never direct. We learn
along the way, and inevitably sometimes we find we've taken the wrong path and need
to divert or turn back. Not uncommonly, something will happen to make us realize we
just did a bunch of work that needs to be thrown away. Sometimes this is because our
erroneous assumptions have been revealed; other times we simply realize a better way
of doing something.

![A pendulum swinging between two extremes.](pendulum.svg?bg)

Software development rarely moves in straight lines. We overcorrect in one direction,
learn from it, and swing back. Each swing gets us closer to equilibrium. The
equilibrium point is *discovered* through iteration, not designed upfront. In one
sense, we could consider this process like a multivariate search of the problem space
for optimal solutions. We might sit at a local maximum for some time, but so often it
is just that, and continued iteration brings us to yet more optimal solutions.

This lesson connects to the first: sometimes customer direction doesn't align
directly with our intended destination.

No matter the path, the hope is that we're always overall getting closer to where we
need to be. Even if we're tacking around trying to catch the wind, we're still moving
forward.

Cirrus's development is not short of examples of this lesson. Perhaps the biggest
example was previously mentioned in the [Part 1 post](cirrus-part-1), specifically
building then throwing away the project CLI, but I've compiled several more that I
think illustrate this lesson, each in a different and valuable way.

### Example 1: State database oscillations

Cirrus has always used DynamoDB for its state database. Even back in 2021, we felt
DynamoDB imposed problematic limitations and conceived of a new design leveraging
PostgreSQL. For reasons (see Lesson 1), we were never able to pursue this part of our
plans.

Until SWOOP, where we did use PostgreSQL. We learned a lot from that experience,
particularly around what it takes for PostgreSQL to accommodate the scale of our
largest Cirrus deployments like Earth Search. That's not extreme scale, but it's
still enough to require advanced techniques like table partitioning and explicit row
locks/skips. And it worked well, but it definitely required more operational
oversight and maintenance than Cirrus's use of DynamoDB.

We're still having this conversation today, five years later. Knowing what we know
now and seeing what features we want to support, the lack of extensibility in the
current Cirrus DynamoDB schema has become an impediment to new features. We've also
leveled up on DynamoDB and see new ways to make it work better for the things we want
to do. Now the conversation has shifted: we're on the verge of a complete redesign of
the state database, but we're most likely going to stick with DynamoDB. At least for
now.

### Example 2: Workflow chaining regrets

In late 2021, we added a feature to Cirrus called "workflow chaining." This addition
was in response to a customer need (again, see Lesson 1) for an in-the-box way to
have the output of one workflow flow into the input of another. Implementation of
this feature was easy: a slight payload format change provided support for a single
process definition, or an array of them in the case of chaining.

The last feature to land in Cirrus v0 is a thing called "workflow events". This
feature provides a new integration point for downstream systems and customizations
that require a real-time view into Cirrus state, but also enables an alternate and
more powerful pattern for chaining. Feeder lambdas can be subscribed to success
events as a way to generate new payloads for additional processing, adding any custom
business logic as necessary.

Looking back, I've started questioning if my gusto to quickly implement chaining
might have been a mistake. Not because it doesn't work—it does, and it certainly
seemed to work quite elegantly at the time—but having that feature likely meant that
we didn't seek more flexible solutions until much later. Now that workflow events
exist, should we remove chaining? Maybe. Chaining *is* simpler where it works, but
the simple in-the-box functionality is trivially replicated with a single lambda
subscribed to the workflow event stream.

Sometimes easy solutions can delay finding better ones. Or, perhaps sometimes, the
pendulum settles at equilibrium with *multiple valid solutions*. Built-in chaining
works great for straightforward pipelines. The pub/sub pattern offers more
flexibility: conditional logic, transformations, fan-in, decoupling. Both have their
place. The right abstraction at a higher level doesn't necessarily obsolete the
lower-level feature; sometimes they complement each other.

### Example 3: IaC Coupling

In the beginning, Cirrus was tightly coupled to Serverless Framework. The project CLI
tightened that coupling significantly. This ended up being a problem, as we saw. The
v1 rework, in response, completely decoupled Cirrus from IaC, at least in the core
project.

Except we realized that we'd overcorrected. With the v1 culling of Serverless we lost
all core resource definitions. Sure, we package the lambdas up into a zip, but they
are useless without knowing the SNS topics, SQS queues, IAM roles, and DynamoDB table
schema they require.

Recently, we added a minimal CloudFormation template back into the core repo as the
reference implementation. This has three effects:

- We can use that minimal template for development testing
- We have a source of truth for what the Cirrus core minimally requires (that isn't embedded deep within our highly-opinionated Terraform module)
- Changes to that template are an effective way to communicate what resource changes need to be made to use new features or be compatible with new releases

This journey has been about finding the right level of coupling. How do projects
provide cloud resource definitions without IaC lock-in? Our answer: use the vendor's
IaC solution (CloudFormation), since Cirrus is AWS-specific anyway. This answer is not
particularly satisfying, but it's the best one we've figured out so far. (This whole
problem seems to be one without a great solution—but please let me know if you know of
something I don't!)

### The broader pattern

Each of these examples shows how the pendulum swings: back and forth, in many
dimensions, all the time. We should embrace the swing: it's not failure or weakness to
say a past decision was bad, or that you've changed your mind. The swing, rather, is a
key mechanism for learning and growth. It's how we get *better*.

Embrace the swing. Recognize the swing is inevitable. Plan for it, or even better, use
it to your advantage. Pendulums have momentum: harness it.

## Lesson 3: The vision remains unchanged

For Cirrus, the vision can be summarized in three words: "failures are inevitable."

A lot is packed into those three words.

When reprocessing the Sentinel-2 catalog and its roughly 40 million scenes, failure
*will* happen. At that scale, it'll probably happen a lot.

Failure can happen in a workflow for many reasons. Service timeouts. API rate limits.
Malformed metadata. Unhandled edge cases. Corrupted files. Network issues. Missed
bugs. Extended Wednesday-morning maintenance windows (if you know, you know). The list
goes on.

The vision that's remained constant through all of Cirrus's evolution—from Cumulus in
2017 to today—is designing a system where failures at scale are manageable. This
means:

- **Failures need to be cheap**. State tracking makes retries inexpensive. Send in all the payloads again: items that previously succeeded get skipped automatically, only failures re-run. Don't pay to reprocess what's already done.
- **Failures need to be visible**. The state database and event logs let operators query, "What failed?" "Why did it fail?" "How often is this workflow failing?" You can't fix what you can't see.
- **Failures need to be easy to resolve**. Replay a workflow execution. Update the task logic and resubmit the payloads. Redrive payloads in a dead-letter queue. The system shouldn't make recovery harder than the failure itself.

This isn't just philosophy; we must make it reality. The architecture enables
iteration: process a million items, fix the failures, move on.

We haven't always excelled at realizing this vision, or even articulating it so
concretely. But we've always had a sense of what it was, and always kept it in mind.
The vision ensures that as we meander along the path, we know we're still headed,
however vaguely, in the right direction.

The broader message: every major project should set aside time to identify its
vision, those basic principles that cannot be compromised without compromising the
project itself. Doing so establishes the project's north star: the fixed reference
that contributors can always fall back to when determining if something is valuable or
in scope. Such principles are critical insurance against bloat, ill-conceived
features, and technical debt. Many things can risk a project's continued success, so a
strong vision is a core mitigation against that risk.

![Circular arcs of star trails over Earth, viewed from the International Space
Station.](star-trails.jpg)

*Star trails photographed from the International Space Station by NASA astronaut
Nichole Ayers.*

## Reflection

Cirrus has been an active project for over five years, and a concept for more than
eight. We've invested a not insignificant amount of time building it out to what it is
today, and have used it as a foundational component for a number of customer and
internal projects, including as the data orchestration framework for our public Earth
Search catalog. Cirrus is a key technology that enables us to develop these projects
efficiently and effectively. Reflecting on how we've then developed Cirrus is all the
more interesting given its importance in our work.

To recap, the three lessons I found from my experience working on Cirrus are:

- **Follow the money:** understand the motivations of those who are providing the resources for developement
- **The pendulum is real:** development is inevitably something of a random walk searching a problem space for an optimal solution
- **The vision remains unchanged:** know the core principles guiding a project and do not compromise them

As you navigate your own journey, whether that's in open source geospatial development
like me or something else entirely, I encourage taking time to document where you've
been and where you're headed. Reflect on what you've learned. Do these three lessons
apply to your projects? What other lessons emerge from your experience? [I'd be
interested to hear what others discover](https://element84.com/who-we-are/contact-us/)
in their own retrospectives.
