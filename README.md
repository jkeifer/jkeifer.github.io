# teotl.dev

Personal blog built with Hugo and a custom minimal theme.

## Quick Start

### Writing a new post

```sh
hugo new posts/my-new-post.md
```

This creates a new draft post with all the theme's frontmatter options.

### Local development

```sh
hugo server -DF
```

### Build for production

```sh
hugo
```

Builds to `public/` directory.

## Key Commands

- `hugo new posts/post-name.md` - Create new post
- `hugo server -D` - Run dev server with drafts
- `hugo server` - Run dev server (published only)
- `hugo` - Build site
- `git push origin src` - Deploy (triggers GitHub Actions)

## Presentations

Each talk *delivery* is its own page bundle under `content/presentations/`,
named `YYYYMMDD-event-talk/`:

```sh
hugo new presentations/20261102-foss4g-na-2026-vector-workshop/index.md
```

Key frontmatter:

- `slug` — event-qualified URL slug (`foss4g-na-2026-vector-formats-workshop`);
  required because repeat deliveries share a title
- `date` — the delivery date; future dates are built (`buildFuture`) and shown
  in the "upcoming" section of `/presentations/`
- `talks` — grouping term shared by all deliveries of the same talk; creates a
  `/talks/<term>/` page listing every delivery with the latest highlighted.
  Omit for one-off talks; add to every delivery once a talk repeats.
- `event`/`eventUrl`/`location` — plain values, the templates own formatting
- `ptype` — talk | workshop | poster | keynote (badge in lists)
- `links` — slides, repos, recordings; archive slides as PDFs *into the
  bundle* and link them with a bundle-relative href
- `note` — free-form escape hatch (markdown ok) for anything structured
  fields can't say

The page body is the abstract as delivered. The home RSS feed only includes
posts; presentations have their own feed at `/presentations/index.xml`.

## Images

### Option 1: Page Bundle (Recommended)

```sh
hugo new posts/my-post/index.md
# Add images to content/posts/my-post/
# Reference: ![alt](image.png)
```

### Option 2: Static Directory

```sh
# Add images to static/images/
# Reference: ![alt](/images/image.png)
```

## Project Structure

- `content/` - Blog posts and pages
- `themes/minimal/` - Custom theme
- `layouts/` - Site-specific overrides
- `static/` - Static files (CNAME, robots.txt)
- `.github/workflows/` - GitHub Actions for deployment

## Theme Features

- Light/dark mode toggle
- Responsive design
- Syntax highlighting
- Table of contents
- Draft indicators
- Reading time
- Related posts
- GitHub-style alerts
- Configurable navigation

## Deployment

Pushes to the `src` branch automatically deploy to GitHub Pages via GitHub
Actions.
