// The page's text comes from _locales, in the language Fastmail is shown in (as
// last seen by the extension), else in the browser's language, else in English.
// Language codes (Fastmail's, e.g. "zh-tw", or the browser's, e.g. "pt-BR") and
// the _locales folder for each. A code is looked up whole, then by its language
// alone, so "en-gb" uses "en" and "zh-hk" uses "zh_TW".
const PAGE_LANGUAGES = {
  cs: "cs", da: "da", de: "de", en: "en", es: "es", fi: "fi", fr: "fr", hu: "hu",
  it: "it", ja: "ja", nb: "no", no: "no", nl: "nl", pl: "pl", pt: "pt_BR",
  ru: "ru", sv: "sv", tr: "tr", uk: "uk",
  zh: "zh_CN", "zh-cn": "zh_CN", "zh-tw": "zh_TW", "zh-hk": "zh_TW",
};
const pageLanguage = (...codes) => {
  for (const code of codes) {
    const full = (code || "").toLowerCase().replace("_", "-");
    const folder = PAGE_LANGUAGES[full] || PAGE_LANGUAGES[full.split("-")[0]];
    if (folder) {
      return folder;
    }
  }
  return "en";
};
// Text that cannot be read from that file comes from Chrome's own choice of locale.
const readMessages = async (language) => {
  try {
    const response = await fetch(chrome.runtime.getURL(`_locales/${language}/messages.json`));
    return await response.json();
  } catch (_e) {
    return {};
  }
};
chrome.storage.local.get("fastmailLanguage", async ({ fastmailLanguage }) => {
  const language = pageLanguage(fastmailLanguage, chrome.i18n.getUILanguage());
  const messages = await readMessages(language);
  document.documentElement.lang = language.replace("_", "-");
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    el.textContent = (messages[key] && messages[key].message) || chrome.i18n.getMessage(key);
  });
});

// While Fastmail's own keyboard shortcuts are on, H/L stay Fastmail's
// (the content scripts enforce this too).
const showFastmailShortcuts = (value) => {
  const on = value === true;
  document.getElementById("hl-pane-keys").disabled = on;
  document.getElementById("fastmail-shortcuts-on").hidden = !on;
};
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.fastmailShortcuts) {
    showFastmailShortcuts(changes.fastmailShortcuts.newValue);
  }
});

chrome.storage.local.get(["alternativeSearch", "alternativeShortcutKeys", "useCursorKeys", "hlPaneKeys", "layoutButton", "fastmailShortcuts", "justUpdated"], (val) => {
  // Leave the page's default checkbox state for settings that were never saved.
  const setChecked = (name, value) => {
    if (value !== undefined) {
      document.querySelector(`[name="${name}"]`).checked = value;
    }
  };
  setChecked("alternative-search", val.alternativeSearch);
  setChecked("alternative-shortcut-keys", val.alternativeShortcutKeys);
  setChecked("use-cusror-keys", val.useCursorKeys);
  setChecked("hl-pane-keys", val.hlPaneKeys);
  setChecked("layout-button", val.layoutButton);
  showFastmailShortcuts(val.fastmailShortcuts);
  document.querySelectorAll('.updated').forEach((el) => {
    el.style.display = val.justUpdated ? '' : 'none';
  });
  if (val.justUpdated){
    chrome.storage.local.set({'justUpdated': false}, () => {});
  }
});

// Save each checkbox to its storage key when clicked.
const checkboxSettings = {
  "alternative-search": "alternativeSearch",
  "alternative-shortcut-keys": "alternativeShortcutKeys",
  "use-cusror-keys": "useCursorKeys",
  "hl-pane-keys": "hlPaneKeys",
  "layout-button": "layoutButton"
};
Object.entries(checkboxSettings).forEach(([id, key]) => {
  document.getElementById(id).addEventListener("click", (e) => {
    chrome.storage.local.set({ [key]: e.target.checked }, () => {});
  });
});

const openTabOnClick = (id, url) => {
  document.getElementById(id).addEventListener("click", () => {
    chrome.tabs.create({ url });
  });
};
openTabOnClick("go-to-fastmail", "http://www.fastmail.com/");
openTabOnClick("github-repo", "https://github.com/yohasebe/fastmail-plus");
openTabOnClick("sign-up-with-fastmail", "https://ref.fm/u27773408");
