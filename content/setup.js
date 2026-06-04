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

let useCursorKeys;
let alternativeShortcutKeys;
let alternativeSearch;
let maxMessageWidth;

let lastUrl = "https://fastmail.com";
let searchMode = "anywhere";
let readingPaneControlPositionTimer = null;
let composePaneControlPositionTimer = null;
let focusOnMessage = true;
let firstTimeReady = false;
let btnControlShown = true;
let mainMenuShown = true;
let splitRight;
let splitPanes;
let cursorPosition;
let leftOrRight;

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
});