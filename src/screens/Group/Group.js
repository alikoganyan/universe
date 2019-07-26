import React, { Component } from 'react'
import { View, Platform } from 'react-native'
import styled from 'styled-components'
import { connect } from 'react-redux'
import {
  setCurrentChat,
  setCurrentRoomId,
  setRoom,
} from '../../actions/messageActions'
import SafeAreaView from '../../common/SafeAreaView'
import helper from '../../utils/helpers'
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
  z-index: 200;
`
class Chat extends Component {
  render() {
    return (
      <SafeAreaView behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}>
        <Wrapper>
          <Header
            toProfile={this.toProfile}
            back={this.navigateBack}
            currentChat={this.props.currentChat}
          />
          <Content navigate={this.props.navigation.navigate} />
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
      setCurrentChat,
      setRoom,
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
}

const mapStateToProps = state => ({
  messages: state.messageReducer.messages,
  currentRoom: state.messageReducer.currentRoom,
  currentChat: state.messageReducer.currentChat,
  user: state.userReducer.user,
})
const mapDispatchToProps = dispatch => ({
  setRoom: _ => dispatch(setRoom(_)),
  setCurrentChat: _ => dispatch(setCurrentChat(_)),
  setCurrentRoomId: _ => dispatch(setCurrentRoomId(_)),
})
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Chat)
