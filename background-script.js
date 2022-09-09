let badgeTimer;
const asyncFunctionWithAwait = (message, sender, sendResponse) => {
  const badgeText = firefox.browserAction.getBadgeText({});
  badgeText.then(current => {
    if(badgeTimer) clearInterval(badgeTimer);
    if(message.type === "string"){
      if(current !== ""){
        firefox.browserAction.setBadgeText({text: "" });
      }
    } else if(message.value == 0){
      if(current !== ""){
        firefox.browserAction.setBadgeText({text: "" });
      }
    } else if(message.value > 0) {
      const messageValue = String(message.value);
      if(current !== messageValue){
        // chrome.action.setBadgeBackgroundColor({color: "#e84545"});
        firefox.browserAction.setBadgeText({text: messageValue });
      }
    }
    badgeTimer = setInterval(() => {
      firefox.browserAction.setBadgeText({text: "" });
    },6000);
  });
}

firefox.runtime.onMessage.addListener((message, sender, sendResponse) => {
  asyncFunctionWithAwait(message, sender, sendResponse)
  return true;
});
