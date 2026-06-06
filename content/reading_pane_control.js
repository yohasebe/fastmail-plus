// Right-hand menu toggle (open/close the right contextual panel).
// The toggle button swaps its icon by state, so branch on the state:
//  - closed -> click the toolbar's i-sidebar button to open
//  - open (v-ContextualSidebar exists) -> click the close (i-close) inside the panel
//    (i-close is generic, so always scope it under the panel to avoid hitting
//     other close buttons)
const toggleRightbar = () => {
  const $sb = $(SEL.contextualSidebar);
  if($sb.length > 0){
    let $close = $sb.find(SEL.closeButton);
    if($close.length === 0){
      $close = $sb.parent().find(SEL.closeButton);
    }
    $close.first().click();
  } else {
    $(SEL.sidebarOpenToggle).first().click();
  }
}

// Create reading-pane control

const $allButtons = $("<div />")
$allButtons.attr('id', 'allButtons');

const $readingPaneButtons = $("<div />")
$readingPaneButtons.attr('id', 'readingPaneButtons');

const createImageLabel = (imgPath) => {
  return "<span class='label'>" +
         `<img style='vertical-align:text-top' src='${chrome.runtime.getURL(imgPath)}' />` +
         "</span>";
}

const btnReloadLabel = () => {
  return createImageLabel("svg/arrow-repeat.svg", "^R");
}

const btnMainMenuLabel = () => {
  // Reflect state: fullscreen icon in the normal view (click to enter the
  // uncluttered view), exit-fullscreen icon while the uncluttered view is active.
  if(mainMenuShown){
    return createImageLabel("svg/fullscreen.svg", "^⇧L");
  } else {
    return createImageLabel("svg/fullscreen-exit.svg", "^⇧L");
  }
}

const btnUpLabel = () => {
  return createImageLabel("svg/arrow-up.svg", "P/↑");
}

const btnDownLabel = () => {
  return createImageLabel("svg/arrow-down.svg", "N/↓");
}

const btnToggleLabel = () => {
  return createImageLabel("svg/view-list.svg", "E/⏎");
}

const btnExpandLabel = () => {
  return createImageLabel("svg/arrows-expand.svg", "⇧E/⇧⏎");
}

const btnCollapseLabel = () => {
  return createImageLabel("svg/arrows-collapse.svg", "⇧⌥E/⇧⌥⏎");
}

const btnControlLabel = () => {
  if(btnControlShown){
    return createImageLabel("svg/arrow-right-square.svg", "^,");
  } else {
    return createImageLabel("svg/arrow-left-square.svg", "^,");
  }
}

const $btnReload = $(`<button>${btnReloadLabel()}</button>`).appendTo($readingPaneButtons);
$btnReload.attr('id', 'btnReloadMenu');
$btnReload.attr('title', 'Reload page');
$btnReload.attr('class', 'v-Button v-Button--standard v-Button--sizeM bfm-Button');

// Reload message
const relad = () => {
  $btnRelaod.click();
}

const $btnMainMenu = $(`<button>${btnMainMenuLabel()}</button>`).appendTo($readingPaneButtons);
$btnMainMenu.attr('id', 'btnMainMenu');
$btnMainMenu.attr('title', 'Toggle uncluttered view');
$btnMainMenu.attr('class', 'v-Button v-Button--standard v-Button--sizeM bfm-Button');

// Left-hand menu toggle
const togglemainMenu = () => {
  $btnMainMenu.click();
}

const $btnUp = $(`<button><span class='label'>${btnUpLabel()}</span></button>`).appendTo($readingPaneButtons);
$btnUp.attr('id', 'btnUp');
$btnUp.attr('title', 'Previous message');
$btnUp.attr('class', 'v-Button v-Button--standard v-Button--sizeM bfm-Button');

const $btnDown = $(`<button><span class='label'>${btnDownLabel()}</span></button>`).appendTo($readingPaneButtons);
$btnDown.attr('id', 'btnDown');
$btnDown.attr('title', 'Next message');
$btnDown.attr('class', 'v-Button v-Button--standard v-Button--sizeM bfm-Button');

