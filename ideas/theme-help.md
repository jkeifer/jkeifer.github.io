---
title: "Theme Switching Without JavaScript"
draft: false
---

If you have JavaScript disabled, you can still change the theme using these methods:

## Method 1: URL Hash

Add one of these to the end of any URL:
- Light mode: `#light`
- Dark mode: `#dark`  
- System mode: Remove the hash

Example: `https://jkeifer.github.io/#dark`

## Method 2: Browser Console

If you have access to the browser console:

```javascript
// For light mode
document.documentElement.className = 'theme-light';

// For dark mode  
document.documentElement.className = 'theme-dark';

// For system mode
document.documentElement.className = '';
```

## Method 3: Browser Extensions

Many browsers have extensions that can inject CSS classes or toggle dark mode on any website.