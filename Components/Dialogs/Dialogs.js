import React, { Component } from 'react'
import { View, Text, FlatList, Dimensions, StatusBar } from 'react-native'
import styled from 'styled-components'
import { Header, Dialog } from './index'
import { SafeAreaView } from '../../Common/'
import { connect } from 'react-redux';
import { getMessages, setRoom, setDialogs } from '../../actions/messageActions'
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
      <SafeAreaView behavior={'height'}>
        <Wrapper>
          <Header toggleDrawer={this.props.navigation.openDrawer} />
          <StyledFlatList
            ListHeaderComponent={<View style={{ margin: 30, }} />}
            ref={(ref) => { this.flatList = ref; }}
            data={FlatListData}
            renderItem={({ item, index }) => <Dialog lastMessage={item.lastMessage} onClick={() => this.toChat(item.id)} title={item.title}>{item.text}</Dialog>}
            keyExtractor={(item, index) => index.toString()}
          />
        </Wrapper>
      </SafeAreaView>
    )
  }
  state = {
    FlatListData: []
  }
  componentDidMount() {
    const { getMessages, setDialogs, storeDialogs } = this.props;
    socket.emit('dialogs', {});
    socket.on('dialogs', (e) => {
      const { dialogs, messages } = e;
      const newDialogs = [];
      dialogs.map(e => {
        const message = messages.filter(message => {
          return message ? Number(e.id) === Number(message.chatId) : false;
        })[0];
        message && newDialogs.push({ title: e.phone, text: message.text, id: e.id, lastMessage: message.timeSent })
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
    const { setRoom, navigation } = this.props
    socket.emit('select chat', { chatId: index })
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
    storeDialogs: state.messageReducer,
    currentRoom: state.messageReducer.currentRoom,
    id: state.userReducer.user.id
  };
};
const mapDispatchToProps = dispatch => ({
  getMessages: _ => dispatch(getMessages(_)),
  setRoom: _ => dispatch(setRoom(_)),
  setDialogs: _ => dispatch(setDialogs(_))
})
export default connect(mapStateToProps, mapDispatchToProps)(Dialogs)
