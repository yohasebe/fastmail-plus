chrome.storage.local.get(["alternativeSearch", "alternativeShortcutKeys", "useCursorKeys", "maxMessageWidth", "hlPaneKeys", "spaceToggle", "justUpdated"], (val) => {
  // Leave the page's default checkbox state for settings that were never saved.
  const setChecked = (name, value) => {
    if (value !== undefined) {
      document.querySelector(`[name="${name}"]`).checked = value;
    }
  };
  setChecked("alternative-search", val.alternativeSearch);
  setChecked("alternative-shortcut-keys", val.alternativeShortcutKeys);
  setChecked("use-cusror-keys", val.useCursorKeys);
  setChecked("max-message-width", val.maxMessageWidth);
  setChecked("hl-pane-keys", val.hlPaneKeys);
  setChecked("space-toggle", val.spaceToggle);
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
  "max-message-width": "maxMessageWidth",
  "hl-pane-keys": "hlPaneKeys",
  "space-toggle": "spaceToggle"
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
