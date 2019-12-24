import React, { Component } from 'react'
import { View, Text, Dimensions, Platform, StyleSheet } from 'react-native'
import styled from 'styled-components'
import { connect } from 'react-redux'
import RNDocumentPicker from 'react-native-document-picker'
import _ from 'lodash'
import {
  getImageFromCamera,
  getImageFromGallery,
} from '../../utils/ImagePicker'
import getGeoCoords from '../../utils/geolocation'
import ActionSheet from 'react-native-actionsheet'
import {
  PapperPlaneIcon,
  CloseIcon,
  AddIconBlue,
  CameraIconBlue,
} from '../../assets/index'
import helper from '../../utils/helpers'
import {
  startSearch,
  stopSearch,
  editMessage,
  forwardMessage,
  addMessage,
  replyMessage,
  setMessage,
  setFile,
  addPreloader,
  removePreloader,
} from '../../actions/messageActions'
import {
  p_send_file,
  p_edit_message,
  p_forward_message,
  p_reply_message,
} from '../../constants/api'
import { setDialogs, setDialog } from '../../actions/dialogsActions'

import sendRequest from '../../utils/request'
import { socket } from '../../utils/socket'
import AutoHeightInput from '../../common/AutoHeightInput'
import FastImage from 'react-native-fast-image'
import MapView from 'react-native-maps'
const { sidePadding, fontSize, Colors } = helper
const { blue } = Colors

const Wrapper = styled(View)`
  background: white;
  width: ${Dimensions.get('window').width};
  left: 0;
  bottom: 0;
  align-self: center;
  padding-horizontal: 10px;
  padding-vertical: 5px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  ${'' /* align-items: ${Platform.OS === 'ios' ? 'center' : 'flex-start'}; */}
  border-width: ${({ isTopItem }) => (isTopItem ? 0 : 1)};
  border-color: ${Colors.silver};
  border-top-width: 1;
  min-height: 44px;
  background-color: #f4f4f4;
  ${'' /* max-height: 65px; */}
`
const Input = styled(AutoHeightInput)`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
  padding-horizontal: 12px;
  padding-top: ${Platform.OS === 'ios' ? '8px' : '10px'};
  padding-bottom: ${Platform.OS === 'ios' ? '6px' : '0px'};
  align-items: flex-start;
  font-size: ${fontSize.input};
  text-align-vertical: top;
  background-color: #ffffff;
  border-radius: 20px;
  border-width: 1px;
  border-color: ${Colors.silver};
`
const Left = styled(View)`
  display: flex;
  align-items: flex-start;
  flex-direction: row;
`
const Body = styled(View)`
  display: flex;
  flex-direction: row;
  flex: 1;
  align-items: center;
  justify-content: center;
`
const Right = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`
const MessageBox = styled(View)`
  width: ${Dimensions.get('window').width}px;
  padding: 0 ${sidePadding}px;
  padding-right: 5px;
  height: 60px;
  background: white;
  align-self: center;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`
const Message = styled(Text)`
  color: ${blue};
`
const MessageText = styled(Text)``
const MessageBoxLeft = styled(View)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  width: 80%;
`

const MyMessageCachedImage = styled(FastImage)`
  width: 40;
  height: 40;
`
const ReplyGeo = styled(View)`
  width: 40;
  height: 40;
`
class InputComponent extends Component {
  render() {
    const { text, edit, forward, reply } = this.state
    const { editedMessage } = this.props
    return (
      <>
        {edit ? (
          <MessageBox>
            <MessageBoxLeft>
              <Message>Редактировать сообщение</Message>
              <MessageText numberOfLines={1}>{editedMessage.text}</MessageText>
            </MessageBoxLeft>
            <Right>
              <CloseIcon onPress={this.stopEditing} marginLeft={false} />
            </Right>
          </MessageBox>
        ) : null}
        {reply ? (
          <MessageBox>
            <MessageBoxLeft>{this.renderReplyed()}</MessageBoxLeft>
            <Right>
              <CloseIcon onPress={this.stopReply} marginLeft={false} />
            </Right>
          </MessageBox>
        ) : null}
        {forward ? (
          <MessageBox>
            <MessageBoxLeft>{this.renderForward()}</MessageBoxLeft>
            <Right>
              <CloseIcon onPress={this.stopForwarding} marginLeft={false} />
              <PapperPlaneIcon onPress={this.confirmForwarding} />
            </Right>
          </MessageBox>
        ) : (
          <Wrapper isTopItem={edit || reply}>
            <Left>
              <AddIconBlue size={20} onPress={this._showActionSheetPlus} />
            </Left>
            <Body>
              <Input
                placeholder="Написать сообщение"
                onChangeText={e => this.handleChange(e)}
                value={text}
                blurOnSubmit={false}
                autoHeight
                multiline
              />
            </Body>
            <Right>
              {text.trim() ? (
                <PapperPlaneIcon onPress={this.handleSendPress} />
              ) : (
                <CameraIconBlue
                  size={20}
                  onPress={() =>
                    this._selectMedia({
                      mediaType: 'mixed',
                      maxWidth: 1500,
                      maxHeight: 1500,
                    })
                  }
                />
              )}
            </Right>
          </Wrapper>
        )}
        <ActionSheet
          ref={node => (this.ActionSheetPlus = node)}
          title="Вложение"
          options={['Документы', 'Галерея', 'Мою локацию', 'Отменить']}
          cancelButtonIndex={3}
          onPress={index => {
            switch (index) {
              case 0:
                this._selectFile()
                break
              case 1:
                this._selectGallery()
                break
              case 2:
                this._selectGeo()
                break
              default:
                break
            }
          }}
        />
      </>
    )
  }