const $btnToggle = $(`<button><span class='label'>${btnToggleLabel()}</span></button>`).appendTo($readingPaneButtons);
$btnToggle.attr('id', 'btnToggle');
$btnToggle.attr('title', 'Toggle this message');
$btnToggle.attr('class', 'v-Button v-Button--standard v-Button--sizeM bfm-Button');

const $btnExpand = $(`<button><span class='label'>${btnExpandLabel()}</span></button>`).appendTo($readingPaneButtons);
$btnExpand.attr('id', 'btnExpand');
$btnExpand.attr('title', 'Expand all');
$btnExpand.attr('class', 'v-Button v-Button--standard v-Button--sizeM bfm-Button');

const $btnCollapse = $(`<button><span class='label'>${btnCollapseLabel()}</span></button>`).appendTo($readingPaneButtons);
$btnCollapse.attr('id', 'btnCollapse');
$btnCollapse.attr('title', 'Collapse all');
$btnCollapse.attr('class', 'v-Button v-Button--standard v-Button--sizeM bfm-Button');

// --- Body text size: a main button that shows the current % and expands a
//     vertical sub-group [A+ / ↺ / A-] upward when clicked. ---
const fontBtnClass = 'v-Button v-Button--standard v-Button--sizeM bfm-Button';

// Wrapper provides the positioning context for the upward popover.
const $fontSizeWrap = $("<span id='fontSizeWrap'></span>").appendTo($readingPaneButtons);

// Main button: its label shows the current scale (kept in sync by applyBodyFontScale).
const $btnFontSize = $("<button><span class='label'>100%</span></button>").appendTo($fontSizeWrap);
$btnFontSize.attr('id', 'btnFontSize');
$btnFontSize.attr('title', 'Body text size — click to adjust');
$btnFontSize.attr('class', fontBtnClass);

// Sub-group (hidden until expanded). DOM order A-, ↺, A+ ; CSS column-reverse puts
// A+ on top and A- at the bottom.
const $fontSizeButtons = $("<span id='fontSizeButtons'></span>").appendTo($fontSizeWrap);
$fontSizeButtons.hide();

const $btnFontDown = $("<button><span class='label'>A-</span></button>").appendTo($fontSizeButtons);
$btnFontDown.attr('id', 'btnFontDown');
$btnFontDown.attr('title', 'Smaller');
$btnFontDown.attr('class', fontBtnClass);

const $btnFontReset = $("<button><span class='label'>↺</span></button>").appendTo($fontSizeButtons);
$btnFontReset.attr('id', 'btnFontReset');
$btnFontReset.attr('title', 'Reset to 100%');
$btnFontReset.attr('class', fontBtnClass);

const $btnFontUp = $("<button><span class='label'>A+</span></button>").appendTo($fontSizeButtons);
$btnFontUp.attr('id', 'btnFontUp');
$btnFontUp.attr('title', 'Larger');
$btnFontUp.attr('class', fontBtnClass);

// Expand upward: the group is anchored bottom:100% (above the button), so a height
// reveal (slideToggle) grows it upward.
$btnFontSize.on('click', () => { $fontSizeButtons.slideToggle(150); });
$btnFontDown.on('click', () => { bumpBodyFontScale(-BODY_ZOOM_STEP); });
$btnFontUp.on('click', () => { bumpBodyFontScale(BODY_ZOOM_STEP); });
$btnFontReset.on('click', () => { resetBodyFontScale(); });

// Collapse the sub-group when clicking anywhere outside the control (another
// button or the page). Clicks inside #fontSizeWrap (the toggle and A+/↺/A-) are
// ignored so the group stays open while adjusting. The toggle's own handler runs
// first, so opening is not immediately undone.
$(document).on('click.fmpFontSize', (e) => {
  if ($fontSizeButtons.is(':visible') && $(e.target).closest('#fontSizeWrap').length === 0) {
    $fontSizeButtons.slideUp(150);
  }
});

$readingPaneButtons.appendTo($allButtons);
$controlerButton = $("<div />").appendTo($allButtons);

const $btnControl = $(`<button><span class='label'>${btnControlLabel()}</span></button>`).appendTo($controlerButton);
$btnControl.attr('id', 'btnControl');
$btnControl.attr('title', 'Show / hide these buttons');
$btnControl.attr('class', 'v-Button v-Button--standard v-Button--sizeM bfm-Button');

