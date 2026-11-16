const checkReadingPaneControlPosition = () => {
  let right = 20;
  // Shift the buttons left by the width of the right contextual sidebar (present
  // in the DOM only while open). When closed there is no element, so :visible is
  // false and no offset is applied.
  const sidebar = qs(SEL.contextualSidebar);
  if(isVisible(sidebar)){
    right += Math.round(sidebar.getBoundingClientRect().width);
  }
  // This runs on every poll tick; write only when the value changes.
  const value = right + "px";
  if(allButtons.style.right !== value){
    allButtons.style.right = value;
  }
}

// Make a compose/note pane resizable from its right edge. The dragged width is
// remembered so the next compose/note opens at that size.
const RESIZABLE_CLASS = 'fmp-resizable';
const makePaneResizable = (pane) => {
  pane.classList.add(RESIZABLE_CLASS);
  const handle = document.createElement('div');
  handle.className = 'fmp-resize-handle';
  pane.appendChild(handle);

  handle.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) {
      return;
    }
    e.preventDefault(); // no text selection while dragging
    const startX = e.clientX;
    // Computed width follows the pane's box-sizing, so it can be written back as is.
    const startWidth = parseFloat(getComputedStyle(pane).width);
    handle.setPointerCapture(e.pointerId);

    const onMove = (ev) => {
      pane.style.width = Math.max(0, startWidth + ev.clientX - startX) + 'px';
    };
    const onEnd = () => {
      handle.removeEventListener('pointermove', onMove);
      handle.removeEventListener('pointerup', onEnd);
      handle.removeEventListener('pointercancel', onEnd);
      if (pane.style.width) {
        // Save the rendered width, which CSS min-/max-width have already clamped.
        composeWidth = Math.round(parseFloat(getComputedStyle(pane).width));
        safeStorageSet({ composeWidth });
      }
    };
    handle.addEventListener('pointermove', onMove);
    handle.addEventListener('pointerup', onEnd);
    handle.addEventListener('pointercancel', onEnd);
  });
};

// Make every open compose/note pane resizable, including inline replies (which
// open inside the conversation without changing the URL). Called on each poll
// tick; it returns at once when no editor is open, and panes already set up are
// skipped so the handle never flickers. Note cards are also tagged with
// NOTE_CARD_CLASS for main.css (their wrapper has no stable class of its own).
const NOTE_CARD_CLASS = 'fmp-note-card';
const initResizablePanes = () => {
  if(!isComposing()){
    return;
  }
  const notePanes = [...noteEditors].map((editor) => editor.parentElement);
  notePanes.forEach((pane) => pane && pane.classList.add(NOTE_CARD_CLASS));
  [...composeEditors].map((editor) => editor.parentElement).concat(notePanes)
    .filter((pane) => pane && !pane.classList.contains(RESIZABLE_CLASS))
    .forEach((pane) => {
      makePaneResizable(pane);
      // Apply the remembered width once, on initialization, so a live drag is
      // never overridden by later ticks.
      if (composeWidth) {
        pane.style.width = composeWidth + 'px';
      }
    });
};

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
  if(!mainMenuShown){
    hidemainMenu();
  }
  // Apply the persisted collapsed/expanded state BEFORE attaching, so the cluster
  // renders directly in that state with no initial slide animation.
  if(!btnControlShown){
    readingPaneButtons.classList.add('fmp-anim');   // collapsed stays clipped
    allButtons.classList.add('fmp-collapsed');
  } else {
    allButtons.classList.remove('fmp-collapsed');
    readingPaneButtons.classList.remove('fmp-anim');
  }
  document.body.appendChild(allButtons);
  // Sync the toggle icon with the (possibly persisted) collapsed/expanded state.
  btnControl.innerHTML = btnControlLabel();
  // Position the buttons immediately; the main poll keeps them in place after that
  // (no dedicated interval — see checkFirstTimeReady).
  checkReadingPaneControlPosition();
};

