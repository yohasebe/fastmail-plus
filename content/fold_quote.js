// This enables quote from previous mails to be folded and toggled by a button 
const managed = []

const foldQuote = () => {
  $('div[id*="appendonsend"]').each((index, element) => {
    let quote = $(element).nextAll();
    let btId  = $(element).attr('id') + '-bt';
    if(!managed.includes(btId)){
      managed.push(btId);
      let btTag = '<br /><div class="u-quote-topPostToggle">'
        + '<input type="button" id="${btId}" class="u-quote-link v-Button v-Button--standard v-Button--iconOnly" value="..." />'
        + '</div>';
      $(btTag).insertBefore($(element)).click((event) => {
        quote.nextAll().toggle('show');
      });
      quote.nextAll().hide();
      $(element).remove();
    }
  })
};
