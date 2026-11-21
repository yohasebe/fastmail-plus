// A button next to the search box that moves Fastmail's reading pane:
// Side → Bottom → Off → Side. The change itself is made by fastmail_prefs.js
// (which can reach Fastmail's preferences) and is saved like a change made in
// Fastmail's settings. The button is shown only while fastmail_prefs.js can read
// the current position.
const READING_PANE_ATTR = 'data-fmp-reading-pane';
const LAYOUT_EVENT = 'fmp-next-reading-pane';

const readingPanePosition = () => document.documentElement.getAttribute(READING_PANE_ATTR);

// A window outline with the pane drawn where it goes (iconSvg is defined in
// alternative_search.js).
const LAYOUT_FRAME = '<rect x="3" y="4" width="18" height="16" rx="2"></rect>';
const LAYOUTS = {
  right: { name: 'Side', icon: iconSvg(LAYOUT_FRAME + '<line x1="10" y1="4" x2="10" y2="20"></line>') },
  below: { name: 'Bottom', icon: iconSvg(LAYOUT_FRAME + '<line x1="3" y1="12" x2="21" y2="12"></line>') },
  off: { name: 'Off', icon: iconSvg(LAYOUT_FRAME) },
};
const NEXT_LAYOUT = { right: 'below', below: 'off', off: 'right' };

const layoutToggle = htmlToElement('<button id="layout-toggle" class="v-Button v-Button--standard v-Button--sizeM v-Button--iconOnly has-icon" style="margin-left:8px;"></button>');
// Also bound to Control + Shift + P (see extra_shortcuts.js).
const nextLayout = () => {
  document.dispatchEvent(new CustomEvent(LAYOUT_EVENT));
};
layoutToggle.addEventListener('click', nextLayout);

// Show the current position on the button, or hide it when it is unknown.
const showLayout = () => {
  const layout = LAYOUTS[readingPanePosition()];
  layoutToggle.hidden = !layout;
  if (layout) {
    layoutToggle.innerHTML = layout.icon;
    layoutToggle.title = `Reading pane: ${layout.name} (click for ${LAYOUTS[NEXT_LAYOUT[readingPanePosition()]].name}; Shortcut: Ctrl + Shift + P)`;
  }
};

// Put the button after the search controls. Called on every poll tick, since
// Fastmail can rebuild the toolbar without a page change.
const setLayoutToggle = () => {
  if (document.getElementById('layout-toggle')) {
    return;
  }
  const after = document.getElementById('search-toggle') || qs(`${SEL.searchInput}:not(#alt-search)`);
  if (after) {
    showLayout();
    after.after(layoutToggle);
  }
};

// The layout changes without a page change, so look at the panes again once
// Fastmail has redrawn them: the list has a pane beside it only in Side. Checked
// every LAYOUT_CHECK_INTERVAL until the panes match the position, for at most
// LAYOUT_CHECK_LIMIT checks; a newer change restarts the checks.
const LAYOUT_CHECK_INTERVAL = 300;
const LAYOUT_CHECK_LIMIT = 15;
let layoutCheckTimer = null;
const followLayout = () => {
  clearInterval(layoutCheckTimer);
  let checks = 0;
  layoutCheckTimer = setInterval(() => {
    checks++;
    const settled = (qs(SEL.splitRightInHierarchy) !== null) === (readingPanePosition() === 'right');
    if (settled || checks >= LAYOUT_CHECK_LIMIT) {
      clearInterval(layoutCheckTimer);
      detectSplitPanes();
    }
  }, LAYOUT_CHECK_INTERVAL);
};
// Started once whether or not the button is shown, since the position can also
// be changed in Fastmail's settings.
const watchLayout = () => {
  new MutationObserver(() => {
    showLayout();
    followLayout();
  }).observe(document.documentElement, { attributes: true, attributeFilter: [READING_PANE_ATTR] });
};
