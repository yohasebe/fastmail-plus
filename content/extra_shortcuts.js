////////////////////
// CURRENTLY UNUSED
////////////////////
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

  // These work even inside textbox/input
  // Mail view
  if(regexMail.test(lastUrl)){
    // Ctrl + I => toggle right panel
    if (e.ctrlKey && e.shiftKey && e.which === 73){
      e.preventDefault();
      e.stopImmediatePropagation();
      toggleRightbar();
      // Ctrl + S => toggle search modes
    } else if (e.ctrlKey && e.which === 83){
      e.preventDefault();
      e.stopImmediatePropagation();
      $("#search-toggle").click();
    }
  // Calendar view
  } else if(regexCalendar.test(lastUrl)){
    if(alternativeShortcutKeys) {
      calendarShortcuts(e);
    }
  }

  // These work only outside textbox/input
  if(!$("input, textarea, div.v-RichText-input").is(":focus")) {
    // Mail view
    if(regexMail.test(lastUrl)){
      // J and K are basically left untouched
      if (e.which === 74 || e.which === 75){
        if(mainMenuShown){
          return true;
        } else {
        e.preventDefault();
        e.stopImmediatePropagation();
        }
      // ? => Show tooltips
      } else if (e.key === "?" && e.which === 191){
        if(alternativeShortcutKeys){
          showTooltips();
        }
        // Esc => Hide tooltips
      } else if (e.which === 27 || e.which === 0){
        if(alternativeShortcutKeys){
          hideTooltips();
        }
      }

      if (regexCompose.test(lastUrl)){
        ;
      } else if(showReadingPane) {
        // Control + L => Toggle non-clutter mode
        if (e.ctrlKey && e.which === 76){
          togglemainMenu();
        } else if(leftOrRight == "right"){
          if(alternativeShortcutKeys) {
            readingPaneShortcuts(e);
          }
          if(useCusrorKeys){
            readingPaneCursor(e);
          }
        } else {
          if(useCusrorKeys){
             moveCursor(e);
          }
        }
      } else {
        if(regexReadingPane.test(lastUrl)){
          // Control + L => Toggle non-clutter mode
          if (e.ctrlKey && e.which === 76){
            togglemainMenu();
          }
          if(alternativeShortcutKeys) {
            readingPaneShortcuts(e);
          }
          if(useCusrorKeys){
            readingPaneCursor(e);
          }
        } else {
          messageCursor(e);
        }
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

const readingPaneShortcuts = (e) => {
  // Shift + alt + (E or Enter) => Shrink
  if (e.shiftKey && e.altKey && (e.which === 69 || e.which === 13)){
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

const buttons = [$btnMainMenu, $btnUp, $btnDown, $btnToggle, $btnExpand, $btnCollapse, $btnControl, $searchToggle]
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

