// Set Parameters retrieved from Chrome storage

let displayNumMessages;
let useCusrorKeys;
let alternativeShortcutKeys;
let alternativeSearch;

let btnControlShown = true;
let mainMenuShown = true;
let alternativeSearchShown = false;

let lastUrl = null;

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

const regexMail = new RegExp('\/mail\/');
const regexCalendar = new RegExp('\/calendar\/');
const regexCompose = new RegExp('\/compose\/');
const regexReadingPane = new RegExp('\/T.{16}\.M.{24}');

