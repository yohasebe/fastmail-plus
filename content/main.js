const checkReadingPaneControlPosition = () => {
  let right = 20;
  let sidebar = $("div.v-ContextualSidebar");
  if(sidebar.is(":visible")){
    right += parseInt(sidebar.width());
  }
  $allButtons.css({
    "right": right + "px"
  });

  // if(splitPanes) {
  //   if(parseInt($("div#mailbox")[0].getBoundingClientRect().width) < 400){
  //     $allButtons.hide();
  //   } else {
  //     $allButtons.show();
  //   }
  // } else if ($("div#conversation")) {
  //   try{
  //     if(parseInt($("div#conversation")[0].getBoundingClientRect().width) < 400){
  //       $allButtons.hide();
  //     } else {
  //       $allButtons.show();
  //     }
  //   } catch(error){
  //     ;
  //   }
  // }
}

const runOnChange = (url) => {
  // currently in mail mode
  if(regexMail.test(url)){

    const selected = $(`a.v-MailboxItem-link[href*='${url}']`);
    if(selected.length > 0){
      cursorPosition = selected.parent().attr("id");
    }

    // check whether it is "Show reading pane mode"
    splitRight = $("div.v-Hierarchy.v-Page-content div.v-Split--right");
    if(splitRight.length > 0) {
      splitPanes = true;

      $("body").on("click", (e) => {
        if (e.target.id == "conversation" || $(e.target).parents("#conversation").length ||
          e.target.id == "allButtons" || $(e.target).parents("#allButtons").length) {
          leftOrRight = "right"
          indicateLeftRight("right");
        } else if (e.target.id == "mailbox" || $(e.target).parents("#mailbox").length) {
          leftOrRight = "left"
          indicateLeftRight("left");
        }
      });
    } else {
      splitPanes = false;
      $("body").off("click");
    }

    if(leftOrRight == undefined){
      leftOrRight = "left";
    }
    if(splitPanes){
      indicateLeftRight("left");
    }

    // reading pane is currently shown
    if(regexReadingPane.test(url)){

      if(!readingPaneControlPositionTimer){
        readingPaneControlPositionTimer = setInterval(checkReadingPaneControlPosition, 300);
      }

      showmainMenu();
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
    } else {
      if(readingPaneControlPositionTimer){
        clearInterval(readingPaneControlPositionTimer);
      }
      $allButtons.detach();
      showmainMenu();
    }
  } else {
    $("body").off("click");
    if(readingPaneControlPositionTimer){
      clearInterval(readingPaneControlPositionTimer);
    }
    $allButtons.detach();
    showmainMenu();
  }
};

const setNumNewMessages = () => {
  console.log("x");
  let numNewMessages;
  const inbox = $("li.v-MailboxSource.v-MailboxSource--inbox");
  const badge = inbox.find("span.v-MailboxSource-badge").first().text();
  numNewMessages = badge ? parseInt(badge) : 0;

  if (chrome.runtime?.id && regexMail.test(location.href)){
    chrome.runtime.sendMessage({
      type: "number",
      value: numNewMessages
    });
  } else {
    chrome.runtime.sendMessage({
      type: "string",
      value: ""
    });
  }
};

const checkFirstTimeReady = () => {

  // update icon badge with number of unread messages
  if(displayNumMessages){
    setNumNewMessages()
    const timer = setInterval(setNumNewMessages, 5000);
  }

  if($("html.t-dark") != null ){
    themeType = 'dark'
  }

  let t1 = setInterval(() => {
    if($("div#mailbox").length > 0 || $("div#conversation").length > 0){

      runOnChange(lastUrl);

      if(alternativeSearch) {
        setAltSearch();
      }

      clearInterval(t1);

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

    }
  }, 300);
}

$(document).ready(() => {
  checkFirstTimeReady();
});
