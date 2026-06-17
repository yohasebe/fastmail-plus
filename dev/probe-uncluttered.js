/*
 * Diagnose the uncluttered (non-clutter) view after it visually breaks.
 *
 * Steps:
 *   1. Enter the uncluttered view (mail list hidden), so the toggle icon shows it
 *      is active.
 *   2. Double-click the mail pane so the list/left panel reappears (the bug).
 *   3. WITHOUT toggling, paste this into the console.
 *
 * Reports the body class, the injected style rule, and the actual layout of the
 * split panes (classes + inline/computed `left` + position), so we can see why the
 * `left: 0 !important` collapse stopped working. No personal data is emitted.
 */
(() => {
  const out = [];
  const log = (s = '') => out.push(s);

  log('### uncluttered state ###');
  log('body.fmp-uncluttered present: ' + document.body.classList.contains('fmp-uncluttered'));

  const style = document.getElementById('fmp-uncluttered-style');
  log('injected <style id=fmp-uncluttered-style>: ' + (style ? 'present' : 'MISSING'));
  if (style) log('  rule: ' + style.textContent.replace(/\s+/g, ' ').trim());
  log('');

  log('### div.v-Split--right elements ###');
  const splits = [...document.querySelectorAll('div.v-Split--right')];
  log('count: ' + splits.length);
  splits.forEach((el, i) => {
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    log(`[${i}] id=${el.id || '-'} classes=${el.className}`);
    log(`     inline.left="${el.style.left}" computed.left=${cs.left} position=${cs.position} transform=${cs.transform}`);
    log(`     rect: left=${Math.round(r.left)} width=${Math.round(r.width)}`);
  });
  log('');

  log('### selector match checks ###');
  log('div.v-Hierarchy.v-Page-content div.v-Split--right -> ' +
      document.querySelectorAll('div.v-Hierarchy.v-Page-content div.v-Split--right').length);
  const mailbox = document.querySelector('#mailbox');
  const conv = document.querySelector('#conversation');
  log('#mailbox rect width: ' + (mailbox ? Math.round(mailbox.getBoundingClientRect().width) : '(none)'));
  log('#conversation rect: ' + (conv ? `left=${Math.round(conv.getBoundingClientRect().left)} width=${Math.round(conv.getBoundingClientRect().width)}` : '(none)'));
  log('');

  // Structural outline around the split, to spot any new/changed wrappers.
  const trim = (el, depth = 0, maxDepth = 3) => {
    if (!el || depth > maxDepth) return '';
    const pad = '  '.repeat(depth);
    const cls = (typeof el.className === 'string' && el.className) ? '.' + el.className.trim().split(/\s+/).slice(0, 5).join('.') : '';
    const cs = getComputedStyle(el);
    const pos = cs.position !== 'static' ? ` [${cs.position} left=${cs.left}]` : '';
    let line = `${pad}<${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}${cls}${pos}>`;
    const kids = [...el.children].slice(0, 4).map(k => trim(k, depth + 1, maxDepth)).filter(Boolean).join('\n');
    return line + (kids ? '\n' + kids : '');
  };
  log('### outline: v-Page-content subtree ###');
  const page = document.querySelector('div.v-Hierarchy.v-Page-content') || document.querySelector('div.v-Page.v-Split--right');
  log(page ? trim(page, 0, 4) : '(v-Page-content not found)');

  const text = out.join('\n');
  try { if (typeof copy === 'function') { copy(text); console.log('%c✅ copied', 'color:green;font-weight:bold'); } } catch (_e) {}
  console.log(text);
  return text;
})();
