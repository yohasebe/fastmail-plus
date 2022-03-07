let lastUrl = location.href;
const checkCurrentURL = () => {
  let url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    toggleVisibility(url);
  }
}

const checkSidebar = () => {
  let right = 20;
  let sidebar = $("div.v-ContextualSidebar");
  if(sidebar.is(":visible")){
    right += parseInt(sidebar.width());
  }
  $allButtons.css({
    "right": right + "px"
  });
}

// Periodically execute functions
setInterval(() => {
  $('div[id*="appendonsend"]').each(foldQuote);
  $('div.u-containSelection.v-Message-body pre').each(colorPlainText);
  checkCurrentURL();
  checkSidebar();
}, 300);

const setNewMessages = (msg) => {
  let newMessage;
  if(msg != undefined){
    numMessages = msg;
  } else {
    numMessages = $("li.v-MailboxSource.v-MailboxSource--inbox span.v-MailboxSource-badge").first().text();
  }
  if (chrome.runtime?.id) {
    chrome.runtime.sendMessage({
      type: "number",
      value: numMessages
    });
  }
};

$(document).ready(() => {
  if(alternativeSearch){
    setTimeout(setAltSearch, 1500);
  }
  toggleVisibility(lastUrl);
  if(displayNumMessages){
    const timer = setInterval(setNewMessages, 5000);
  } else {
    setNewMessages("");
  }
  // in case "show reading pane" is selected
  // but right-hand side is invisible, conversation control
  // should be disabled;
  toggleVisibility();
});

