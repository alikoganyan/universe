export const sortedAllDialogs = (dialogs, props) => {
  const { setDialogs } = props
  const newDialogs =
    dialogs.length &&
    dialogs.sort((a, b) => {
      if (b.messages.length && a.messages.length) {
        const aCreation = new Date(a.created_at)
        const aLastMessage = new Date(
          a.messages[a.messages.length - 1].created_at,
        )
        const aDate = aCreation > aLastMessage ? aCreation : aLastMessage
        const bCreation = new Date(b.created_at)
        const bLastMessage = new Date(
          b.messages[b.messages.length - 1].created_at,
        )
        const bDate = bCreation > bLastMessage ? bCreation : bLastMessage
        return bDate - aDate
      }
      if (b.messages.length && !a.messages.length) {
        const aCreation = new Date(a.created_at)
        const bCreation = new Date(b.created_at)
        const bLastMessage = new Date(
          b.messages[b.messages.length - 1].created_at,
        )
        const bDate = bCreation > bLastMessage ? bCreation : bLastMessage
        return bDate - aCreation
      }
      if (!b.messages.length && a.messages.length) {
        const aCreation = new Date(a.created_at)
        const aLastMessage = new Date(
          a.messages[a.messages.length - 1].created_at,
        )
        const aDate = aCreation > aLastMessage ? aCreation : aLastMessage
        const bCreation = new Date(b.created_at)
        return bCreation - aDate
      }
      if (!b.messages.length && !a.messages.length) {
        const aCreation = new Date(a.created_at)
        const bCreation = new Date(b.created_at)
        return bCreation - aCreation
      }
      return false
    })
  setDialogs(newDialogs)
}
