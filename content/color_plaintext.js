// Give gray left-side border to mails in plain text

const colorPlainText = () => {
  $('div.u-containSelection.v-Message-body pre').each((index, element) => {
    $(element).css('box-shadow', '8px 0px 0px 0px lightgray inset');
  });
}
