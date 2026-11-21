// When using the cursor keys, indicate which pane (list / message) has focus with
// a thin accent line at the bottom of its toolbar. The inactive side just clears
// the line (none), so this does not depend on light/dark theme detection. The
// color matches the other UI tweaks (blue).
const PANE_ACCENT = '#5b9bd5'; // mirrors --fmp-accent in content/main.css
const indicateLeftRight = () => {
  const list = qsa(`${SEL.mailboxPane} ${SEL.toolbar}`);
  const conv = qsa(`${SEL.conversationPane} ${SEL.toolbar}`);
  const paint = (els, shadow) => els.forEach((el) => {
    el.style.boxShadow = shadow;
    el.style.transition = '';
  });
  // With the cursor keys turned off, leave the toolbars as Fastmail draws them.
  if(!useCursorKeys){
    paint(list, '');
    paint(conv, '');
    return;
  }
  // A compose/reply editor lives inside #conversation, so painting the indicator
  // would leave a stray blue bar on its toolbar. Clear and skip while composing.
  if(isComposing()){
    paint(list, 'none');
    paint(conv, 'none');
    return;
  }
  const activeShadow = `inset 0 -2px 0 ${PANE_ACCENT}`;
  paint(list, leftOrRight === "left" ? activeShadow : 'none');
  paint(conv, leftOrRight === "left" ? 'none' : activeShadow);
}

// The mailbox item next to the remembered cursor position ('prev' or 'next'),
// staying on the current item at either end. Falls back to the first item when
// there is no remembered position. May return null (e.g. an empty list).
const neighborItem = (direction) => {
  if(!cursorPosition){
    return qs(SEL.mailboxItem);
  }
  const current = document.getElementById(cursorPosition);
  if(!current){
    return null;
  }
  const sibling = direction === 'prev' ? current.previousElementSibling : current.nextElementSibling;
  return sibling || current;
};

// Read the focused list item (if any) into cursorPosition.
const syncCursorFromFocus = () => {
  const focused = qs(SEL.mailboxItemFocused);
  cursorPosition = focused ? (focused.id || undefined) : undefined;
};

// (Pane focus on click is handled by the delegated body "click.fmp" handler in
//  main.js. The previous direct handlers here called an undefined function and
//  were bound at load time, so they were both broken and redundant.)

// H / L move to the left / right pane when the "hlPaneKeys" option is on. Only
// plain key presses count, so shortcuts such as Ctrl + Shift + L are unaffected.
const isPlainKey = (e) => !e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey && !e.isComposing;
// A letter shortcut (e.g. J) pressed on its own, so Ctrl/Cmd/Shift combinations
// (Cmd + P to print, Ctrl + J, ...) keep their usual meaning. Never true while
// Fastmail's own shortcuts are on: the letter then does what Fastmail says.
const isLetterKey = (e, code) => e.which === code && isPlainKey(e) && !fastmailShortcutsOn();
// Arrows count only on their own too, so Alt + ← (back) and the like keep their meaning.
const isPaneLeftKey = (e) => (e.which === 37 && isPlainKey(e)) || (hlPaneKeys && isLetterKey(e, 72));
const isPaneRightKey = (e) => (e.which === 39 && isPlainKey(e)) || (hlPaneKeys && isLetterKey(e, 76));

