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
      // Ctrl + M => toggle search modes
    } else if (e.ctrlKey && e.shiftKey && e.which === 77){
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

  // These work only outside any editable field (input/textarea/contenteditable).
  // Using document.activeElement + isContentEditable reliably covers rich-text
  // editors where focus lands on a nested node, so we never hijack keys like
  // Cmd+Right / Cmd+Shift+Right (move/select to end of line) while editing.
  if(!isEditingText()) {
    // Mail view
    if(regexMail.test(lastUrl)){
      if (e.ctrlKey && e.which === 82){
        window.location.reload();
      // Command + right (for mac) is ignored because the original behavior of going forward could make some users confused
      } else if(e.metaKey && e.which == 39) {
        e.preventDefault();
        e.stopImmediatePropagation();
        return true;
      // J and K are basically left untouched
      } else if (e.which === 74 || e.which === 75){
        if(mainMenuShown){
          return true;
        } else {
        e.preventDefault();
        e.stopImmediatePropagation();
        }
      // ^⇧+ / ^⇧- / ^⇧0 => body text size: larger / smaller / reset
      } else if (alternativeShortcutKeys && e.ctrlKey && e.shiftKey && e.which === 187){
        e.preventDefault();
        e.stopImmediatePropagation();
        bumpBodyFontScale(BODY_ZOOM_STEP);
      } else if (alternativeShortcutKeys && e.ctrlKey && e.shiftKey && e.which === 189){
        e.preventDefault();
        e.stopImmediatePropagation();
        bumpBodyFontScale(-BODY_ZOOM_STEP);
      } else if (alternativeShortcutKeys && e.ctrlKey && e.shiftKey && e.which === 48){
        e.preventDefault();
        e.stopImmediatePropagation();
        resetBodyFontScale();
      }

      // Detect compose by DOM too: inline replies keep the conversation URL, so
      // a URL-only check would let reading-pane shortcuts (e.g. Enter) hijack the
      // editor.
      if (regexCompose.test(lastUrl) || isComposing()){
        ;
      } else if(splitPanes) {
        // Ctrl + Shift + L => Toggle non-clutter mode
        if (e.ctrlKey && e.shiftKey && e.which === 76){
          if(alternativeShortcutKeys && $(SEL.empty).length == 0){
            togglemainMenu();
          }
        } else if(leftOrRight == "right"){
          if(alternativeShortcutKeys) {
            readingPaneShortcuts(e);
          }
          if(useCursorKeys){
            readingPaneCursor(e);
          }
        } else {
          if(useCursorKeys){
             moveCursor(e);
          }
        }
      } else {
        if(isReadingPaneShown()){
          // Shift + L => Toggle non-clutter mode
          if (e.shiftKey && e.ctrlKey && e.which === 76){
            togglemainMenu();
          }
          if(alternativeShortcutKeys) {
            readingPaneShortcuts(e);
          }
          if(useCursorKeys){
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

// Hover help is provided by each button's native `title` attribute (the browser
// tooltip): subtle, delayed, and shown near the cursor — unobtrusive. No jQuery UI
// tooltip is used. Fastmail's own `?` overlay still lists the shortcut keys.

// set extra shortcut keys
document.addEventListener('keydown', shortcutHandler);