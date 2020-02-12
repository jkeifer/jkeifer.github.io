---
title: "Docs on master is an antipattern?"
date: 2020-02-14T15:03:17-08:00
publishDate: 2020-02-14T15:03:17-08:00
draft: true
tags:
- git
- antipattern
url: /posts/docs-on-master-is-an-antipattern
---

While I was setting up this blog recently, I had to clone a repo
to get a copy of the theme that I wanted to use. When I did so,
I was shocked to find the download took a couple of minutes and
had over 73 MB of files.

Not sure what, in a CSS dependency, could take up so much space,
I started digging through the disk usage, and found this damning
report:

```sh
❯ du -h -d 1 .
4.0K	./test
508K	./css
 72M	./docs
 20K	./.github
260K	./sass
 73M	.
```

Literally, more than 98% of the size of the repo was consumed by
the docs.

Now in this specific case, the majority of that space was consumed
by images for the documentation. Binary files in git are already
a bit of an issue (particulary if they are updated with any frequency),
but this leads me to question: are docs on the same branch as code
an antipattern?

If the docs were separated onto a different branch, the repo could be
cloned (including this specific case of a submodule included in a
different repo) sparsely such that these files could not need to be
included.


- recent experience cloning a repo
  - show du of the repo root
  - breakdown by % for docs

- realize that changes to docs will persist in the git history FOREVER

- Why did anyone think this was a good idea?
  - acknowledge that it is easier to understand
  - older versions of git made it harder
  - the docs are right there on github without digging around for the doc branch

- Generated resources (generally)
