let badgeTimer;
const asyncFunctionWithAwait = (message, sender, sendResponse) => {
  const badgeText = browser.action.getBadgeText({});
  badgeText.then(current => {
    if(badgeTimer) clearInterval(badgeTimer);
    if(message.type === "string"){
      if(current !== ""){
        browser.action.setBadgeText({text: "" });
      }
    } else if(message.value == 0){
      if(current !== ""){
        browser.action.setBadgeText({text: "" });
      }
    } else if(message.value > 0) {
      const messageValue = String(message.value);
      if(current !== messageValue){
        // browser.action.setBadgeBackgroundColor({color: "#e84545"});
        browser.action.setBadgeText({text: messageValue });
      }
    }
    badgeTimer = setInterval(() => {
      browser.action.setBadgeText({text: "" });
    },6000);
  });
}

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  asyncFunctionWithAwait(message, sender, sendResponse)
  return true;
});
