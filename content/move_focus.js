// When using the cursor keys, indicate which pane (list / message) has focus with
// a thin accent line at the bottom of its toolbar. The inactive side just clears
// the line (none), so this does not depend on light/dark theme detection. The
// color matches the other UI tweaks (blue).
const PANE_ACCENT = '#5b9bd5';
const indicateLeftRight = () => {
  if(!useCursorKeys){
    return;
  }
  const $list = $(`${SEL.mailboxPane} ${SEL.toolbar}`);
  const $conv = $(`${SEL.conversationPane} ${SEL.toolbar}`);
  // A compose/reply editor lives inside #conversation, so painting the indicator
  // would leave a stray blue bar on its toolbar. Clear and skip while composing.
  if(isComposing()){
    $list.css({"box-shadow": "none"});
    $conv.css({"box-shadow": "none"});
    return;
  }
  const activeShadow = `inset 0 -2px 0 ${PANE_ACCENT}`;
  if(leftOrRight === "left"){
    $list.css({"box-shadow": activeShadow, "transition": ""});
    $conv.css({"box-shadow": "none"});
  } else {
    $conv.css({"box-shadow": activeShadow, "transition": ""});
    $list.css({"box-shadow": "none"});
  }
}

// (Pane focus on click is handled by the delegated body "click.fmp" handler in
//  main.js. The previous direct handlers here called an undefined function and
//  were bound at load time, so they were both broken and redundant.)

const moveCursor = (e) => {
  // Enter or →
  if(e.which === 13 || e.which === 39){
    if(splitPanes && $(SEL.empty).length == 0){
      leftOrRight = "right";
      indicateLeftRight("right")
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  // ←
  } else if(e.which === 37){
    if(splitPanes){
      leftOrRight = "left";
      indicateLeftRight("left");
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  // K or ↑
  } else if(e.which === 75 || e.which === 38){
    if(splitPanes){
      indicateLeftRight("left");
    }
    e.preventDefault();
    e.stopImmediatePropagation();

    const focused = $(SEL.mailboxItemFocused);
    if(focused){
      cursorPosition = focused.attr("id");
    }

    let target;
    if(cursorPosition){
      target = $('#' + cursorPosition).prev();
      if(target.length === 0){
        target = $('#' + cursorPosition)
      }
    } else {
      target = $(SEL.mailboxItem).first();
    }
    cursorPosition = target.attr('id');
    target.click();
  // J or ↓
  } else if(e.which === 74 || e.which === 40) {
    if(splitPanes){
      indicateLeftRight("left");
    }
    e.preventDefault();
    e.stopImmediatePropagation();

    const focused = $(SEL.mailboxItemFocused);
    if(focused){
      cursorPosition = focused.attr("id");
    }

    let target;
    if(cursorPosition){
      target = $('#' + cursorPosition).next();
      if(target.length === 0){
        target = $('#' + cursorPosition)
      }
    } else {
      target = $(SEL.mailboxItem).first();
    }
    cursorPosition = target.attr("id");
    target.click();
  }
}

const doubleClick = async (lb) => {
  await lb.click();
  lb.click();
};

// Move focus via up/down cursor keys in messages view
const messageCursor = (e) => {
  // K or ↑
  if(e.which === 75 || e.which === 38){
    e.preventDefault();
    e.stopImmediatePropagation();
    let target;
    if(cursorPosition){
      target = $('#' + cursorPosition).prev();
      if(target.length === 0){
        target = $('#' + cursorPosition)
      }
    } else {
      target = $(SEL.mailboxItem).first();
    }
    cursorPosition = target.attr('id');
    // target.find("div.v-MailboxItem-from").first().click();
    // target.find("label").first().click().click();
    const lb = target.find("label").first()
    doubleClick(lb);

  // J or ↓
  } else if(e.which === 74 || e.which === 40) {
    e.preventDefault();
    e.stopImmediatePropagation();
    let target;
    if(cursorPosition){
      target = $('#' + cursorPosition).next();
      if(target.length === 0){
        target = $('#' + cursorPosition)
      }
    } else {
      target = $(SEL.mailboxItem).first();
    }
    cursorPosition = target.attr("id");
    // target.find("div.v-MailboxItem-from").first().click();
    // target.find("label").first().click().click();
    const lb = target.find("label").first()
    doubleClick(lb);
  }
}

// Move focus via up/down cursor keys in reading pane
const readingPaneCursor = (e) => {
  if(useCursorKeys){
    if(!isEditingText()) {
      if(e.which === 39){
        if(splitPanes){
          leftOrRight = "right";
          indicateLeftRight("right");
          e.preventDefault();
          e.stopImmediatePropagation();
        }
      } else if(e.which === 37){
        if(splitPanes){
          leftOrRight = "left";
          indicateLeftRight("left");
          e.preventDefault();
          e.stopImmediatePropagation();
        }
      // P or ↑ => Previous
      } else if (e.which === 80 || (e.which === 38)){
        if(splitPanes){
          indicateLeftRight("right");
        }
        e.preventDefault();
        e.stopImmediatePropagation();
        $btnUp.click();
        // N or ↓ => Next
      } else if (e.which === 78 || (e.which === 40)){
        if(splitPanes){
          indicateLeftRight("right");
        }
        e.preventDefault();
        e.stopImmediatePropagation();
        $btnDown.click();
      }
    }
  }
};