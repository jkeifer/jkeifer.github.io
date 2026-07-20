# Presentation Add-to-Calendar Button Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a gated "+ add to calendar" button to upcoming presentation pages that downloads a valid `.ics` event file.

**Architecture:** A Hugo template computes a visibility gate (`upcoming && start && end && address`), builds an iCalendar VEVENT string in `presentations/single.html`, and embeds it as a base64 `data:` URI on a download link. Text escaping is factored into a reusable `ical-escape` partial. No Hugo config or output-format changes.

**Tech Stack:** Hugo 0.148.2 extended, Go templates, plain CSS.

## Global Constraints

- Button renders **only** when all four hold: presentation is upcoming (`.Date >= today`), and `.Params.start`, `.Params.end`, `.Params.address` are all present. Missing any one → no button and no `.ics`.
- `start`/`end` are authored as offset-aware RFC3339 datetimes; the `.ics` emits them as UTC with a trailing `Z`.
- `.ics` `LOCATION` uses `address` only — never the display `location`.
- Delivery is an inline base64 `data:text/calendar` URI with a `download` attribute. No Hugo config changes, no custom output format.
- Existing `date` and `location` frontmatter fields are untouched.
- iCalendar text values escape `\`, `;`, `,`, and newlines (in that order).

---

### Task 1: Add the three fields to the archetype and one upcoming presentation

This provides the data the template needs to render, and updates the authoring template so new talks include the fields.

**Files:**
- Modify: `themes/minimal/archetypes/presentations.md`
- Modify: `content/presentations/20260830-foss4g-2026-raster-workshop/index.md`

**Interfaces:**
- Produces: frontmatter params `start`, `end` (offset-aware datetimes) and `address` (string) on the FOSS4G 2026 raster workshop page, used by Task 2's template gate and VEVENT.

- [ ] **Step 1: Add the fields to the archetype**

In `themes/minimal/archetypes/presentations.md`, insert these three lines immediately after the `location: ""` line:

```yaml
start: ""           # offset-aware datetime for calendar, e.g. 2026-08-30T14:00:00+09:00
end: ""             # offset-aware datetime for calendar, e.g. 2026-08-30T17:00:00+09:00
address: ""         # granular calendar location (street/building/room, or join URL); required for the add-to-calendar button
```

- [ ] **Step 2: Add the fields to the FOSS4G 2026 raster workshop**

In `content/presentations/20260830-foss4g-2026-raster-workshop/index.md`, insert these three lines immediately after the `location: "Hiroshima, Japan"` line. The times are placeholders consistent with the file's existing "schedule not yet published" TODO — flagged for the author to correct:

```yaml
# TODO: placeholder times/room pending the published FOSS4G 2026 schedule
start: 2026-08-30T14:00:00+09:00
end: 2026-08-30T17:00:00+09:00
address: "Hiroshima International Conference Center, Room TBD, Hiroshima, Japan"
```

- [ ] **Step 3: Build and verify frontmatter parses**

Run: `hugo --quiet --gc`
Expected: exits 0 with no errors (parses the new datetime fields without complaint).

- [ ] **Step 4: Commit**

```bash
git add themes/minimal/archetypes/presentations.md content/presentations/20260830-foss4g-2026-raster-workshop/index.md
git commit -m "content: add calendar start/end/address fields (archetype + FOSS4G 2026 raster)"
```

---

### Task 2: iCalendar escape partial + gated button in the presentation template

**Files:**
- Create: `themes/minimal/layouts/partials/ical-escape.html`
- Modify: `themes/minimal/layouts/presentations/single.html` (inside the `.post-meta-box` block, ~lines 58-77)

**Interfaces:**
- Consumes: `start`, `end`, `address` params from Task 1; the `$isUpcoming` variable already computed in `single.html`.
- Produces: rendered `<a class="cal-button" …>` consumed by Task 3's CSS.

- [ ] **Step 1: Create the escape partial**

Create `themes/minimal/layouts/partials/ical-escape.html` with exactly:

```go-html-template
{{- $s := . -}}
{{- $s = replace $s "\\" "\\\\" -}}
{{- $s = replace $s "\n" "\\n" -}}
{{- $s = replace $s ";" "\\;" -}}
{{- $s = replace $s "," "\\," -}}
{{- return $s -}}
```

(Backslash is escaped first so the backslashes added by later replacements are not doubled.)

- [ ] **Step 2: Add the gate + button to the template**

In `themes/minimal/layouts/presentations/single.html`, locate the closing of the `$hasStatus` note block inside `.post-meta-box`. It currently reads:

```go-html-template
        {{ end }}
    </div>
    {{ end }}
