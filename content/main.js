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

// One width, set by dragging the right edge, is shared by the open conversation
// (its messages and inline replies) and by the compose/note panes, and is
// remembered for the next time. Fastmail centres the conversation within the
// pane using side padding; the injected stylesheet sets that padding instead.
// Fastmail's own full-width conversation view is left as it is.
const RESIZABLE_CLASS = 'fmp-resizable';
const MESSAGE_WIDTH_MIN = 480;
// Widths with nothing set: Fastmail's conversation width, which main.css also
// gives the compose pane, and main.css's width for note panes. Dragging close to
// it snaps there, and letting go there forgets the set width.
const MESSAGE_WIDTH_DEFAULT = 882;
const NOTE_WIDTH_DEFAULT = 780;
const WIDTH_SNAP = 16;
const SNAPPED_CLASS = 'fmp-snapped';
const applyMessageWidth = () => {
  let style = document.getElementById('fmp-message-width');
  if (!composeWidth) {
    if (style) {
      style.remove();
    }
    return;
  }
  if (!style) {
    style = document.createElement('style');
    style.id = 'fmp-message-width';
    document.head.appendChild(style);
  }
  const half = composeWidth / 2;
  style.textContent = `
    ${SEL.thread}:not(${SEL.threadFullWidth}) {
      padding-left: max(0px, 50% - ${half}px) !important;
      padding-right: max(0px, 50% - ${half}px) !important;
    }
    div.v-MessageCard:has(> .v-Compose), .${NOTE_CARD_CLASS} {
      width: ${composeWidth}px !important;
    }`;
};

const makePaneResizable = (pane) => {
  pane.classList.add(RESIZABLE_CLASS);
  const handle = document.createElement('div');
  handle.className = 'fmp-resize-handle';
  handle.title = 'Drag to resize; double-click for the default width';
  pane.appendChild(handle);

  // Back to the default width (nothing set), as when letting go at it.
  handle.addEventListener('dblclick', () => {
    composeWidth = savedComposeWidth = null;
    applyMessageWidth();
    safeStorageSet({ composeWidth });
  });

  handle.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) {
      return;
    }
    e.preventDefault(); // no text selection while dragging
    const startX = e.clientX;
    // Width of an element's content box.
    const contentWidth = (el) => {
      const cs = getComputedStyle(el);
      return el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    };
    // Inside the conversation, the width is that of the conversation's content
    // (between Fastmail's side padding), which the message may not fill exactly;
    // at most it is the whole conversation.
    const thread = pane.closest(SEL.thread);
    const measure = () => (thread ? contentWidth(thread) : pane.getBoundingClientRect().width);
    const available = thread ? thread.clientWidth : contentWidth(pane.parentElement);
    const startWidth = measure();
    // Messages and compose panes are centred and grow on both sides, so the edge
    // under the pointer moves by half of the change. Note panes grow to the right.
    const isNote = pane.classList.contains(NOTE_CARD_CLASS);
    const factor = isNote ? 1 : 2;
    // The width shown with nothing set, in this window: the default, limited by
    // the space there is.
    const defaultWidth = Math.min(available, isNote ? NOTE_WIDTH_DEFAULT : MESSAGE_WIDTH_DEFAULT);
    let moved = false;
    let snapped = false;
    handle.setPointerCapture(e.pointerId);
    resizingWidth = true;

    const onMove = (ev) => {
      moved = true;
      const width = Math.min(available,
        Math.max(MESSAGE_WIDTH_MIN, startWidth + factor * (ev.clientX - startX)));
      snapped = Math.abs(width - defaultWidth) <= WIDTH_SNAP;
      handle.classList.toggle(SNAPPED_CLASS, snapped);
      composeWidth = snapped ? null : Math.round(width);
      applyMessageWidth();
    };
    // A click without a drag, or a cancelled drag, goes back to the saved width
    // (which another tab may have changed meanwhile).
    const onEnd = (ev) => {
      handle.removeEventListener('pointermove', onMove);
      handle.removeEventListener('pointerup', onEnd);
      handle.removeEventListener('pointercancel', onEnd);
      handle.classList.remove(SNAPPED_CLASS);
      resizingWidth = false;
      if (!moved || ev.type === 'pointercancel') {
        composeWidth = savedComposeWidth;
        applyMessageWidth();
        return;
      }
      // Save the rendered width, which the window size may have limited.
      composeWidth = savedComposeWidth = snapped ? null : Math.max(MESSAGE_WIDTH_MIN, Math.round(measure()));
      applyMessageWidth();
      safeStorageSet({ composeWidth });
    };
    handle.addEventListener('pointermove', onMove);
    handle.addEventListener('pointerup', onEnd);
    handle.addEventListener('pointercancel', onEnd);
  });
};