$btnReload.on('click', () => {
  window.location.reload();
});

$btnMainMenu.on('click', () => {
  if(!mainMenuShown){
    showmainMenu();
  } else {
    hidemainMenu();
  }
});

$btnToggle.on('click', () => {
  let focused = $(SEL.messageCardFocused)
  let current;
  if(focused.length > 0){
    current = focused.first();
  } else {
    current = $(SEL.messageCard).first();
  }
  current.find(SEL.messageCardHeader).click()
  setTimeout(() => {
    current.addClass("is-focused");
  }, 100);
});

$btnExpand.on('click', () => {
  $(SEL.messageCardCollapsedHeader).click();
});

$btnCollapse.on('click', () => {
  $(SEL.messageCardExpandedHeader).click();
});

$btnUp.on('click', () => {
  let focused = $(SEL.messageCardFocused);
  if (focused.length == 0){
    $(SEL.messageCard).last().addClass("is-focused");
  } else {
    if (focused.prev().length == 0) {
     const top = $(`${SEL.conversationPane} ${SEL.pageContent}`).get(0);
     if (top) { top.scrollTop = 0; }
    } else if (focused.prev().length > 0){
      let newFocus = focused.removeClass("is-focused").prev().addClass("is-focused");
      const el = newFocus.get(0);
      if (el) { el.scrollIntoView({behavior: 'smooth', block: 'start'}); }
    }
  }
});

$btnDown.on('click', () => {
  let focused = $(SEL.messageCardFocused);
  if (focused.length == 0){
    $(SEL.messageCard).first().addClass("is-focused");
  } else if (focused.next().length == 0) {
    let pageContent = $(SEL.pageContent).not(`${SEL.splitLeft} ${SEL.pageContent}`);
    const pc = pageContent.get(0);
    if (pc) {
      pc.scrollIntoView({behavior: 'smooth', block: 'end'});
      // If the message in focus is already the last one, scroll further to the bottom of the message.
      pageContent.animate({ scrollTop: $(document).height() * 100 }, 0);
    }
  } else {
    if (focused.next().length > 0){
      let newFocus = focused.removeClass("is-focused").next().addClass("is-focused");
      const el = newFocus.get(0);
      if (el) { el.scrollIntoView({behavior: 'smooth', block: 'start'}); }
    }
  }
});

$btnControl.on('click', () => {
  if(btnControlShown){
    $readingPaneButtons.hide('slide', {direction: 'right'});
    btnControlShown = false;
  } else {
    $readingPaneButtons.show('slide', {direction: 'right'});
    btnControlShown = true;
  }
  chrome.storage.local.set({ btnControlShown }); // remember collapsed/expanded
  setTimeout(() => {$btnControl.html(btnControlLabel())}, 200);
});

// The uncluttered (near-fullscreen) view is driven by a body class + an injected
// stylesheet with !important. An author-stylesheet !important rule beats Fastmail's
// inline `left`, so the collapse survives Fastmail re-laying out the split on zoom /
// text-size changes — no flicker and no need to re-assert on a timer. The CSS is
// generated from SEL so the selectors live only in selectors.js (no duplication).
const UNCLUTTERED_CLASS = 'fmp-uncluttered';

$('<style>').attr('id', 'fmp-uncluttered-style').text(
  `body.${UNCLUTTERED_CLASS} ${SEL.conversationPane} ${SEL.toolbar},\n` +
  `body.${UNCLUTTERED_CLASS} ${SEL.pageHeader} { display: none !important; }\n` +
  `body.${UNCLUTTERED_CLASS} ${SEL.splitRight},\n` +
  `body.${UNCLUTTERED_CLASS} ${SEL.splitRightInHierarchy} { left: 0 !important; }`
).appendTo('head');

const showmainMenu = () => {
  mainMenuShown = true;
  $('body').removeClass(UNCLUTTERED_CLASS);
  $btnMainMenu.html(btnMainMenuLabel());
}

const hidemainMenu = () => {
  mainMenuShown = false;
  $('body').addClass(UNCLUTTERED_CLASS);
  $btnMainMenu.html(btnMainMenuLabel());
}