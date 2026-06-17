# Changelog

All notable changes to this project are documented here.
Earlier history (before 0.3.0) is available in the git commit log.

## [0.4.1] - 2026-06-17

### Fixed
- Uncluttered view stays collapsed when double-clicking the mail pane. Fastmail
  overwrites `body.className`, which wiped the class; it is now re-asserted instantly
  via a MutationObserver (before paint, so no flicker), with a poll as backup.
- Reading-pane button icons are inlined as SVG instead of being loaded via
  `chrome.runtime.getURL`, so they can no longer blank out or throw "Extension
  context invalidated" when the extension is reloaded/updated. (Also makes the icons
  follow the theme color, improving visibility in dark mode.)
- A stale content script (after the extension is reloaded/updated) no longer throws
  "Extension context invalidated": the poll stops gracefully and all chrome.storage
  writes are guarded, so button clicks / resize / zoom on an old tab stay quiet.

## [0.4.0] - 2026-06-06

### Added
- Adjustable message body text size: zoom the message body only (not the whole
  browser UI) using CSS `zoom`, so even emails with hard-coded px font sizes
  enlarge. A reading-pane button shows the current size and expands a small
  [A+ / ↺ / A-] group upward; shortcuts are `^⇧+` / `^⇧-` / `^⇧0`. The setting is
  remembered. (Wide fixed-width content may get a horizontal scrollbar.)
- The compose/note pane now remembers its resized width and reopens at that size.
- The reading-pane button group remembers whether it is collapsed or expanded.

### Changed
- Reading-pane button hover help now uses the browser's native tooltip (subtle and
  delayed) showing a short description of each button. The extension's own `?`
  tooltip overlay was removed — Fastmail's built-in `?` shortcut help is used for
  keys instead.

## [0.3.0] - 2026-06-04

Catch-up release for the redesigned Fastmail web UI (`app.fastmail.com`).

### Added
- `content/selectors.js`: all DOM selectors are now centralized in one file, so a
  future Fastmail UI change can usually be followed by editing only this file.
- `dev/` console diagnostic helpers (`diagnose.js`, `probe-sidebar.js`,
  `probe-buttons.js`) to locate changed selectors. These are not packaged into the
  extension. See `dev/README.md`.
- `CHANGELOG.md` (this file).

### Changed
- Reading-pane detection is now based on the presence of `v-MessageCard` in the DOM
  instead of the old message-URL pattern, which the new UI no longer uses.
- Alternative-search buttons restyled to native icon buttons (send `→` / cycle),
  matching Fastmail's standard buttons; the search query now uses `location.origin`
  (so `app.fastmail.com` works).
- The reading-pane focus indicator is now theme-independent (a single accent line on
  the active pane, none on the inactive pane).
- The compose/note resize handle is now visible (a centered grip bar) and no longer
  flickers.
- Right contextual panel toggle (`Shift + Control + I`) updated for the new UI, which
  swaps the toggle icon between `i-sidebar` (open) and `i-close` (close).
- Comments across the codebase unified to English.
- `Rakefile`: `rake chrome` / `rake firefox` now use `ln -sf` (works on macOS too).

### Fixed
- Removed a leftover click handler that called an undefined function, which threw a
  console error when clicking a mail-list item or message.
- Text-editing keys are no longer hijacked: `Cmd+Right` / `Cmd+Shift+Right` (and other
  keys) now work while typing in the compose body, subject, etc. Editing is detected
  from `document.activeElement` (including `isContentEditable`) instead of matching a
  fixed set of element classes, which missed nested rich-text editor nodes.
- Uncluttered (near-fullscreen) view no longer reopens the mail list column when the
  browser zoom / text size changes. It is now driven by a body class + a CSS
  `!important` rule (which beats Fastmail's inline layout) instead of an inline width,
  so there is no flicker. The toggle button icon now reflects state
  (fullscreen / exit-fullscreen).
- Compose/reply editor no longer has the pane-focus indicator (a stray blue bar on
  its toolbar) and `Enter` now inserts a newline instead of being hijacked by a
  reading-pane shortcut. Inline replies keep the conversation URL, so compose is now
  detected from the DOM (`.v-Compose` / `.v-EditNote`) rather than the URL.
- Pane focus indicator no longer paints a stray dark line in light theme (broken
  `t-dark` detection always evaluated true).
- `Ctrl + R` reload shortcut (previously called an undefined function).
- `fold_quote.js` button id was a literal `${btId}` (single-quoted) instead of being
  interpolated.
- Guarded `scrollTop` / `scrollIntoView` calls against missing elements.
- `.gitignore` now correctly ignores the local `manifest.json` symlink.

### Notes
- The screenshots in `README.md` still show the previous Fastmail UI and may be
  refreshed separately.
- Firefox (Manifest V2) shares the same code path but was not verified on-device in
  this release.
