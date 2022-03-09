const checkCurrentURL = () => {
  let url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    runOnChange(url);
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
  runMiscActions();
  checkCurrentURL();
  checkSidebar();
  // show alternative search box if not yet
  if(alternativeSearch && !alternativeSearchShown){
    alternativeSearchShown = setAltSearch();
  }
}, 300);

$(window).on('resize', () => {
  const currentURL = location.href;
  runOnChange(currentURL);
});

const runOnChange = (url) => {
  // in mail view do this regardless of reading pain shown or not
  if(regexMail.test(url)){
    ;
  }

  // reading pane is currently shown
  if(regexConversation.test(url)){
    showmainMenu();
    const splitRight = $("div.v-Hierarchy.v-Page-content div.v-Split--right");
    if(splitRight.length > 0) {
      showReadingPane = true;
      // hide concentrate view
      // $btnMainMenu.hide();
      // $btnMainMenu.click(false);
      // hide control if width is not enough
      if(parseInt(splitRight[0].getBoundingClientRect().width) < 400){
        return true;
      }
    } else {
      showReadingPane = false;
    }

    $allButtons.appendTo("body");
    if(!btnControlShown){
      $conversationButtons.hide();
    } else {
      $conversationButtons.show();
    }
    if(!mainMenuShown){
      hidemainMenu();
    }
  } else {
    $allButtons.detach();
    showmainMenu();
  }
};

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
  runOnChange(lastUrl);

  // update icon badge with number of unread messages 
  if(displayNumMessages){
    const timer = setInterval(setNewMessages, 5000);
  } else {
    setNewMessages("");
  }
});

