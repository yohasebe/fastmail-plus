// Runs in the page itself (the manifest's "MAIN" world), where Fastmail's own
// objects are visible; the other content scripts cannot see them. It reads one
// preference, whether Fastmail's keyboard shortcuts are on, and exposes it as an
// attribute on <html> ("on" / "off", removed when it cannot be read).
(() => {
  const ATTR = 'data-fmp-fastmail-shortcuts';
  const read = () => {
    try {
      const value = window.FastMail.preferences.get('enableKBShortcuts');
      return typeof value === 'boolean' ? (value ? 'on' : 'off') : null;
    } catch (_e) {
      return null;
    }
  };
  const update = () => {
    const value = read();
    const root = document.documentElement;
    if (value === null) {
      root.removeAttribute(ATTR);
    } else if (root.getAttribute(ATTR) !== value) {
      root.setAttribute(ATTR, value);
    }
  };
  update();
  // The preference can be changed in Fastmail's settings at any time.
  setInterval(update, 1000);
})();
