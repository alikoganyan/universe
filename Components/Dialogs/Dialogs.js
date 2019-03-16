import React, { Component } from 'react'
import { View, Text, FlatList, Dimensions, StatusBar } from 'react-native'
import styled from 'styled-components'
import { Header, Dialog } from './index'
import { SafeAreaView } from '../../Common/'
import { connect } from 'react-redux';
import { getMessages, setRoom } from '../../actions/messageActions'
import helper from '../../Helper/helper'
const { sidePaddingNumber, HeaderHeightNumber, socket } = helper;
const Wrapper = styled(View)`
  max-height: ${Dimensions.get('window').height - sidePaddingNumber}px;
`
const StyledFlatList = styled(FlatList)`
`

class Dialogs extends Component {
  render() {
    const { FlatListData } = this.state;
    return (
      <SafeAreaView>
        <Wrapper>
          <Header toggleDrawer={this.props.navigation.openDrawer} />
          <StyledFlatList
            ListHeaderComponent={<View style={{ margin: 30, }} />}
            ref={(ref) => { this.flatList = ref; }}
            data={FlatListData}
            renderItem={({ item, index }) => <Dialog onClick={() => this.toChat(index)} title={item.title}>{item.text}</Dialog>}
            keyExtractor={(item, index) => index.toString()}
          />
        </Wrapper>
      </SafeAreaView>
    )
  }
  state = {
    FlatListData: [
      { text: 'text', title: 'title' },
      { text: 'text', title: 'title' },
      { text: 'text', title: 'title' },
      { text: 'text', title: 'title' },
      { text: 'text', title: 'title' },
      { text: 'text', title: 'title' },
      { text: 'text', title: 'title' },
      { text: 'text', title: 'title' },
      { text: 'text', title: 'title' },
      { text: 'text', title: 'title' },
      { text: 'text', title: 'title' },
      { text: 'text', title: 'title' },
      { text: 'text', title: 'title' },
      { text: 'text', title: 'title' },
      { text: 'text', title: 'title' },
      { text: 'text', title: 'title' },
      { text: 'text', title: 'title' },
      { text: 'text', title: 'title' },
      { text: 'text', title: 'title' }
    ]
  }
  componentDidMount() {
    const { getMessages } = this.props;
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
    currentRoom: state.messageReducer.currentRoom,
    id: state.userReducer.user.id
  };
};
const mapDispatchToProps = dispatch => ({
  getMessages: _ => dispatch(getMessages(_)),
  setRoom: _ => dispatch(setRoom(_))
})
export default connect(mapStateToProps, mapDispatchToProps)(Dialogs)
