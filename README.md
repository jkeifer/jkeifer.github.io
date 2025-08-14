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