const exitReadingPane = () => {
  allButtons.remove();
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

// In the split view, track which pane (list / message) was clicked last.
const paneClickHandler = (e) => {
  if (!(e.target instanceof Element)) {
    return;
  }
  if (e.target.closest("#conversation, #allButtons")) {
    leftOrRight = "right"
    indicateLeftRight("right");
  } else if (e.target.closest("#mailbox")) {
    leftOrRight = "left"
    indicateLeftRight("left");
  }
};

const runOnChange = (url) => {
  if(alternativeSearch && !document.getElementById("alt-search")) {
    setAltSearch();
  }

  // currently in mail mode
  if(regexMail.test(url)){

    // Reflect the currently focused list item into cursorPosition.
    // (The old URL match via a.v-MailboxItem-link[href] no longer works in the
    //  new UI, so read it directly from the is-focused class.)
    const focusedItem = qs(SEL.mailboxItemFocused);
    if(focusedItem){
      cursorPosition = focusedItem.id || undefined;
    }

    // check whether it is "Show reading pane mode"
    splitRight = qs(SEL.splitRightInHierarchy);
    if(splitRight) {
      splitPanes = true;
      // addEventListener ignores a second registration of the same function, so
      // this never stacks up across navigation.
      document.body.addEventListener("click", paneClickHandler);
    } else {
      splitPanes = false;
      document.body.removeEventListener("click", paneClickHandler);
    }

    if(leftOrRight == undefined){
      leftOrRight = "left";
    }
    if(splitPanes){
      indicateLeftRight("left");
    }
  } else {
    document.body.removeEventListener("click", paneClickHandler);
  }

  // Reading-pane button visibility is decided from the DOM (v-MessageCard).
  applyReadingPaneState();
};

const checkFirstTimeReady = () => {

  // Theme detection is no longer needed (the pane indicator in indicateLeftRight
  // is now theme-independent).

  let t1 = setInterval(() => {
    if(qs(SEL.searchInputAny)){
      runOnChange(lastUrl);

      clearInterval(t1);

      // check current URL;
      const mainPoll = setInterval(() => {
        // When the extension is reloaded or auto-updated, this (now stale) content
        // script keeps running but chrome.* APIs throw "Extension context
        // invalidated". Stop the poll gracefully instead of spamming errors; the
        // tab picks up the new script on its next reload.
        if (!isExtensionAlive()) {
          clearInterval(mainPoll);
          return;
        }
        let url = location.href;
        if (url !== lastUrl) {
          runOnChange(url);
          lastUrl = url;
        }
        // Decide reading-pane button visibility from the DOM every tick rather
        // than relying on URL changes (the card may be unrendered at the moment
        // the URL changes).
        applyReadingPaneState();
        initResizablePanes();
        // Keep the floating buttons positioned while the reading pane is shown
        // (folded into this single poll instead of a separate interval).
        if(readingPaneShown){
          checkReadingPaneControlPosition();
        }
        // Keep the uncluttered body class in sync with our state. Fastmail can
        // overwrite body.className (e.g. when double-clicking the mail pane), which
        // would silently wipe the class and un-collapse the panes while the toggle
        // still says it is on. Re-asserting here heals that within one tick.
        document.body.classList.toggle(UNCLUTTERED_CLASS, !mainMenuShown);
      }, 300);

      window.addEventListener('resize', () => {
        if(readingPaneShown){
          checkReadingPaneControlPosition();
        }
      });
    }
  }, 300);
}

// Record whether Fastmail's own shortcuts are on, so the options page can show
// which options they leave out. Pages where it cannot be read (signed out, other
// fastmail.com pages) keep the last known value.
const reportFastmailShortcuts = () => {
  const value = document.documentElement.getAttribute(FASTMAIL_SHORTCUTS_ATTR);
  if (value !== null) {
    safeStorageSet({ fastmailShortcuts: value === 'on' });
  }
};
reportFastmailShortcuts();
new MutationObserver(reportFastmailShortcuts)
  .observe(document.documentElement, { attributes: true, attributeFilter: [FASTMAIL_SHORTCUTS_ATTR] });
// With several Fastmail tabs (e.g. two accounts), the tab in front sets the value.
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    reportFastmailShortcuts();
  }
});

// Content scripts run after the DOM is ready (document_idle); wait only for the
// settings so that the options below are known before starting.
settingsLoaded.then(() => {
  if(maxMessageWidth) {
    maximizeMessageWidth();
  }
  checkFirstTimeReady();
});
