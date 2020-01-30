import React, { Component } from 'react'
import {
  View,
  Text,
  Dimensions,
  Platform,
  Alert,
  StyleSheet,
} from 'react-native'
import styled from 'styled-components'
import { connect } from 'react-redux'
import ActionSheet from 'react-native-actionsheet'
import _ from 'lodash'
import {
  getImageFromCamera,
  getImageFromGallery,
} from '../../utils/ImagePicker'
import RNDocumentPicker from 'react-native-document-picker'
import getGeoCoords from '../../utils/geolocation'
import {
  PapperPlaneIcon,
  CloseIcon,
  AddIconBlue,
  CameraIconBlue,
} from '../../assets/index'
import helper from '../../utils/helpers'
import AutoHeightInput from '../../common/AutoHeightInput'
import {
  // addMessage,
  // startSearch,
  // stopSearch,
  // getMessages,
  setCurrentChat,
  setRoom,
  setCurrentRoomId,
  editMessage,
  forwardMessage,
  replyMessage,
  setMessage,
  setFile,
  addPreloader,
  removePreloader,
  setSendingMessages,
} from '../../actions/messageActions'
import moment from 'moment'

import {
  p_send_file,
  p_edit_message,
  p_forward_message,
  p_reply_message,
} from '../../constants/api'

import { setDialogs, setDialog } from '../../actions/dialogsActions'
import sendRequest from '../../utils/request'
import { socket } from '../../utils/socket'
import FastImage from 'react-native-fast-image'
import MapView from 'react-native-maps'

