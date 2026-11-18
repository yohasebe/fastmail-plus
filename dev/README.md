# dev/ — diagnostic and image helpers

Console scripts used to keep Fastmail Plus in sync with Fastmail's web UI. They are
**not** part of the shipped extension (the `Rakefile` build does not include `dev/`).

Fastmail rolls out UI changes on <https://app.beta.fastmail.com/> first. The extension
warns in the DevTools console (`[Fastmail Plus] … matches nothing`) when a selector it
relies on stops matching; that is usually the first sign of a change.

When a Fastmail UI change breaks a feature, run the relevant script in the browser
DevTools console on an open Fastmail tab, then update the selectors in
[`../content/selectors.js`](../content/selectors.js) accordingly. Each script copies its
result to the clipboard and prints it to the console. None of them emit personal data —
they report only structure (tag names, ids, classes, attributes).

| Script | Run it when… | What it reports |
| --- | --- | --- |
| `diagnose.js` | First, broad survey (mail list + reading pane visible) | Whether known selectors still match, the class naming convention, the current URL, and a structural outline of the key regions |
| `probe-buttons.js` | A message is open | Every icon button with its icon class and rough screen position — used to find toolbar/header toggles |
| `probe-sidebar.js` | The right contextual panel is open | Sidebar-related classes and buttons near `v-ContextualSidebar` |
| `probe-uncluttered.js` | The uncluttered view visually broke (e.g. after double-clicking the mail pane) | The body class, the injected style rule, and the split panes' computed `left`/`position` — to see why the collapse stopped applying |

## How to run

1. Open Fastmail and put it in the state noted above.
2. Open DevTools → Console.
3. Paste the whole script and press Enter (the result is copied to the clipboard).

## Mockup images

`mockups.py` generates the SVG mockups in [`../images/mockups/`](../images/mockups/)
used by the README and the Chrome Web Store listing. They are drawn, not captured, so
they never contain real mail. Edit `mockups.py` rather than the SVGs, then run:

```
python3 dev/mockups.py
rake store_images   # PNGs for the store listing, written to build/store/
```

## Icons

The extension icons are rendered from [`../images/fastmail-plus.svg`](../images/fastmail-plus.svg).
Edit the SVG, then run `rake icons` to write the 16, 48 and 128px PNGs. The 128px
icon is also the store icon, so it keeps a 16px transparent margin.
