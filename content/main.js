const checkReadingPaneControlPosition = () => {
  let right = 20;
  let sidebar = $("div.v-ContextualSidebar");
  if(sidebar.is(":visible")){
    right += parseInt(sidebar.width());
  }
  $allButtons.css({
    "right": right + "px"
  });

  if(showReadingPane) {
    if(parseInt(splitRight[0].getBoundingClientRect().width) < 400){
      $allButtons.hide();
    } else {
      $allButtons.show();
    }
  } else {
    ;
  }
}

const runOnChange = (url) => {

  if(leftOrRight == undefined){
    leftOrRight = "left";
  }

  // currently in mail mode
  if(regexMail.test(url)){

    const selected = $(`a.v-MailboxItem-link[href*='${url}']`);
    if(selected.length > 0){
      cursorPosition = selected.parent().attr("id");
    }

    // check whether it is "Show reading pane mode"
    splitRight = $("div.v-Hierarchy.v-Page-content div.v-Split--right");
    if(splitRight.length > 0) {
      showReadingPane = true;
    } else {
      showReadingPane = false;
    }

    // reading pane is currently shown
    if(regexReadingPane.test(url)){

      if(!readingPaneControlPositionTimer){
        readingPaneControlPositionTimer = setInterval(checkReadingPaneControlPosition, 300);
      }

      showmainMenu();
      colorPlainText();
      foldQuote();

      if(!mainMenuShown){
        hidemainMenu();
      }

      $allButtons.appendTo("body");
      if(!btnControlShown){
        $readingPaneButtons.hide();
      } else {
        $readingPaneButtons.show();
      }
      return true;
    }
  }

  if(readingPaneControlPositionTimer){
    clearInterval(readingPaneControlPositionTimer);
  }
  $allButtons.detach();
  showmainMenu();
};

const setNumNewMessages = (msg) => {
  let numNewMessages;
  if(msg != undefined){
    numNewMessages = msg;
  } else {
    numNewMessages = $("li.v-MailboxSource.v-MailboxSource--inbox span.v-MailboxSource-badge").first().text();
  }
  if (chrome.runtime?.id) {
    chrome.runtime.sendMessage({
      type: "number",
      value: numNewMessages
    });
  }
};

// check current URL;
setInterval(() => {
  let url = location.href;
  if (url !== lastUrl) {
    runOnChange(url);
    lastUrl = url;
  }
}, 300);

$(window).on('resize', () => {
  if(readingPaneControlPositionTimer){
    checkReadingPaneControlPosition();
  }
});

const checkFirstTimeReady = () => {
  let t1 = setInterval(() => {
    if($("div#mailbox").length > 0){
      runOnChange(lastUrl);
      if(alternativeSearch) {
        setAltSearch();
      }
    }
    // update icon badge with number of unread messages
    if(displayNumMessages){
      const timer = setInterval(setNumNewMessages, 10000);
    } else {
      setNumNewMessages("");
    }
    clearInterval(t1);
  }, 300);
}

$(document).ready(() => {
  checkFirstTimeReady();
});