```

(the `{{ end }}` for `if $hasStatus`, then the `</div>` closing `.post-meta-box`, then the `{{ end }}` for the `if or .Params.summary $hasStatus`).

Insert the following **between** the `if $hasStatus`'s `{{ end }}` and the `</div>`:

```go-html-template
        {{ $canCal := and $isUpcoming .Params.start .Params.end .Params.address }}
        {{ if $canCal }}
        {{ $stamp := now.UTC.Format "20060102T150405Z" }}
        {{ $dtstart := (time.AsTime .Params.start).UTC.Format "20060102T150405Z" }}
        {{ $dtend := (time.AsTime .Params.end).UTC.Format "20060102T150405Z" }}
        {{ $desc := .Permalink }}
        {{ with .Params.summary }}{{ $desc = printf "%s\\n\\n%s" (partial "ical-escape" .) $.Permalink }}{{ end }}
        {{ $lines := slice
            "BEGIN:VCALENDAR"
            "VERSION:2.0"
            "PRODID:-//teotl.dev//presentations//EN"
            "BEGIN:VEVENT"
            (printf "UID:%s" .Permalink)
            (printf "DTSTAMP:%s" $stamp)
            (printf "DTSTART:%s" $dtstart)
            (printf "DTEND:%s" $dtend)
            (printf "SUMMARY:%s" (partial "ical-escape" .Title))
            (printf "LOCATION:%s" (partial "ical-escape" .Params.address))
            (printf "DESCRIPTION:%s" $desc)
            "END:VEVENT"
            "END:VCALENDAR" }}
        {{ $ics := delimit $lines "\r\n" }}
        <div class="cal-add">
            <a class="cal-button" download="{{ .Params.slug | default "event" }}.ics" href="data:text/calendar;charset=utf-8;base64,{{ $ics | base64Encode }}">+ add to calendar</a>
        </div>
        {{ end }}
```

- [ ] **Step 3: Build the site**

Run: `hugo --quiet --gc`
Expected: exits 0, no template errors.

- [ ] **Step 4: Verify the button renders on the upcoming presentation**

Run: `grep -c 'cal-button' public/presentations/foss4g-2026-raster-formats-workshop/index.html`
Expected: `1`

- [ ] **Step 5: Verify the encoded event has the correct UTC times**

Decode the data URI and check DTSTART/DTEND (14:00+09:00 → 05:00Z, 17:00+09:00 → 08:00Z):

Run:
```bash
grep -o 'base64,[A-Za-z0-9+/=]*' public/presentations/foss4g-2026-raster-formats-workshop/index.html | head -1 | sed 's/^base64,//' | base64 -d
```
Expected output contains:
```
DTSTART:20260830T050000Z
DTEND:20260830T080000Z
SUMMARY:Exploring Cloud Native Geospatial Data Formats: Hands-on with Raster Data
LOCATION:Hiroshima International Conference Center\, Room TBD\, Hiroshima\, Japan
```
(Note the escaped commas `\,` in LOCATION — confirms escaping works.)

- [ ] **Step 6: Verify a past presentation has NO button**

Run: `grep -c 'cal-button' public/presentations/esip-january-2026-ccrp/index.html`
Expected: `0` (ESIP Jan 2026 is in the past relative to the build date, so it fails the `$isUpcoming` gate even though it could otherwise qualify).

- [ ] **Step 7: Verify an upcoming presentation MISSING the fields has NO button**

Run: `grep -c 'cal-button' public/presentations/foss4g-2026-vector-formats-workshop/index.html`
Expected: `0` (upcoming but no `start`/`end`/`address`, so the gate fails).

- [ ] **Step 8: Commit**

```bash
git add themes/minimal/layouts/partials/ical-escape.html themes/minimal/layouts/presentations/single.html
git commit -m "theme: add-to-calendar .ics button for upcoming presentations"
```

---

### Task 3: Style the button

**Files:**
- Modify: `themes/minimal/static/css/style.css` (near the `.post-meta-box` rules, ~line 513)

**Interfaces:**
- Consumes: the `.cal-add` / `.cal-button` markup produced by Task 2.

- [ ] **Step 1: Add the CSS**

In `themes/minimal/static/css/style.css`, immediately after the `.post-meta-box .note-text p + p { … }` rule (around line 513), add:

```css
.post-meta-box .cal-add {
    margin-top: 0.75rem;
}

.cal-button {
    display: inline-block;
    padding: 0.3rem 0.75rem;
    font-size: 0.8rem;
    border: 1px solid var(--footer-text);
    border-radius: 4px;
    color: var(--text-color);
    text-decoration: none;
    line-height: 1.2;
}

.cal-button:hover {
    background-color: var(--code-bg);
}
```

- [ ] **Step 2: Build and verify the class is present in output CSS**

Run: `hugo --quiet --gc && grep -c '\.cal-button' public/css/style.css`
Expected: `1` (or more) — the rule is served.

- [ ] **Step 3: Visual check (manual)**

Run: `hugo server` and open `http://localhost:1313/presentations/foss4g-2026-raster-formats-workshop/`.
Expected: an "+ add to calendar" button appears inside the meta box under the "upcoming" note; clicking it downloads a `.ics` that opens in Calendar with the event at the correct local time. Confirm it looks right in both light and dark themes.

- [ ] **Step 4: Commit**

```bash
git add themes/minimal/static/css/style.css
git commit -m "theme: style the add-to-calendar button"
```

---

## Self-Review Notes

- **Spec coverage:** metadata fields (Task 1) ✓; timezone→UTC emission (Task 2, verified Step 5) ✓; four-part visibility gate (Task 2, verified Steps 4/6/7) ✓; placement in `.post-meta-box` (Task 2) ✓; base64 `data:` URI delivery (Task 2) ✓; VEVENT contents incl. escaping via partial (Tasks 2, verified Step 5) ✓; styling (Task 3) ✓; archetype update (Task 1) ✓.
- **Encoding resolution:** the spec's flagged `urlquery` caveat is resolved by using `base64Encode` instead of percent-encoding.
- **Type consistency:** `$isUpcoming` reused from existing template; `ical-escape` partial called consistently in Task 2; class names `cal-add`/`cal-button` match between Tasks 2 and 3.
```
