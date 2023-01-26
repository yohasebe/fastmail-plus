const setNumNewMessages = () => {
  let numNewMessages;
  const inbox = $("li.v-MailboxSource.v-MailboxSource--inbox");
  const badge = inbox.find("span.v-MailboxSource-badge").first().text();
  numNewMessages = badge ? parseInt(badge) : 0;

  if (browser.runtime?.id && regexMail.test(location.href)){
    browser.runtime.sendMessage({
      type: "number",
      value: numNewMessages
    });
  } else {
    browser.runtime.sendMessage({
      type: "string",
      value: ""
    });
  }
};
