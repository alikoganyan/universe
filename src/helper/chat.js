import { socket } from '../utils/socket'

export const toChat = (e, props) => {
  const {
    setDialog,
    setCurrentChat,
    navigation,
    user,
    setCurrentDialogs,
    setCurrentRoomId,
    setProfile,
    setIsMyProfile,
  } = props
  const dialog = { ...e }
  const { room, _id, image, name } = dialog
  setCurrentRoomId(_id)
  setCurrentChat(room)
  setDialog(dialog)
  setCurrentDialogs(dialog)
  socket.emit('view', { room, viewer: user._id })
  const chatImage = image
  const chatName = name || room
  setProfile({
    ...dialog,
    name: chatName,
    image: chatImage,
  })
  setIsMyProfile(false)
  navigation.navigate('Group')
}
