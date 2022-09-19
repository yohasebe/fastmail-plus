const regexMail = new RegExp('\/mail\/');
const regexCalendar = new RegExp('\/calendar\/');
const regexCompose = new RegExp('\/compose\/');
const regexReadingPane = new RegExp('\/T.{16}\.M.{24}');

let displayNumMessages;
let useCursorKeys;
let alternativeShortcutKeys;
let alternativeSearch;
let maxMessageWidth;

let lastUrl = "https://fastmail.com";
let searchMode = "anywhere";
let themeType = "light"; // could be "light" or "dark"
let readingPaneControlPositionTimer = null;
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
  "displayNumMessages",
  "useCursorKeys",
  "alternativeShortcutKeys",
  "alternativeSearch",
  "maxMessageWidth"
]

const getSyncStorage = (keys) => new Promise(resolve => {
  chrome.storage.local.get(keys, resolve);
});

getSyncStorage().then((vals) => {
  displayNumMessages = vals.displayNumMessages === undefined ? true : vals.displayNumMessages;
  useCursorKeys = vals.useCursorKeys === undefined ? true : vals.useCursorKeys;
  alternativeShortcutKeys = vals.alternativeShortcutKeys === undefined ? true : vals.alternativeShortcutKeys;
  alternativeSearch = vals.alternativeSearch === undefined ? true : vals.alternativeSearch;
  maxMessageWidth = vals.maxMessageWidth === undefined ? true : vals.maxMessageWidth;
});

