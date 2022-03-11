const changeLeftRight = (side) => {
  leftOrRight = side;
  if(leftOrRight === "left"){
    $("div#mailbox div.v-Toolbar").css({"box-shadow": "inset 0 -5px 0 #f7e3e3"});
    $("div#conversation div.v-Toolbar").css({"box-shadow": ""});
  } else {
    $("div#mailbox div.v-Toolbar").css({"box-shadow": ""});
    $("div#conversation div.v-Toolbar").css({"box-shadow": "inset 0 -5px 0 #f7e3e3"});
  } 
}

const moveCursor = (e) => {
  if(e.which === 39){
    changeLeftRight("right")
    e.preventDefault();
    e.stopImmediatePropagation();
  } else if(e.which === 75 || e.which === 38){
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
    target.click();
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
    target.click();
  }
}

// Move focus via up/down cursor keys in messages view
const messageCursor = (e) => {
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
      target = $("li.v-MailboxItem.u-list-item").first();
    }
    cursorPosition = target.attr('id');
    // target.find("div.v-MailboxItem-from").first().click();
    target.find("label").first().click().click();
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
    target.find("label").first().click().click();
  }
}

// Move focus via up/down cursor keys in reading pane 
const readingPaneCursor = (e) => {
  if(useCusrorKeys){
    if(!$("input").is(":focus")) {
      if(e.which === 37){
        changeLeftRight("left");
        e.preventDefault();
        e.stopImmediatePropagation();
      // P or ↑ => Previous
      } else if (e.which === 80 || (e.which === 38)){
        e.preventDefault();
        e.stopImmediatePropagation();
        $btnUp.click();
        // N or ↓ => Next
      } else if (e.which === 78 || (e.which === 40)){
        e.preventDefault();
        e.stopImmediatePropagation();
        $btnDown.click();
      }
    }
  }
};
