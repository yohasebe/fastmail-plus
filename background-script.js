chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if(message.value === "" || parseInt(message.value) === 0){
    chrome.action.setBadgeBackgroundColor({color: "#0167b9"});
  } else {
    chrome.action.setBadgeBackgroundColor({color: "#e84545"});
  }
  chrome.action.setBadgeText({text: message.value });
});