  state = {
    text: '',
    prevText: '',
    edit: false,
    forward: false,
    reply: false,
  }

  componentWillUnmount() {
    this.stopEditing()
    this.stopReply()
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const editChanged =
      JSON.stringify(nextProps.editedMessage) !==
      JSON.stringify(prevState.editedMessage)
    const forwardChanged =
      JSON.stringify(nextProps.forwardedMessage) !==
      JSON.stringify(prevState.forwardedMessage)
    const replyChanged =
      JSON.stringify(nextProps.repliedMessage) !==
      JSON.stringify(prevState.repliedMessage)

    if (
      nextProps.editedMessage &&
      nextProps.editedMessage.text &&
      editChanged
    ) {
      return {
        ...nextProps,
        edit: nextProps.editedMessage.text,
        text: nextProps.editedMessage.text,
      }
    }
    if (!_.isEmpty(nextProps.forwardedMessage) && forwardChanged) {
      return {
        ...nextProps,
        forward: true,
      }
    }
    if (
      nextProps.repliedMessage &&
      nextProps.repliedMessage.type &&
      replyChanged
    ) {
      return {
        ...nextProps,
        reply: nextProps.repliedMessage.text
          ? nextProps.repliedMessage.text
          : true,
      }
    }

    return nextProps
  }

