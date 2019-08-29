import React, { Component } from 'react'
import {
  View,
  Text,
  TextInput,
  Dimensions,
  TouchableOpacity,
  Platform,
} from 'react-native'
import styled from 'styled-components'
import { connect } from 'react-redux'
import getImageFromPicker from '../../utils/ImagePicker'
import RNPermissions from 'react-native-permissions'
import posed from 'react-native-pose'
import { BottomSheet } from 'react-native-btr'
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
} from '../../actions/messageActions'
import {
  p_send_file,
  p_edit_message,
  p_forward_message,
  p_reply_message,
} from '../../constants/api'
import { setDialogs } from '../../actions/dialogsActions'

import sendRequest from '../../utils/request'
import { socket } from '../../utils/socket'

const { sidePadding, borderRadius, /*HeaderHeight,*/ fontSize, Colors } = helper
const { blue } = Colors
const FilePickerPosed = posed.View({
  visible: { bottom: 10 },
  hidden: { bottom: -250 },
})

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
const Input = styled(TextInput)`
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
const FilePicker = styled(FilePickerPosed)`
  background: white;
  width: 94%;
  height: ${Dimensions.get('window').height * 0.3}px;
  position: absolute;
  margin: 0 3%;
  padding: 2% 7%;
  bottom: 10px;
  border-radius: ${borderRadius};
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
  z-index: 4;
