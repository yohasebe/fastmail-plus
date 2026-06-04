/*
 * Fastmail Plus - Centralized selector definitions
 *
 * All selectors used across the content scripts are consolidated here.
 * When a Fastmail web UI change breaks a feature, this file is usually the
 * only place that needs updating (use dev/diagnose.js to inspect the live DOM).
 *
 * Content scripts run in the same scope in the order listed in the manifest's
 * js array, so the `const SEL` defined in this first-loaded file is visible to
 * every subsequent file.
 *
 * Last verified: 2026-06-04 (app.fastmail.com redesigned UI)
 */
const SEL = {
  // --- Startup detection / search ---
  searchInput: 'div.v-SearchInput.v-MailToolbar-search',
  searchInputAny: 'div.v-SearchInput',
  textInput: '.v-TextInput-input',

  // --- Mailbox list pane ---
  mailboxPane: '#mailbox',
  mailboxItem: 'li.v-MailboxItem.u-list-item',
  mailboxItemAny: 'li.v-MailboxItem',
  mailboxItemFocused: 'li.v-MailboxItem.u-list-item.is-focused',
  listLink: 'a.u-list-link', // was a.v-MailboxItem-link (renamed in the 2026 UI)

  // --- Conversation / reading pane ---
  conversationPane: '#conversation',
  messageCard: 'div.v-MessageCard.app-contentCard',
  messageCardAny: 'div.v-MessageCard',
  messageCardHeader: 'div.v-MessageCard-header',
  messageCardFocused: 'div.v-MessageCard.app-contentCard.is-focused',
  messageCardCollapsed: 'div.v-MessageCard.app-contentCard.is-collapsed',
  messageCardExpanded: 'div.v-MessageCard.app-contentCard.is-expanded',
  messageCardCollapsedHeader: 'div.v-MessageCard.app-contentCard.is-collapsed div.v-MessageCard-header',
  messageCardExpandedHeader: 'div.v-MessageCard.app-contentCard.is-expanded div.v-MessageCard-header',

  // --- Layout ---
  splitRight: 'div.v-Split--right',
  splitLeft: 'div.v-Split--left',
  splitRightInHierarchy: 'div.v-Hierarchy.v-Page-content div.v-Split--right',
  pageContent: 'div.v-Page-content',
  toolbar: 'div.v-Toolbar',
  pageHeader: 'div.v-PageHeader',
  empty: 'div.v-Empty',

  // --- Compose / Note ---
  // In the 2026 UI, v-Compose became a *child* of app-contentCard, so the old
  // '.v-Compose.app-contentCard' (same element) no longer matches.
  composeCard: '.app-contentCard:has(.v-Compose)',
  noteCard: '.app-contentCard:has(.v-EditNote)',
  composeActive: '.v-Compose, .v-EditNote', // a compose/reply or note editor is open
  richTextInput: 'div.v-RichText-input',

  // --- Right contextual sidebar ---
  // v-ContextualSidebar still exists (present only while the right panel is
  // open; absent from the DOM when closed). The button-offset adjustment uses it.
  contextualSidebar: 'div.v-ContextualSidebar',
  // The right contextual panel (People/contacts) toggle swaps its icon by state:
  // when closed it's the toolbar's i-sidebar (click to open); when open the same
  // spot becomes i-close (click to close). i-close is generic, so when closing we
  // always scope it under v-ContextualSidebar to avoid hitting other close buttons
  // (see toggleRightbar). The left-nav collapse uses i-hidesidebar/i-showsidebar,
  // a different class, so it does not interfere.
  sidebarOpenToggle: 'button:has(svg.i-sidebar)',
  closeButton: 'button:has(svg.i-close)',
};

if (typeof window !== 'undefined') {
  window.SEL = SEL;
}