const { sidePadding, /*HeaderHeight,*/ fontSize, Colors } = helper
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
  width: 100%;
  max-height: 120px;
  overflow: hidden;
  padding-horizontal: 12px;
  padding-top: ${Platform.OS === 'ios' ? '8px' : '8px'};
  padding-bottom: ${Platform.OS === 'ios' ? '6px' : '2px'};
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
  align-items: flex-start;
  flex-direction: row;
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
  max-width: 80%;
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
                autoHeight={Platform.OS !== 'ios'}
                multiline
              />
            </Body>
            <Right>
              {text.trim() ? (
                <PapperPlaneIcon onPress={this.handleSendPress} />
              ) : (
                <CameraIconBlue
                  size={20}
                  onPress={() => {
                    if (Platform.OS === 'ios') {
                      this._selectMedia()
                    } else {
                      this._showActionCamera()
                    }
                  }}
                />
              )}
            </Right>
          </Wrapper>
        )}
        <ActionSheet
          ref={node => (this.ActionGallery = node)}
          options={['Фото', 'Видео', 'Отменить']}
          cancelButtonIndex={2}
          onPress={index => {
            switch (index) {
              case 0:
                this._selectGallery('photo')
                break
              case 1:
                this._selectGallery('video')
                break
              default:
                break
            }
          }}
        />

        <ActionSheet
          ref={node => (this.ActionCamera = node)}
          options={['Фото', 'Видео', 'Отменить']}
          cancelButtonIndex={2}
          onPress={index => {
            switch (index) {
              case 0:
                this._selectMedia('photo')
                break
              case 1:
                this._selectMedia('video')
                break
              default:
                break
            }
          }}
        />

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
                if (Platform.OS === 'ios') {
                  this._selectGallery()
                } else {
                  this._showActionGallery()
                }
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

  componentDidMount(): void {}

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

  _selectMedia = async (mediaType = 'mixed') => {
    getImageFromCamera(
      result => {
        const { imageFormData = {}, uri = '' } = result
        let imageSrc = /\.(gif|jpg|jpeg|tiff|png)$/i.test(uri) ? uri : ''

        this._startSendingFile(imageFormData, imageSrc)
      },
      () => {},
      mediaType,
    )
  }

  _selectGallery = async (mediaType = 'mixed') => {
    getImageFromGallery(
      result => {
        const { imageFormData = {}, uri = '' } = result
        let imageSrc = /\.(gif|jpg|jpeg|tiff|png)$/i.test(uri) ? uri : ''

        this._startSendingFile(imageFormData, imageSrc)
      },
      () => {},
      mediaType,
    )
  }

  _startSendingFile = (formDataObject = {}, imageUri = '') => {
    const {
      currentChat,
      currentRoomId,
      currentDialog,
      setCurrentChat,
      navigation,
      messages,
    } = this.props

    const form = new FormData()
    form.append('file', formDataObject)
    currentChat
      ? form.append('room', currentChat)
      : form.append('receiver', currentDialog._id)

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
    sendRequest({
      r_path: p_send_file,
      method: 'post',
      attr: form,
      config: {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
      success: res => {
        if (res.message) {
          messages.push(res.message)
          this.props.setMessages(messages)
          navigation.getParam('scrollToBottom')()
        }
        if (res.dialog) {
          this.props.setDialog(res.dialog)
        }
        this.props.removePreloader({
          roomId: currentRoomId,
          _id: tempMessageId,
        })
        if (!currentChat) {
          setCurrentChat(res.dialog.room)
        }
        this.props.setFile({})
      },
      failFunc: err => {
        this.props.removePreloader({
          roomId: currentRoomId,
          _id: tempMessageId,
        })
        Alert.alert('Ошибка', 'Что то пошло не так')
      },
    })
  }

  _selectFile = async () => {
    try {
      const data = await RNDocumentPicker.pick({
        type: [RNDocumentPicker.types.allFiles, '.xls .pdf .pages .numbers'],
      })
      if (data) {
        this._startSendingFile(data, data.uri)
      }
    } catch (err) {}
  }

  _selectGeo = async () => {
    const { navigation, currentRoomId, currentDialog } = this.props
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
      socket.emit('geo', {
        receiver: currentDialog._id,
        geo_data: { latitude, longitude },
      })
      navigation.getParam('scrollToBottom')()
    }
  }

  sendMessage = () => {
    const { currentRoom } = this.props
    const { text } = this.state
    if (text.trim()) {
      const date = moment()
        .utc()
        .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
      this.getCurrentCompany(text.trim(), date, 'text')
      socket.emit('message', {
        receiver: currentRoom,
        message: text.trim(),
        date,
      })
    }

    this.setState({ text: '' })
  }

  getCurrentCompany = (text, date, type) => {
    const { sendingMessages, user, dialog } = this.props
    const { company } = user
    let newSendingMessages = { ...sendingMessages }
    const companyKey = company._id
    const dialogKey = dialog._id
    if (!newSendingMessages[companyKey]) {
      newSendingMessages[companyKey] = {}
    }
    if (!newSendingMessages[companyKey][dialogKey]) {
      newSendingMessages[companyKey][dialogKey] = {
        messages: [],
      }
    }
    if (newSendingMessages[companyKey][dialogKey].messages) {
      this.createMessage(
        newSendingMessages,
        companyKey,
        dialogKey,
        text,
        date,
        type,
      )
    }
  }

  createMessage = (
    newSendingMessages,
    companyKey,
    dialogKey,
    text,
    date,
    type,
  ) => {
    const { setSendingMessages, dialog, user } = this.props
    const currentDialog = newSendingMessages[companyKey][dialogKey]
    let lastItemId = currentDialog.messages.length
      ? currentDialog.messages[currentDialog.messages.length - 1]._id
      : 0
    const newMessage = {
      text: text,
      type: type,
      viewers: [user._id],
      dialog: dialog._id,
      company: user.company._id,
      created_at: date,
      updated_at: date,
      sender: { ...user },
      _id: --lastItemId,
      myMessage: true,
    }
    newSendingMessages[companyKey][dialogKey].messages.push(newMessage)
    setSendingMessages(newSendingMessages)
  }

  handleChange = e => {
    this.setState({ text: e })
  }

  _showActionSheetPlus = async () => {
    this.ActionSheetPlus && this.ActionSheetPlus.show()
  }

  _showActionCamera = async () => {
    this.ActionCamera && this.ActionCamera.show()
  }

  _showActionGallery = async () => {
    this.ActionGallery && this.ActionGallery.show()
  }

  confirmEditing = () => {
    const { text } = this.state
    const {
      messages,
      editedMessage: { _id },
    } = this.props
    const bodyReq = { text, message_id: _id }
    this.stopEditing()

    sendRequest({
      r_path: p_edit_message,
      method: 'patch',
      attr: bodyReq,
      success: res => {
        const msgIndex = messages.findIndex(e => e._id === _id)
        messages[msgIndex].text = text
        messages[msgIndex].edited = true
        this.props.setMessages(messages)
      },
      failFunc: () => {},
    })
  }

  stopEditing = () => {
    const { fEditMessage } = this.props
    const { prevText } = this.state
    this.setState({ edit: false, text: prevText })
    fEditMessage({})
  }

  confirmForwarding = () => {
    const {
      forwardedMessage: { _id },
      currentRoomId,
      currentDialog,
      currentChat,
    } = this.props
    this.stopForwarding()

    const bodyReq = {
      message_id: _id,
      dialog_id: currentRoomId,
      receiver: !currentChat ? currentDialog._id : null,
    }
    sendRequest({
      r_path: p_forward_message,
      method: 'post',
      attr: bodyReq,
      success: res => {
        if (res.dialog) {
          this.props.setDialog(res.dialog)
        }
      },
      failFunc: err => {},
    })
  }

  stopForwarding = () => {
    const { forwardMessage } = this.props
    this.setState({ forward: false })
    forwardMessage({})
  }

  stopReply = () => {
    const { replyMessage } = this.props
    this.setState({ reply: false, text: '' })
    replyMessage({})
  }

  confirmReplay = () => {
    const {
      repliedMessage: { _id },
      currentRoomId,
    } = this.props
    const { text } = this.state
    const bodyReq = { message_id: _id, dialog_id: currentRoomId, text }
    this.stopReply()

    sendRequest({
      r_path: p_reply_message,
      method: 'post',
      attr: bodyReq,
      success: res => {},
      failFunc: err => {},
    })
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
  // messages: state.messageReducer.messages,
  currentRoom: state.messageReducer.currentRoom,
  editedMessage: state.messageReducer.editMessage,
  currentChat: state.messageReducer.currentChat,
  currentDialog: state.dialogsReducer.currentDialog,
  user: state.userReducer.user,
  dialogs: state.dialogsReducer.dialogs,
  dialog: state.dialogsReducer.dialog,
  forwardedMessage: state.messageReducer.forwardMessage,
  currentRoomId: state.messageReducer.currentRoomId,
  repliedMessage: state.messageReducer.replyMessage,
  sendingMessages: state.messageReducer.sendingMessages,
})
const mapDispatchToProps = dispatch => ({
  fEditMessage: _ => dispatch(editMessage(_)),
  addPreloader: _ => dispatch(addPreloader(_)),
  removePreloader: _ => dispatch(removePreloader(_)),
  setDialogs: _ => dispatch(setDialogs(_)),
  setDialog: _ => dispatch(setDialog(_)),
  setCurrentChat: _ => dispatch(setCurrentChat(_)),
  setCurrentRoomId: _ => dispatch(setCurrentRoomId(_)),
  setRoom: _ => dispatch(setRoom(_)),
  forwardMessage: _ => dispatch(forwardMessage(_)),
  replyMessage: _ => dispatch(replyMessage(_)),
  setMessage: _ => dispatch(setMessage(_)),
  setFile: _ => dispatch(setFile(_)),
  setSendingMessages: _ => dispatch(setSendingMessages(_)),
})
export default connect(mapStateToProps, mapDispatchToProps)(InputComponent)
