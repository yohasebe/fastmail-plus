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
  // currently in mail mode
  if(regexMail.test(url)){
    if(!altSearchBoxTimer){
      altSearchBoxTimer = setInterval(setAltSearchBox, 300);
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

      // this might seem redundant but is necessary
      // in case composition is started (and done) from uncluttered mode
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
    }

  // currently not in mail mode (calendar, contacts, etc.)
  } else {
    if(altSearchBoxTimer !== null){
      clearInterval(altSearchBoxTimer);
    }
    if(readingPaneControlPositionTimer){
      clearInterval(readingPaneControlPositionTimer);
    }
    $allButtons.detach();
    showmainMenu();
  }
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

const setAltSearchBox = () => {
  // show alternative search box if not yet
  if(alternativeSearch && !alternativeSearchShown){
    alternativeSearchShown = setAltSearch();
  }
}

// check current URL;
setInterval(() => {
  let url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    runOnChange(url);
  }
}, 300);

$(window).on('resize', () => {
  if(readingPaneControlPositionTimer){
    checkReadingPaneControlPosition();
  }
});

$(document).ready(() => {
  setTimeout(() => {runOnChange(lastUrl)}, 500);

  // update icon badge with number of unread messages
  if(displayNumMessages){
    const timer = setInterval(setNumNewMessages, 10000);
  } else {
    setNumNewMessages("");
  }
});

