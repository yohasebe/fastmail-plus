// Prevent search execution at the time enter-key is pressed to select expression from choices on Mac
const ua = window.navigator.userAgent.toLowerCase();
if(ua.indexOf("mac os x") !== -1) {
  document.addEventListener('keydown', (e) => {
    const active = document.activeElement;
    if (active && active.matches(SEL.textInput) && e.isComposing) {
      e.stopImmediatePropagation();
    }
  });
}
