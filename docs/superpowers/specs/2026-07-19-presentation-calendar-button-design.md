# Add-to-calendar button for upcoming presentations

**Date:** 2026-07-19
**Status:** Approved design, pending implementation plan

## Problem

Presentation pages describe upcoming talks but give a visitor no easy way to
put the event on their own calendar. We want an "add to calendar" button on a
presentation page that downloads a standard `.ics` (iCalendar) file, so it works
with Apple Calendar, Google Calendar, Outlook, etc.

Constraints from the request:

- The button applies **only to upcoming presentations**, never past ones.
- The button is **not visible unless all requisite details are present** in the
  page's frontmatter.

## Non-goals

- No calendar *subscription* feed (a single one-shot "add this event" is enough).
- No third-party service links (e.g. a Google-Calendar-only URL). The `.ics` is
  universal and self-contained.
- No `VTIMEZONE`/DST rule generation. Times are emitted as absolute UTC instants
  (see Timezones).

## Metadata

Three new **optional** frontmatter fields on a presentation page bundle
(`content/presentations/<slug>/index.md`). All three must be present for the
button to render:

```yaml
start:   2026-08-30T14:00:00+09:00   # offset-aware RFC3339 datetime
end:     2026-08-30T17:00:00+09:00   # offset-aware RFC3339 datetime
address: "Hiroshima Int'l Conf Center, Room 201"   # granular, navigable location
```

Field semantics:

- **`start` / `end`** — full offset-aware datetimes. The UTC offset (`+09:00`,
  `-07:00`, `Z`, …) is authored explicitly so the venue's wall-clock time is
  unambiguous. Existing `date` (day granularity) is **untouched** and still
  drives the timeline, sorting, and upcoming/past logic. `start`/`end` are purely
  additive; the `start` day should agree with `date`, but nothing enforces it.
- **`address`** — the granular, navigable calendar location: street address,
  building, room number, or (for a virtual talk) a join URL / "virtual". This is
  distinct from the existing display field `location` (a human label such as
  "Hiroshima, Japan"). The `.ics` `LOCATION` uses `address` only; `location` is
  never used for the calendar event. `address` is **required** for the button —
  no address, no button — guaranteeing every generated event has a precise
  location.

## Timezones

Authors write `start`/`end` with the venue's real UTC offset. The template
converts each to UTC and emits it with a trailing `Z`:

```
DTSTART:20260830T050000Z
```

via `(time.AsTime .Params.start).UTC.Format "20060102T150405Z"`.

Consequence: every subscriber's calendar shows the correct absolute instant,
rendered in that subscriber's own local timezone. This is standard, correct
iCalendar behavior and avoids any need for `VTIMEZONE` blocks. Trade-off: the
event displays in the *viewer's* local time, not the *venue's* local time — the
accepted and expected behavior for an absolute event instant.

## Button visibility gate

The button renders only when **all** of the following hold:

1. `$isUpcoming` — the presentation is upcoming (`.Date >= today`). This value is
   already computed in `presentations/single.html`.
2. `.Params.start` is present.
3. `.Params.end` is present.
4. `.Params.address` is present.

Missing any one → no button, no `.ics`. This satisfies both requirements: past
talks never qualify (fails #1), and incomplete metadata never renders a broken
event (fails #2/#3/#4).

## Placement

A single link styled as a small button, reading `+ add to calendar`, placed
inside the existing `.post-meta-box` status area in
`themes/minimal/layouts/presentations/single.html` — directly under the "this
presentation is upcoming" note. That block already computes `$isUpcoming`, so the
gate reuses existing logic.

## Delivery: inline `data:` URI (approach A)

The template builds the full VEVENT text and embeds it directly in the link as a
data URI, with a `download` attribute so the browser saves it as a file that
opens in the user's calendar app:

```html
<a class="cal-button" download="talk.ics"
   href="data:text/calendar;charset=utf-8,{{ $ics | <percent-encode> }}">+ add to calendar</a>
```

> Encoding caveat for the plan: the VEVENT text must be **percent-encoded** for a
> `data:` URI. Hugo's `urlquery` encodes spaces as `+`, which a data URI does
> **not** decode back to a space — so `urlquery` alone is wrong. The plan must
> pick an encoding that percent-encodes spaces and newlines (e.g. build the
> encoding explicitly, or post-process `+`), and this must be verified against a
> real download.

Chosen over a Hugo custom output format (`single.ics.ics` + config/cascade)
because:

- No Hugo config changes and no cascade plumbing.
- No stray `.ics` files generated for presentations that lack times.
- Generation is fully controlled by the same `if` that gates the button.
- The VEVENT is tiny, so data-URI size is a non-issue.

Trade-off accepted: the URL is an opaque data URI rather than a clean,
right-click-saveable file URL. Fine for a one-shot "add event" button.

## VEVENT contents

```
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//teotl.dev//presentations//EN
BEGIN:VEVENT
UID:<page permalink>
DTSTAMP:<now, UTC>
DTSTART:<start, UTC>
DTEND:<end, UTC>
SUMMARY:<page title, escaped>
LOCATION:<address, escaped>
DESCRIPTION:<summary if present, escaped> + <page permalink>
END:VEVENT
END:VCALENDAR
```

- `UID` — the page permalink (stable, unique per delivery).
- `DTSTAMP` — build time in UTC.
- `SUMMARY` — the presentation title.
- `LOCATION` — `address` only.
- `DESCRIPTION` — the `summary` param if present, followed by a link back to the
  page permalink; permalink alone if there is no summary.

### Text escaping

Per RFC 5545, text values must escape backslash, comma, semicolon, and newlines.
The template applies, in order: `\` → `\\`, `;` → `\;`, `,` → `\,`, newline →
`\n`. Line-folding at 75 octets is **skipped** — Apple Calendar, Google Calendar,
and Outlook all tolerate long unfolded lines, and folding is fiddly to do
correctly in Hugo templates.

## Styling

Add a `.cal-button` rule to `themes/minimal/static/css/style.css`, near the
existing `.post-meta-box` rules (around line 485). Match the visual language of
existing badges/links: small, inline-block, subtle background, rounded corners,
readable in both themes via existing CSS variables. No new colors introduced.

## Files touched

- `themes/minimal/layouts/presentations/single.html` — compute the gate, build
  the VEVENT string, render the button inside `.post-meta-box`.
- `themes/minimal/static/css/style.css` — `.cal-button` styling.
- One or more upcoming presentation `index.md` files — add `start`, `end`,
  `address` to demonstrate/enable the feature (e.g. the ESIP 2026 talk).

## Testing / verification

- A presentation with all three fields, dated in the future → button appears and
  downloads a valid `.ics` that opens in Apple Calendar with the correct instant.
- The same presentation with `date` in the past → no button.
- An upcoming presentation missing `address` (or `start`, or `end`) → no button.
- Verify escaping with a title/address containing a comma and a semicolon.
- Verify the emitted `DTSTART`/`DTEND` UTC values match the authored offset
  (e.g. `14:00+09:00` → `0500Z`).
