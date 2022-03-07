let cursorPosition;

// Move focus via up/down cursor keys in messages view
const messageCursor = (e) => {
  if(e.which == 75 || e.which == 38){
    e.preventDefault();
    e.stopImmediatePropagation();
    let target;
    if(cursorPosition){
      target = $('#' + cursorPosition).prev();
      if(target.length == 0){
        target = $('#' + cursorPosition)
      }
    } else {
      target = $("li.v-MailboxItem.u-list-item").first();
    }
    cursorPosition = target.attr('id');
    target.find("label").first().click().click();
  } else if(e.which == 74 || e.which == 40) {
    e.preventDefault();
    e.stopImmediatePropagation();
    let target;
    if(cursorPosition){
      target = $('#' + cursorPosition).next();
      if(target.length == 0){
        target = $('#' + cursorPosition)
      }
    } else {
      target = $("li.v-MailboxItem.u-list-item").first();
    }
    cursorPosition = target.attr("id");
    target.find("label").first().click().click();
  }
}

// Move focus via up/down cursor keys in conversation view
const conversationCursor = (e) => {
  if(useCusrorKeys){
    if(!$("input").is(":focus")) {
      // P or ↑ => Previous
      if (e.which == 80 || (e.which == 38)){
        e.preventDefault();
        e.stopImmediatePropagation();
        $btnUp.click();
        // N or ↓ => Next
      } else if (e.which == 78 || (e.which == 40)){
        e.preventDefault();
        e.stopImmediatePropagation();
        $btnDown.click();
      }
    }
  }
};
