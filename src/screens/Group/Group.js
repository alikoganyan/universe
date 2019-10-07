import React, { Component, Fragment } from 'react'
import { View, Platform } from 'react-native'
import styled from 'styled-components'
import { connect } from 'react-redux'
import {
  setCurrentChat,
  setCurrentRoomId,
  setRoom,
} from '../../actions/messageActions'
import SafeAreaView from '../../common/SafeAreaView'
import ImagesViewer from '../../common/ImagesViewer'
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
  static state = {
    previewImages: [],
    previewImagesIndex: 0,
    previewImagesIsVisible: false,
  }

  _onCLosePreviewImages = () => {
    this.setState({
      previewImages: [],
      previewImagesIndex: 0,
      previewImagesIsVisible: false,
    })
  }

  _onShowPreviewImages = (images, index) => {
    this.setState({
      previewImages: images,
      previewImagesIndex: index,
      previewImagesIsVisible: true,
    })
  }

  render() {
    const {
      previewImagesIsVisible,
      previewImages,
      previewImagesIndex,
    } = this.state
    return (
      <Fragment>
        <SafeAreaView behavior="padding" enabled={Platform.OS === 'ios'}>
          <Wrapper>
            <Header
              toProfile={this.toProfile}
              back={this.navigateBack}
              currentChat={this.props.currentChat}
            />
            <Content
              navigate={this.props.navigation.navigate}
              goBack={this.props.navigation.goBack}
              onShowPreviewImages={this._onShowPreviewImages}
            />
            <Bottom>
              <Input />
            </Bottom>
          </Wrapper>
        </SafeAreaView>
        <ImagesViewer
          isVisible={previewImagesIsVisible}
          images={previewImages}
          index={previewImagesIndex}
          onClose={this._onCLosePreviewImages}
        />
      </Fragment>
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
