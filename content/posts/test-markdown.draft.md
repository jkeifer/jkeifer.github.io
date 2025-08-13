---
title: "Markdown Test Page"
date: 2025-08-13T10:00:00-08:00
lastmod: 2025-08-14T15:30:00-08:00
draft: true
description: "A comprehensive test of all markdown features"
math: true
summary: "Test page with various markdown features, for reference or theme development."
toc: true
showSummary: true
note: "This is a test note with a link to [example.com](https://example.com)"
---

This page tests all markdown features supported by Hugo and our custom theme.

## Headers

# H1 Header
## H2 Header
### H3 Header
#### H4 Header
##### H5 Header
###### H6 Header

## Text Formatting

This is a paragraph with **bold text**, *italic text*, ***bold italic text***, and ~~strikethrough text~~.

You can also use _underscores for italic_ and __double underscores for bold__.

Here's some `inline code` within a paragraph.

## Lists

### Unordered List

- First item
- Second item
  - Nested item 1
  - Nested item 2
    - Deep nested item
- Third item

### Ordered List

1. First step
2. Second step
   1. Sub-step A
   2. Sub-step B
3. Third step

### Task List

- [x] Completed task
- [ ] Incomplete task
- [ ] Another todo item

### Definition List

Term 1
: Definition for term 1

Term 2
: Definition for term 2
: Another definition for term 2

## Links and Images

### Links

- [Internal link to home](/)
- [External link to Hugo](https://gohugo.io)
- [Link with title](https://example.com "This is a title")
- <https://automatic-link.com>
- Reference-style link to [Hugo][1]

[1]: https://gohugo.io "Hugo Static Site Generator"

### Images

![Alt text for image](https://via.placeholder.com/600x400 "Image title")

## Code

### Inline Code

Use `git status` to check your repository status.

### Code Blocks

```bash
#!/bin/bash
echo "Hello, World!"
for i in {1..5}; do
    echo "Number: $i"
done
```

```python
def fibonacci(n):
    """Generate Fibonacci sequence"""
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b

# Print first 10 Fibonacci numbers
for num in fibonacci(10):
    print(num)
```

```javascript
// React component example
const Button = ({ onClick, children }) => {
  return (
    <button
      className="btn btn-primary"
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

```go
package main

import "fmt"

func main() {
    fmt.Println("Hello from Go!")
}
```

## Tables

### Basic Table

| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |

### Aligned Table

| Left Aligned | Center Aligned | Right Aligned |
|:-------------|:--------------:|--------------:|
| Left         | Center         | Right         |
| Text         | Text           | Text          |
| 123          | 456            | 789           |

### Complex Table

| Feature | Basic | Pro | Enterprise |
|---------|:-----:|:---:|:----------:|
| Users   | 1     | 5   | Unlimited  |
| Storage | 1GB   | 10GB| 100GB      |
| Support | Email | Priority | 24/7 Phone |
| Price   | Free  | $9/mo | $99/mo    |

## Blockquotes and Alerts

### Regular Blockquote

> This is a regular blockquote.
> It can span multiple lines.
>
> And have multiple paragraphs.

### Nested Blockquote

> This is the outer quote.
>> This is a nested quote.
>>> This can go even deeper.

### GitHub-style Alerts

> **NOTE**
> Useful information that users should know, even when skimming content.
{.note}

> **TIP**
> Helpful advice for doing things better or more easily.
{.tip}

> **IMPORTANT**
> Key information users need to know to achieve their goal.
{.important}

> **WARNING**
> Urgent info that needs immediate user attention to avoid problems.
{.warning}

> **CAUTION**
> Advises about risks or negative outcomes of certain actions.
{.caution}

## Other Elements

### Horizontal Rule

---

### Line Breaks

This is line one.
This is line two (with two spaces before line break).

This is a new paragraph.

### HTML Elements

<div style="background-color: var(--code-bg); padding: 1rem; border-radius: 4px;">
This is a custom HTML div element.
</div>

### Footnotes

Here's a sentence with a footnote[^1].

You can also use inline footnotes^[This is an inline footnote].

[^1]: This is the footnote text that appears at the bottom.

### Abbreviations

The HTML specification is maintained by the W3C.

*[HTML]: HyperText Markup Language
*[W3C]: World Wide Web Consortium

### Keyboard Input

Press <kbd>Ctrl</kbd> + <kbd>C</kbd> to copy.

### Math (if supported)

Inline math: $E = mc^2$

Block math:
$$
\frac{n!}{k!(n-k)!} = \binom{n}{k}
$$

## Special Characters

- Copyright: ©
- Registered: ®
- Trademark: ™
- Euro: €
- Em dash: —
- En dash: –
- Ellipsis: …
- Non-breaking space: &nbsp;

## Emoji

Hugo supports emoji :smile: :heart: :rocket:

## Summary

This page demonstrates the various markdown features available in Hugo. The rendering may vary based on your theme configuration and any custom shortcodes or render hooks you've implemented.
