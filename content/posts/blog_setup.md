---
title: "Create a static site with Hugo and GitHub pages"
date: 2020-02-11T12:52:22-08:00
draft: false
url: /posts/create-a-static-site-with-hugo-and-github-pages
---

As I mentioned in my first post, much of my resistance to blogging
has been a blend of prefectionism and an abhorrence to any chance
of having to deal with yet more infrastructure issue.
That is, I deal with broken crap at my day job; I really
don't want to have to worry about that for my blog.
In that vein, I pursued the simplest practical stack
with the quickest startup time, ending up with a static
site generated with [Hugo](https://gohugo.io/)
hosted as a GitHub page.

I initially deliberated between making my own generator and choosing
something premade. The "quick startup time" combined with my desire
to support both markdown and org-mode input files meant a simple shell
script of my own design probably wasn't the best choice. I also
did not want to use something requiring node.js, nor did a ruby/python
project feel like the most user-friendly path forward.

Hugo, as a go program, is a single statically-linked binary, meaning
less to worry about about and a quicker start. I had also played with
it in the past and knew it was featureful enough that anything I might
want to do in the future it would support. In the spirit of just getting
this done, the decision was made, and I didn't look back.

Installing Hugo is easy on Mac, just `brew install hugo`. Done.

To actually create my blog, I started with the
[quick-start guide](https://gohugo.io/getting-started/quick-start/). However,
I ended up throwing it all away when I realized the default was not going to
work well with
[GitHub pages](https://help.github.com/en/github/working-with-github-pages/about-github-pages).
That is, GitHub pages, for a user or organization page, expects the master
branch of a repo to have the static site files in the root, namely the
index.html file. But we don't want to pollute our source branch with
the build files (more on that in a future post), so we need to have
a separate branch with the hugo source content. Therefore, it became
clear that setting up the repo _before_ creating the hugo project is key.

First we create a repo, make a source branch, and then we can create a hugo
project in the repo:

```sh
$ mkdir your-blog
$ cd your-blog
$ git init
$ git checkout -b src
$ hugo new site . --force
```

It is also good to add a `.gitignore` before we get much further:

```sh
$ cat > .gitignore <<EOF
# Hugo output directories
/public
/resources

## OS Files
# Windows
Thumbs.db
ehthumbs.db
Desktop.ini
$RECYCLE.BIN/

# OSX
.DS_Store
EOF
```

We'll also need to create a repo on GitHub, obviously. For a user/orgnaization
GitHub pages site, the repo needs to be named like `your-username.github.io`,
and when we publish content it will be available at that URL.

Now that we have some files and a GitHub repo, let's commit and push this src branch:

```sh
$ git add .
$ git commit -m "inital commit"
$ git remote add origin git@github.com:your-username/your-blog.git
$ git push -u origin src
```

We now have a Hugo project, but it still needs some setup.
Following the quickstart guide, we need to add a theme and some content.
Then we can run the local server to validate everything works.
I chose to start with the
[Bare theme](https://themes.gohugo.io/bare-hugo-theme/):

```sh
$ git submodule add https://github.com/orf/bare-hugo-theme.git themes/bare
$ git submodule update --init --recursive  # actually clone the submodule
$ hugo new content/posts/first_post.md
# edit your post and set draft to false
$ hugo server  # test the site, accessible at localhost:1313
```

Great, but how do we publish this? By default Hugo will output the built site
into `./public/`. Because of the aforementioned expectation of GitHub pages,
we need that directory to map to somehow map to our master branch. Enter git worktrees.

Worktrees allow one to checkout multiple working copies of a repo into different
directories backed by the same local clone. Interestingly, they can be nested, so
we can make our `./public/` directory a worktree checkout of the master branch:

```sh
$ git checkout --orphan master  # create the master branch with no parent commits
$ git commit --allow-empty -m "initial content branch"
$ git push origin master
$ git checkout src
$ git worktree add -B master public origin/master
```

Now a Hugo build will create files in the master branch via our ./public/ worktree.
We can commit and push everything, and our content should show up on our Github pages site:

```sh
$ hugo  # build the site into ./public/
$ git add . && git commit -m "new content added"
$ (cd public && git add . && git commit -m "publish new site content")
$ git push --all
```

And there it is, a Hugo site hosted on GitHub pages.

(I'll note that I did consult the
[Hugo GitHub pages documentation](https://gohugo.io/hosting-and-deployment/hosting-on-github/),
but it does not provide any instructions for a user/org account
on separate branches in the same repo, as I desired.)
