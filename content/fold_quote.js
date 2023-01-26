// This enables quote from previous mails to be folded and toggled by a button
const managed = []

const foldQuote = () => {
  $('div[id*="appendonsend"]').each((_index, element) => {
    let quote = $(element).nextAll();
    let btId  = $(element).attr('id') + '-foldbtn';
    if(!managed.includes(btId)){
      managed.push(btId);
      let btTag = '<br /><div class="u-quote-topPostToggle">'
        + '<input type="button" id="${btId}" class="u-quote-link v-Button v-Button--standard v-Button--iconOnly" value="..." />'
        + '</div>';
      $(btTag).insertBefore($(element)).click((_event) => {
        quote.nextAll().toggle('show');
      });
      quote.nextAll().hide();
      $(element).remove();
    }
  })
}