/*
 * Probe to locate the right-panel (contacts/People) open/close toggle button.
 *
 * Paste into the console WITH A MESSAGE OPEN (reading pane visible).
 * The right panel may be open or closed (capturing both states once each is ideal).
 * The result is copied to the clipboard. No personal data is emitted.
 */
(() => {
  const out = [];
  const push = (s) => out.push(s);
  const vw = window.innerWidth || 1280;

  // List buttons/links that carry an icon class (i-xxx), with rough position.
  const cands = [...document.querySelectorAll('button, a')].map(b => {
    const r = b.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return null; // skip hidden
    const icons = [...b.querySelectorAll('[class]')]
      .map(e => (e.getAttribute('class') || '').match(/\bi-[a-z0-9-]+/i))
      .filter(Boolean).map(m => m[0]);
    const selfIcon = (typeof b.className === 'string' ? b.className : '').match(/\bi-[a-z0-9-]+/i);
    if (selfIcon) icons.push(selfIcon[0]);
    if (!icons.length) return null;
    const third = r.left < vw / 3 ? 'L' : (r.left > vw * 2 / 3 ? 'R' : 'C');
    return {
      icons: [...new Set(icons)].join(','),
      pos: `${third}@${Math.round(r.left)},${Math.round(r.top)}`,
      aria: b.getAttribute('aria-label') || '',
      title: b.getAttribute('title') || '',
      cls: (typeof b.className === 'string' ? b.className : '').replace(/\bhas-icon\b/, '').trim(),
    };
  }).filter(Boolean);

  push('### Buttons with an icon (pos: L=left / C=center / R=right @x,y) ###');
  push('(the right-panel toggle should be pos=R, in the top bar or the reading-pane header)');
  cands.forEach(c => {
    push(`[${c.pos.padEnd(12)}] icons=${c.icons.padEnd(28)} aria="${c.aria.slice(0,24)}" title="${c.title.slice(0,20)}"`);
  });

  push('');
  push('### State ###');
  push(`v-ContextualSidebar (right panel) count: ${document.querySelectorAll('div.v-ContextualSidebar').length}`);
  push(`v-MessageCard (reading pane) count: ${document.querySelectorAll('div.v-MessageCard').length}`);
  push(`hint-word icons present: ${[...new Set(cands.flatMap(c => c.icons.split(',')))].filter(i => /sidebar|people|contact|panel|info|aside/i.test(i)).join(', ') || '(none)'}`);

  const text = out.join('\n');
  try { if (typeof copy === 'function') { copy(text); console.log('%c✅ copied', 'color:green;font-weight:bold'); } } catch (_e) {}
  console.log(text);
  return text;
})();
