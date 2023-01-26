chrome.storage.local.get(["alternativeSearch", "alternativeShortcutKeys", "useCursorKeys", "maxMessageWidth", "justUpdated"], (val) => {
  $('[name="alternative-search"]').prop('checked', val.alternativeSearch);
  $('[name="alternative-shortcut-keys"]').prop('checked', val.alternativeShortcutKeys);
  $('[name="use-cusror-keys"]').prop('checked', val.useCursorKeys);
  $('[name="max-message-width"]').prop('checked', val.maxMessageWidth);
  if (val.justUpdated){
    $('.updated').show();
    chrome.storage.local.set({'justUpdated': false}, () => {});
  } else {
    $('span.updated').hide();
  }
});

$("#alternative-search").on("click", () => {
  let alternativeSearch = $('[name="alternative-search"]').prop('checked');
  chrome.storage.local.set({'alternativeSearch': alternativeSearch}, () => {});
})

$("#alternative-shortcut-keys").on("click", () => {
  let alternativeShortcutKeys = $('[name="alternative-shortcut-keys"]').prop('checked');
  chrome.storage.local.set({'alternativeShortcutKeys': alternativeShortcutKeys}, () => {});
})

$("#use-cusror-keys").on("click", () => {
  let useCursorKeys = $('[name="use-cusror-keys"]').prop('checked');
  chrome.storage.local.set({'useCursorKeys': useCursorKeys}, () => {});
})

$("#max-message-width").on("click", () => {
  let maxMessageWidth = $('[name="max-message-width"]').prop('checked');
  chrome.storage.local.set({'maxMessageWidth': maxMessageWidth}, () => {});
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
