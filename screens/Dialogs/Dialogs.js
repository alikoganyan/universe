import React, { Component } from 'react'
import { View, Text, FlatList, TouchableOpacity, AppState } from 'react-native'
import styled from 'styled-components'
import Header from './Header'
import Dialog from './Dialog'
import Loader from '../../common/Loader'
import Congratulations from '../../common/Congratulations'
import SafeAreaView from '../../common/SafeAreaView'
import { connect } from 'react-redux';
import { getMessages, setRoom, addMessage, setCurrentChat, setCurrentRoomId } from '../../actions/messageActions'
import { setDialogs, setCurrentDialogs } from '../../actions/dialogsActions'
import { setAllUsers } from '../../actions/userActions'
import helper from '../../utils/helpers'
import { socket, connectToSocket } from '../../utils/socket'
const { Colors } = helper;
const { blue, grey2, lightColor } = Colors;
const Wrapper = styled(View)
`
  height: 100%;
`
const StyledFlatList = styled(FlatList)
`
  height: 100%;
`

class Dialogs extends Component {

    render() {
        const { dialogs, user } = this.props
        const { congratulations } = this.state;
        return (
            <SafeAreaView behavior={'padding'}>
                <Wrapper>
                    <Header toProfile={this.toProfile} toggleDrawer={this.props.navigation.openDrawer} />
                    {congratulations ? <Congratulations title={'Поздравляем с регистрацией.'} onClickOutside={this.closeCongratulations}>
                        <Text style={{ color: lightColor, textAlign: 'center' }}>Не забудьте заполнить</Text>
                        <TouchableOpacity onPress={this.toProfileEdit}>
                            <Text style={{ color: blue, textAlign: 'center' }}>свой профиль и поменять пароль.</Text>
                        </TouchableOpacity>
                    </Congratulations> : null}
                    {dialogs.length ? <StyledFlatList
                        ListHeaderComponent={<View style={{ margin: 30, }} />}
                        ref={(ref) => { this.flatList = ref; }}
                        keyboardDismissMode={'on-drag'}
                        initialNumToRender={20}
                        data={dialogs}
                        keyboardShouldPersistTaps={'always'}
                        renderItem={(dialog) => {
                            const { item } = dialog
                            const { creator, participants, messages, name, text, isGroup, room, image } = item
                            const unreadMessages = messages.filter(e =>
                                !e.viewers.includes(user._id) && e.sender._id !== user._id).length
                            const chatName = !isGroup ?
                                user._id !== creator._id ?
                                    (creator.first_name ? `${creator.first_name} ${creator.last_name}` : creator.phone_number) :
                                    (participants[0] && participants[0].first_name ? `${participants[0].first_name} ${participants[0].last_name}` : participants[0].phone_number) :
                                (name || room)
                            const chatImage = !isGroup ?
                                (user._id === creator ? user.image : participants[0].image) : image;
                            return <Dialog unreadMessages={unreadMessages} lastMessage={messages} onClick={() => this.toChat({...item})} image={chatImage} title={chatName} item={item}>{text}</Dialog>
                        }}
                        keyExtractor={(item, index) => index.toString()}
                    /> : <Loader style={{ flex: 1 }} hint={'Пока нет диалогов'}>
                            <TouchableOpacity onPress={this.toContacts}>
                                <Text style={{ color: grey2, textAlign: 'center' }}>Откройте первый диалог, выбрав пользователя
                                    <Text style={{ color: blue }}> на странице контактов</Text>
                                </Text>
                            </TouchableOpacity>
                        </Loader>}
                </Wrapper>
            </SafeAreaView >
        )
    }
    state = {
        FlatListData: [],
        congratulations: false,
    }
    componentDidMount() {
        const { user } = this.props;
        // navigation.navigate('NewTask') // restore
        // clearInterval(this.interval)
        // this.interval = setInterval(() => {
        //  if (!socket.connected) connectToSocket()
        // }, 2000)
        socket.removeEventListener('update_dialogs', this.setDialogsSocket)
        socket.removeEventListener('new_message', this.newMessageSocket)
        socket.removeEventListener('new_dialogs', this.socketNewDialog)
        socket.removeEventListener('need_update', this.socketNeedsUpdate)
        socket.removeEventListener('dialog_opened', this.socketDialogOpened)
        socket.removeEventListener('new_group', this.socketGetGroup)
        AppState.addEventListener('change', this._handleAppStateChange);
        socket.emit('get_dialogs', { id: user._id })
        socket.on('update_dialogs', e => this.setDialogsSocket(e))
        socket.on('new_message', e => this.newMessageSocket(e))
        socket.on('new_dialogs', this.socketNewDialog)
        socket.on('need_update', this.socketNeedsUpdate)
        socket.on('dialog_opened', this.socketDialogOpened)
        socket.on('new_group', this.socketGetGroup)
        this.setState({ congratulations: !user.first_name })
    }
    componentWillUnmount() {
        console.log('unmount dialogs')
        // disconnectFromSocket()
        AppState.removeEventListener('change', this._handleAppStateChange);
    }
    _handleAppStateChange = () => {
        if (!socket.connected) connectToSocket()
    };
    socketGetGroup = () => {
        socket.emit('get_dialogs')
    }
    socketNewDialog = () => {}
    socketDialogOpened = e => {
        const { dialogs, setDialogs, getMessages, currentDialog } = this.props;
        const { dialog_id, viewer } = e;
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
            newDialog.messages && newDialog.messages.map(e => {
                newMessages.push({ ...e, viewers: [...e.viewers, viewer] })
            });
            newDialogs[newDialogIndex] = newDialog
            newDialog.messages = newMessages
            if (currentDialog._id === dialog_id) getMessages(newMessages)
            setDialogs(newDialogs)
        }
    }
    socketNeedsUpdate = () => {
        const { user } = this.props;
        socket.emit('get_dialogs', { id: user._id })
    }
    setDialogsSocket = (e) => {
        const { setDialogs } = this.props;
        const newDialogs = e.dialogs.length ? [...e.dialogs] : [];
        const newDialogsSorted = newDialogs.length ? newDialogs.sort((a, b) => {
            if (b.messages.length && a.messages.length) {
                const aCreation = new Date(a.created_at);
                const aLastMessage = new Date(a.messages[a.messages.length - 1].created_at)
                const aDate = aCreation > aLastMessage ? aCreation : aLastMessage
                const bCreation = new Date(b.created_at);
                const bLastMessage = new Date(b.messages[b.messages.length - 1].created_at)
                const bDate = bCreation > bLastMessage ? bCreation : bLastMessage
                return bDate - aDate
            }
            if (b.messages.length && !a.messages.length) {
                const aCreation = new Date(a.created_at);
                const bCreation = new Date(b.created_at);
                const bLastMessage = new Date(b.messages[b.messages.length - 1].created_at)
                const bDate = bCreation > bLastMessage ? bCreation : bLastMessage
                return bDate - aCreation
            }
            if (!b.messages.length && a.messages.length) {
                const aCreation = new Date(a.created_at);
                const aLastMessage = new Date(a.messages[a.messages.length - 1].created_at)
                const aDate = aCreation > aLastMessage ? aCreation : aLastMessage
                const bCreation = new Date(b.created_at);
                return bCreation - aDate
            }
            if (!b.messages.length && !a.messages.length) {
                const aCreation = new Date(a.created_at);
                const bCreation = new Date(b.created_at);
                return bCreation - aCreation
            }
        }) : [];
        setDialogs(newDialogsSorted)
    }
    closeCongratulations = () => {
        this.setState({ congratulations: false })
    }
    toProfileEdit = () => {
        const { navigation } = this.props;
        navigation.navigate('ProfileEdit')
        setTimeout(() => this.closeCongratulations(), 400)
    }
    toContacts = () => {
        const { navigation } = this.props;
        navigation.navigate('NewDialog')
    }
    newMessageSocket = (e) => {
        const { dialogs, addMessage, setDialogs, currentRoomId } = this.props
        const message = e.message._id ? {
            ...e.message
        } : { ...e, text: e.message, type: 'text', created_at: new Date(), sender: { ...e.sender }, viewers: [] }
        const newDialogs = [...dialogs]
        const newDialog = newDialogs.filter(event => event.room === e.room)[0]
        if (newDialog) {
            newDialog.messages = [...newDialog.messages, message]
            newDialogs[newDialogs.findIndex(event => event.room === e.room)] = newDialog
            const newDialogSorted = newDialogs.length && newDialogs.sort((a, b) => {
                if (b.messages.length && a.messages.length) {
                    const aCreation = new Date(a.created_at);
                    const aLastMessage = new Date(a.messages[a.messages.length - 1].created_at)
                    const aDate = aCreation > aLastMessage ? aCreation : aLastMessage
                    const bCreation = new Date(b.created_at);
                    const bLastMessage = new Date(b.messages[b.messages.length - 1].created_at)
                    const bDate = bCreation > bLastMessage ? bCreation : bLastMessage
                    return bDate - aDate
                }
                if (b.messages.length && !a.messages.length) {
                    const aCreation = new Date(a.created_at);
                    const bCreation = new Date(b.created_at);
                    const bLastMessage = new Date(b.messages[b.messages.length - 1].created_at)
                    const bDate = bCreation > bLastMessage ? bCreation : bLastMessage
                    return bDate - aCreation
                }
                if (!b.messages.length && a.messages.length) {
                    const aCreation = new Date(a.created_at);
                    const aLastMessage = new Date(a.messages[a.messages.length - 1].created_at)
                    const aDate = aCreation > aLastMessage ? aCreation : aLastMessage
                    const bCreation = new Date(b.created_at);
                    return bCreation - aDate
                }
                if (!b.messages.length && !a.messages.length) {
                    const aCreation = new Date(a.created_at);
                    const bCreation = new Date(b.created_at);
                    return bCreation - aCreation
                }
            })
            setDialogs(newDialogSorted)
            if (newDialog._id === currentRoomId) addMessage(message)
        }
    }
    toProfile = () => {
        this.props.navigation.navigate('Profile')
    }
    news = () => {

    }
    getUsers = e => {
        const { setAllUsers } = this.props;
        setAllUsers(e);
    }
    find = e => {
        setDialogs(e.result)

    }
    selectChat = e => {
        const { getMessages } = this.props;
        getMessages(e)
    }
    chatMessage = e => {
        const { addMessage, dialogs } = this.props
        addMessage(e)
        const newFlatListData = [...dialogs]
        newFlatListData.sort((a, b) => {
            return new Date(a.lastMessage) - new Date(b.lastMessage)
        })
        // this.setState({FlatListData: newFlatListData })?
    }
    newMessage = e => {
        const { senderId, chatId } = e
        const { user, dialogs } = this.props
        const chat = chatId.split('room')[1].replace(/\_/, '').replace(senderId, '')
        const newFlatListData = [...dialogs]
        const index = newFlatListData.findIndex((event) => {
            return event.id === e.senderId
        })
        const myIndex = newFlatListData.findIndex((event) => {
            return event.id === user.id
        })
        if (newFlatListData[index] || newFlatListData[myIndex]) {
            if (chat == user.id) newFlatListData[index].text = e.text
            if (senderId == user.id) newFlatListData[myIndex].text = e.text
        }
        newFlatListData.sort((a, b) => {
            return new Date(b.lastMessage) - new Date(a.lastMessage)
        })
        if (chat == user.id || senderId == user.id) setDialogs(newFlatListData)
    }
    dialogs = e => {
        const { user } = this.props
        const { dialogs, messages, unread } = e;
        const newDialogs = [];
        dialogs.map(e => {
            const message = messages.filter(message => {
                const room = user.id >= e.id ? `room${user.id}_${e.id}` : `room${e.id}_${user.id}`
                return message ? room === message.chatId : false;
            })[0];
            const unreadMessage = unread.filter(unreadMessage => {
                return unreadMessage ? e.id === unreadMessage.chatId : false;
            })[0];
            newDialogs.push({ title: e.phone, text: message ? message.text : ' no messages yet', id: e.id, unreadMessage, lastMessage: message ? message.timeSent : null })
        })
        newDialogs.sort((x, y) => {
            return x.lastMessage < y.lastMessage
        });
        setDialogs(newDialogs)
    }
    toChat = e => {
        const { setRoom, setCurrentChat, navigation, getMessages, user, setCurrentDialogs, setCurrentRoomId, dialogs } = this.props
        const { isGroup, messages, room, participants, creator, _id } = e
        const roomId = room.split('_').filter(e => e != user._id)[0]
        const currentDialog = isGroup ? { ...e } :
            user._id === creator._id ? { ...participants[0] } : { ...creator }
        const newMessages = []
        const newDialogs = [...dialogs]
        const newDialog = newDialogs.filter(e => e._id === _id)[0]
        
        setRoom(roomId)
        setCurrentRoomId(_id); 
        setCurrentChat(room)
        setCurrentDialogs(currentDialog)
        getMessages([...messages]);
        socket.emit('view', { room: room, viewer: user._id })

        if (newDialog) {
            const newDialogIndex = newDialogs.findIndex(e => e._id === _id)
            currentDialog.messages && currentDialog.messages.map(e => {
                newMessages.push({ ...e, viewers: [...e.viewers, user._id] })
            });
            newDialogs[newDialogIndex] = newDialog
            newDialog.messages = newMessages
            setDialogs(newDialogs)
        }
        navigation.navigate(e.isGroup ? 'Group' : 'Chat')
    }
    toGroup = () => {
        const { navigation } = this.props
        navigation.navigate('Group')
    }
}


const mapStateToProps = state => {
    return {
        messages: state.messageReducer.messages,
        dialogs: state.dialogsReducer.dialogs,
        currentRoomId: state.messageReducer.currentRoomId,
        currentRoom: state.messageReducer.currentRoom,
        currentChat: state.messageReducer.currentChat,
        user: state.userReducer.user,
        users: state.userReducer,
        currentDialog: state.dialogsReducer.currentDialog
    };
};
const mapDispatchToProps = dispatch => ({
    getMessages: _ => dispatch(getMessages(_)),
    setRoom: _ => dispatch(setRoom(_)),
    setCurrentChat: _ => dispatch(setCurrentChat(_)),
    setDialogs: _ => dispatch(setDialogs(_)),
    addMessage: _ => dispatch(addMessage(_)),
    setAllUsers: _ => dispatch(setAllUsers(_)),
    setCurrentDialogs: _ => dispatch(setCurrentDialogs(_)),
    setCurrentRoomId: _ => dispatch(setCurrentRoomId(_)),
})
export default connect(mapStateToProps, mapDispatchToProps)(Dialogs)