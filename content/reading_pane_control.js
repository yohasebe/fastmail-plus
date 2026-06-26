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

// Icons are inlined as SVG (Bootstrap Icons) rather than loaded via
// chrome.runtime.getURL(svg file). This removes the dependency on the extension
// context entirely: the buttons can never blank out or throw "Extension context
// invalidated" when the extension is reloaded/updated. fill=currentColor makes each
// icon follow the button's text color.
const svgIcon = (paths) =>
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" ' +
  'viewBox="0 0 16 16" style="vertical-align:text-top" role="presentation">' + paths + '</svg>';

const ICONS = {
  reload: svgIcon('<path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/><path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/>'),
  fullscreen: svgIcon('<path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1h-4zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zM.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5z"/>'),
  fullscreenExit: svgIcon('<path d="M5.5 0a.5.5 0 0 1 .5.5v4A1.5 1.5 0 0 1 4.5 6h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5zm5 0a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 10 4.5v-4a.5.5 0 0 1 .5-.5zM0 10.5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 6 11.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zm10 1a1.5 1.5 0 0 1 1.5-1.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4z"/>'),
  up: svgIcon('<path fill-rule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"/>'),
  down: svgIcon('<path fill-rule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"/>'),
  viewList: svgIcon('<path d="M3 4.5h10a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2zm0 1a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1H3zM1 2a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 2zm0 12a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 14z"/>'),
  expand: svgIcon('<path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 8zM7.646.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 1.707V5.5a.5.5 0 0 1-1 0V1.707L6.354 2.854a.5.5 0 1 1-.708-.708l2-2zM8 10a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 14.293V10.5A.5.5 0 0 1 8 10z"/>'),
  collapse: svgIcon('<path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 8zm7-8a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 4.293V.5A.5.5 0 0 1 8 0zm-.5 11.707-1.146 1.147a.5.5 0 0 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 11.707V15.5a.5.5 0 0 1-1 0v-3.793z"/>'),
  rightSquare: svgIcon('<path fill-rule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>'),
  leftSquare: svgIcon('<path fill-rule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm11.5 5.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"/>'),
};

const iconLabel = (svg) => "<span class='label'>" + svg + "</span>";

const btnReloadLabel = () => iconLabel(ICONS.reload);
// fullscreen icon in the normal view (click to enter uncluttered), exit-fullscreen
// while the uncluttered view is active.
const btnMainMenuLabel = () => iconLabel(mainMenuShown ? ICONS.fullscreen : ICONS.fullscreenExit);
const btnUpLabel = () => iconLabel(ICONS.up);
const btnDownLabel = () => iconLabel(ICONS.down);
const btnToggleLabel = () => iconLabel(ICONS.viewList);
const btnExpandLabel = () => iconLabel(ICONS.expand);
const btnCollapseLabel = () => iconLabel(ICONS.collapse);
const btnControlLabel = () => iconLabel(btnControlShown ? ICONS.rightSquare : ICONS.leftSquare);

const $btnReload = $(`<button>${btnReloadLabel()}</button>`).appendTo($readingPaneButtons);
$btnReload.attr('id', 'btnReloadMenu');
$btnReload.attr('title', 'Reload page');
$btnReload.attr('class', 'v-Button v-Button--standard v-Button--sizeM bfm-Button');

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

let expandClipTimer = null;
$btnControl.on('click', () => {
  // Collapse/expand by toggling classes that drive a CSS transition on the group's
  // width (see main.css). The frosted panel is the flex parent, so its frame shrinks
  // in lockstep with the buttons — no "frame leads/lingers" like the old jQuery slide.
  $readingPaneButtons.addClass('fmp-anim');  // clip while sliding
  clearTimeout(expandClipTimer);
  $readingPaneButtons.off('transitionend.fmpExpand');
  if(btnControlShown){
    $allButtons.addClass('fmp-collapsed');
    btnControlShown = false;
  } else {
    $allButtons.removeClass('fmp-collapsed');
    btnControlShown = true;
    // Drop the clip once expansion finishes so the upward font-size popover isn't cut.
    // Listen for the transition's end, but also fall back to a timer: if the transition
    // is skipped (e.g. prefers-reduced-motion), transitionend never fires and the clip
    // would otherwise stay and cut off the popover.
    const dropClip = () => {
      clearTimeout(expandClipTimer);
      $readingPaneButtons.removeClass('fmp-anim').off('transitionend.fmpExpand');
    };
    $readingPaneButtons.on('transitionend.fmpExpand', (e) => {
      if(e.originalEvent.propertyName === 'max-width'){ dropClip(); }
    });
    expandClipTimer = setTimeout(dropClip, 400);
  }
  safeStorageSet({ btnControlShown }); // remember collapsed/expanded
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

// Fastmail can overwrite body.className wholesale (e.g. when double-clicking the
// mail pane), wiping our uncluttered class. Re-assert it the instant the class
// attribute changes — the observer callback runs before the browser paints, so the
// panes never visibly flash open. (A 300ms poll in main.js is the backup.)
const unclutteredObserver = new MutationObserver(() => {
  // Detach once the extension is reloaded/updated (stale script).
  if(!isExtensionAlive()){ unclutteredObserver.disconnect(); return; }
  if(!mainMenuShown && !document.body.classList.contains(UNCLUTTERED_CLASS)){
    document.body.classList.add(UNCLUTTERED_CLASS);
  }
});
unclutteredObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });

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