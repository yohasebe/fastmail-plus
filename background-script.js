const asyncFunctionWithAwait = async (message, sender, sendResponse) => {
  const badgeText = chrome.action.getBadgeText({});
  badgeText.then(current => {
    if(message.type === "string"){
      if(current !== ""){
        chrome.action.setBadgeText({text: "?" });
      }
    } else if(message.value == 0){
      if(current !== "0"){
        chrome.action.setBadgeBackgroundColor({color: "#0167b9"});
        chrome.action.setBadgeText({text: "0" });
      }
    } else if(message.value > 0) {
      const messageValue = String(message.value);
      if(current !== messageValue){
        chrome.action.setBadgeBackgroundColor({color: "#e84545"});
        chrome.action.setBadgeText({text: messageValue });
      }
    }
    resetBadge();
  });
}

let tabId;
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  tabId = sender.tab.id;
  asyncFunctionWithAwait(message, sender, sendResponse)
  return true;
});

let badgeTimer;
const resetBadge = () => {
  if(badgeTimer){
    clearInterval(badgeTimer);
  }
  badgeTimer = setInterval(() => {
    const badgeText = chrome.action.getBadgeText({});
    badgeText.then(current => {
      if(current !== ""){
        chrome.action.setBadgeText({text: "" });
      }
    });
  },10000);
}
