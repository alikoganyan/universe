/* eslint-disable array-callback-return */
import React, { Component } from 'react'
import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  AppState,
  Alert,
} from 'react-native'
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
  setMessage,
  removeAllPreloader,
  deleteMessage,
  getEditedMessage,
} from '../../actions/messageActions'
// import { Notifications } from 'expo';
import {
  setDialogs,
  setCurrentDialogs,
  setDialog,
  setCompanyLoading,
} from '../../actions/dialogsActions'
import {
  setAllUsers,
  setCompanies,
  setReset,
  setUser,
} from '../../actions/userActions'
import helper from '../../utils/helpers'
import { socket } from '../../utils/socket'
import TabPreHeader from '../../common/TabPreHeader'
import sendRequest from '../../utils/request'
import Company from '../../common/Company'
import { setTaskList } from '../../actions/tasksActions'
import OfflineNotice from '../../common/OfflineNotice'

import { setIsMyProfile, setProfile } from '../../actions/profileAction'

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

    const chatName =
      !isGroup && creator && participants.length
        ? user._id !== creator._id
          ? creator.first_name
            ? `${creator.first_name} ${creator.last_name}`
            : creator.phone_number && creator.phone_number
          : participants[0] && participants[0].first_name
          ? `${participants[0].first_name} ${participants[0].last_name}`
          : participants[0].phone_number && participants[0].phone_number
        : name || room
    const chatImage =
      !isGroup && participants.length
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
    const { dialogs, navigation, companyLoading } = this.props
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
        {companyLoading && <OfflineNotice text="Обновляется" bgColor="green" />}
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
    // const { user } = this.props

    this.props.setCompanies({
      companies: this.props.user.companies,
      company: this.props.user.company,
    })
    this.getProfile()

    this.props.removeAllPreloader()
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
    // AppState.addEventListener('change', this._handleAppStateChange)

    // socket.emit('get_dialogs', { id: user._id })
    socket.removeEventListener('update_dialogs', this.setDialogsSocket)
    socket.removeEventListener('update_dialog', this.setDialogSocket)
    socket.removeEventListener('update_profile', this.getProfile)
    socket.removeEventListener('new_message', this.newMessageSocket)
    socket.removeEventListener('new_dialog', this.socketNewDialog)
    socket.removeEventListener('need_update', this.socketNeedsUpdate)
    socket.removeEventListener('dialog_opened', this.socketDialogOpened)
    socket.removeEventListener('new_group', this.socketGetGroup)
    socket.removeEventListener('deleted_from_group', this.socketDeleteGroup)
    socket.removeEventListener('change_group_name', this.socketChangeGroup)
    socket.removeEventListener('change_group_image', this.socketChangeGroup)
    socket.removeEventListener(
      'change_group_participants',
      this.socketChangeGroup,
    )
    socket.removeEventListener('user_left_from_group', this.socketLeaveGroup)
    socket.removeEventListener('deleted_message', this.socketDeleteMessage)
    socket.removeEventListener('message_edited', this.socketEditMessage)
    socket.removeEventListener('delete_dialog', this.socketDeleteDialog)
    socket.removeEventListener('admin_update', this.socketAdminUpdate)
    socket.on('update_dialogs', e => this.setDialogsSocket(e))
    socket.on('update_dialog', e => this.setDialogSocket(e))
    socket.on('update_profile', this.getProfile)
    socket.on('new_message', e => this.newMessageSocket(e))
    socket.on('new_dialog', e => this.socketNewDialog(e))
    socket.on('need_update', this.socketNeedsUpdate)
    socket.on('dialog_opened', this.socketDialogOpened)
    socket.on('new_group', e => this.socketGetGroup(e))
    socket.on('deleted_from_group', e => this.socketDeleteGroup(e))
    socket.on('change_group_name', e => this.socketChangeGroup(e, 'name'))
    socket.on('change_group_image', e => this.socketChangeGroup(e, 'image'))
    socket.on('change_group_participants', e =>
      this.socketChangeGroup(e, 'participants'),
    )
    socket.on('user_left_from_group', e => this.socketLeaveGroup(e))
    socket.on('deleted_message', e => this.socketDeleteMessage(e))
    socket.on('message_edited', e => this.socketEditMessage(e))
    socket.on('delete_dialog', e => this.socketDeleteDialog(e))
    socket.on('admin_update', this.socketAdminUpdate)

    AppState.addEventListener('change', this.handleAppStateChange)
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange)

    // this.props.setDialog(null)
    this.props.setCompanyLoading(false)
    this.props.setCurrentRoomId(null)

    // disconnectFromSocket()
    // AppState.removeEventListener('change', this._handleAppStateChange);
  }

  handleAppStateChange = nextAppState => {
    const { currentChat, user } = this.props
    if (nextAppState === 'background' && currentChat) {
      socket.emit('leave', { room: currentChat, viewer: user._id })
    } else if (nextAppState === 'active' && currentChat) {
      socket.emit('view', { room: currentChat, viewer: user._id })
    }
  }

  setCompanyData = e => {
    const tasksInc = [...e.tasks]
    const tasksOut = [...e.created_tasks]
    const tasksWithUsers = [...tasksInc, ...tasksOut]
    this.props.setTaskList({ tasksInc, tasksOut, tasksWithUsers })
    this.props.setUser(e)
    this.props.setReset(true)
  }

  // setEmptyCompany = () => {
  //   const tasksInc = []
  //   const tasksOut = []
  //   const tasksWithUsers = []
  //   this.props.setTaskList({ tasksInc, tasksOut, tasksWithUsers })
  //   this.props.setCompanies({
  //     companies: [],
  //     company: {},
  //   })
  //   this.props.setReset(true)
  // }

  getProfile = (adminChange = false) => {
    if (!adminChange) {
      this.props.setCompanyLoading(true)
    }
    sendRequest({
      r_path: '/profile',
      method: 'get',
      success: res => {
        const userData = { ...res }
        this.setState({ congratulations: !userData.user.first_name })
        this.props.setCompanies({
          companies: userData.user.companies,
          company: userData.user.company,
        })
        if (
          adminChange &&
          userData.user.companies &&
          userData.user.companies.length
        ) {
          const currentCompany = userData.user.companies.find(
            c => c._id === userData.user.company._id,
          )
          if (currentCompany) {
            this.setCompanyData(userData.user)
          } else {
            this.changeCompany(userData.user.companies[0]._id)
          }
        } else {
          this.setCompanyData(userData.user)
          setDialogs(userData.user.company.dialogs)
          // socket.emit('get_dialogs')
        }

        this.props.setCompanyLoading(false)

        // todo
        // } else if (adminChange && (!userData.user.companies || !userData.user.companies.length)) {
        //   this.setEmptyCompany()
        //     console.log(222)
        // } else {
        //   this.setCompanyData(userData.user)
        //   socket.emit('get_dialogs')
        // }
      },
      failFunc: e => {
        this.props.setCompanies({
          companies: this.props.user.companies,
          company: this.props.user.company,
        })
        // this.props.setNews(res.data.news)

        this.props.setCompanyLoading(false)
      },
    })
  }

  changeCompany = id => {
    this.props.setCompanyLoading(true)
    sendRequest({
      r_path: '/profile/change_company',
      method: 'patch',
      attr: {
        company_id: id,
      },
      success: res => {
        this.getProfile()
      },
      failFunc: () => {
        this.props.setCompanyLoading(false)
      },
      full_res: true,
    })
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
    socket.emit('get_dialogs', { id: user._id })
  }
  // todo
  socketLeaveGroup = e => {
    // console.log(e)
  }

  socketAdminUpdate = () => {
    this.getProfile(true)
  }

  socketDeleteMessage = e => {
    const {
      dialogs,
      setDialogs,
      setDeletedMessage,
      currentRoomId,
      company,
    } = this.props
    if (e.company_id === company._id) {
      if (!currentRoomId) {
        const currentDialog = dialogs.find(d => d._id === e.dialog_id)
        if (currentDialog) {
          const index = dialogs.findIndex(d => d._id === e.dialog_id)
          dialogs[index].messages = dialogs[index].messages.filter(
            m => m._id !== e.message_id,
          )
          setDialogs(dialogs)
        }
      } else {
        setDeletedMessage(e)
      }
    }
  }

  socketEditMessage = ({ message }) => {
    const {
      dialogs,
      setDialogs,
      setEditedMessage,
      currentRoomId,
      company,
    } = this.props
    if (message.company === company._id) {
      if (!currentRoomId) {
        const currentDialogIndex = dialogs.findIndex(
          d => d._id === message.dialog,
        )
        if (
          currentDialogIndex ||
          (typeof currentDialogIndex === 'number' &&
            dialogs[currentDialogIndex].messages.length)
        ) {
          const editedMessageIndex = dialogs[
            currentDialogIndex
          ].messages.findIndex(m => m._id === message._id)
          if (
            editedMessageIndex !== -1 &&
            dialogs[currentDialogIndex].messages[editedMessageIndex]
          ) {
            dialogs[currentDialogIndex].messages[editedMessageIndex].text =
              message.text
            dialogs[currentDialogIndex].messages[editedMessageIndex].edited =
              message.edited
            setDialogs(dialogs)
          }
        }
      } else {
        setEditedMessage(message)
      }
    }
  }

  socketDeleteDialog = e => {
    const { dialogs, setDialogs } = this.props
    if (e) {
      const newDialogs = dialogs.filter(d => d._id !== e.dialog_id)
      setDialogs(newDialogs)
    }
  }

  socketChangeGroup = (e, type) => {
    const {
      setDialogs,
      dialogs,
      dialog,
      setDialog,
      setCurrentDialogs,
      setProfile,
    } = this.props
    if (!!(dialog[type] && e[type])) {
      if (dialog._id === e.dialog_id) {
        dialog[type] = e[type]
        setCurrentDialogs(dialog)
        setDialog(dialog)
        setProfile(dialog)
      }
    }
    if (dialogs.length && e[type]) {
      dialogs.find(d => e.dialog_id === d._id)[type] = e[type]
      setDialogs(dialogs)
    }
  }

  socketDeleteGroup = e => {
    const { setDialogs, dialogs, currentRoomId } = this.props
    const deletedDialog = dialogs.find(d => e.dialog_id === d._id)

    if (deletedDialog) {
      const newDialogs = dialogs.filter(d => e.dialog_id !== d._id)
      setDialogs(newDialogs)
      Alert.alert(
        `Вас удалили из группы ${deletedDialog.name}`,
        '',
        [
          {
            text: 'OK',
            onPress: () => {
              if (e.dialog_id === currentRoomId) {
                this.props.navigation.navigate('Dialogs')
              }
            },
          },
        ],
        { cancelable: false },
      )
    }
  }

  socketGetGroup = e => {
    const { setDialog } = this.props
    const room = e.room
    if (room) {
      socket.emit('subscribe_to_group', { room: room }, ({ dialog }) => {
        setDialog(dialog)
      })
    }
    socket.emit('get_dialogs')
  }

  // to do
  socketNewDialog = e => {
    // console.log(e, 'new dialog')
  }

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

  setDialogSocket = e => {
    const { dialogs, setDialogs } = this.props
    const dialog = { ...e }
    this.props.setDialog(dialog)
    const newDialog = dialogs.map(d => (d._id === e._id ? e : d))
    setDialogs(newDialog)
  }

  setDialogsSocket = e => {
    const { setDialogs, setCompanyLoading } = this.props
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
    setCompanyLoading(false)
    this.props.setReset(true)
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
    const { dialog, company, dialogs, user, currentRoomId } = this.props
    try {
      if (e.company === company._id) {
        const message =
          e && e._id
            ? {
                ...e,
              }
            : {
                ...e,
                text: e.text,
                type: e.type,
                created_at: new Date(),
                sender: { ...e.sender },
                viewers: [],
              }
        if (currentRoomId) {
          if (e.dialog === dialog._id) {
            if (!message.viewers.includes(user._id)) {
              message.viewers.push(user._id)
            }
            this.props.setMessage(message)
            const updatedCurrentDialog = { ...dialog }
            updatedCurrentDialog.messages.push(message)
            this.sortedDialog(updatedCurrentDialog)
          }
        } else {
          const currentDialog = dialogs.find(d => d._id === e.dialog)
          if (currentDialog) {
            currentDialog.messages.push(message)
            this.sortedDialog(currentDialog)
            // this.props.setCurrentRoomId(e.dialog)
          }
        }
      }
    } catch (err) {
      alert(`${JSON.stringify(e)} cannot be processed [${err}]`)
    }
  }

  messageEdited = e => {
    // console.log(e)
  }

  sortedDialog = dialog => {
    const { dialogs, setDialogs } = this.props
    const newDialogs = [...dialogs]
    const newDialog = { ...dialog }
    this.props.setCompanyLoading(false)
    if (newDialog) {
      newDialogs[
        newDialogs.findIndex(event => event._id === dialog._id)
      ] = newDialog
      const newDialogSorted =
        newDialogs.length &&
        newDialogs
          .sort((a, b) => {
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
          .map(e => ({ ...e, messages: _.uniqBy(e.messages, '_id') }))
      setDialogs(newDialogSorted)
    }
  }

  toProfile = () => {
    const { navigation } = this.props
    navigation.navigate('Profile')
  }

  news = () => {}

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

  // newMessage = e => {
  //   const { senderId, chatId } = e
  //   const { user, dialogs } = this.props
  //   const chat = chatId
  //     .split('room')[1]
  //     // eslint-disable-next-line no-useless-escape
  //     .replace(/\_/, '')
  //     .replace(senderId, '')
  //   const newFlatListData = [...dialogs]
  //   const index = newFlatListData.findIndex(event => event.id === e.senderId)
  //   const myIndex = newFlatListData.findIndex(event => event.id === user.id)
  //   if (newFlatListData[index] || newFlatListData[myIndex]) {
  //     if (chat === user.id) newFlatListData[index].text = e.text
  //     if (senderId === user.id) newFlatListData[myIndex].text = e.text
  //   }
  //   newFlatListData.sort(
  //     (a, b) => new Date(b.lastMessage) - new Date(a.lastMessage),
  //   )
  //   if (chat === user.id || senderId === user.id) setDialogs(newFlatListData)
  // }

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
      setProfile,
      setIsMyProfile,
    } = this.props
    e.messages.forEach(m => {
      if (!m.viewers.includes(user._id) && m.sender._id !== user._id) {
        m.viewers.push(user._id)
      }
    })
    const { isGroup, room, participants, creator, _id } = e
    const recipientId =
      !isGroup && user._id !== e.creator._id
        ? e.creator._id
        : (e.participants[0] || { _id: null })._id
    const dialog = { ...e }
    const currentDialog = isGroup
      ? { ...e }
      : user._id === creator._id
      ? { ...participants[0] }
      : { ...creator }
    if (recipientId || recipientId === 0) {
      setRoom(recipientId)
    }
    setCurrentRoomId(_id)
    setCurrentChat(room)
    this.props.setDialog(dialog)
    setCurrentDialogs(currentDialog)
    socket.emit('view', { room, viewer: user._id })
    const chatImage =
      !isGroup && participants.length
        ? user._id === creator
          ? user.image
          : participants[0].image
        : e.image

    const chatName =
      !isGroup && creator && participants.length
        ? user._id !== creator._id
          ? creator.first_name
            ? `${creator.first_name} ${creator.last_name}`
            : creator.phone_number && creator.phone_number
          : participants[0] && participants[0].first_name
          ? `${participants[0].first_name} ${participants[0].last_name}`
          : participants[0].phone_number && participants[0].phone_number
        : e.name || room
    setProfile({
      ...e,
      name: chatName,
      image: chatImage,
    })
    setIsMyProfile(false)
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
  companyLoading: state.dialogsReducer.companyLoading,
  dialogs: state.dialogsReducer.dialogs,
  message: state.messageReducer.message,
  dialog: state.dialogsReducer.dialog,
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
  setDialog: _ => dispatch(setDialog(_)),
  addMessage: _ => dispatch(addMessage(_)),
  setMessage: _ => dispatch(setMessage(_)),
  setDeletedMessage: _ => dispatch(deleteMessage(_)),
  setEditedMessage: _ => dispatch(getEditedMessage(_)),
  removeAllPreloader: _ => dispatch(removeAllPreloader(_)),
  setUser: _ => dispatch(setUser(_)),
  setAllUsers: _ => dispatch(setAllUsers(_)),
  setCurrentDialogs: _ => dispatch(setCurrentDialogs(_)),
  setCurrentRoomId: _ => dispatch(setCurrentRoomId(_)),
  setCompanies: _ => dispatch(setCompanies(_)),
  setTaskList: _ => dispatch(setTaskList(_)),
  setIsMyProfile: _ => dispatch(setIsMyProfile(_)),
  setReset: _ => dispatch(setReset(_)),
  setCompanyLoading: _ => dispatch(setCompanyLoading(_)),
  setProfile: _ => dispatch(setProfile(_)),
})
export default connect(mapStateToProps, mapDispatchToProps)(Dialogs)
