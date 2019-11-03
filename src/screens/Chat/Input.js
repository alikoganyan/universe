import React, { Component } from 'react'
import { View, Text, Dimensions, Platform } from 'react-native'
import styled from 'styled-components'
import { connect } from 'react-redux'
import ActionSheet from 'react-native-actionsheet'
import _ from 'lodash'
import getImageFromPicker from '../../utils/ImagePicker'
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
} from '../../actions/messageActions'
import {
  p_send_file,
  p_edit_message,
  p_forward_message,
  p_reply_message,
} from '../../constants/api'

import {
  setDialogs,
  addUploadMessage,
  removeUploadMessage,
  updateUploadMessageProgress,
} from '../../actions/dialogsActions'
import sendRequest from '../../utils/request'
import { socket } from '../../utils/socket'

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
class InputComponent extends Component {
  render() {
    const { text, edit, forward, reply } = this.state
    const { editedMessage, repliedMessage } = this.props
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
            <MessageBoxLeft>
              <Message>Ответить</Message>
              <MessageText numberOfLines={1}>{repliedMessage.text}</MessageText>
            </MessageBoxLeft>
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
              />
            </Body>
            <Right>
              {text ? (
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
          options={['Файл', 'Мою локацию', 'Отменить']}
          cancelButtonIndex={2}
          onPress={index => {
            switch (index) {
              case 0:
                this._selectFile()
                break
              case 1:
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
      nextProps.repliedMessage.text &&
      replyChanged
    ) {
      return {
        ...nextProps,
        reply: nextProps.repliedMessage.text,
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
          <>
            <Message>{`${forwardedMessage.sender.first_name} ${forwardedMessage.sender.last_name}`}</Message>
            <MessageText numberOfLines={1}>Forwarded location</MessageText>
          </>
        )
      case 'file':
        return (
          <>
            <Message>{`${forwardedMessage.sender.first_name} ${forwardedMessage.sender.last_name}`}</Message>
            <MessageText numberOfLines={1}>Forwarded file</MessageText>
          </>
        )
      case 'image':
        return (
          <>
            <Message>{`${forwardedMessage.sender.first_name} ${forwardedMessage.sender.last_name}`}</Message>
            <MessageText numberOfLines={1}>Forwarded image</MessageText>
          </>
        )
      default:
        return null
    }
  }

  confirmEditing = () => {
    const { text } = this.state
    const {
      editedMessage: { _id },
      dialogs,
      currentChat,
      setDialogs,
    } = this.props
    const bodyReq = { text, message_id: _id }
    sendRequest({
      r_path: p_edit_message,
      method: 'patch',
      attr: bodyReq,
      success: res => {
        const newDialogs = [...dialogs]
        const newDialog = newDialogs.filter(e => e.room === currentChat)[0]
        const dialogIndex = newDialogs.findIndex(e => e.room === currentChat)
        const msgIndex = newDialog.messages.findIndex(e => e._id === _id)
        newDialog.messages[msgIndex].text = text
        newDialogs[dialogIndex] = newDialog
        setDialogs(newDialogs)
        this.stopEditing()
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

  _selectMedia = async (options = {}) => {
    getImageFromPicker(
      result => {
        const { imageFormData = {}, uri = '' } = result
        let imageSrc = /\.(gif|jpg|jpeg|tiff|png)$/i.test(uri) ? uri : ''

        this._startSendingFile(imageFormData, imageSrc)
      },
      () => {},
      options,
    )
  }

  _startSendingFile = (formDataObject = {}, imageUri = '') => {
    const {
      currentChat,
      setDialogs: setDialogsProp,
      addUploadMessage: addUploadMessageProp,
      removeUploadMessage: removeUploadMessageProp,
      updateUploadMessageProgress: updateUploadMessageProgressProp,
      dialogs,
      user,
    } = this.props
    const form = new FormData()

    form.append('file', formDataObject)
    form.append('room', currentChat)
    const tempMessageId = Date.now()
    let prevProgress = 0
    const progressMultiplier = 10
    addUploadMessageProp({
      room: currentChat,
      src: imageUri,
      type: imageUri ? 'image' : 'file',
      isUploaded: true,
      created_at: new Date(),
      sender: { ...user },
      tempId: tempMessageId,
      viewers: [],
      enableUploadProgress: true,
      uploadProgress: 0,
    })
    sendRequest({
      r_path: p_send_file,
      method: 'post',
      attr: form,
      config: {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: progressEvent => {
          const uploadProgress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          )
          if (uploadProgress >= prevProgress + progressMultiplier) {
            prevProgress = uploadProgress
            updateUploadMessageProgressProp({
              room: currentChat,
              tempId: tempMessageId,
              uploadProgress,
            })
          }
        },
      },
      success: res => {
        socket.emit('file', { room: currentChat })
        const newDialogs = [...dialogs]
        const index = newDialogs.findIndex(e => e.room === currentChat)
        newDialogs[index] = res.dialog
        setDialogsProp(newDialogs)
      },
      failFunc: err => {
        removeUploadMessageProp({
          room: currentChat,
          tempId: tempMessageId,
        })
        // if (!result.cancelled) {
        //   sendRequest({
        //     r_path: p_send_file,
        //     method: 'post',
        //     attr: form,
        //     config: {
        //       headers: {
        //         'Content-Type': 'multipart/form-data',
        //       },
        //       onUploadProgress: progressEvent => {
        //         const uploadProgress = Math.round(
        //           (progressEvent.loaded * 100) / progressEvent.total,
        //         )
        //         updateUploadMessageProgressProp({
        //           room: currentChat,
        //           tempId: tempMessageId,
        //           uploadProgress,
        //         })
        //       },
        //     },
        //     success: res => {
        //       socket.emit('file', {
        //         room: currentChat,
        //         dialog_id: res.dialog._id,
        //         participant: res.dialog.participants[0]._id,
        //       })
        //       const newDialogs = [...dialogs]
        //       const index = newDialogs.findIndex(e => e.room === currentChat)
        //       newDialogs[index] = res.dialog
        //       setDialogsProp(newDialogs)
        //     },
        //     failFunc: err => {
        //       removeUploadMessageProp({
        //         room: currentChat,
        //         tempId: tempMessageId,
        //       })
        //     },
        //   })
        // }
      },
    })
  }

  _selectFile = async () => {
    try {
      const data = await RNDocumentPicker.pick({
        type: [RNDocumentPicker.types.allFiles],
      })
      if (data) {
        this._startSendingFile(data, data.uri)
      }
    } catch (err) {}
  }

  async getGeolocationPromise() {
    // await Location.requestPermissionsAsync();
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        position => {
          //geo
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        },
        error => {
          reject(error)
        },
        {
          enableHighAccuracy: false,
          timeout: 20000,
          maximumAge: 1000 * 10 * 60,
        },
      )
    })
  }

  _selectGeo = async () => {
    const { currentDialog } = this.props
    const coords = await getGeoCoords()
    if (coords) {
      const { latitude, longitude } = coords
      socket.emit('geo', {
        receiver: currentDialog._id,
        geo_data: { latitude, longitude },
      })
    }
  }

  discardSelect = () => {}

  sendMessage = () => {
    const { currentRoom } = this.props
    const { text } = this.state
    if (text) {
      socket.emit('message', { receiver: currentRoom, message: text.trim() })
      this.setState({ text: '' })
    }
  }

  handleChange = e => {
    this.setState({ text: e })
  }

  _showActionSheetPlus = async () => {
    this.ActionSheetPlus && this.ActionSheetPlus.show()
  }

  confirmForwarding = () => {
    const {
      forwardedMessage: { _id, text },
      currentRoomId,
      currentRoom,
    } = this.props
    const bodyReq = { message_id: _id, dialog_id: currentRoomId }
    sendRequest({
      r_path: p_forward_message,
      method: 'post',
      attr: bodyReq,
      success: res => {
        this.stopForwarding()
        socket.emit('message', { receiver: currentRoom, message: text })
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
    this.setState({ reply: false })
    replyMessage({})
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
        socket.emit('get_dialog', { id: currentRoomId })
      },
      failFunc: err => {},
    })
  }

  handleSendPress = () => {
    const { edit, reply } = this.state

    if (edit) {
      this.confirmEditing()
    } else if (reply) {
      this.confirmReplay()
    } else {
      this.sendMessage()
    }
  }
}

const mapStateToProps = state => ({
  messages: state.messageReducer.messages,
  currentRoom: state.messageReducer.currentRoom,
  editedMessage: state.messageReducer.editMessage,
  currentChat: state.messageReducer.currentChat,
  currentDialog: state.dialogsReducer.currentDialog,
  user: state.userReducer.user,
  dialogs: state.dialogsReducer.dialogs,
  forwardedMessage: state.messageReducer.forwardMessage,
  currentRoomId: state.messageReducer.currentRoomId,
  repliedMessage: state.messageReducer.replyMessage,
})
const mapDispatchToProps = dispatch => ({
  fEditMessage: _ => dispatch(editMessage(_)),
  addUploadMessage: _ => dispatch(addUploadMessage(_)),
  removeUploadMessage: _ => dispatch(removeUploadMessage(_)),
  updateUploadMessageProgress: _ => dispatch(updateUploadMessageProgress(_)),
  setDialogs: _ => dispatch(setDialogs(_)),
  setCurrentChat: _ => dispatch(setCurrentChat(_)),
  setCurrentRoomId: _ => dispatch(setCurrentRoomId(_)),
  setRoom: _ => dispatch(setRoom(_)),
  forwardMessage: _ => dispatch(forwardMessage(_)),
  replyMessage: _ => dispatch(replyMessage(_)),
})
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(InputComponent)
