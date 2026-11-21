// Runs in the page itself (the manifest's "MAIN" world), where Fastmail's own
// objects are visible; the other content scripts cannot see them. It exposes three
// of Fastmail's settings as attributes on <html> (removed when they cannot be
// read):
//   data-fmp-fastmail-shortcuts: whether Fastmail's keyboard shortcuts are on ("on" / "off")
//   data-fmp-reading-pane: where the reading pane is ("right" / "below" / "off")
//   data-fmp-fastmail-language: the language Fastmail is shown in ("en", "ja", ...)
// and changes one of them on request: the reading pane position, when the
// layout button (see layout_toggle.js) sends LAYOUT_EVENT. Nothing else is written.
(() => {
  const SHORTCUTS_ATTR = 'data-fmp-fastmail-shortcuts';
  const PANE_ATTR = 'data-fmp-reading-pane';
  const LANGUAGE_ATTR = 'data-fmp-fastmail-language';
  const LAYOUT_EVENT = 'fmp-next-reading-pane';
  // Each position and the two Fastmail preferences that make it.
  const PANE_PREFS = {
    right: { showReadingPane: true, showPaneBelow: false },
    below: { showReadingPane: true, showPaneBelow: true },
    off: { showReadingPane: false },
  };
  const NEXT_PANE = { right: 'below', below: 'off', off: 'right' };

  const prefs = () => window.FastMail.preferences;
  const readShortcuts = () => {
    try {
      const value = prefs().get('enableKBShortcuts');
      return typeof value === 'boolean' ? (value ? 'on' : 'off') : null;
    } catch (_e) {
      return null;
    }
  };
  // Set when a change could not be made; the button is then hidden and no further
  // changes are attempted until the page is reloaded.
  let paneWriteFailed = false;
  const readPane = () => {
    if (paneWriteFailed) {
      return null;
    }
    try {
      const value = prefs().readingPanePosition();
      return Object.hasOwn(PANE_PREFS, value) ? value : null;
    } catch (_e) {
      return null;
    }
  };

  // Fastmail names the file of its interface text after the language, e.g. "ja.mod.js".
  const readLanguage = () => {
    try {
      const match = /^([a-z]{2,3}(?:-[a-z0-9]+)*)\.mod\.js$/i.exec(window.FastMail.language);
      return match ? match[1].toLowerCase() : null;
    } catch (_e) {
      return null;
    }
  };

  const setAttr = (name, value) => {
    const root = document.documentElement;
    if (value === null) {
      root.removeAttribute(name);
    } else if (root.getAttribute(name) !== value) {
      root.setAttribute(name, value);
    }
  };
  const update = () => {
    setAttr(SHORTCUTS_ATTR, readShortcuts());
    setAttr(PANE_ATTR, readPane());
    setAttr(LANGUAGE_ATTR, readLanguage());
  };

  // Move the reading pane to the next position, but only when the current one is
  // known; then read it back so the attribute shows what Fastmail now has. If a
  // write fails, put back both preferences as they were.
  document.addEventListener(LAYOUT_EVENT, () => {
    const current = readPane();
    if (current === null) {
      return;
    }
    const target = PANE_PREFS[NEXT_PANE[current]];
    const keys = Object.keys(PANE_PREFS.below);
    let before;
    try {
      before = keys.map((key) => [key, prefs().get(key)]);
      Object.entries(target).forEach(([key, value]) => prefs().set(key, value));
    } catch (_e) {
      paneWriteFailed = true;
      console.warn('[Fastmail Plus] Could not change the reading pane layout; the layout button is turned off until the page is reloaded.');
      try {
        (before || []).filter(([, value]) => typeof value === 'boolean')
          .forEach(([key, value]) => prefs().set(key, value));
      } catch (_e2) {
        // Nothing more can be done here.
      }
    }
    update();
  });

  update();
  // The preferences can be changed in Fastmail's settings at any time.
  setInterval(update, 1000);
})();
