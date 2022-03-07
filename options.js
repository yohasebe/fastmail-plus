chrome.storage.local.get(["alternativeSearch", "displayNumMessages", "alternativeShortcutKeys", "useCusrorKeys"], (val) => {
  $('[name="alternative-search"]').prop('checked', val.alternativeSearch);
  $('[name="display-num-messages"]').prop('checked', val.displayNumMessages);
  $('[name="alternative-shortcut-keys"]').prop('checked', val.alternativeShortcutKeys);
  $('[name="use-cusror-keys"]').prop('checked', val.useCusrorKeys);
});

$("#alternative-search").on("click", () => {
  let alternativeSearch = $('[name="alternative-search"]').prop('checked');
  chrome.storage.local.set({'alternativeSearch': alternativeSearch}, () => {});
})

$("#display-num-messages").on("click", () => {
  let displayNumMessages = $('[name="display-num-messages"]').prop('checked');
  chrome.storage.local.set({'displayNumMessages': displayNumMessages}, () => {});
})

$("#alternative-shortcut-keys").on("click", () => {
  let alternativeShortcutKeys = $('[name="alternative-shortcut-keys"]').prop('checked');
  chrome.storage.local.set({'alternativeShortcutKeys': alternativeShortcutKeys}, () => {});
})

$("#use-cusror-keys").on("click", () => {
  let useCusrorKeys = $('[name="use-cusror-keys"]').prop('checked');
  chrome.storage.local.set({'useCusrorKeys': useCusrorKeys}, () => {});
})

$("#go-to-fastmail").on("click", () => {
  chrome.tabs.create({ url: "http://www.fastmail.com/" });
})

$("#sign-up-with-fastmail").on("click", () => {
  chrome.tabs.create({ url: "https://ref.fm/u27773408" });
})

