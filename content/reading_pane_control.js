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
$btnReload.attr('title', '^R');
$btnReload.attr('class', 'v-Button v-Button--standard v-Button--sizeM bfm-Button');

// Reload message
const relad = () => {
  $btnRelaod.click();
}

const $btnMainMenu = $(`<button>${btnMainMenuLabel()}</button>`).appendTo($readingPaneButtons);
$btnMainMenu.attr('id', 'btnMainMenu');
$btnMainMenu.attr('title', '^⇧L');
$btnMainMenu.attr('class', 'v-Button v-Button--standard v-Button--sizeM bfm-Button');

// Left-hand menu toggle
const togglemainMenu = () => {
  $btnMainMenu.click();
}

const $btnUp = $(`<button><span class='label'>${btnUpLabel()}</span></button>`).appendTo($readingPaneButtons);
$btnUp.attr('id', 'btnUp');
$btnUp.attr('title', '↑');
$btnUp.attr('class', 'v-Button v-Button--standard v-Button--sizeM bfm-Button');

const $btnDown = $(`<button><span class='label'>${btnDownLabel()}</span></button>`).appendTo($readingPaneButtons);
$btnDown.attr('id', 'btnDown');
$btnDown.attr('title', '↓');
$btnDown.attr('class', 'v-Button v-Button--standard v-Button--sizeM bfm-Button');

const $btnToggle = $(`<button><span class='label'>${btnToggleLabel()}</span></button>`).appendTo($readingPaneButtons);
$btnToggle.attr('id', 'btnToggle');
$btnToggle.attr('title', '⏎');
$btnToggle.attr('class', 'v-Button v-Button--standard v-Button--sizeM bfm-Button');

const $btnExpand = $(`<button><span class='label'>${btnExpandLabel()}</span></button>`).appendTo($readingPaneButtons);
$btnExpand.attr('id', 'btnExpand');
$btnExpand.attr('title', '⇧⏎');
$btnExpand.attr('class', 'v-Button v-Button--standard v-Button--sizeM bfm-Button');

const $btnCollapse = $(`<button><span class='label'>${btnCollapseLabel()}</span></button>`).appendTo($readingPaneButtons);
$btnCollapse.attr('id', 'btnCollapse');
$btnCollapse.attr('title', '⇧⌥⏎');
$btnCollapse.attr('class', 'v-Button v-Button--standard v-Button--sizeM bfm-Button');

$readingPaneButtons.appendTo($allButtons);
$controlerButton = $("<div />").appendTo($allButtons);

const $btnControl = $(`<button><span class='label'>${btnControlLabel()}</span></button>`).appendTo($controlerButton);
$btnControl.attr('id', 'btnControl');
$btnControl.attr('title', '^,');
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
  setTimeout(() => {$btnControl.html(btnControlLabel())}, 200);
});

// The uncluttered (near-fullscreen) view is driven by a body class + CSS with
// !important (see main.css). An author-stylesheet !important rule beats Fastmail's
// inline `left`, so the collapse survives Fastmail re-laying out the split on zoom /
// text-size changes — no flicker and no need to re-assert on a timer.
const UNCLUTTERED_CLASS = 'fmp-uncluttered';

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