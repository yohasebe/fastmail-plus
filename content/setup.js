const regexMail = new RegExp('\/mail\/');
const regexCalendar = new RegExp('\/calendar\/');
const regexNotes = new RegExp('\/notes\/');
const regexCompose = new RegExp('\/compose');

// In the 2026 UI the message URL changed from /T<16>.M<24> to /mail/<folder>/<id>,
// and a message can also be shown while the URL stays at /mail/Inbox/, so the URL
// can't reliably tell whether the reading pane is shown. Detect it from the
// presence of v-MessageCard in the DOM instead (also resilient to future URL changes).
const isReadingPaneShown = () => $(SEL.messageCardAny).length > 0;

// True while a compose/reply or note editor is open. Inline replies do NOT change
// the URL to /compose, so detect them from the DOM rather than the URL — otherwise
// the pane-focus indicator and reading-pane key handlers leak into the editor
// (e.g. Enter getting hijacked instead of inserting a newline).
const isComposing = () => $(SEL.composeActive).length > 0;

// True when the user is typing in any editable field: an input, a textarea, or any
// contenteditable region (the rich-text body, subject, etc.). Used to avoid
// hijacking keys (arrows, Cmd+arrows, Enter, ...) while editing. Checking
// document.activeElement + isContentEditable is far more reliable than matching a
// fixed set of element classes — rich-text editors focus a nested node whose tag
// and classes vary, but isContentEditable is true for anything inside the region.
const isEditingText = () => {
  const el = document.activeElement;
  if (!el) {
    return false;
  }
  const tag = el.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || el.isContentEditable === true;
};

let useCursorKeys;
let alternativeShortcutKeys;
let alternativeSearch;
let maxMessageWidth;

let lastUrl = "https://fastmail.com";
let searchMode = "anywhere";
let composePaneControlPositionTimer = null;
let composeWidth = null; // remembered width (px) of the resizable compose/note pane
let btnControlShown = true;
let mainMenuShown = true;
let splitRight;
let splitPanes;
let cursorPosition;
let leftOrRight;

// --- Body-only text zoom ---------------------------------------------------
// Scales the message body only (not the whole browser UI) via CSS `zoom`, so even
// emails with hard-coded px font sizes enlarge (a container font-size can't override
// explicit px). Applied via an injected stylesheet generated from SEL, and persisted.
// Trade-off: fixed-width content (e.g. wide tables) may get a horizontal scrollbar.
let bodyFontScale = 1.0;
const BODY_ZOOM_MIN = 0.7;
const BODY_ZOOM_MAX = 2.5;
const BODY_ZOOM_STEP = 0.1;

const applyBodyFontScale = () => {
  const pct = Math.round(bodyFontScale * 100);
  let style = document.getElementById("fmp-body-zoom");
  if (!style) {
    style = document.createElement("style");
    style.id = "fmp-body-zoom";
    document.head.appendChild(style);
  }
  style.textContent = `${SEL.messageBody} { zoom: ${bodyFontScale} !important; }`;
  // Keep the main button label showing the current setting (by id, so this stays
  // decoupled from the button's jQuery object defined in reading_pane_control.js).
  const label = document.querySelector("#btnFontSize .label");
  if (label) {
    label.textContent = `${pct}%`;
  }
};

const setBodyFontScale = (scale) => {
  const clamped = Math.min(BODY_ZOOM_MAX, Math.max(BODY_ZOOM_MIN, Math.round(scale * 10) / 10));
  bodyFontScale = clamped;
  applyBodyFontScale();
  chrome.storage.local.set({ bodyFontScale: clamped });
};

const bumpBodyFontScale = (delta) => setBodyFontScale(bodyFontScale + delta);
const resetBodyFontScale = () => setBodyFontScale(1.0);

// Set Parameters retrieved from Chrome storage

const keys = [
  "useCursorKeys",
  "alternativeShortcutKeys",
  "alternativeSearch",
  "maxMessageWidth"
]

const getSyncStorage = (keys) => new Promise(resolve => {
  chrome.storage.local.get(keys, resolve);
});

getSyncStorage().then((vals) => {
  useCursorKeys = vals.useCursorKeys === undefined ? true : vals.useCursorKeys;
  alternativeShortcutKeys = vals.alternativeShortcutKeys === undefined ? true : vals.alternativeShortcutKeys;
  alternativeSearch = vals.alternativeSearch === undefined ? true : vals.alternativeSearch;
  maxMessageWidth = vals.maxMessageWidth === undefined ? true : vals.maxMessageWidth;
  bodyFontScale = vals.bodyFontScale === undefined ? 1.0 : vals.bodyFontScale;
  composeWidth = vals.composeWidth === undefined ? null : vals.composeWidth;
  btnControlShown = vals.btnControlShown === undefined ? true : vals.btnControlShown;
  applyBodyFontScale();
});