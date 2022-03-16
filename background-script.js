// To avoid "Uncaught (in promise) Error"
// https://stackoverflow.com/questions/54017163
const asyncFunctionWithAwait = async (message, sender, sendResponse) => {
  if(message.type === "string"){
    chrome.action.setBadgeText({text: "" });
  } else if(message.value == 0){
    chrome.action.setBadgeBackgroundColor({color: "#0167b9"});
    chrome.action.setBadgeText({text: "0" });
  } else if(message.value > 0) {
    chrome.action.setBadgeBackgroundColor({color: "#e84545"});
    const messageValue = String(message.value);
    chrome.action.setBadgeText({text: messageValue });
  }
  resetBadge();
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  asyncFunctionWithAwait(message, sender, sendResponse)
  return true;
});

let badgeTimer;
const resetBadge = () => {
  if(badgeTimer){
    clearInterval(badgeTimer);
  }
  badgeTimer = setInterval(() => {
    chrome.action.setBadgeText({text: "" });
  },10000);
}
