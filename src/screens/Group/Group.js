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
import { setIsMyProfile } from '../../actions/profileAction'
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
    return (
      <Fragment>
        <SafeAreaView behavior="padding" enabled={Platform.OS === 'ios'}>
          <Wrapper>
            <Header
              toProfile={this.toProfile}
              back={this.navigateBack}
              currentChat={this.props.currentChat}
            />
            <View style={{ flex: 1 }}>
              <Content
                navigation={this.props.navigation}
                navigate={this.props.navigation.navigate}
                goBack={this.props.navigation.goBack}
                onShowPreviewImages={this._onShowPreviewImages}
              />
            </View>
            <Bottom>
              <Input navigation={this.props.navigation} />
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
    this.props.setDialog(null)
    socket.emit('get_dialogs', { id: user._id })
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
}

const mapStateToProps = state => ({
  messages: state.messageReducer.messages,
  currentRoom: state.messageReducer.currentRoom,
  currentChat: state.messageReducer.currentChat,
  user: state.userReducer.user,
})
const mapDispatchToProps = dispatch => ({
  setRoom: _ => dispatch(setRoom(_)),
  setDialog: _ => dispatch(setDialog(_)),
  setCurrentChat: _ => dispatch(setCurrentChat(_)),
  setCurrentRoomId: _ => dispatch(setCurrentRoomId(_)),
  setIsMyProfile: _ => dispatch(setIsMyProfile(_)),
})
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Chat)
