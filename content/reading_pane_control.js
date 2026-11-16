// Right-hand menu toggle (open/close the right contextual panel).
// The toggle button swaps its icon by state, so branch on the state:
//  - closed -> click the toolbar's i-sidebar button to open
//  - open (v-ContextualSidebar exists) -> click the close (i-close) inside the panel
//    (i-close is generic, so always scope it under the panel to avoid hitting
//     other close buttons)
const toggleRightbar = () => {
  const sb = qs(SEL.contextualSidebar);
  if(sb){
    const close = qs(SEL.closeButton, sb) || (sb.parentElement && qs(SEL.closeButton, sb.parentElement));
    if(close){ close.click(); }
  } else {
    const open = qs(SEL.sidebarOpenToggle);
    if(open){ open.click(); }
  }
}

// Create reading-pane control

const allButtons = document.createElement('div');
allButtons.id = 'allButtons';

const readingPaneButtons = document.createElement('div');
readingPaneButtons.id = 'readingPaneButtons';

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
const btnControlLabel = () => iconLabel(btnControlShown ? ICONS.rightSquare : ICONS.leftSquare);

const BUTTON_CLASS = 'v-Button v-Button--standard v-Button--sizeM bfm-Button';

// Create a button with the extension's own label markup and append it to parent.
const addButton = (parent, id, title, labelHtml) => {
  const button = document.createElement('button');
  button.id = id;
  button.title = title;
  button.className = BUTTON_CLASS;
  button.innerHTML = labelHtml;
  parent.appendChild(button);
  return button;
};

const btnReload = addButton(readingPaneButtons, 'btnReloadMenu', 'Reload page', btnReloadLabel());
const btnMainMenu = addButton(readingPaneButtons, 'btnMainMenu', 'Toggle uncluttered view', btnMainMenuLabel());

// Left-hand menu toggle
const togglemainMenu = () => {
  btnMainMenu.click();
}

const btnUp = addButton(readingPaneButtons, 'btnUp', 'Previous message', iconLabel(ICONS.up));
const btnDown = addButton(readingPaneButtons, 'btnDown', 'Next message', iconLabel(ICONS.down));
const btnToggle = addButton(readingPaneButtons, 'btnToggle', 'Toggle this message', iconLabel(ICONS.viewList));
const btnExpand = addButton(readingPaneButtons, 'btnExpand', 'Expand all', iconLabel(ICONS.expand));
const btnCollapse = addButton(readingPaneButtons, 'btnCollapse', 'Collapse all', iconLabel(ICONS.collapse));

// --- Body text size: a main button that shows the current % and expands a
//     vertical sub-group [A+ / ↺ / A-] upward when clicked. ---

// Wrapper provides the positioning context for the upward popover.
const fontSizeWrap = document.createElement('span');
fontSizeWrap.id = 'fontSizeWrap';
readingPaneButtons.appendChild(fontSizeWrap);

// Main button: its label shows the current scale (kept in sync by applyBodyFontScale).
const btnFontSize = addButton(fontSizeWrap, 'btnFontSize', 'Body text size — click to adjust', "<span class='label'>100%</span>");

// Sub-group (hidden until expanded). DOM order A-, ↺, A+ ; CSS column-reverse puts
// A+ on top and A- at the bottom.
const fontSizeButtons = document.createElement('span');
fontSizeButtons.id = 'fontSizeButtons';
fontSizeButtons.style.display = 'none';
fontSizeWrap.appendChild(fontSizeButtons);

const btnFontDown = addButton(fontSizeButtons, 'btnFontDown', 'Smaller', "<span class='label'>A-</span>");
const btnFontReset = addButton(fontSizeButtons, 'btnFontReset', 'Reset to 100%', "<span class='label'>↺</span>");
const btnFontUp = addButton(fontSizeButtons, 'btnFontUp', 'Larger', "<span class='label'>A+</span>");

const isFontSizeOpen = () => fontSizeButtons.style.display !== 'none';
const setFontSizeOpen = (open) => {
  fontSizeButtons.style.display = open ? '' : 'none';
};

btnFontSize.addEventListener('click', () => { setFontSizeOpen(!isFontSizeOpen()); });
btnFontDown.addEventListener('click', () => { bumpBodyFontScale(-BODY_ZOOM_STEP); });
btnFontUp.addEventListener('click', () => { bumpBodyFontScale(BODY_ZOOM_STEP); });
btnFontReset.addEventListener('click', () => { resetBodyFontScale(); });

// Collapse the sub-group when clicking anywhere outside the control (another
// button or the page). Clicks inside #fontSizeWrap (the toggle and A+/↺/A-) are
// ignored so the group stays open while adjusting.
document.addEventListener('click', (e) => {
  if (isFontSizeOpen() && !fontSizeWrap.contains(e.target)) {
    setFontSizeOpen(false);
  }
});

allButtons.appendChild(readingPaneButtons);
const controllerButton = document.createElement('div');
allButtons.appendChild(controllerButton);

const btnControl = addButton(controllerButton, 'btnControl', 'Show / hide these buttons', btnControlLabel());

btnReload.addEventListener('click', () => {
  window.location.reload();
});

btnMainMenu.addEventListener('click', () => {
  if(!mainMenuShown){
    showmainMenu();
  } else {
    hidemainMenu();
  }
});

