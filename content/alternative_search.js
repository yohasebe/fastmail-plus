const searchToggleImage = chrome.runtime.getURL("svg/arrow-repeat.svg");
const $searchToggle = $('<button id="search-toggle" title="^⇧M" class="v-Button v-Button--subtle v-Button--sizeM has-icon" style="background-color: #c1c5c8; width:50px; padding:0; margin-right:10px; margin-left:10px">'+
                         `<img src="${searchToggleImage}" /></button>`);
const $searchExecuteButton = $('<button id="searchExecute" style="margin-left: 10px; margin-right: 0; background-color: darkgray; width:50px;" class="v-Button v-Button--cta v-Button--sizeM"><span class="label">Go</span></button>');

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
  $altSearch.hide();
  $altSearch.insertAfter($searchBar);
  $searchBar.after($altSearch);
  $altSearch.after($searchToggle);
  $searchToggle.before($searchExecuteButton);

  const $altSearchInput = $("#alt-search-input");
  const $normalSearchInput = $("div.v-SearchInput.v-MailToolbar-search input.v-SearchInput-input").not($altSearchInput);
  $normalSearchInput.attr("placeholder", "Search Mail (Default)")

  $searchToggle.on('click', () => {
    if(searchMode === "anywhere"){
      $searchBar.hide();
      $altSearch.show();
      $searchExecuteButton.css('background-color','#80aedb');
      $searchExecuteButton.show();
      searchMode = "subject_body";
      $('#alt-search-input').css('background-color', '#e3edf7');
      $('#alt-search-input').attr('placeholder', 'Search Mail (Subject & Body)');
      const currentVal = $normalSearchInput.val();
      if(currentVal.match(/\(.*?\)/)){
        $altSearchInput.val("");
      } else {
        $altSearchInput.val(currentVal);
      }
      $altSearchInput.focus();
    } else if (searchMode === "subject_body") {
      searchMode = "subject";
      $searchExecuteButton.css('background-color','#e6a8a8');
      $('#alt-search-input').css('background-color', '#f7e3e3');
      $('#alt-search-input').attr('placeholder', 'Search Mail (Subject Only)');
      $altSearchInput.focus();
    } else  {
      $altSearch.hide();
      $searchExecuteButton.css('background-color','darkgray');
      $searchBar.show();
      searchMode = "anywhere";
      const currentVal = $altSearchInput.val();
      $normalSearchInput.val(currentVal);
      $normalSearchInput.focus();
    }
  });

  const executeSearch = () => {
    let url;
    if(searchMode === "anywhere"){
      const text = $normalSearchInput.val();
      if(text.match(/^[\(\)\s]*$/)){
        return false;
      }
      url = `https://fastmail.com/mail/search:${text}`;
    } else {
      const text = $altSearchInput.val();
      if(text.match(/^[\(\)\s]*$/)){
        return false;
      }
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
      url = `https://fastmail.com/mail/search:(${query.join('%20')})`;
    }
    window.location = url;
  }

  $altSearchInput.on('keydown', (e) => {
    if(e.keyCode == 13){
      executeSearch()
    }
  });

  $searchExecuteButton.on('click', (e) => {
    executeSearch()
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