  renderReplyed = () => {
    const { repliedMessage } = this.props
    switch (repliedMessage.type) {
      case 'text':
        return (
          <>
            <Message>Ответить</Message>
            <MessageText numberOfLines={1}>{repliedMessage.text}</MessageText>
          </>
        )
      case 'geo':
        return (
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flexDirection: 'column', width: '98%' }}>
              <Message>Ответить</Message>
              <MessageText numberOfLines={1}>Replyed location</MessageText>
            </View>
            <ReplyGeo>
              <MapView
                scrollEnabled={false}
                rotateEnabled={false}
                pitchEnabled={false}
                zoomEnabled={false}
                provider="google"
                style={[StyleSheet.absoluteFillObject, { margin: 3 }]}
                region={{
                  ...repliedMessage.data,
                  latitudeDelta: 0.002,
                  longitudeDelta: 0.002,
                }}
                tracksViewChanges={false}
              >
                <MapView.Marker
                  coordinate={{
                    latitude: repliedMessage.data.latitude,
                    longitude: repliedMessage.data.longitude,
                  }}
                  tracksViewChanges={false}
                />
              </MapView>
            </ReplyGeo>
          </View>
        )
      case 'file':
        return (
          <>
            <Message>Ответить</Message>
            <MessageText numberOfLines={1}>
              Replyed file {repliedMessage.filename}
            </MessageText>
          </>
        )
      case 'video':
      case 'image':
        return (
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flexDirection: 'column', width: '98%' }}>
              <Message>Ответить</Message>
              <MessageText numberOfLines={1}>
                Replyed {repliedMessage.type}
              </MessageText>
            </View>

            <MyMessageCachedImage
              source={{
                uri: `https://seruniverse.asmo.media${repliedMessage.src}`,
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
          </View>
        )
      default:
        return null
    }
  }

  renderForward = () => {
    const { forwardedMessage } = this.props

    switch (forwardedMessage.type) {
      case 'text':
        return (
          <>
            <Message>{`${forwardedMessage.sender.first_name} ${forwardedMessage.sender.last_name}`}</Message>
            <MessageText numberOfLines={1}>{forwardedMessage.text}</MessageText>
          </>
        )
      case 'geo':
        return (
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flexDirection: 'column', width: '88%' }}>
              <Message>{`${forwardedMessage.sender.first_name} ${forwardedMessage.sender.last_name}`}</Message>
              <MessageText numberOfLines={1}>Forwarded location</MessageText>
            </View>
            <ReplyGeo>
              <MapView
                scrollEnabled={false}
                rotateEnabled={false}
                pitchEnabled={false}
                zoomEnabled={false}
                provider="google"
                style={[StyleSheet.absoluteFillObject, { margin: 3 }]}
                region={{
                  ...forwardedMessage.data,
                  latitudeDelta: 0.002,
                  longitudeDelta: 0.002,
                }}
                tracksViewChanges={false}
              >
                <MapView.Marker
                  coordinate={{
                    latitude: forwardedMessage.data.latitude,
                    longitude: forwardedMessage.data.longitude,
                  }}
                  tracksViewChanges={false}
                />
              </MapView>
            </ReplyGeo>
          </View>
        )
      case 'file':
        return (
          <>
            <Message>{`${forwardedMessage.sender.first_name} ${forwardedMessage.sender.last_name}`}</Message>
            <MessageText numberOfLines={1}>
              Forwarded file {forwardedMessage.filename}
            </MessageText>
          </>
        )
      case 'video':
      case 'image':
        return (
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flexDirection: 'column', width: '88%' }}>
              <Message>{`${forwardedMessage.sender.first_name} ${forwardedMessage.sender.last_name}`}</Message>
              <MessageText numberOfLines={1}>
                Forwarded {forwardedMessage.type}
              </MessageText>
            </View>

            <MyMessageCachedImage
              source={{
                uri: `https://seruniverse.asmo.media${forwardedMessage.src}`,
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
          </View>
        )
      default:
        return null
    }
  }

  stopEditing = () => {
    const { fEditMessage } = this.props
    const { prevText } = this.state
    this.setState({ edit: false, text: prevText })
    fEditMessage({})
  }

  _selectMedia = async (options = {}) => {
    getImageFromCamera(
      result => {
        const { imageFormData = {}, uri = '' } = result
        let imageSrc = /\.(gif|jpg|jpeg|tiff|png)$/i.test(uri) ? uri : ''
        this._startSendingFile(imageFormData, imageSrc)
      },
      () => {},
      options,
    )
  }

  _selectGallery = async (options = {}) => {
    getImageFromGallery(
      result => {
        const { imageFormData = {}, uri = '' } = result
        let imageSrc = /\.(gif|jpg|jpeg|tiff|png)$/i.test(uri) ? uri : ''

        this._startSendingFile(imageFormData, imageSrc)
      },
      () => {},
      options,
    )
  }

  _startSendingFile = async (formDataObject = {}, imageUri = '') => {
    const { currentChat, currentRoomId, navigation, messages } = this.props
    const form = new FormData()
    form.append('file', formDataObject)
    form.append('room', currentChat)
    // form.append('')
    const tempMessageId = Date.now()
    this.props.addPreloader({
      src: formDataObject.uri,
      viewers: [1, 2, 3],
      type: 'loader',
      roomId: currentRoomId,
      _id: tempMessageId,
      created_at: new Date(),
      isUploading: true,
    })
    await sendRequest({
      r_path: p_send_file,
      method: 'post',
      attr: form,
      config: {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
      success: res => {
        messages.push(res.message)
        this.props.setMessages(messages)
        navigation.getParam('scrollToBottom')()
        this.props.removePreloader({
          roomId: currentRoomId,
          _id: tempMessageId,
        })
        navigation.getParam('scrollToBottom')()
        this.props.setFile({})
      },
      failFunc: err => {
        this.props.removePreloader({
          roomId: currentRoomId,
          _id: tempMessageId,
        })
      },
    })
  }

  _selectFile = async () => {
    try {
      const data = await RNDocumentPicker.pick({
        type: [RNDocumentPicker.types.allFiles],
      })
      if (data) {
        this._startSendingFile(data)
      }
    } catch (err) {}
  }

  _selectGeo = async () => {
    const { currentChat, currentRoomId, navigation } = this.props
    const tempMessageId = Date.now()
    this.props.addPreloader({
      viewers: [1, 2, 3],
      type: 'loader',
      roomId: currentRoomId,
      _id: tempMessageId,
      created_at: new Date(),
      isUploading: true,
      geo: true,
    })
    const coords = await getGeoCoords()
    if (coords) {
      const { latitude, longitude } = coords
      socket.emit('geo_group', {
        room: currentChat,
        geo_data: { latitude, longitude },
      })
      navigation.getParam('scrollToBottom')()
    }
  }

  discardSelect = () => {}

  sendMessage = () => {
    const { currentChat } = this.props

    // const {
    //   _id, first_name, last_name, middle_name, image
    // } = user;
    const { text } = this.state
    if (text.trim()) {
      // const message = {
      //   _id: Math.random().toString(36).substring(7),
      //   sender: {
      //     _id,
      //     first_name,
      //     last_name,
      //     middle_name,
      //     image
      //   },
      //   text: text.trim(),
      //   created_at: new Date(),
      //   type: 'text',
      //   viewers: []
      // };
      // const newDialogs = [...dialogs];
      // const newDialog = { ...newDialogs.filter(event => event.room === currentChat)[0] };
      // if (newDialog) {
      //   newDialog.messages = [...newDialog.messages, message];
      //   newDialogs[newDialogs.findIndex(event => event.room === currentChat)] = newDialog;
      //   const newDialogSorted = newDialogs.sort((a, b) => {
      //     if (b.messages.length && a.messages.length) return new Date(b.messages[b.messages.length - 1].created_at) - new Date(a.messages[a.messages.length - 1].created_at);
      //   });
      //   setDialogs(newDialogSorted);
      socket.emit('group_message', { room: currentChat, message: text.trim() })
      // }
    }

    this.setState({ text: '' })
  }

  handleChange = e => {
    this.setState({ text: e })
  }

  _showActionSheetPlus = async () => {
    this.ActionSheetPlus && this.ActionSheetPlus.show()
  }

  confirmForwarding = () => {
    const {
      forwardedMessage: { _id },
      currentRoomId,
    } = this.props
    const bodyReq = { message_id: _id, dialog_id: currentRoomId }
    sendRequest({
      r_path: p_forward_message,
      method: 'post',
      attr: bodyReq,
      success: res => {
        this.stopForwarding()
      },
      failFunc: err => {},
    })
  }

  stopForwarding = () => {
    const { forwardMessage } = this.props
    this.setState({ forward: false })
    forwardMessage({})
  }

  confirmEditing = () => {
    const { text } = this.state
    let { messages } = this.props
    const {
      editedMessage: { _id },
    } = this.props
    const bodyReq = { text, message_id: _id }
    sendRequest({
      r_path: p_edit_message,
      method: 'patch',
      attr: bodyReq,
      success: res => {
        const msgIndex = messages.findIndex(e => e._id === _id)
        messages[msgIndex].text = text
        messages[msgIndex].edited = true
        this.props.setMessages(messages)
        this.stopEditing()
      },
      failFunc: err => {},
    })
  }

  confirmReplay = () => {
    const {
      repliedMessage: { _id },
      currentRoomId,
    } = this.props
    const { text } = this.state
    const bodyReq = { message_id: _id, dialog_id: currentRoomId, text }
    sendRequest({
      r_path: p_reply_message,
      method: 'post',
      attr: bodyReq,
      success: res => {
        this.stopReply()
      },
      failFunc: err => {
        // console.error(err)
      },
    })
  }

  stopReply = () => {
    const { replyMessage } = this.props
    this.setState({ reply: false, text: '' })
    replyMessage({})
  }

  handleSendPress = () => {
    const { navigation } = this.props
    const { edit, reply } = this.state
    if (edit) {
      this.confirmEditing()
    } else if (reply) {
      this.confirmReplay()
    } else {
      this.sendMessage()
    }
    if (!edit) {
      navigation.getParam('scrollToBottom')()
    }
  }
}

