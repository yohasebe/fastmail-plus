/*
 * Fastmail Plus - UI diagnosis tool
 *
 * Usage:
 *   1. Open Fastmail (ideally with the mail list + reading pane visible)
 *   2. Open the DevTools Console
 *   3. Copy the whole contents of this file, paste, and press Enter
 *   4. The result is copied to the clipboard automatically (also logged)
 *   5. Share that output
 *
 * No personal data (message bodies, recipients, etc.) is emitted - only the
 * structure: tag names / ids / classes / attributes.
 */
(() => {
  const out = [];
  const log = (s = '') => out.push(s);

  // --- 1. Legacy selector survival ------------------------------------
  const legacy = {
    'v-SearchInput': 'div.v-SearchInput',
    'v-MailToolbar-search': 'div.v-MailToolbar-search',
    'v-MailboxItem': 'li.v-MailboxItem, div.v-MailboxItem',
    'v-MailboxItem-link': 'a.v-MailboxItem-link',
    'u-list-item': '.u-list-item',
    'is-focused': '.is-focused',
    'v-MessageCard': 'div.v-MessageCard',
    'v-MessageCard-header': 'div.v-MessageCard-header',
    'app-contentCard': '.app-contentCard',
    'is-collapsed': '.is-collapsed',
    'is-expanded': '.is-expanded',
    'v-Split--right': 'div.v-Split--right',
    'v-Split--left': 'div.v-Split--left',
    'v-Hierarchy': 'div.v-Hierarchy',
    'v-Page-content': 'div.v-Page-content',
    'v-Toolbar': 'div.v-Toolbar',
    'v-PageHeader': 'div.v-PageHeader',
    'v-ContextualSidebar': 'div.v-ContextualSidebar',
    'v-Button--sidebar': 'button.v-Button--sidebar',
    'v-Button': 'button.v-Button',
    'v-Compose': '.v-Compose',
    'v-EditNote': '.v-EditNote',
    '#mailbox': '#mailbox',
    '#conversation': '#conversation',
    'v-Empty': '.v-Empty',
  };
  log('### 1. Legacy selector survival ###');
  for (const [name, sel] of Object.entries(legacy)) {
    let n = 0;
    try { n = document.querySelectorAll(sel).length; } catch (_e) { n = -1; }
    log(`${n > 0 ? 'OK ' : '-- '} ${name.padEnd(24)} ${sel}  -> ${n}`);
  }
  log('');

  // --- 2. Class naming convention -------------------------------------
  // Is the v- prefix still in use, or has it been hashed/obfuscated?
  const allClasses = new Set();
  document.querySelectorAll('*').forEach(el => {
    el.classList.forEach(c => allClasses.add(c));
  });
  const arr = [...allClasses];
  const vPrefixed = arr.filter(c => /^v-/.test(c));
  const hashLike = arr.filter(c => /^[a-z]?[_-]?[A-Za-z0-9]{5,}$/.test(c) && /[0-9]/.test(c) && c.length <= 10);
  log('### 2. Class naming convention ###');
  log(`total class names: ${arr.length}`);
  log(`with "v-" prefix: ${vPrefixed.length}`);
  log(`sample (v-): ${vPrefixed.slice(0, 25).join(', ')}`);
  log(`hash-like candidates: ${hashLike.length} e.g.: ${hashLike.slice(0, 15).join(', ')}`);
  log('');

  // --- 3. URL ---------------------------------------------------------
  log('### 3. URL ###');
  log(`location.href = ${location.href.replace(/search:.*/i, 'search:<omitted>')}`);
  log(`hash = ${location.hash.slice(0, 120)}`);
  log('');

  // --- 4. Structural outline of key regions ---------------------------
  // Find each region by likely landmarks (id, role, aria, data-*).
  const trim = (el, depth = 0, maxDepth = 3, maxChildren = 6) => {
    if (!el || depth > maxDepth) return '';
    const pad = '  '.repeat(depth);
    const cls = el.className && typeof el.className === 'string'
      ? '.' + el.className.trim().split(/\s+/).slice(0, 6).join('.') : '';
    const id = el.id ? '#' + el.id : '';
    const role = el.getAttribute && el.getAttribute('role') ? ` role=${el.getAttribute('role')}` : '';
    const aria = el.getAttribute && el.getAttribute('aria-label') ? ` aria-label="${el.getAttribute('aria-label').slice(0, 30)}"` : '';
    const data = el.attributes ? [...el.attributes].filter(a => /^data-/.test(a.name)).slice(0, 3).map(a => ` ${a.name}="${String(a.value).slice(0, 20)}"`).join('') : '';
    let line = `${pad}<${el.tagName.toLowerCase()}${id}${cls}${role}${aria}${data}>`;
    const kids = [...el.children].slice(0, maxChildren);
    const more = el.children.length > maxChildren ? `\n${pad}  ...(+${el.children.length - maxChildren} more)` : '';
    const sub = kids.map(k => trim(k, depth + 1, maxDepth, maxChildren)).filter(Boolean).join('\n');
    return line + (sub ? '\n' + sub : '') + more;
  };

  const regions = [
    ['search toolbar', [
      '[role="search"]', 'input[type="search"]', '.v-SearchInput',
      'input[placeholder*="Search" i]'
    ]],
    ['mailbox list item (first only)', [
      'li.v-MailboxItem', '[role="listitem"]', '[data-list-item]',
      '.v-MailboxItem', '[role="option"]'
    ]],
    ['reading pane / message card', [
      'div.v-MessageCard', '[role="article"]', '.app-contentCard',
      'article', '[data-message-id]'
    ]],
    ['split layout', [
      'div.v-Split--right', '.v-Split', '[class*="Split"]', 'main'
    ]],
    ['toolbar / header', [
      '.v-Toolbar', '.v-PageHeader', '[class*="Toolbar"]', '[class*="Header"]'
    ]],
  ];

  log('### 4. Structural outline ###');
  for (const [title, selectors] of regions) {
    let found = null, used = null;
    for (const sel of selectors) {
      try {
        const el = document.querySelector(sel);
        if (el) { found = el; used = sel; break; }
      } catch (_e) {}
    }
    log(`\n--- ${title} ---`);
    if (found) {
      log(`(matched: ${used})`);
      log(trim(found, 0, 3, 6));
    } else {
      log('(not found - may not be visible on this screen)');
    }
  }
  log('');

  // --- 5. Top-level structure below body ------------------------------
  log('### 5. Top-level structure ###');
  log(trim(document.body, 0, 2, 8));
  log('');

  // --- 6. Right contextual sidebar probe ------------------------------
  // Run this section with the right panel (contacts/details) OPEN to identify
  // the new selectors.
  log('### 6. Right contextual sidebar probe ###');
  const hints = /sidebar|contextual|aside|detailspanel|infopanel|rightbar|v-Contact/i;
  const hitClasses = arr.filter(c => hints.test(c));
  log(`classes containing a hint word: ${hitClasses.join(', ') || '(none)'}`);
  // Buttons that look like a toggle (hint word in aria-label/title).
  const btnHints = /sidebar|info|detail|panel|contact/i;
  const btns = [...document.querySelectorAll('button, a')].filter(b => {
    const al = (b.getAttribute('aria-label') || '') + ' ' + (b.getAttribute('title') || '');
    return btnHints.test(al);
  }).slice(0, 12);
  if (btns.length) {
    log('candidate buttons:');
    btns.forEach(b => {
      const cls = typeof b.className === 'string' ? '.' + b.className.trim().split(/\s+/).slice(0, 6).join('.') : '';
      log(`  <${b.tagName.toLowerCase()}${cls} aria-label="${(b.getAttribute('aria-label') || '').slice(0, 40)}" title="${(b.getAttribute('title') || '').slice(0, 30)}">`);
    });
  } else {
    log('candidate buttons: (none - re-run with the right panel open)');
  }

  const text = out.join('\n');
  try {
    if (typeof copy === 'function') { copy(text); console.log('%c✅ Result copied to the clipboard.', 'color:green;font-weight:bold'); }
  } catch (_e) {}
  console.log(text);
  return text;
})();
