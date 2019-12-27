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
import { setIsMyProfile, setProfile } from '../../actions/profileAction'
import { setDialog } from '../../actions/dialogsActions'

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
                messages={this.state.messages}
                setMessages={this.setMessages}
                navigation={this.props.navigation}
                navigate={this.navigate}
                goBack={this.navigateBack}
                onShowPreviewImages={this._onShowPreviewImages}
              />
            </View>
            <Bottom>
              <Input
                messages={this.state.messages}
                setMessages={this.setMessages}
                navigation={this.props.navigation}
              />
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
    messages: [],
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
    this.props.setDialog(null)
    socket.emit('get_dialogs', { id: user._id })
  }

  setMessages = messages => {
    this.setState({ messages: messages })
  }

  navigateBack = () => {
    const { navigation } = this.props
    navigation.goBack()
  }

  toProfile = () => {
    this.props.setIsMyProfile(false)
    this.navigate('Profile')
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
  currentDialog: state.dialogsReducer.currentDialog,
  profile: state.profileReducer.profile,
})
const mapDispatchToProps = dispatch => ({
  getMessages: _ => dispatch(getMessages(_)),
  setProfile: _ => dispatch(setProfile(_)),
  setRoom: _ => dispatch(setRoom(_)),
  setCurrentRoomId: _ => dispatch(setCurrentRoomId(_)),
  setCurrentChat: _ => dispatch(setCurrentChat(_)),
  setIsMyProfile: _ => dispatch(setIsMyProfile(_)),
  setDialog: _ => dispatch(setDialog(_)),
})
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Chat)
