const checkReadingPaneControlPosition = () => {
  let right = 20;
  let sidebar = $("div.v-ContextualSidebar");
  if(sidebar.is(":visible")){
    right += parseInt(sidebar.width());
  }
  $allButtons.css({
    "right": right + "px"
  });

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

const checkFirstTimeReady = () => {

  // update icon badge with number of unread messages
  if(displayNumMessages){
    setNumNewMessages()
    const timer = setInterval(setNumNewMessages, 5000);
  }

  // Detects if dark theme is enabled.
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
  if(maxMessageWidth) {
    let max_width = `
      <style>
        div.v-MessageCard.app-contentCard {
          max-width: 100% !important;
        }
      </style>
      `; 
    $('head').append($(max_width));
  }
  checkFirstTimeReady();
});
