import React, { Component } from 'react'
import { View, Platform } from 'react-native'
import styled from 'styled-components'
import { connect } from 'react-redux'
import {
  setCurrentChat,
  setCurrentRoomId,
  setRoom,
  getMessages,
} from '../../actions/messageActions'
import SafeAreaView from '../../common/SafeAreaView'
import Header from './Header'
import Input from './Input'
import Content from './Content'
import { socket } from '../../utils/socket'

const Wrapper = styled(View)`
  height: 100%;
  overflow: hidden;
`
const Bottom = styled(View)`
  position: absolute;
  bottom: 0;
  width: 100%;
  background: transparent;
  z-index: 3;
`
class Chat extends Component {
  render() {
    const { currentChat } = this.props
    return (
      <SafeAreaView behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}>
        <Wrapper>
          <Header
            toProfile={this.toProfile}
            back={this.navigateBack}
            currentChat={currentChat}
          />
          <Content navigate={this.navigate} goBack={this.navigateBack} />
          <Bottom>
            <Input />
          </Bottom>
        </Wrapper>
      </SafeAreaView>
    )
  }

  state = {
    currentChat: null,
  }

  componentDidMount() {}

  componentWillUnmount() {
    const {
      setRoom,
      setCurrentChat,
      setCurrentRoomId,
      currentChat,
      user,
    } = this.props
    socket.emit('leave', { room: currentChat, viewer: user._id })
    setCurrentChat(null)
    setCurrentRoomId(null)
    setRoom(null)
  }

  navigateBack = () => {
    const { navigation } = this.props
    navigation.goBack()
  }

  toProfile = () => {
    const { navigation } = this.props
    const { navigate } = navigation
    navigate('Profile')
  }

  navigate = e => {
    const { navigation } = this.props
    navigation.navigate(e)
  }
}

const mapStateToProps = state => ({
  messages: state.messageReducer.messages,
  currentRoom: state.messageReducer.currentRoom,
  currentChat: state.messageReducer.currentChat,
  user: state.userReducer.user,
})
const mapDispatchToProps = dispatch => ({
  getMessages: _ => dispatch(getMessages(_)),
  setRoom: _ => dispatch(setRoom(_)),
  setCurrentRoomId: _ => dispatch(setCurrentRoomId(_)),
  setCurrentChat: _ => dispatch(setCurrentChat(_)),
})
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Chat)
