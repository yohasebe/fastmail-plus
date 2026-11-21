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
const searchToggle = htmlToElement(`<button id="search-toggle" title="Switch search mode" class="v-Button v-Button--standard v-Button--sizeM v-Button--iconOnly has-icon" style="margin-left:8px;">${repeatIcon}</button>`);
const searchExecuteButton = htmlToElement(`<button id="searchExecute" title="Search" class="v-Button v-Button--standard v-Button--sizeM v-Button--iconOnly has-icon" style="margin-left:8px;">${sendIcon}</button>`);

// The extra search box, made once; setAltSearch() puts it (with the two buttons)
// after Fastmail's own search box, again whenever Fastmail rebuilds the toolbar,
// and removeAltSearch() takes it away when the option is turned off.
const altSearch = htmlToElement('<div id="alt-search" class="v-TextInput v-SearchInput v-MailToolbar-search" style="position:relative;">'
  + '<div class="v-TextInput-control">'
  + '<input id="alt-search-input" class="v-TextInput-input" name = "alt-search" type = "text" tabindex = "0" placeholder = "Search Mail" autocapitalize = "off" autocomplete = "off" autocorrect = "off" spellcheck = "false" title = "Shortcut: /" >'
  + '</div >'
  + '<svg xmlns = "http://www.w3.org/2000/svg" viewBox = "0 0 24 24" class="u-standardicon v-Icon i-search" role = "presentation" ><circle cx="10.5" cy="10.5" r="5.75"></circle><line x1="19.25" y1="19.25" x2="14.57" y2="14.57"></line></svg></div>');
const altSearchInput = qs('#alt-search-input', altSearch);
const NATIVE_SEARCH_PLACEHOLDER = 'Search Mail (Default)';
// Fastmail's own search box next to which the extra one was last put.
let searchBar = null;
let nativePlaceholder = null;
const nativeSearchInput = () => (searchBar ? qs('input', searchBar) : null);
const normalValue = () => {
  const input = nativeSearchInput();
  return input ? input.value : "";
};

// Show the given search mode: "anywhere" uses Fastmail's own box, the others the
// extra one in its mode color.
const showSearchMode = (mode) => {
  searchMode = mode;
  const colors = mode === "subject_body" ? SEARCH_MODE_COLORS.subjectBody
    : mode === "subject" ? SEARCH_MODE_COLORS.subject : null;
  if(searchBar){
    searchBar.style.display = colors ? 'none' : '';
  }
  altSearch.style.display = colors ? '' : 'none';
  // On the light mode color, force a dark icon regardless of theme for contrast;
  // in anywhere mode, back to the native standard colors.
  searchExecuteButton.style.backgroundColor = colors ? colors.button : '';
  searchExecuteButton.style.color = colors ? SEARCH_MODE_COLORS.iconOnTint : '';
  altSearchInput.style.backgroundColor = colors ? colors.input : '';
  altSearchInput.placeholder = mode === "subject" ? 'Search Mail (Subject Only)' : 'Search Mail (Subject & Body)';
};

searchToggle.addEventListener('click', () => {
  if(searchMode === "anywhere"){
    showSearchMode("subject_body");
    const currentVal = normalValue();
    altSearchInput.value = currentVal.match(/\(.*?\)/) ? "" : currentVal;
    altSearchInput.focus();
  } else if (searchMode === "subject_body") {
    showSearchMode("subject");
    altSearchInput.focus();
  } else {
    showSearchMode("anywhere");
    const input = nativeSearchInput();
    if(input){
      input.value = altSearchInput.value;
      input.focus();
    }
  }
});

const executeSearch = () => {
  let url;
  if(searchMode === "anywhere"){
    const text = normalValue();
    if(text.match(/^[\(\)\s]*$/)){
      return false;
    }
    url = `${location.origin}/mail/search:${text}`;
  } else {
    const text = altSearchInput.value;
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

altSearchInput.addEventListener('keydown', (e) => {
  // Ignore the Enter that confirms an IME conversion.
  if(e.key === 'Enter' && !e.isComposing){
    executeSearch()
  }
});

searchExecuteButton.addEventListener('click', () => {
  executeSearch()
});

const setAltSearch = () => {
  const bar = qs(`${SEL.searchInput}:not(#alt-search)`);
  if(!bar){
    return false;
  }
  searchBar = bar;
  // Order after the native search box: alt search, execute button, mode toggle.
  searchBar.after(altSearch, searchExecuteButton, searchToggle);
  const input = nativeSearchInput();
  if(input && input.placeholder !== NATIVE_SEARCH_PLACEHOLDER){
    nativePlaceholder = input.placeholder;
    input.placeholder = NATIVE_SEARCH_PLACEHOLDER;
  }
  // A rebuilt toolbar shows Fastmail's own box again; follow it.
  showSearchMode("anywhere");
  return true;
};

// Take the extra search box away and leave Fastmail's own box as it was.
const removeAltSearch = () => {
  showSearchMode("anywhere");
  altSearch.remove();
  searchExecuteButton.remove();
  searchToggle.remove();
  const input = nativeSearchInput();
  if(input && nativePlaceholder !== null){
    input.placeholder = nativePlaceholder;
  }
  searchBar = null;
};
