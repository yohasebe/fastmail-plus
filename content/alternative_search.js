let searchMode = "anywhere";

const $searchToggleLabel = ($('<span id="searchToggleLabel" style="margin-right:8px;">Anywhere</span>'));
const searchToggleImage = chrome.runtime.getURL("svg/arrow-repeat.svg");
const $searchToggle = $('<button id="search-toggle" title="^S" class="v-Button v-Button--subtle v-Button--sizeM has-icon" style="width:130px; padding:0;">'+
                         `<img src="${searchToggleImage}" /></button>`);

const setAltSearch = () => {
  if($("div.v-SearchInput.v-MailToolbar-search").length === 0){
    return false;
  }
  const $searchBar = $("div.v-SearchInput.v-MailToolbar-search").not('#alt-search');
  const altSHTML = '<div id="alt-search" class="v-SearchInput v-MailToolbar-search altSearch" style="position:relative;">'
    + '<input id="alt-search-input" class="v-SearchInput-input" name="alt-searchSubjectBody" '
    + 'style="background-color: #e3edf7;" '
    + 'placeholder="Search Mail" '
    + 'autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false" tabindex="0" />'
    + '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="u-standardicon v-Icon i-search" role="presentation">'
    + '<circle cx="10.5" cy="10.5" r="5.75"></circle>'
    + '<line x1="19.25" y1="19.25" x2="14.57" y2="14.57"></line>'
    + '</svg>'
    + '</div>';
  const $altSearch = $(altSHTML);
  $altSearch.insertAfter($searchBar);
  $searchBar.after($altSearch);
  $searchToggle.prepend($searchToggleLabel);
  $altSearch.after($searchToggle);
  $altSearch.hide();

  const $altSearchInput = $("#alt-search-input");
  const $normalSearchInput = $("div.v-SearchInput.v-MailToolbar-search input.v-SearchInput-input").not($altSearchInput);

  $searchToggle.on('click', (e) => {
    if(searchMode === "anywhere"){
      $searchBar.hide();
      $altSearch.show();
      searchMode = "subject_body";
      $('#alt-search-input').css('background-color', '#e3edf7');
      $('#searchToggleLabel').text("Subject & Body");
      $altSearchInput.val("");
      $altSearchInput.focus();
    } else if (searchMode === "subject_body") {
      searchMode = "subject";
      $('#alt-search-input').css('background-color', '#f7e3e3');
      $('#searchToggleLabel').text("Subject Only");
      $altSearchInput.val("");
      $altSearchInput.focus();
    } else  {
      $altSearch.hide();
      $searchBar.show();
      searchMode = "anywhere";
      $('#searchToggleLabel').text("Anywhere");
      $normalSearchInput.val("");
      $normalSearchInput.focus();
    }
  });

  $altSearchInput.on('keydown', (e) => {
    if(e.keyCode == 13){
      const text = $altSearchInput.val();
      let keys;
      const quoteRegex = /"[^"\\]*(?:\\[\s\S][^"\\]*)*"/g;
      const quoted = text.match(quoteRegex);
      const unquoted = text.replace(quoteRegex, '').split(/\s+/);
      if(quoted){
        keys = quoted.concat(unquoted);
      } else {
        keys = unquoted;
      }

      const query = keys.filter((e) => {return !(e === null || e === undefined || e === "");}).map((v, i, k) => {
        if(searchMode === "subject_body"){
          return `(suject:${v} OR body:${v})`;
        } else {
          return `subject:${v}`;
        }
      })
      const url = `https://www.fastmail.com/mail/search:(${query.join('%20')})`;
      window.location = url;
    }
  });

  document.addEventListener('keydown', (e) => {
    if(searchMode === "alt" && !$("input, textarea").is(":focus")) {
      if (!e.shiftKey && e.which === 191){
        $altSearchInput.focus();
      }
    }
  });

  return true;
};

