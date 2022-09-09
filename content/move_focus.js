const indicateLeftRight = (side) => {
  if(useCursorKeys){
    if(leftOrRight === "left"){
      if(themeType === "light"){
        $("div#conversation div.v-Toolbar").css({"box-shadow": "inset 0 -5px 0 #ffffff"});
        $("div#mailbox div.v-Toolbar").css({"box-shadow": "inset 0 -5px 0 #f7e3e3", "transition": ""});
      } else {
        $("div#conversation div.v-Toolbar").css({"box-shadow": "inset 0 -5px 0 #1b1e20"});
        $("div#mailbox div.v-Toolbar").css({"box-shadow": "inset 0 -5px 0 #dc818f", "transition": ""});
      }
    } else {
      if(themeType === "light"){
        $("div#mailbox div.v-Toolbar").css({"box-shadow": "inset 0 -5px 0 #ffffff"});
        $("div#conversation div.v-Toolbar").css({"box-shadow": "inset 0 -5px 0 #f7e3e3", "transition": ""});
      } else {
        $("div#mailbox div.v-Toolbar").css({"box-shadow": "inset 0 -5px 0 #1b1e20"});
        $("div#conversation div.v-Toolbar").css({"box-shadow": "inset 0 -5px 0 #dc818f", "transition": ""});
      }
    }
  }
}

$("div#mailbox div.v-MailboxItem").on("click", () => {
  changeleftright("left");
});

$("div#conversation div.v-MessageCard").on("click", () => {
  changeleftright("right");
});

const moveCursor = (e) => {
  // Enter or →
  if(e.which === 13 || e.which === 39){
    if(splitPanes && $("div.v-Empty").length == 0){
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

    const focused = $("li.v-MailboxItem.u-list-item.is-focused");
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
      target = $("li.v-MailboxItem.u-list-item").first();
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

    const focused = $("li.v-MailboxItem.u-list-item.is-focused");
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
      target = $("li.v-MailboxItem.u-list-item").first();
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
    console.log(e);
    e.preventDefault();
    e.stopImmediatePropagation();
    let target;
    if(cursorPosition){
      target = $('#' + cursorPosition).prev();
      if(target.length === 0){
        target = $('#' + cursorPosition)
      }
    } else {
      target = $("li.v-MailboxItem.u-list-item").first();
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
      target = $("li.v-MailboxItem.u-list-item").first();
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
    if(!$("input").is(":focus")) {
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