const moveCursor = (e) => {
  // Enter, → or L
  if(e.which === 13 || isPaneRightKey(e)){
    if(splitPanes && qs(SEL.empty) === null){
      leftOrRight = "right";
      indicateLeftRight("right")
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  // ← or H
  } else if(isPaneLeftKey(e)){
    if(splitPanes){
      leftOrRight = "left";
      indicateLeftRight("left");
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  // K or ↑
  } else if(isLetterKey(e, 75) || e.which === 38){
    if(splitPanes){
      indicateLeftRight("left");
    }
    e.preventDefault();
    e.stopImmediatePropagation();

    syncCursorFromFocus();
    const target = neighborItem('prev');
    cursorPosition = target ? (target.id || undefined) : undefined;
    if(target){ target.click(); }
  // J or ↓
  } else if(isLetterKey(e, 74) || e.which === 40) {
    if(splitPanes){
      indicateLeftRight("left");
    }
    e.preventDefault();
    e.stopImmediatePropagation();

    syncCursorFromFocus();
    const target = neighborItem('next');
    cursorPosition = target ? (target.id || undefined) : undefined;
    if(target){ target.click(); }
  }
}

// Click the item's label twice (a single click does not open the message here),
// yielding once in between so Fastmail can apply the first click.
const clickItemLabel = async (target) => {
  const lb = target ? qs('label', target) : null;
  if(lb){
    lb.click();
    await Promise.resolve();
    lb.click();
  }
};

// With the reading pane off, the list and an open conversation take turns on
// screen, and Fastmail moves the list's cursor itself with ↑ / ↓ (clicking an
// item would open it). So ↑ / ↓ are left to Fastmail, J / K are passed on to it
// as ↑ / ↓, and → / L open the conversation under the cursor, as moving right does
// beside the list. The cursor is the browser focus on an item's link.
const focusedListLink = () => {
  const active = document.activeElement;
  return active && active.matches(`${SEL.mailboxPane} ${SEL.listLink}`) ? active : null;
};
const listCursor = (e) => {
  if(isPaneRightKey(e)){
    const link = focusedListLink();
    if(link){
      e.preventDefault();
      e.stopImmediatePropagation();
      link.click();
    }
  // K or J
  } else if(isLetterKey(e, 75) || isLetterKey(e, 74)){
    e.preventDefault();
    e.stopImmediatePropagation();
    const key = e.which === 75 ? 'ArrowUp' : 'ArrowDown';
    (document.activeElement || document.body).dispatchEvent(
      new KeyboardEvent('keydown', { key, code: key, bubbles: true, cancelable: true }));
  }
};

// Move focus via up/down cursor keys in messages view
const messageCursor = (e) => {
  if(qs(SEL.conversationPane) === null){
    listCursor(e);
    return;
  }
  // K or ↑
  if(isLetterKey(e, 75) || e.which === 38){
    e.preventDefault();
    e.stopImmediatePropagation();
    const target = neighborItem('prev');
    cursorPosition = target ? (target.id || undefined) : undefined;
    clickItemLabel(target);

  // J or ↓
  } else if(isLetterKey(e, 74) || e.which === 40) {
    e.preventDefault();
    e.stopImmediatePropagation();
    const target = neighborItem('next');
    cursorPosition = target ? (target.id || undefined) : undefined;
    clickItemLabel(target);
  }
}

// Move focus via up/down cursor keys in reading pane
const readingPaneCursor = (e) => {
  if(useCursorKeys){
    if(!isEditingText()) {
      // → / L and ← / H work like a tree view: → opens the focused message (or
      // focuses the newest one), ← closes it, and ← on a closed message goes back
      // to the list. In a conversation of one message, ← goes back at once.
      if(isPaneRightKey(e)){
        e.preventDefault();
        e.stopImmediatePropagation();
        const focused = qs(SEL.messageCardFocused);
        if(!focused){
          const cards = qsa(SEL.messageCard);
          if(cards.length > 0){
            focusCard(cards[cards.length - 1]);
          }
        } else if(focused.matches(SEL.messageCardCollapsed)){
          btnToggle.click();
        }
        if(splitPanes){
          leftOrRight = "right";
          indicateLeftRight("right");
        }
      } else if(isPaneLeftKey(e)){
        const focused = qs(SEL.messageCardFocused);
        // With the reading pane off, going back to the list is the conversation's
        // back link.
        const back = splitPanes ? null : qs(`${SEL.conversationPane} ${SEL.backLink}`);
        const backAtOnce = (splitPanes || back) && qsa(SEL.messageCard).length === 1;
        if(focused && focused.matches(SEL.messageCardExpanded) && !backAtOnce){
          e.preventDefault();
          e.stopImmediatePropagation();
          btnToggle.click();
        } else if(splitPanes){
          leftOrRight = "left";
          indicateLeftRight("left");
          e.preventDefault();
          e.stopImmediatePropagation();
        } else if(back){
          e.preventDefault();
          e.stopImmediatePropagation();
          back.click();
        }
      // P, K or ↑ => Previous
      } else if (isLetterKey(e, 80) || isLetterKey(e, 75) || e.which === 38){
        if(splitPanes){
          indicateLeftRight("right");
        }
        e.preventDefault();
        e.stopImmediatePropagation();
        btnUp.click();
        // N, J or ↓ => Next
      } else if (isLetterKey(e, 78) || isLetterKey(e, 74) || e.which === 40){
        if(splitPanes){
          indicateLeftRight("right");
        }
        e.preventDefault();
        e.stopImmediatePropagation();
        btnDown.click();
      }
    }
  }
};