btnToggle.addEventListener('click', () => {
  const current = qs(SEL.messageCardFocused) || qs(SEL.messageCard);
  if(!current){
    return;
  }
  const header = qs(SEL.messageCardHeader, current);
  if(header){ header.click(); }
  setTimeout(() => {
    current.classList.add("is-focused");
  }, 100);
});

btnExpand.addEventListener('click', () => {
  qsa(SEL.messageCardCollapsedHeader).forEach((header) => header.click());
});

btnCollapse.addEventListener('click', () => {
  qsa(SEL.messageCardExpandedHeader).forEach((header) => header.click());
});

// Mark a message card as focused and scroll to it.
const focusCard = (card) => {
  card.classList.add("is-focused");
  card.scrollIntoView({behavior: 'smooth', block: 'start'});
};

// Move the is-focused marker from one message card to another.
const moveCardFocus = (from, to) => {
  from.classList.remove("is-focused");
  focusCard(to);
};

btnUp.addEventListener('click', () => {
  const focused = qs(SEL.messageCardFocused);
  if (!focused){
    const cards = qsa(SEL.messageCard);
    if (cards.length > 0) { cards[cards.length - 1].classList.add("is-focused"); }
  } else if (!focused.previousElementSibling) {
    const top = qs(`${SEL.conversationPane} ${SEL.pageContent}`);
    if (top) { top.scrollTop = 0; }
  } else {
    moveCardFocus(focused, focused.previousElementSibling);
  }
});

btnDown.addEventListener('click', () => {
  const focused = qs(SEL.messageCardFocused);
  if (!focused){
    const first = qs(SEL.messageCard);
    if (first) { first.classList.add("is-focused"); }
  } else if (!focused.nextElementSibling) {
    const pageContents = qsa(SEL.pageContent).filter((el) => !el.closest(SEL.splitLeft));
    if (pageContents.length > 0) {
      pageContents[0].scrollIntoView({behavior: 'smooth', block: 'end'});
      // If the message in focus is already the last one, scroll further to the bottom of the message.
      pageContents.forEach((el) => { el.scrollTop = el.scrollHeight; });
    }
  } else {
    moveCardFocus(focused, focused.nextElementSibling);
  }
});

let expandClipTimer = null;
let expandClipListener = null;
btnControl.addEventListener('click', () => {
  // Collapse/expand by toggling classes that drive a CSS transition on the group's
  // width (see main.css). The frosted panel is the flex parent, so its frame shrinks
  // in lockstep with the buttons.
  readingPaneButtons.classList.add('fmp-anim');  // clip while sliding
  clearTimeout(expandClipTimer);
  if(expandClipListener){
    readingPaneButtons.removeEventListener('transitionend', expandClipListener);
    expandClipListener = null;
  }
  if(btnControlShown){
    allButtons.classList.add('fmp-collapsed');
    btnControlShown = false;
  } else {
    allButtons.classList.remove('fmp-collapsed');
    btnControlShown = true;
    // Drop the clip once expansion finishes so the upward font-size popover isn't cut.
    // Listen for the transition's end, but also fall back to a timer: if the transition
    // is skipped (e.g. prefers-reduced-motion), transitionend never fires and the clip
    // would otherwise stay and cut off the popover.
    const dropClip = () => {
      clearTimeout(expandClipTimer);
      readingPaneButtons.classList.remove('fmp-anim');
      if(expandClipListener){
        readingPaneButtons.removeEventListener('transitionend', expandClipListener);
        expandClipListener = null;
      }
    };
    expandClipListener = (e) => {
      if(e.propertyName === 'max-width'){ dropClip(); }
    };
    readingPaneButtons.addEventListener('transitionend', expandClipListener);
    expandClipTimer = setTimeout(dropClip, 400);
  }
  safeStorageSet({ btnControlShown }); // remember collapsed/expanded
  setTimeout(() => { btnControl.innerHTML = btnControlLabel(); }, 200);
});

// The uncluttered (near-fullscreen) view is driven by a body class + an injected
// stylesheet with !important. An author-stylesheet !important rule beats Fastmail's
// inline `left`, so the collapse survives Fastmail re-laying out the split on zoom /
// text-size changes — no flicker and no need to re-assert on a timer. The CSS is
// generated from SEL so the selectors live only in selectors.js (no duplication).
const UNCLUTTERED_CLASS = 'fmp-uncluttered';

const unclutteredStyle = document.createElement('style');
unclutteredStyle.id = 'fmp-uncluttered-style';
unclutteredStyle.textContent =
  `body.${UNCLUTTERED_CLASS} ${SEL.conversationPane} ${SEL.toolbar},\n` +
  `body.${UNCLUTTERED_CLASS} ${SEL.pageHeader} { display: none !important; }\n` +
  `body.${UNCLUTTERED_CLASS} ${SEL.splitRight},\n` +
  `body.${UNCLUTTERED_CLASS} ${SEL.splitRightInHierarchy} { left: 0 !important; }`;
document.head.appendChild(unclutteredStyle);

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
  document.body.classList.remove(UNCLUTTERED_CLASS);
  btnMainMenu.innerHTML = btnMainMenuLabel();
}

const hidemainMenu = () => {
  mainMenuShown = false;
  document.body.classList.add(UNCLUTTERED_CLASS);
  btnMainMenu.innerHTML = btnMainMenuLabel();
}