const mapStateToProps = state => ({
  currentRoom: state.messageReducer.currentRoom,
  currentChat: state.messageReducer.currentChat,
  dialogs: state.dialogsReducer.dialogs,
  dialog: state.dialogsReducer.dialog,
  editedMessage: state.messageReducer.editMessage,
  id: state.userReducer.user._id,
  user: state.userReducer.user,
  forwardedMessage: state.messageReducer.forwardMessage,
  currentRoomId: state.messageReducer.currentRoomId,
  repliedMessage: state.messageReducer.replyMessage,
})
const mapDispatchToProps = dispatch => ({
  addMessage: _ => dispatch(addMessage(_)),
  addPreloader: _ => dispatch(addPreloader(_)),
  removePreloader: _ => dispatch(removePreloader(_)),
  fEditMessage: _ => dispatch(editMessage(_)),
  startSearch: _ => dispatch(startSearch(_)),
  stopSearch: _ => dispatch(stopSearch(_)),
  setDialogs: _ => dispatch(setDialogs(_)),
  forwardMessage: _ => dispatch(forwardMessage(_)),
  replyMessage: _ => dispatch(replyMessage(_)),
  setDialog: _ => dispatch(setDialog(_)),
  setMessage: _ => dispatch(setMessage(_)),
  setFile: _ => dispatch(setFile(_)),
})
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(InputComponent)
