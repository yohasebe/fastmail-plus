let badgeTimer;
const asyncFunctionWithAwait = (message, sender, sendResponse) => {
  const badgeText = chrome.action.getBadgeText({});
  badgeText.then(current => {
    if(badgeTimer) clearInterval(badgeTimer);
    if(message.type === "string"){
      if(current !== ""){
        chrome.action.setBadgeText({text: "" });
      }
    } else if(message.value == 0){
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
