importScripts("libraries/browser-polyfill.js")

let badgeTimer;
const asyncFunctionWithAwait = (message, sender, sendResponse) => {
  const badgeText = browser.browserAction.getBadgeText({});
  badgeText.then(current => {
    if(badgeTimer) clearInterval(badgeTimer);
    if(message.type === "string"){
      if(current !== ""){
        browser.browserAction.setBadgeText({text: "" });
      }
    } else if(message.value == 0){
      if(current !== ""){
        browser.browserAction.setBadgeText({text: "" });
      }
    } else if(message.value > 0) {
      const messageValue = String(message.value);
      if(current !== messageValue){
        browser.browserAction.setBadgeText({text: messageValue });
      }
    }
    badgeTimer = setInterval(() => {
      browser.browserAction.setBadgeText({text: "" });
    },6000);
  });
}

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  asyncFunctionWithAwait(message, sender, sendResponse)
  return true;
});
