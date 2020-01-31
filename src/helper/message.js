export const getCurrentCompany = (text, date, type, props, messageType) => {
  const { sendingMessages, user, dialog } = props
  const { company } = user
  let newSendingMessages = { ...sendingMessages }
  const companyKey = company._id
  const dialogKey = dialog._id
  if (!newSendingMessages[companyKey]) {
    newSendingMessages[companyKey] = {}
  }
  if (!newSendingMessages[companyKey][dialogKey]) {
    newSendingMessages[companyKey][dialogKey] = {
      messages: [],
    }
  }
  if (newSendingMessages[companyKey][dialogKey].messages) {
    createMessage(
      newSendingMessages,
      companyKey,
      dialogKey,
      text,
      date,
      type,
      props,
      messageType,
    )
  }
}

const createMessage = (
  newSendingMessages,
  companyKey,
  dialogKey,
  text,
  date,
  type,
  props,
  messageType,
) => {
  const { setSendingMessages, dialog, user } = props
  const currentDialog = newSendingMessages[companyKey][dialogKey]
  let lastItemId = currentDialog.messages.length
    ? currentDialog.messages[currentDialog.messages.length - 1]._id
    : 0
  const newMessage = {
    text: text,
    type: type,
    viewers: [user._id],
    dialog: dialog._id,
    company: user.company._id,
    created_at: date,
    updated_at: date,
    sender: { ...user },
    _id: --lastItemId,
    myMessage: true,
    reply:
      messageType === 'reply'
        ? props.repliedMessage
        : messageType === 'forward' && props.forwardedMessage.reply
        ? props.forwardedMessage.reply
        : false,
    resend: messageType === 'forward' ? props.forwardedMessage : false,
  }
  newSendingMessages[companyKey][dialogKey].messages.push(newMessage)
  setSendingMessages(newSendingMessages)
}
