const checkCurrentURL = () => {
  let url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    runOnChange(url);
  }
}

const checkReadingPaneControlPosition = () => {
  let right = 20;
  let sidebar = $("div.v-ContextualSidebar");
  if(sidebar.is(":visible")){
    right += parseInt(sidebar.width());
  }
  $allButtons.css({
    "right": right + "px"
  });

  const splitRight = $("div.v-Hierarchy.v-Page-content div.v-Split--right");
  if(splitRight.length > 0) {
    if(parseInt(splitRight[0].getBoundingClientRect().width) < 400){
      $allButtons.hide();
    } else {
      $allButtons.show();
    }
  } else {
  }
}

// Periodically execute functions
setInterval(() => {
  runMiscActions();
  checkCurrentURL();
  checkReadingPaneControlPosition();
  // show alternative search box if not yet
  if(alternativeSearch && !alternativeSearchShown){
    alternativeSearchShown = setAltSearch();
  }
}, 300);

const runOnChange = (url) => {
  // reading pane is currently shown
  if(regexReadingPane.test(url)){
    // this might seem redundant but is necessary
    // in case composition is started (and done) from uncluttered mode
    showmainMenu();

    if(!mainMenuShown){
      hidemainMenu();
    }

    $allButtons.appendTo("body");
    if(!btnControlShown){
      $readingPaneButtons.hide();
    } else {
      $readingPaneButtons.show();
    }

  } else {
    $allButtons.detach();
    showmainMenu();
  }
};

$(window).on('resize', () => {
  checkReadingPaneControlPosition();
});


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
  setTimeout(() => {runOnChange(lastUrl)}, 500);

  // update icon badge with number of unread messages
  if(displayNumMessages){
    const timer = setInterval(setNewMessages, 10000);
  } else {
    setNewMessages("");
  }
});