`
// const Shadow = styled(TouchableOpacity)`
//   position: absolute;
//   width: ${Dimensions.get('window').width};
//   height: ${Dimensions.get('window').height};
//   background: rgba(5, 5, 5, 0.3);
//   top: -${Dimensions.get('window').height - HeaderHeight - 3};
//   z-index: 2;
// `
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
class InputComponent extends Component {
  render() {
    const { text, pickerOpened, edit, forward, reply } = this.state
    const { editedMessage, forwardedMessage, repliedMessage } = this.props

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
            <MessageBoxLeft>
              <Message>{`${forwardedMessage.sender.first_name} ${forwardedMessage.sender.last_name}`}</Message>
              <MessageText numberOfLines={1}>
                {forwardedMessage.text}
              </MessageText>
            </MessageBoxLeft>
            <Right>
              <CloseIcon onPress={this.stopForwarding} marginLeft={false} />
              <PapperPlaneIcon onPress={this.confirmForwarding} />
            </Right>
          </MessageBox>
        ) : (
          <Wrapper isTopItem={edit || reply}>
            <Left>
              <AddIconBlue size={20} />
            </Left>
            <Body>
              <Input
                placeholder="Написать сообщение"
                onChangeText={e => this.handleChange(e)}
                value={text}
                blurOnSubmit={false}
              />
            </Body>
            <Right>
              {text ? (
                <PapperPlaneIcon onPress={this.handleSendPress} />
              ) : (
                <CameraIconBlue size={20} onPress={this.pickImage} />
              )}
            </Right>
          </Wrapper>
        )}
        <BottomSheet
          visible={pickerOpened}
          onBackButtonPress={this._hideBottomSheetMenu}
          onBackdropPress={this._hideBottomSheetMenu}
        >
          <FilePicker>
            <TouchableOpacity onPress={this.selectPhoto}>
              <Text>Фото</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.selectFile}>
              <Text>Файл</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.selectGeo}>
              <Text>Мою локацию</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this._hideBottomSheetMenu}>
              <Text>Отменить</Text>
            </TouchableOpacity>
          </FilePicker>
        </BottomSheet>
      </>
    )
  }

  state = {
    text: '',
    prevText: '',
    edit: false,
    pickerOpened: false,
    forward: false,
    reply: false,
  }

  componentWillUnmount() {
    this.stopEditing()
    this.stopReply()
    this._hideBottomSheetMenu()
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const editChanged =
      JSON.stringify(nextProps.editedMessage) !==
      JSON.stringify(prevState.editedMessage)
    const forwarChanged =
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
    if (
      nextProps.forwardedMessage &&
      nextProps.forwardedMessage.text &&
      forwarChanged
    ) {
      return {
        ...nextProps,
        forward: nextProps.forwardedMessage.text,
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
      failFunc: err => {
        // console.log({ err })
      },
    })
  }

  _hideBottomSheetMenu = () => {
    this.setState({ pickerOpened: false })
  }

  stopEditing = () => {
    const { fEditMessage } = this.props
    const { prevText } = this.state
    this.setState({ edit: false, text: prevText })
    fEditMessage({})
  }

  selectPhoto = async () => {
    const { currentChat, setDialogs, dialogs, user } = this.props
    getImageFromPicker(result => {
      const { imageFormData = {}, uri } = result
      const form = new FormData()
      this._hideBottomSheetMenu()
      form.append('file', imageFormData)
      form.append('room', currentChat)
      const message = {
        room: currentChat,
        sender: { ...user },
        created_at: new Date(),
        type: 'image',
        src: uri,
        viewers: [],
      }
      if (!result.cancelled) {
        addMessage(message)
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
            socket.emit('file', { room: currentChat })
            const newDialogs = [...dialogs]
            const index = newDialogs.findIndex(e => e.room === currentChat)
            newDialogs[index] = res.dialog
            setDialogs(newDialogs)
          },
          failFunc: err => {
            // console.log({ err })
          },
        })
      }
    }, this._hideBottomSheetMenu)
  }

  selectFile = async () => {
    // let result = await DocumentPicker.getDocumentAsync({});
  }

  selectGeo = async () => {
    const { currentRoom } = this.props
    this._hideBottomSheetMenu()
    // const { status } = await Permissions.askAsync(Permissions.LOCATION);

    let status
    await RNPermissions.request('location').then(response => {
      // console.log('RNPermissions location: ', response)
      status = response
    })
    if (status !== 'granted') {
      alert('no location permission')
      return
    }
    navigator.geolocation.getCurrentPosition(
      position => {
        // console.log({ receiver: currentRoom, geo_data: position.coords })
        socket.emit('geo_group', {
          receiver: currentRoom,
          geo_data: position.coords,
        })
      },
      error => alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    )
  }

  discardSelect = () => {}

  sendMessage = () => {
    const { currentChat } = this.props
    // const {
    //   _id, first_name, last_name, middle_name, image
    // } = user;
    const { text } = this.state
    if (text) {
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
      socket.emit('group_message', { room: currentChat, message: text })
      // }
    }
    this.setState({ text: '' })
  }

  handleChange = e => {
    this.setState({ text: e })
  }

  pickImage = async () => {
    this.setState({ pickerOpened: true })
  }

  confirmForwarding = () => {
    const {
      forwardedMessage: { _id, text },
      currentRoomId,
      currentChat,
    } = this.props
    const bodyReq = { message_id: _id, dialog_id: currentRoomId }
    sendRequest({
      r_path: p_forward_message,
      method: 'post',
      attr: bodyReq,
      success: res => {
        this.stopForwarding()
        socket.emit('group_message', { room: currentChat, message: text })
      },
      failFunc: err => {
        // console.log(err)
      },
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
    // const { text } = this.state
    const bodyReq = { message_id: _id, dialog_id: currentRoomId }
    sendRequest({
      r_path: p_reply_message,
      method: 'post',
      attr: bodyReq,
      success: res => {
        this.stopForwarding()
        socket.emit('get_dialog', { id: currentRoomId })
      },
      failFunc: err => {
        // console.log(err.response, err)
      },
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
  currentChat: state.messageReducer.currentChat,
  dialogs: state.dialogsReducer.dialogs,
  editedMessage: state.messageReducer.editMessage,
  id: state.userReducer.user._id,
  user: state.userReducer.user,
  forwardedMessage: state.messageReducer.forwardMessage,
  currentRoomId: state.messageReducer.currentRoomId,
  repliedMessage: state.messageReducer.replyMessage,
})
const mapDispatchToProps = dispatch => ({
  addMessage: _ => dispatch(addMessage(_)),
  fEditMessage: _ => dispatch(editMessage(_)),
  startSearch: _ => dispatch(startSearch(_)),
  stopSearch: _ => dispatch(stopSearch(_)),
  setDialogs: _ => dispatch(setDialogs(_)),
  forwardMessage: _ => dispatch(forwardMessage(_)),
  replyMessage: _ => dispatch(replyMessage(_)),
})
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(InputComponent)
