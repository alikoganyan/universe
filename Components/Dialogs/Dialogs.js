import React, { Component } from 'react'
import { View, Text, FlatList, Dimensions, StatusBar } from 'react-native'
import styled from 'styled-components'
import { Header, Dialog } from './index'
import { SafeAreaView } from '../../Common/'
import { connect } from 'react-redux';
import { getMessages, setRoom } from '../../actions/messageActions'
import { setDialogs } from '../../actions/dialogsActions'
import helper from '../../Helper/helper'
import { DrawerActions } from 'react-navigation';

const { sidePaddingNumber, HeaderHeightNumber, socket } = helper;
const Wrapper = styled(View)`
  height: 100%;
`
const StyledFlatList = styled(FlatList)`
  height: 100%;
`

class Dialogs extends Component {
  render() {
    const { FlatListData } = this.state;
    return (
      <SafeAreaView behavior={'padding'}>
        <Wrapper>
          <Header toggleDrawer={this.props.navigation.openDrawer} />
          <StyledFlatList
            ListHeaderComponent={<View style={{ margin: 30, }} />}
            ref={(ref) => { this.flatList = ref; }}
            data={FlatListData}
            keyboardShouldPersistTaps={'handled'}
            renderItem={({ item, index }) => <Dialog lastMessage={item.lastMessage} onClick={() => this.toChat(item.id)} title={item.title} item={item}>{item.text}</Dialog>}
            keyExtractor={(item, index) => index.toString()}
          />
        </Wrapper>
      </SafeAreaView>
    )
  }
  state = {
    FlatListData: []
  }
  componentWillReceiveProps(props) {
    // this.setState({ FlatListData: [...props.dialog] })
  }
  componentDidMount() {
    const { getMessages, setDialogs, messages, id } = this.props;
    socket.emit('dialogs', {userId: id});
    socket.emit('news', {userId: id});
    socket.on('news', e => console.log('test', e));
    socket.emit('set dialogs', {userId: id, dialogId: 33});
    socket.on('find', e => {
      this.setState({ FlatListData: e.result })
    })
    socket.on('dialogs', (e) => {
      const { dialogs, messages, unread } = e;
      const newDialogs = [];
      dialogs.map(e => {
        const message = messages.filter(message => {
          return message ? Number(e.id) === Number(message.chatId) : false;
        })[0];
        const unreadMessage = unread.filter(unreadMessage => {
          return unreadMessage ? Number(e.id) === Number(unreadMessage.chatId) : false;
        })[0];
        newDialogs.push({ title: e.phone, text: message ? message.text : ' no messages yet', id: e.id, unreadMessage, lastMessage: message ? message.timeSent : null  })
      })
      newDialogs.sort((x, y) => {
        return x.lastMessage < y.lastMessage
      });
      this.setState({ FlatListData: newDialogs })
    })
    socket.on('select chat', e => {
      getMessages(e)
    })

  }
  toChat = (index) => {
    const { setRoom, navigation, id } = this.props
    socket.emit('select chat', { chatId: index, userId: id })
    setRoom(index)
    navigation.navigate('Chat')
  }
  toGroup = () => {
    const { navigation } = this.props
    navigation.navigate('Group')
  }
}


const mapStateToProps = state => {
  return {
    messages: state.messageReducer.messages,
    dialog: state.dialogsReducer.dialogs,
    currentRoom: state.messageReducer.currentRoom,
    id: state.userReducer.user.user.id
  };
};
const mapDispatchToProps = dispatch => ({
  getMessages: _ => dispatch(getMessages(_)),
  setRoom: _ => dispatch(setRoom(_)),
  setDialogs: _ => dispatch(setDialogs(_))
})
export default connect(mapStateToProps, mapDispatchToProps)(Dialogs)
