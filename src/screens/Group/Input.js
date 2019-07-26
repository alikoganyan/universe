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
// import { ImagePicker, Permissions } from 'expo';
import RNPermissions from 'react-native-permissions'
import posed from 'react-native-pose'
import { BottomSheet } from 'react-native-btr'
import { ImageIconBlue, PapperPlaneIcon, CloseIcon } from '../../assets/index'
import helper from '../../utils/helpers'
import {
  addMessage,
  startSearch,
  stopSearch,
  editMessage,
} from '../../actions/messageActions'
import { p_send_file, p_edit_message } from '../../constants/api'
import { setDialogs } from '../../actions/dialogsActions'

import sendRequest from '../../utils/request'
import { socket } from '../../utils/socket'

const { sidePadding, borderRadius, HeaderHeight, fontSize, Colors } = helper
const { blue } = Colors
const FilePickerPosed = posed.View({
  visible: { bottom: 10 },
  hidden: { bottom: -250 },
})
const Wrapper = styled(View)`
  background: white;
  width: ${({ edit }) =>
    edit
      ? Dimensions.get('window').width
      : Dimensions.get('window').width - sidePadding * 2}px;
  left: 0;
  bottom: ${({ edit }) => (edit ? 0 : 10)}px;
  align-self: center;
  padding: ${({ edit }) => (edit ? `0 ${sidePadding}` : `0 15`)}px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: ${Platform.OS === 'ios' ? 'center' : 'flex-start'};
  border-radius: ${borderRadius};
  border-width: ${({ edit }) => (edit ? 0 : 1)};
  border-color: #ddd;
  border-top-width: 1;
  min-height: 44px;
  max-height: 65px;
`
const Input = styled(TextInput)`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
  padding: 0;
  min-height: 30px;
  align-items: flex-start;
  font-size: ${fontSize.input};
  text-align-vertical: bottom;
`
const Left = styled(View)`
  display: flex;
  flex-direction: row;
  width: 90%;
  align-items: center;
  justify-content: center;
`
const Right = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding-top: ${Platform.OS === 'ios' ? 0 : 3}px;
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
const Shadow = styled(TouchableOpacity)`
  position: absolute;
  width: ${Dimensions.get('window').width};
  height: ${Dimensions.get('window').height};
  background: rgba(5, 5, 5, 0.3);
  top: -${Dimensions.get('window').height - HeaderHeight - 3};
  z-index: 2;
`
const EditBox = styled(View)`
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
const EditMessage = styled(Text)`
  color: ${blue};
`
const EditMessageText = styled(Text)``
const EditBoxLeft = styled(View)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  width: 80%;
`
class InputComponent extends Component {
  render() {
    const { text, pickerOpened, edit } = this.state
    const { editedMessage } = this.props
    return (
      <>
        {edit ? (
          <EditBox>
            <EditBoxLeft>
              <EditMessage>Редактировать сообщение</EditMessage>
              <EditMessageText numberOfLines={1}>
                {editedMessage.text}
              </EditMessageText>
            </EditBoxLeft>
            <Right>
              <CloseIcon onPress={this.stopEditing} marginLeft={false} />
            </Right>
          </EditBox>
        ) : null}
        <Wrapper edit={edit}>
          <Left>
            <Input
              placeholder="Написать сообщение"
              onChangeText={e => this.handleChange(e)}
              value={text}
              blurOnSubmit={false}
            />
          </Left>
          <Right>
            {text ? (
              <PapperPlaneIcon
                onPress={edit ? this.confirmEditing : this.sendMessage}
              />
            ) : (
              <ImageIconBlue onPress={this.pickImage} />
            )}
          </Right>
        </Wrapper>
        <BottomSheet
          visible={pickerOpened}
          onBackButtonPress={this.unselect}
          onBackdropPress={this.unselect}
        >
          <FilePicker>
            <TouchableOpacity onPress={this.selectPhoto}>
              <Text>Фото или видео</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.selectFile}>
              <Text>Файл</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.selectGeo}>
              <Text>Мою локацию</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.unselect}>
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
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const propsChanged =
      JSON.stringify(nextProps.editedMessage) !==
      JSON.stringify(prevState.editedMessage)
    if (
      nextProps.editedMessage &&
      nextProps.editedMessage.text &&
      propsChanged
    ) {
      return {
        ...nextProps,
        edit: nextProps.editedMessage.text,
        text: nextProps.editedMessage.text,
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
        console.log({ err })
      },
    })
  }

  unselect = () => {
    this.setState({ pickerOpened: false })
  }

  stopEditing = () => {
    const { fEditMessage } = this.props
    const { prevText } = this.state
    this.setState({ edit: false, text: prevText })
    fEditMessage({})
  }

  selectPhoto = async () => {
    const { currentChat, setDialogs, dialogs } = this.props
    this.unselect()

    getImageFromPicker(result => {
      const { uri, type } = result
      const ext = uri.split('.')[uri.split('.').length - 1]
      const fileName = Math.random()
        .toString(36)
        .substring(7)
      const form = new FormData()
      form.append('file', {
        uri,
        name: `photo.${fileName}.${ext}`,
        type: `image/${type}`,
      })
      form.append('room', currentChat)
      if (!result.cancelled) {
        const newDialogs = [...dialogs]
        // const index = newDialogs.findIndex(e => e.room === currentChat);
        // newDialogs[index] = res.dialog;
        setDialogs(newDialogs)
        sendRequest({
          r_path: p_send_file,
          method: 'post',
          attr: form,
          // config: {
          //     headers: {
          //         'Content-Type': 'multipart/form-data'
          //     }
          // },
          success: () => {
            socket.emit('file', { room: currentChat })
          },
          failFunc: err => {
            console.log({ err })
          },
        })
      }
    })
  }

  selectFile = async () => {
    // let result = await DocumentPicker.getDocumentAsync({});
  }

  selectGeo = async () => {
    const { currentRoom } = this.props
    this.unselect()
    // const { status } = await Permissions.askAsync(Permissions.LOCATION);

    let status
    await RNPermissions.request('location').then(response => {
      console.log('RNPermissions location: ', response)
      status = response
    })
    if (status !== 'granted') {
      alert('no location permission')
      return
    }
    navigator.geolocation.getCurrentPosition(
      position => {
        console.log({ receiver: currentRoom, geo_data: position.coords })
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
}

const mapStateToProps = state => ({
  messages: state.messageReducer.messages,
  currentRoom: state.messageReducer.currentRoom,
  currentChat: state.messageReducer.currentChat,
  dialogs: state.dialogsReducer.dialogs,
  editedMessage: state.messageReducer.editMessage,
  id: state.userReducer.user._id,
  user: state.userReducer.user,
})
const mapDispatchToProps = dispatch => ({
  fEditMessage: _ => dispatch(editMessage(_)),
  startSearch: _ => dispatch(startSearch(_)),
  stopSearch: _ => dispatch(stopSearch(_)),
  setDialogs: _ => dispatch(setDialogs(_)),
})
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(InputComponent)
