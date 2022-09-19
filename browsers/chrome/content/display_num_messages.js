const setNumNewMessages = () => {
  let numNewMessages;
  const inbox = $("li.v-MailboxSource.v-MailboxSource--inbox");
  const badge = inbox.find("span.v-MailboxSource-badge").first().text();
  numNewMessages = badge ? parseInt(badge) : 0;

  if (chrome.runtime?.id && regexMail.test(location.href)){
    chrome.runtime.sendMessage({
      type: "number",
      value: numNewMessages
    });
  }
};
