const regexMail = new RegExp('\/mail\/');
const regexCalendar = new RegExp('\/calendar\/');
const regexCompose = new RegExp('\/compose\/');
const regexReadingPane = new RegExp('\/T.{16}\.M.{24}');

let displayNumMessages;
let useCusrorKeys;
let alternativeShortcutKeys;
let alternativeSearch;

let splitRight;
let searchMode = "anywhere";
let altSearchBoxTimer = null;
let readingPaneControlPositionTimer = null;
// let leftOrRightTimer = null;
let focusOnMessage = true;
let showReadingPane;
let cursorPosition;
let leftOrRight;
let firstTimeReady = false;

let btnControlShown = true;
let mainMenuShown = true;
let alternativeSearchShown = false;

let lastUrl = "https://fastmail.com";

// Set Parameters retrieved from Chrome storage

const keys = [
  "displayNumMessages",
  "useCusrorKeys",
  "alternativeShortcutKeys",
  "alternativeSearch"
]

const getSyncStorage = (keys) => new Promise(resolve => {
  chrome.storage.local.get(keys, resolve);
});

getSyncStorage().then((vals) => {
  displayNumMessages = vals.displayNumMessages === undefined ? true : vals.displayNumMessages;
  useCusrorKeys = vals.useCusrorKeys === undefined ? true : vals.useCusrorKeys;
  alternativeShortcutKeys = vals.alternativeShortcutKeys === undefined ? true : vals.alternativeShortcutKeys;
  alternativeSearch = vals.alternativeSearch === undefined ? true : vals.alternativeSearch;
});

