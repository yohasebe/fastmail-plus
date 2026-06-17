# dev/ — diagnostic helpers

Console scripts used to keep Fastmail Plus in sync with Fastmail's web UI. They are
**not** part of the shipped extension (the `Rakefile` build does not include `dev/`).

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
