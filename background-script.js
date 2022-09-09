let badgeTimer;
const asyncFunctionWithAwait = (message, sender, sendResponse) => {
  const badgeText = chrome.action.getBadgeText({});
  badgeText.then(current => {
    if(badgeTimer) clearInterval(badgeTimer);
    if(message.type === "string"){
      if(current !== ""){
        chrome.browserAction.setBadgeText({text: "" });
      }
    } else if(message.value == 0){
      if(current !== ""){
        chrome.browserAction.setBadgeText({text: "" });
      }
    } else if(message.value > 0) {
      const messageValue = String(message.value);
      if(current !== messageValue){
        // chrome.action.setBadgeBackgroundColor({color: "#e84545"});
        chrome.browserAction.setBadgeText({text: messageValue });
      }
    }
    badgeTimer = setInterval(() => {
      chrome.browserAction.setBadgeText({text: "" });
    },6000);
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  asyncFunctionWithAwait(message, sender, sendResponse)
  return true;
});
