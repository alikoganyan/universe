/* eslint-disable array-callback-return */
import React, { Component } from 'react'
import { View, Text, Animated, TouchableOpacity, AppState } from 'react-native'
import styled from 'styled-components'
import { connect } from 'react-redux'
import _ from 'lodash'
import Header from './Header'
import Dialog from './Dialog'
import Loader from '../../common/Loader'
import Congratulations from '../../common/Congratulations'
import SafeAreaView from '../../common/SafeAreaView'
import {
  setRoom,
  addMessage,
  setCurrentChat,
  setCurrentRoomId,
} from '../../actions/messageActions'
// import { Notifications } from 'expo';
import { setDialogs, setCurrentDialogs } from '../../actions/dialogsActions'
import { setAllUsers, setCompanies } from '../../actions/userActions'
import helper from '../../utils/helpers'
import { socket } from '../../utils/socket'
import TabPreHeader from '../../common/TabPreHeader'
import sendRequest from '../../utils/request'
import Company from '../../common/Company'

const { Colors } = helper
const { blue, grey2, lightColor } = Colors
const Wrapper = styled(View)`
  height: 100%;
`
const StyledFlatList = styled(Animated.FlatList)`
  height: 100%;
`

const Title = styled(Text)`
  font-family: 'OpenSans-Bold';
  font-size: 30px;
  color: ${Colors.black};
  padding: 0 16px 8px;
  background-color: ${Colors.white};
  z-index: 2;
`

