let badgeTimer;

const asyncFunctionWithAwait = (message) => {
  const badgeText = chrome.action.getBadgeText({});
  badgeText.then(current => {
    if(badgeTimer) clearInterval(badgeTimer);
    if(message.value == 0){
      if(current !== ""){
        chrome.action.setBadgeText({text: "" });
      }
    } else if(message.value > 0) {
      const messageValue = String(message.value);
      if(current !== messageValue){
        chrome.action.setBadgeText({text: messageValue });
      }
    }
    badgeTimer = setInterval(() => {
      chrome.action.setBadgeText({text: "" });
    },6000);
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  asyncFunctionWithAwait(message, sender, sendResponse)
  return true;
});

chrome.runtime.onInstalled.addListener((details) => {
  if(details.reason == "update" || details.reason == "install"){
    chrome.storage.local.set({'justUpdated': true}, () => {});
  }
});
