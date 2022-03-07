// CURRENTLY UNUSED
// Switch between plain text / HTML via shortcut key of Ctrl + V
const toggleViewHTML = () => {
  let focused = $("div.v-MessageCard.app-contentCard.is-focused.is-expanded");
  if(focused.length >= 0){
    focused.find("button.s-message-actions").first().click();
    setTimeout(() => {
      let viewAs = $('button:contains("View as")');
      if(viewAs.length){
        viewAs.click();
      } else {
        ;
      }
    }, 300)
  }
}

// Handle extra shortcuts
const shortcutHandler = (e) => {
  if(!$("input, textarea, div.v-RichText-input").is(":focus")) {
    // Mail view
    if(regexMail.test(lastUrl)){
      // J and K are left untouched
      if (e.which === 74 || e.which === 75){
        return true;
      // Ctrl + i => toggle right panel
      } else if (e.ctrlKey && e.shiftKey && e.which === 73){
        e.preventDefault();
        e.stopImmediatePropagation();
        toggleRightbar();
      // Ctrl + S => toggle search modes
      } else if (e.ctrlKey && e.which === 83){
        e.preventDefault();
        e.stopImmediatePropagation();
        $("#search-toggle").click();
      // ? => Show tooltips
      } else if (e.key === "?" && e.which === 191){
        showTooltips();
        // Esc => Hide tooltips
      } else if (e.which === 27 || e.which === 0){
        hideTooltips();
      }
      // Conversation view
      if(regexConversation.test(lastUrl)){
        if(alternativeShortcutKeys) {
          conversationShortcuts(e);
        }
        if(useCusrorKeys){
          conversationCursor(e);
        }
      // Compose view
      } else if (regexCompose.test(lastUrl)){
        ;
      // Message view
      } else {
        if(useCusrorKeys){
          messageCursor(e);
        }
      }
      // Calendar view
    } else if(regexCalendar.test(lastUrl)){
      if(alternativeShortcutKeys) {
        calendarShortcuts(e);
      }
    }
  }
}

// Move to next and prev in calendar view
const calendarShortcuts = (e) => {
  // N and P are left untouched
  if (e.which === 78 || e.which === 80){
    return true;
  // Ctrl + ↑ => Prev Month
  } else if (e.ctrlKey && e.which === 38){
    e.preventDefault();
    e.stopImmediatePropagation();
    $('button[title="Shortcut: K"]').click();
    // Ctrl + ↓ => Next Month
  } else if (e.ctrlKey && e.which === 40){
    e.preventDefault();
    e.stopImmediatePropagation();
    $('button[title="Shortcut: J"]').click();
  }
}

const conversationShortcuts = (e) => {
  // Control + S => Toggle Leftbar
  if (e.ctrlKey && e.which === 76){
    toggleLeftBar();
    // Shift + alt + (E or Enter) => Shrink
  } else if (e.shiftKey && e.altKey && (e.which === 69 || e.which === 13)){
    e.preventDefault();
    e.stopImmediatePropagation();
    $btnCollapse.click();
    // Shift + (E or Enter) => Expand
  } else if (e.shiftKey && (e.which === 69 || e.which === 13)){
    e.preventDefault();
    e.stopImmediatePropagation();
    $btnExpand.click();
    // E or Enter => Toggle
  } else if (e.which === 69 || e.which === 13){

    e.preventDefault();
    e.stopImmediatePropagation();
    $btnToggle.click();
  } else if (e.ctrlKey && e.which === 188){
    e.preventDefault();
    e.stopImmediatePropagation();
    $btnControl.click();
  }
};

const buttons = [$btnLeftbar, $btnUp, $btnDown, $btnToggle, $btnExpand, $btnCollapse, $btnControl, $searchToggle]
for (const button of buttons) {
  button.tooltip({
    position: {
      my: "center bottom",
      at: "center top"
    }
  });
}

const showTooltips = () => {
  for (const button of buttons) {
    if(button.is(":visible")){
      button.tooltip("enable");
      button.tooltip("open");
    }
  }
}

const hideTooltips = () => {
  for (const button of buttons) {
    if(button.is(":visible")){
      button.tooltip("close");
      button.tooltip("disable");
    }
  }
}

// set extra shortcut keys
document.addEventListener('keydown', shortcutHandler);

$(document).on('click', () => {
  if(hideTooltips !== undefined){
    hideTooltips();
  }
});

