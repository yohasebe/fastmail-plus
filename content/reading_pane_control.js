// Right-hand menu toggle
const toggleRightbar = () => {
  $('button.v-Button--sidebar').first().click();
}

// Create reading-pane control

const $allButtons = $("<div />")
$allButtons.attr('id', 'allButtons');

const $readingPaneButtons = $("<div />")
$readingPaneButtons.attr('id', 'readingPaneButtons');

const createImageLabel = (imgPath, key) => {
  return "<span class='label'>" +
         `<img style='vertical-align:text-top' src='${chrome.runtime.getURL(imgPath)}' />` +
         "</span>";
}

const btnMainMenuLabel = () => {
  return createImageLabel("svg/fullscreen.svg", "^L");
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

const $btnMainMenu = $(`<button>${btnMainMenuLabel()}</button>`).appendTo($readingPaneButtons);
$btnMainMenu.attr('id', 'btnMainMenu');
$btnMainMenu.attr('title', '^L');
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

$btnMainMenu.on('click', () => {
  if(!mainMenuShown){
    showmainMenu();
  } else {
    hidemainMenu();
  }
});

$btnToggle.on('click', () => {
  let focused = $("div.v-MessageCard.app-contentCard.is-focused")
  let current;
  if(focused.length > 0){
    current = focused.first();
  } else {
    current = $("div.v-MessageCard.app-contentCard").first();
  }
  current.find("div.v-MessageCard-header").click()
  setTimeout(() => {
    current.addClass("is-focused");
  }, 100);
});

$btnExpand.on('click', () => {
  $("div.v-MessageCard.app-contentCard.is-collapsed div.v-MessageCard-header").click();
});

$btnCollapse.on('click', () => {
  $("div.v-MessageCard.app-contentCard.is-expanded div.v-MessageCard-header").click();
});

$btnUp.on('click', () => {
  let focused = $("div.v-MessageCard.app-contentCard.is-focused");
  if (focused.length == 0){
    $("div.v-MessageCard.app-contentCard").last().addClass("is-focused");
  } else {
    if (focused.prev().length > 0){
      let newFocus = focused.removeClass("is-focused").prev().addClass("is-focused");
      newFocus.get(0).scrollIntoView({behavior: 'smooth', block: 'nearest'});
    }
  }
});

$btnDown.on('click', () => {
  let focused = $("div.v-MessageCard.app-contentCard.is-focused");
  if (focused.length == 0){
    $("div.v-MessageCard.app-contentCard").first().addClass("is-focused");
  } else {
    if (focused.next().length > 0){
      let newFocus = focused.removeClass("is-focused").next().addClass("is-focused");
      newFocus.get(0).scrollIntoView({behavior: 'smooth', block: 'nearest'});
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

let originalmainMenuWidth1;
let originalmainMenuWidth2;

const showmainMenu = () => {
  mainMenuShown = true;
  $("#conversation div.v-Toolbar, div.v-PageHeader").css("display", "");
  // application order is important
  $("div.v-Split--right").css("left", originalmainMenuWidth1);
  $("div.v-Hierarchy.v-Page-content div.v-Split--right").css('left', originalmainMenuWidth2);
}
//
const hidemainMenu = () => {
  mainMenuShown = false;
  $("#conversation div.v-Toolbar, div.v-PageHeader").css("display", "none");
  // requesting order is important
  originalmainMenuWidth2 = $("div.v-Hierarchy.v-Page-content div.v-Split--right").css('left');
  $("div.v-Hierarchy.v-Page-content div.v-Split--right").css('left', '0px');
  originalmainMenuWidth1 = $("div.v-Split--right").css("left");
  $("div.v-Split--right").css("left", "0px");
}

