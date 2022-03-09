const runMiscActions = () => {
  $('div[id*="appendonsend"]').each(foldQuote);
  $('div.u-containSelection.v-Message-body pre').each(colorPlainText);
}
