chrome.storage.local.get(["alternativeSearch", "displayNumMessages", "alternativeShortcutKeys", "useCursorKeys"], (val) => {
  $('[name="alternative-search"]').prop('checked', val.alternativeSearch);
  $('[name="display-num-messages"]').prop('checked', val.displayNumMessages);
  $('[name="alternative-shortcut-keys"]').prop('checked', val.alternativeShortcutKeys);
  $('[name="use-cusror-keys"]').prop('checked', val.useCursorKeys);
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
  let useCursorKeys = $('[name="use-cusror-keys"]').prop('checked');
  chrome.storage.local.set({'useCursorKeys': useCursorKeys}, () => {});
})

$("#go-to-fastmail").on("click", () => {
  chrome.tabs.create({ url: "http://www.fastmail.com/" });
})

$("#github-repo").on("click", () => {
  chrome.tabs.create({ url: "https://github.com/yohasebe/fastmail-plus" });
})

$("#sign-up-with-fastmail").on("click", () => {
  chrome.tabs.create({ url: "https://ref.fm/u27773408" });
})
