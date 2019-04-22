import React, { Component } from 'react'
import { View, Text, FlatList, Dimensions, StatusBar } from 'react-native'
import styled from 'styled-components'
import { Header, Dialog } from './index'
import { SafeAreaView } from '../../common'
import { connect } from 'react-redux';
import { getMessages, setRoom, addMessage } from '../../actions/messageActions'
import { setDialogs } from '../../actions/dialogsActions'
import { setAllUsers } from '../../actions/userActions'
import helper from '../../utils/helpers'

const { sidePaddingNumber, HeaderHeightNumber, socket } = helper;
const Wrapper = styled(View)`
  height: 100%;
`
const StyledFlatList = styled(FlatList)`
  height: 100%;
`

class Dialogs extends Component {

  render() {
    const { dialogs } = this.props
    const { FlatListData } = this.state;
    return (
      <SafeAreaView behavior={'padding'}>
        <Wrapper>
          <Header toProfile={this.toProfile} toggleDrawer={this.props.navigation.openDrawer} />
          <StyledFlatList
            ListHeaderComponent={<View style={{ margin: 30, }} />}
            ref={(ref) => { this.flatList = ref; }}
            data={dialogs}
            keyboardShouldPersistTaps={'handled'}
            renderItem={({ item, index }) => <Dialog lastMessage={item.messages} onClick={() => this.toChat(item)} title={item.title || item.room} item={item}>{item.text}</Dialog>}
            keyExtractor={(item, index) => index.toString()}
          />
        </Wrapper>
      </SafeAreaView>
    )
  }
  state = {
    FlatListData: []
  }
  async componentDidMount() {
    const { user, addMessage, setDialogs } = this.props;
    socket.on('update_dialogs', e => {
      setDialogs(e)
    })
    socket.emit('get_dialogs', { id: user._id })
    socket.on('new_message', e => addMessage({ ...e, text: e.message, date: new Date() }))
    socket.on('need_update', e => {
      socket.emit('get_dialogs', { id: user._id })
    })
  }
  componentWillUnmount() {
    socket.removeListener('update_dialogs');
    socket.removeListener('new_message');
    socket.removeListener('new_dialog');
  }
  toProfile = e => {
    this.props.navigation.navigate('Profile')
  }
  news = e => {

  }
  getUsers = e => {
    const { setAllUsers } = this.props;
    setAllUsers(e);
    this.forceUpdate()
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
    const { FlatListData } = this.state
    const newFlatListData = [...dialogs]
    newFlatListData.sort((a, b) => {
      return new Date(a.lastMessage) - new Date(b.lastMessage)
    })
    // this.setState({ FlatListData: newFlatListData })?
  }
  newMessage = e => {
    const { senderId, chatId } = e
    const { user, currentChat, dialogs } = this.props
    const chat = chatId.split('room')[1].replace(/\_/, '').replace(senderId, '')
    const { FlatListData } = this.state
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
    const { setRoom, navigation, getMessages, user } = this.props
    const roomId = e.room.split('_').filter(e => e != user._id)[0]
    setRoom(roomId)
    getMessages(e.messages);
    navigation.navigate('Chat')
  }
  toGroup = e => {
    const { navigation } = this.props
    navigation.navigate('Group')
  }
}


const mapStateToProps = state => {
  return {
    messages: state.messageReducer.messages,
    dialogs: state.dialogsReducer.dialogs,
    currentRoom: state.messageReducer.currentRoom,
    currentChat: state.messageReducer.currentChat,
    user: state.userReducer.user,
    users: state.userReducer
  };
};
const mapDispatchToProps = dispatch => ({
  getMessages: _ => dispatch(getMessages(_)),
  setRoom: _ => dispatch(setRoom(_)),
  setDialogs: _ => dispatch(setDialogs(_)),
  addMessage: _ => dispatch(addMessage(_)),
  setAllUsers: _ => dispatch(setAllUsers(_))
})
export default connect(mapStateToProps, mapDispatchToProps)(Dialogs)
