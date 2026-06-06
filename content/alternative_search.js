// Match Fastmail's native icon buttons (iconOnly). Like the magnifier to the
// left of the search box, use a self-contained inline SVG (following
// currentColor) so size and color adapt to the theme automatically.
const iconSvg = (inner) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" ` +
  `fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" ` +
  `stroke-linejoin="round" role="presentation" style="vertical-align:middle;">${inner}</svg>`;
// Send (->) icon: run the search
const sendIcon = iconSvg('<line x1="4" y1="12" x2="18" y2="12"></line><polyline points="12 5.5 18.5 12 12 18.5"></polyline>');
// Repeat icon: cycle through search modes
const repeatIcon = iconSvg('<polyline points="17 2 21 6 17 10"></polyline><path d="M3 11.5V10a4 4 0 0 1 4-4h14"></path><polyline points="7 22 3 18 7 14"></polyline><path d="M21 12.5V14a4 4 0 0 1-4 4H3"></path>');

// Colors that indicate the active search mode. The mode backgrounds are light, so
// the button icon is forced to a dark color for contrast regardless of theme.
const SEARCH_MODE_COLORS = {
  subjectBody: { button: '#80aedb', input: '#e3edf7' },
  subject: { button: '#e6a8a8', input: '#f7e3e3' },
  iconOnTint: '#1b1e20',
};

// Match Fastmail's native "standard button" style (v-Button--standard) so the
// buttons look consistent with the others in the UI. The search button gets a
// mode color (blue/red) layered on top, and returns to the native standard color
// in anywhere mode.
const $searchToggle = $(`<button id="search-toggle" title="Switch search mode" class="v-Button v-Button--standard v-Button--sizeM v-Button--iconOnly has-icon" style="margin-left:8px;">${repeatIcon}</button>`);
const $searchExecuteButton = $(`<button id="searchExecute" title="Search" class="v-Button v-Button--standard v-Button--sizeM v-Button--iconOnly has-icon" style="margin-left:8px;">${sendIcon}</button>`);

const setAltSearch = () => {
  if($(SEL.searchInput).length === 0){
    return false;
  }
  const $searchBar = $(SEL.searchInput).not('#alt-search');
  const altSHTML = '<div id="alt-search" class="v-TextInput v-SearchInput v-MailToolbar-search" style="position:relative;">'
    + '<div class="v-TextInput-control">'
    + '<input id="alt-search-input" class="v-TextInput-input" name = "alt-search" type = "text" tabindex = "0" placeholder = "Search Mail" autocapitalize = "off" autocomplete = "off" autocorrect = "off" spellcheck = "false" title = "Shortcut: /" >'
    + '</div >'
    + '<svg xmlns = "http://www.w3.org/2000/svg" viewBox = "0 0 24 24" class="u-standardicon v-Icon i-search" role = "presentation" ><circle cx="10.5" cy="10.5" r="5.75"></circle><line x1="19.25" y1="19.25" x2="14.57" y2="14.57"></line></svg>';

  const $altSearch = $(altSHTML);
  $altSearch.hide();
  $altSearch.insertAfter($searchBar);
  $searchBar.after($altSearch);
  $altSearch.after($searchToggle);
  $searchToggle.before($searchExecuteButton);

  const $altSearchInput = $("#alt-search-input");
  const $normalSearchInput = $(`${SEL.searchInput} input`).not($altSearchInput);
  $normalSearchInput.attr("placeholder", "Search Mail (Default)")

  $searchToggle.on('click', () => {
    if(searchMode === "anywhere"){
      $searchBar.hide();
      $altSearch.show();
      // On the light mode color, force a dark icon regardless of theme for contrast
      $searchExecuteButton.css({'background-color': SEARCH_MODE_COLORS.subjectBody.button, 'color': SEARCH_MODE_COLORS.iconOnTint});
      $searchExecuteButton.show();
      searchMode = "subject_body";
      $('#alt-search-input').css('background-color', SEARCH_MODE_COLORS.subjectBody.input);
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
      $searchExecuteButton.css({'background-color': SEARCH_MODE_COLORS.subject.button, 'color': SEARCH_MODE_COLORS.iconOnTint});
      $('#alt-search-input').css('background-color', SEARCH_MODE_COLORS.subject.input);
      $('#alt-search-input').attr('placeholder', 'Search Mail (Subject Only)');
      $altSearchInput.focus();
    } else  {
      $altSearch.hide();
      // back to the native standard background and text color
      $searchExecuteButton.css({'background-color': '', 'color': ''});
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
      url = `${location.origin}/mail/search:${text}`;
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

      const query = keys.filter((e) => {return !(e === null || e === undefined || e === "");}).map(v => {
        if(searchMode === "subject_body"){
          return `(subject:${v} OR body:${v})`;
        } else {
          return `subject:${v}`;
        }
      })
      url = `${location.origin}/mail/search:(${query.join('%20')})`;
    }
    window.location = url;
  }

  $altSearchInput.on('keydown', (e) => {
    if(e.keyCode == 13){
      executeSearch()
    }
  });

  $searchExecuteButton.on('click', (_e) => {
    executeSearch()
  });

  return true;
};
