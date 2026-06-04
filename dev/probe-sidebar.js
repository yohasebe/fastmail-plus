/*
 * Probe to identify the right-panel open/close toggle button.
 * Paste into the console with the right panel (contacts/details) OPEN.
 * The result is copied to the clipboard.
 */
(() => {
  const out = [];
  const push = (s) => out.push(s);

  // Enumerate elements carrying a sidebar-ish class and their owning button.
  const iconEls = [...document.querySelectorAll('[class]')].filter(e => {
    const c = e.getAttribute('class') || '';
    return /(hide|show|toggle)?sidebar/i.test(c) || /v-Button--sidebar/i.test(c);
  });

  push('### Elements with a sidebar-ish class ###');
  if (!iconEls.length) push('(none)');
  iconEls.slice(0, 20).forEach(e => {
    const tag = e.tagName.toLowerCase();
    const cls = e.getAttribute('class');
    const btn = e.closest('button, a');
    const btnInfo = btn
      ? `${btn.tagName.toLowerCase()} class="${btn.getAttribute('class') || ''}" ` +
        `aria-label="${btn.getAttribute('aria-label') || ''}" title="${btn.getAttribute('title') || ''}"`
      : '(not in a button)';
    push(`- <${tag} class="${cls}">  <- owning button: ${btnInfo}`);
  });

  // Buttons near the right contextual sidebar (the toggle is often nearby).
  push('');
  push('### Buttons near v-ContextualSidebar ###');
  const sb = document.querySelector('div.v-ContextualSidebar');
  if (sb) {
    const scope = sb.parentElement || sb;
    const btns = [...scope.querySelectorAll('button')].slice(0, 10);
    btns.forEach(b => {
      const iconCls = [...b.querySelectorAll('[class]')]
        .map(x => x.getAttribute('class')).filter(c => /icon|^i-|v-Icon/i.test(c)).join(' | ');
      push(`- button class="${b.getAttribute('class') || ''}" aria-label="${b.getAttribute('aria-label') || ''}" title="${b.getAttribute('title') || ''}"  icons:[${iconCls}]`);
    });
  } else {
    push('(v-ContextualSidebar not found - open the right panel first)');
  }

  const text = out.join('\n');
  try { if (typeof copy === 'function') { copy(text); console.log('%c✅ copied', 'color:green;font-weight:bold'); } } catch (_e) {}
  console.log(text);
  return text;
})();
