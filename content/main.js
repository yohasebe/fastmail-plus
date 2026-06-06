const checkReadingPaneControlPosition = () => {
  let right = 20;
  // Shift the buttons left by the width of the right contextual sidebar (present
  // in the DOM only while open). When closed there is no element, so :visible is
  // false and no offset is applied.
  let sidebar = $(SEL.contextualSidebar);
  if(sidebar.is(":visible")){
    right += parseInt(sidebar.width());
  }
  $allButtons.css({
    "right": right + "px"
  });
}

const makeResizable = (url) => {
  // currently in compose/note mode
  if (regexCompose.test(url) || regexNotes.test(url)) {
    composePaneControlPositionTimer = setInterval(() => {
      // Skip elements already made resizable (.ui-resizable). Re-initializing
      // every tick recreates the handle and causes it to flicker.
      const $fresh = $(`${SEL.composeCard}, ${SEL.noteCard}`).not('.ui-resizable');
      $fresh.resizable({
        handles: 'e',
        // Remember the dragged width so the next compose/note opens at that size.
        stop: (_e, ui) => {
          composeWidth = Math.round(ui.size.width);
          chrome.storage.local.set({ composeWidth });
        }
      });
      // Apply the remembered width to each freshly-initialized pane (once; later
      // ticks skip it via .not('.ui-resizable'), so a live drag is never overridden).
      if (composeWidth) {
        $fresh.css('width', composeWidth + 'px');
      }
      // The reply quote (appendonsend) appears inside compose, so fold it here.
      foldQuote();
    }, 300);
  } else {
    if (composePaneControlPositionTimer) {
      clearInterval(composePaneControlPositionTimer);
      composePaneControlPositionTimer = null;
    }
  }
}

// Whether a conversation (reading pane) is shown. Compose/note are excluded
// (compose also has a v-MessageCard, so without the URL exclusion the buttons
// would show incorrectly).
const isConversationShown = () =>
  regexMail.test(location.href) &&
  !regexCompose.test(location.href) &&
  !regexNotes.test(location.href) &&
  !isComposing() &&
  isReadingPaneShown();

const enterReadingPane = () => {
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
  // Position the buttons immediately; the main poll keeps them in place after that
  // (no dedicated interval — see checkFirstTimeReady).
  checkReadingPaneControlPosition();
};

const exitReadingPane = () => {
  $allButtons.detach();
  showmainMenu();
};

// Watch the reading pane (v-MessageCard) visibility and show/hide the buttons
// only on change. Detection is DOM-based (not URL-based), so it is polled.
// Showing is immediate; hiding is debounced only when the card disappears while
// staying on a mail conversation page (a re-render), to avoid flicker. Leaving
// to compose/another page closes immediately.
let readingPaneShown = false;
let readingPaneAbsentTicks = 0;
const READING_PANE_EXIT_TICKS = 3; // close after ~900ms of the card being absent
const applyReadingPaneState = () => {
  if(isConversationShown()){
    readingPaneAbsentTicks = 0;
    if(!readingPaneShown){
      readingPaneShown = true;
      enterReadingPane();
    }
    return;
  }
  if(!readingPaneShown){
    return;
  }
  // If only the card vanished while still on a mail conversation page, it is
  // likely a re-render, so debounce. Leaving to compose/note/another page closes
  // immediately.
  const stillInMailConversation =
    regexMail.test(location.href) &&
    !regexCompose.test(location.href) &&
    !regexNotes.test(location.href);
  if(stillInMailConversation){
    readingPaneAbsentTicks++;
    if(readingPaneAbsentTicks < READING_PANE_EXIT_TICKS){
      return;
    }
  }
  readingPaneShown = false;
  readingPaneAbsentTicks = 0;
  exitReadingPane();
};

const runOnChange = (url) => {
  if(alternativeSearch && $("#alt-search").length == 0) {
    setAltSearch();
  }

  makeResizable(url);

  // currently in mail mode
  if(regexMail.test(url)){

    // Reflect the currently focused list item into cursorPosition.
    // (The old URL match via a.v-MailboxItem-link[href] no longer works in the
    //  new UI, so read it directly from the is-focused class.)
    const focusedItem = $(SEL.mailboxItemFocused);
    if(focusedItem.length > 0){
      cursorPosition = focusedItem.attr("id");
    }

    // check whether it is "Show reading pane mode"
    splitRight = $(SEL.splitRightInHierarchy);
    if(splitRight.length > 0) {
      splitPanes = true;

      // Rebind with a namespace each time to prevent the handler from being
      // registered multiple times across navigation.
      $("body").off("click.fmp").on("click.fmp", (e) => {
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
      $("body").off("click.fmp");
    }

    if(leftOrRight == undefined){
      leftOrRight = "left";
    }
    if(splitPanes){
      indicateLeftRight("left");
    }
  } else {
    $("body").off("click.fmp");
  }

  // Reading-pane button visibility is decided from the DOM (v-MessageCard).
  applyReadingPaneState();
};

const checkFirstTimeReady = () => {

  // Theme detection is no longer needed (the pane indicator in indicateLeftRight
  // is now theme-independent).

  let t1 = setInterval(() => {
    if($(SEL.searchInputAny).length > 0){
      runOnChange(lastUrl);

      clearInterval(t1);

      // check current URL;
      setInterval(() => {
        let url = location.href;
        if (url !== lastUrl) {
          runOnChange(url);
          lastUrl = url;
        }
        // Decide reading-pane button visibility from the DOM every tick rather
        // than relying on URL changes (the card may be unrendered at the moment
        // the URL changes).
        applyReadingPaneState();
        // Keep the floating buttons positioned while the reading pane is shown
        // (folded into this single poll instead of a separate interval).
        if(readingPaneShown){
          checkReadingPaneControlPosition();
        }
      }, 300);

      $(window).on('resize', () => {
        if(readingPaneShown){
          checkReadingPaneControlPosition();
        }
      });
    }
  }, 300);
}

$(document).ready(() => {
  if(maxMessageWidth) {
    maximizeMessageWidth();
  }
  checkFirstTimeReady();
});
