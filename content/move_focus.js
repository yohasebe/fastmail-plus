// When using the cursor keys, indicate which pane (list / message) has focus with
// a thin accent line at the bottom of its toolbar. The inactive side just clears
// the line (none), so this does not depend on light/dark theme detection. The
// color matches the other UI tweaks (blue).
const PANE_ACCENT = '#5b9bd5'; // mirrors --fmp-accent in content/main.css
const indicateLeftRight = () => {
  if(!useCursorKeys){
    return;
  }
  const list = qsa(`${SEL.mailboxPane} ${SEL.toolbar}`);
  const conv = qsa(`${SEL.conversationPane} ${SEL.toolbar}`);
  const paint = (els, shadow) => els.forEach((el) => {
    el.style.boxShadow = shadow;
    el.style.transition = '';
  });
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
// (Cmd + P to print, Ctrl + J, ...) keep their usual meaning.
const isLetterKey = (e, code) => e.which === code && isPlainKey(e);
const isPaneLeftKey = (e) => e.which === 37 || (hlPaneKeys && e.which === 72 && isPlainKey(e));
const isPaneRightKey = (e) => e.which === 39 || (hlPaneKeys && e.which === 76 && isPlainKey(e));

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

// Move focus via up/down cursor keys in messages view
const messageCursor = (e) => {
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
      if(isPaneRightKey(e)){
        if(splitPanes){
          leftOrRight = "right";
          indicateLeftRight("right");
          e.preventDefault();
          e.stopImmediatePropagation();
        }
      } else if(isPaneLeftKey(e)){
        if(splitPanes){
          leftOrRight = "left";
          indicateLeftRight("left");
          e.preventDefault();
          e.stopImmediatePropagation();
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