const HeaderContainer = styled(Animated.View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  z-index: 2;
  background-color: #ffffff;
`

class Dialogs extends Component {
  _renderItem = dialog => {
    const { user } = this.props
    const { item } = dialog
    const {
      creator,
      participants,
      messages,
      name,
      text,
      isGroup,
      room,
      image,
    } = item
    const unreadMessages = messages.filter(
      e => !e.viewers.includes(user._id) && e.sender._id !== user._id,
    ).length
    const chatName = !isGroup
      ? user._id !== creator._id
        ? creator.first_name
          ? `${creator.first_name} ${creator.last_name}`
          : creator.phone_number
        : participants[0] && participants[0].first_name
        ? `${participants[0].first_name} ${participants[0].last_name}`
        : participants[0].phone_number
      : name || room
    const chatImage = !isGroup
      ? user._id === creator
        ? user.image
        : participants[0].image
      : image
    return (
      <Dialog
        key={item._id}
        unreadMessages={unreadMessages}
        lastMessage={messages}
        onClick={() => this.toChat({ ...item })}
        image={chatImage}
        title={chatName}
        item={item}
      >
        {text}
      </Dialog>
    )
  }

  render() {
    const { dialogs, navigation } = this.props
    const { congratulations } = this.state
    const opacity = this.scrollY.interpolate({
      inputRange: [0, 90, 91],
      outputRange: [0, 0, 1],
    })

    return (
      <SafeAreaView behavior="padding">
        <TabPreHeader
          onWritePress={() => navigation.navigate('NewDialog')}
          title="Диалоги"
          opacity={opacity}
        />
        <Wrapper>
          {congratulations ? (
            <Congratulations
              title="Поздравляем с регистрацией."
              onClickOutside={this.closeCongratulations}
            >
              <Text style={{ color: lightColor, textAlign: 'center' }}>
                Не забудьте заполнить
              </Text>
              <TouchableOpacity onPress={this.toProfileEdit}>
                <Text style={{ color: blue, textAlign: 'center' }}>
                  свой профиль и поменять пароль.
                </Text>
              </TouchableOpacity>
            </Congratulations>
          ) : null}
          <StyledFlatList
            ref={ref => {
              this.flatList = ref
            }}
            ListHeaderComponent={this._renderListHeader}
            ListEmptyComponent={this._renderEmptyComponent}
            keyboardDismissMode="on-drag"
            initialNumToRender={20}
            data={dialogs}
            keyboardShouldPersistTaps="always"
            renderItem={this._renderItem}
            keyExtractor={(item, index) => item._id.toString()}
            contentContainerStyle={{ paddingBottom: 60 }}
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [
                {
                  nativeEvent: { contentOffset: { y: this.scrollY } },
                },
              ],
              {
                useNativeDriver: true,
              },
            )}
          />
        </Wrapper>
      </SafeAreaView>
    )
  }

  state = {
    congratulations: false,
    scrolled: false,
  }
  scrollY = new Animated.Value(0)

  componentDidMount() {
    const { user } = this.props

    sendRequest({
      r_path: '/profile',
      method: 'get',
      success: res => {
        this.props.setCompanies({
          companies: res.user.companies,
          company: res.user.company,
        })
      },
      failFunc: () => {},
    })
    // navigation.navigate('NewTask') // restore
    // clearInterval(this.interval)
    // this.interval = setInterval(() => {
    //  if (!socket.connected) connectToSocket()
    // }, 2000)

    // Notifications.addListener((notification) => {
    // 	const { dialogs } = this.props;
    //         const { room } = notification.data;
    //         const dialog = [...dialogs].filter(chat => chat.room === room)[0];
    //         this.toChat(dialog);
    //     });

    AppState.addEventListener('change', this._handleAppStateChange)

    socket.emit('get_dialogs', { id: user._id })
    socket.removeEventListener('update_dialogs', this.setDialogsSocket)
    socket.removeEventListener('new_message', this.newMessageSocket)
    socket.removeEventListener('new_dialogs', this.socketNewDialog)
    socket.removeEventListener('need_update', this.socketNeedsUpdate)
    socket.removeEventListener('dialog_opened', this.socketDialogOpened)
    socket.removeEventListener('new_group', this.socketGetGroup)
    socket.on('update_dialogs', e => this.setDialogsSocket(e))
    socket.on('new_message', e => this.newMessageSocket(e))
    socket.on('new_dialogs', this.socketNewDialog)
    socket.on('need_update', this.socketNeedsUpdate)
    socket.on('dialog_opened', this.socketDialogOpened)
    socket.on('new_group', this.socketGetGroup)
    this.setState({ congratulations: !user.first_name })
  }

  componentWillUnmount() {
    // disconnectFromSocket()
    // AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _renderListHeader = () => {
    const translateY = this.scrollY.interpolate({
      inputRange: [0, 50, 51],
      outputRange: [0, 50, 50],
    })

    return (
      <>
        <HeaderContainer style={{ transform: [{ translateY }] }}>
          <Title>Диалоги</Title>
          <Company navigate={this.props.navigation.navigate} />
        </HeaderContainer>
        <Header />
      </>
    )
  }

  _renderEmptyComponent = () => (
    <Loader style={{ flex: 1 }} hint="Пока нет диалогов">
      <TouchableOpacity onPress={this.toContacts}>
        <Text style={{ color: grey2, textAlign: 'center' }}>
          Откройте первый диалог, выбрав пользователя
          <Text style={{ color: blue }}> на странице контактов</Text>
        </Text>
      </TouchableOpacity>
    </Loader>
  )

  _handleAppStateChange = () => {
    const { user } = this.props
    // if (!socket.connected)
    // connectToSocket();
    socket.emit('get_dialogs', { id: user._id })
    // socket.removeEventListener('update_dialogs', this.setDialogsSocket);
    // socket.removeEventListener('new_message', this.newMessageSocket);
    // socket.removeEventListener('new_dialogs', this.socketNewDialog);
    // socket.removeEventListener('need_update', this.socketNeedsUpdate);
    // socket.removeEventListener('dialog_opened', this.socketDialogOpened);
    // socket.removeEventListener('new_group', this.socketGetGroup);
    // socket.on('update_dialogs', e => this.setDialogsSocket(e));
    // socket.on('new_message', e => this.newMessageSocket(e));
    // socket.on('new_dialogs', this.socketNewDialog);
    // socket.on('need_update', this.socketNeedsUpdate);
    // socket.on('dialog_opened', this.socketDialogOpened);
    // socket.on('new_group', this.socketGetGroup);
  }

  socketGetGroup = () => {
    socket.emit('get_dialogs')
  }

  socketNewDialog = () => {}

  socketDialogOpened = e => {
    const { dialogs, setDialogs } = this.props
    const { dialog_id, viewer } = e
    const newMessages = []
    const newDialogs = [...dialogs]
    const newDialog = newDialogs.filter(e => e._id === dialog_id)[0]
    if (newDialog) {
      const newDialogIndex = newDialogs.findIndex(e => e._id === dialog_id)
      // if (currentDialog._id === dialog_id) {
      //  currentDialog.messages && currentDialog.messages.map(e => {
      //      newMessages.push({ ...e, viewers: [...e.viewers, viewer] })
      //  });
      // } else {
      // }
      newDialog.messages &&
        newDialog.messages.forEach(e => {
          newMessages.push({ ...e, viewers: [...e.viewers, viewer] })
        })
      newDialogs[newDialogIndex] = newDialog
      newDialog.messages = newMessages
      // if (currentDialog._id === dialog_id) getMessages(newMessages)
      setDialogs(newDialogs)
    }
  }

  socketNeedsUpdate = () => {
    const { user } = this.props
    socket.emit('get_dialogs', { id: user._id })
  }

  setDialogsSocket = e => {
    const { setDialogs } = this.props
    const newDialogs = e.dialogs.length ? [...e.dialogs] : []
    const newDialogsSorted = newDialogs.length
      ? // eslint-disable-next-line array-callback-return
        newDialogs.sort((a, b) => {
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
        })
      : []
    setDialogs(newDialogsSorted)
  }

  closeCongratulations = () => {
    this.setState({ congratulations: false })
  }

  toProfileEdit = () => {
    const { navigation } = this.props
    navigation.navigate('ProfileEdit')
    setTimeout(() => this.closeCongratulations(), 400)
  }

  toContacts = () => {
    const { navigation } = this.props
    navigation.navigate('NewDialog')
  }

  newMessageSocket = e => {
    const {
      dialogs,
      setDialogs /*addMessage, currentRoomId, user*/,
    } = this.props
    try {
      const message =
        e.message && e.message._id
          ? {
              ...e.message,
            }
          : {
              ...e,
              text: e.text,
              type: e.type,
              created_at: new Date(),
              sender: { ...e.sender },
              viewers: [],
            }
      const newDialogs = [...dialogs]
      const newDialog = newDialogs.filter(event => event._id === e.dialog)[0]
      if (newDialog) {
        newDialog.messages = [...newDialog.messages, message]
        newDialogs[
          newDialogs.findIndex(event => event._id === e.dialog)
        ] = newDialog
        const newDialogSorted =
          newDialogs.length &&
          // eslint-disable-next-line array-callback-return
          newDialogs
            .sort((a, b) => {
              if (b.messages.length && a.messages.length) {
                const aCreation = new Date(a.created_at)
                const aLastMessage = new Date(
                  a.messages[a.messages.length - 1].created_at,
                )
                const aDate =
                  aCreation > aLastMessage ? aCreation : aLastMessage
                const bCreation = new Date(b.created_at)
                const bLastMessage = new Date(
                  b.messages[b.messages.length - 1].created_at,
                )
                const bDate =
                  bCreation > bLastMessage ? bCreation : bLastMessage
                return bDate - aDate
              }
              if (b.messages.length && !a.messages.length) {
                const aCreation = new Date(a.created_at)
                const bCreation = new Date(b.created_at)
                const bLastMessage = new Date(
                  b.messages[b.messages.length - 1].created_at,
                )
                const bDate =
                  bCreation > bLastMessage ? bCreation : bLastMessage
                return bDate - aCreation
              }
              if (!b.messages.length && a.messages.length) {
                const aCreation = new Date(a.created_at)
                const aLastMessage = new Date(
                  a.messages[a.messages.length - 1].created_at,
                )
                const aDate =
                  aCreation > aLastMessage ? aCreation : aLastMessage
                const bCreation = new Date(b.created_at)
                return bCreation - aDate
              }
              if (!b.messages.length && !a.messages.length) {
                const aCreation = new Date(a.created_at)
                const bCreation = new Date(b.created_at)
                return bCreation - aCreation
              }
            })
            .map(e => ({ ...e, messages: _.uniqBy(e.messages, '_id') }))
        setDialogs(newDialogSorted)
      }
    } catch (err) {
      alert(`${JSON.stringify(e)} cannot be processed [${err}]`)
    }
  }

  toProfile = () => {
    const { navigation } = this.props
    navigation.navigate('Profile')
  }

  news = () => {}

  getUsers = e => {
    const { setAllUsers } = this.props
    setAllUsers(e)
  }

  find = e => {
    setDialogs(e.result)
  }

  selectChat = () => {
    // const { getMessages } = this.props;
    // getMessages(e)
  }

  chatMessage = e => {
    const { addMessage, dialogs } = this.props
    addMessage(e)
    const newFlatListData = [...dialogs]
    newFlatListData.sort(
      (a, b) => new Date(a.lastMessage) - new Date(b.lastMessage),
    )
    // this.setState({FlatListData: newFlatListData })?
  }

  newMessage = e => {
    const { senderId, chatId } = e
    const { user, dialogs } = this.props
    const chat = chatId
      .split('room')[1]
      // eslint-disable-next-line no-useless-escape
      .replace(/\_/, '')
      .replace(senderId, '')
    const newFlatListData = [...dialogs]
    const index = newFlatListData.findIndex(event => event.id === e.senderId)
    const myIndex = newFlatListData.findIndex(event => event.id === user.id)
    if (newFlatListData[index] || newFlatListData[myIndex]) {
      if (chat === user.id) newFlatListData[index].text = e.text
      if (senderId === user.id) newFlatListData[myIndex].text = e.text
    }
    newFlatListData.sort(
      (a, b) => new Date(b.lastMessage) - new Date(a.lastMessage),
    )
    if (chat === user.id || senderId === user.id) setDialogs(newFlatListData)
  }

  dialogs = e => {
    const { user } = this.props
    const { dialogs, messages, unread } = e
    const newDialogs = []
    dialogs.forEach(e => {
      const message = messages.filter(message => {
        const room =
          user.id >= e.id ? `room${user.id}_${e.id}` : `room${e.id}_${user.id}`
        return message ? room === message.chatId : false
      })[0]
      const unreadMessage = unread.filter(unreadMessage =>
        unreadMessage ? e.id === unreadMessage.chatId : false,
      )[0]
      newDialogs.push({
        title: e.phone,
        text: message ? message.text : ' no messages yet',
        id: e.id,
        unreadMessage,
        lastMessage: message ? message.timeSent : null,
      })
    })
    newDialogs.sort((x, y) => x.lastMessage < y.lastMessage)
    setDialogs(newDialogs)
  }

  toChat = e => {
    const {
      setRoom,
      setCurrentChat,
      navigation,
      user,
      setCurrentDialogs,
      setCurrentRoomId,
    } = this.props
    const { isGroup, room, participants, creator, _id } = e
    // const roomId = room.split('_').filter(e => Number(e) !== user._id)[0]
    const recipientId =
      !isGroup && user._id !== e.creator._id
        ? e.creator._id
        : e.participants[0]._id
    const currentDialog = isGroup
      ? { ...e }
      : user._id === creator._id
      ? { ...participants[0] }
      : { ...creator }
    setRoom(recipientId)
    setCurrentRoomId(_id)
    setCurrentChat(room)
    setCurrentDialogs(currentDialog)
    socket.emit('view', { room, viewer: user._id })
    navigation.navigate(e.isGroup ? 'Group' : 'Chat')
  }

  handleScroll = event => {
    const { y } = event.nativeEvent.contentOffset
    const { scrolled } = this.state
    if (y >= 50 && !scrolled) {
      this.setState({ scrolled: true })
    } else if (y < 50 && scrolled) {
      this.setState({ scrolled: false })
    }
  }
}

const mapStateToProps = state => ({
  dialogs: state.dialogsReducer.dialogs,
  currentRoomId: state.messageReducer.currentRoomId,
  currentRoom: state.messageReducer.currentRoom,
  currentChat: state.messageReducer.currentChat,
  user: state.userReducer.user,
  currentDialog: state.dialogsReducer.currentDialog,
  companies: state.userReducer.companies,
  company: state.userReducer.company,
})
const mapDispatchToProps = dispatch => ({
  setRoom: _ => dispatch(setRoom(_)),
  setCurrentChat: _ => dispatch(setCurrentChat(_)),
  setDialogs: _ => dispatch(setDialogs(_)),
  addMessage: _ => dispatch(addMessage(_)),
  setAllUsers: _ => dispatch(setAllUsers(_)),
  setCurrentDialogs: _ => dispatch(setCurrentDialogs(_)),
  setCurrentRoomId: _ => dispatch(setCurrentRoomId(_)),
  setCompanies: _ => dispatch(setCompanies(_)),
})
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Dialogs)