// Give every open compose/note pane and every open message in the conversation
// a resize handle, including inline replies (which open inside the conversation
// without changing the URL). Called on each poll tick; it returns at once when
// there is nothing to resize, and panes already set up are skipped so the handle
// never flickers. Note cards are also tagged with NOTE_CARD_CLASS for main.css
// (their wrapper has no stable class of its own).
const NOTE_CARD_CLASS = 'fmp-note-card';
const initResizablePanes = () => {
  if (readingPaneShown) {
    qsa(`${SEL.thread} ${SEL.messageCardExpanded}:not(.${RESIZABLE_CLASS})`).forEach(makePaneResizable);
  }
  if(!isComposing()){
    return;
  }
  const notePanes = [...noteEditors].map((editor) => editor.parentElement);
  notePanes.forEach((pane) => pane && pane.classList.add(NOTE_CARD_CLASS));
  [...composeEditors].map((editor) => editor.parentElement).concat(notePanes)
    .filter((pane) => pane && !pane.classList.contains(RESIZABLE_CLASS))
    .forEach(makePaneResizable);
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

// Warn in the console (once per selector) when a selector the extension relies on
// stops matching, so a Fastmail UI change shows up early, e.g. on
// app.beta.fastmail.com. Checked a few seconds after each page change, once the
// page has rendered (a newer page change restarts the wait). Message cards and
// the conversation's container are expected only while a conversation is open.
const SELECTOR_CHECK_DELAY = 3000;
const missingSelectors = new Set();
let selectorCheckTimer = null;
const warnMissing = (name) => {
  if (!missingSelectors.has(name)) {
    missingSelectors.add(name);
    console.warn(`[Fastmail Plus] "${name}" (${SEL[name]}) matches nothing; some features may not work.`);
  }
};
const checkSelectors = () => {
  if (!regexMail.test(location.href) || regexCompose.test(location.href)) {
    return;
  }
  const expected = ['toolbar', 'pageContent'];
  // The conversation pane can hold just the "nothing selected" placeholder.
  const conversationOpen = qs(SEL.conversationPane) !== null &&
    qs(`${SEL.conversationPane} ${SEL.empty}`) === null;
  if (conversationOpen) {
    expected.push('messageCard', 'messageCardHeader', 'thread');
  }
  // With the reading pane hidden, an open conversation replaces the list. A
  // conversation opened in its own window has neither the list nor the search box.
  if (!conversationOpen || splitPanes) {
    expected.push('mailboxPane', 'searchInputAny');
  }
  expected.filter((name) => qs(SEL[name]) === null).forEach(warnMissing);
};

// Whether the reading pane is shown beside the list ("Show reading pane mode").
// Checked on each page change and after the layout button moves the pane.
const detectSplitPanes = () => {
  if(!regexMail.test(location.href)){
    return;
  }
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
};

const runOnChange = (url) => {
  clearTimeout(selectorCheckTimer);
  selectorCheckTimer = setTimeout(checkSelectors, SELECTOR_CHECK_DELAY);

  // currently in mail mode
  if(regexMail.test(url)){

    // Reflect the currently focused list item into cursorPosition.
    // (The old URL match via a.v-MailboxItem-link[href] no longer works in the
    //  new UI, so read it directly from the is-focused class.)
    const focusedItem = qs(SEL.mailboxItemFocused);
    if(focusedItem){
      cursorPosition = focusedItem.id || undefined;
    }

    detectSplitPanes();
  } else {
    document.body.removeEventListener("click", paneClickHandler);
  }

  // Reading-pane button visibility is decided from the DOM (v-MessageCard).
  applyReadingPaneState();
};

const STARTUP_WARNING_DELAY = 30000;
const checkFirstTimeReady = () => {
  // Everything starts once the search box, or a message (a conversation opened in
  // its own window has no search box), is shown; if neither appears in mail, say
  // so. (Other fastmail.com pages, such as the sign-in page, have neither.)
  const startupWarning = setTimeout(() => {
    if (regexMail.test(location.href)) {
      warnMissing('searchInputAny');
    }
  }, STARTUP_WARNING_DELAY);

  // Theme detection is no longer needed (the pane indicator in indicateLeftRight
  // is now theme-independent).

  let t1 = setInterval(() => {
    if(qs(SEL.searchInputAny) || qs(SEL.messageCard)){
      runOnChange(lastUrl);

      clearInterval(t1);
      clearTimeout(startupWarning);

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
        // Fastmail can build or rebuild the toolbar at any time.
        if(alternativeSearch && !document.getElementById("alt-search")){
          setAltSearch();
        }
        if(layoutButton){
          setLayoutToggle();
        }
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
// which options they leave out, and the language Fastmail is shown in, which the
// options page uses. Pages where they cannot be read (signed out, other
// fastmail.com pages) keep the last known values.
const reportFastmailPrefs = () => {
  const root = document.documentElement;
  const shortcuts = root.getAttribute(FASTMAIL_SHORTCUTS_ATTR);
  if (shortcuts !== null) {
    safeStorageSet({ fastmailShortcuts: shortcuts === 'on' });
  }
  const language = root.getAttribute(FASTMAIL_LANGUAGE_ATTR);
  if (language !== null) {
    safeStorageSet({ fastmailLanguage: language });
  }
};
reportFastmailPrefs();
new MutationObserver(reportFastmailPrefs)
  .observe(document.documentElement, { attributes: true, attributeFilter: [FASTMAIL_SHORTCUTS_ATTR, FASTMAIL_LANGUAGE_ATTR] });
// With several Fastmail tabs (e.g. two accounts), the tab in front sets the values.
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    reportFastmailPrefs();
  }
});

// Content scripts run after the DOM is ready (document_idle); wait only for the
// settings so that the options below are known before starting.
settingsLoaded.then(() => {
  watchLayout();
  applyMessageWidth();
  checkFirstTimeReady();
  chrome.storage.onChanged.addListener(onSettingsChanged);
});
