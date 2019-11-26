import React, { Component, Fragment } from 'react'
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
import ImagesViewer from '../../common/ImagesViewer'
import Header from './Header'
import Input from './Input'
import Content from './Content'
import { socket } from '../../utils/socket'
import { setIsMyProfile } from '../../actions/profileAction'

const Wrapper = styled(View)`
  height: 100%;
  overflow: hidden;
`
const Bottom = styled(View)`
  width: 100%;
  background: transparent;
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
    const { currentChat } = this.props
    return (
      <Fragment>
        <SafeAreaView behavior="padding" enabled={Platform.OS === 'ios'}>
          <Wrapper>
            <Header
              toProfile={this.toProfile}
              back={this.navigateBack}
              currentChat={currentChat}
            />
            <View style={{ flex: 1 }}>
              <Content
                navigate={this.navigate}
                goBack={this.navigateBack}
                onShowPreviewImages={this._onShowPreviewImages}
              />
            </View>

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
    this.props.setIsMyProfile(false)
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
  setIsMyProfile: _ => dispatch(setIsMyProfile(_)),
})
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Chat)
