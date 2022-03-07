// Prevent search execution at the time enter-key is pressed to select expression from choices on Mac
const ua = window.navigator.userAgent.toLowerCase();
if(ua.indexOf("mac os x") !== -1) {
  document.addEventListener('keydown', (e) => {
    if ($("input.v-SearchInput-input").is(":focus") && e.isComposing) {
      e.stopImmediatePropagation();
    }
  });
}

