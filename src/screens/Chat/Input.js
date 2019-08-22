import React, { Component } from 'react'
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Platform,
  Linking,
  PermissionsAndroid,
} from 'react-native'
import styled from 'styled-components'
import { connect } from 'react-redux'
// import { ImagePicker, DocumentPicker, Permissions, Location } from 'expo';
import RNPermissions from 'react-native-permissions'
import getImageFromPicker from '../../utils/ImagePicker'
import posed from 'react-native-pose'
import { BottomSheet } from 'react-native-btr'
import { PapperPlaneIcon, ImageIconBlue, CloseIcon } from '../../assets/index'
import helper from '../../utils/helpers'
import AutoHeightInput from '../../common/AutoHeightInput'
import {
  addMessage,
  // startSearch,
  // stopSearch,
  // getMessages,
  setCurrentChat,
  setRoom,
  setCurrentRoomId,
  editMessage,
} from '../../actions/messageActions'
import { p_send_file, p_edit_message } from '../../constants/api'

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
  ${'' /* align-items: ${Platform.OS === 'ios' ? 'center' : 'flex-start'}; */}
  align-items: flex-start;
  border-radius: ${borderRadius};
  border-width: ${({ edit }) => (edit ? 0 : 1)};
  border-color: #ddd;
  border-top-width: 1;
  min-height: 44px;
  ${'' /* max-height: 65px; */}
`
const Input = styled(AutoHeightInput)`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
  padding-horizontal: 0;
  padding-top: ${Platform.OS === 'ios' ? '10px' : '14px'};
  padding-bottom: ${Platform.OS === 'ios' ? '8px' : '0px'};
  min-height: 30px;
  max-height: 100px;
  align-items: flex-start;
  font-size: ${fontSize.input};
  text-align-vertical: top;
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
  align-items: flex-start;
  flex-direction: row;
  padding-top: ${Platform.OS === 'ios' ? '2px' : '6px'};
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
  z-index: 999;
`
// const Shadow = styled(TouchableOpacity)`
//   position: absolute;
//   width: ${Dimensions.get('window').width};
//   height: ${Dimensions.get('window').height};
//   background: rgba(5, 5, 5, 0.3);
//   top: -${Dimensions.get('window').height - HeaderHeight * 3}px;
//   z-index: 990;
// `
const FilePickerOption = styled(TouchableOpacity)`
  z-index: 999;
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
              autoHeight
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
          onBackButtonPress={this._hideBottomSheetMenu}
          onBackdropPress={this._hideBottomSheetMenu}
        >
          <FilePicker>
            <FilePickerOption onPress={this.selectPhoto}>
              <Text>Фото</Text>
            </FilePickerOption>
            <FilePickerOption onPress={this.selectFile}>
              <Text>Файл</Text>
            </FilePickerOption>
            <FilePickerOption onPress={this.selectGeo}>
              <Text>Мою локацию</Text>
            </FilePickerOption>
            <FilePickerOption onPress={this._hideBottomSheetMenu}>
              <Text>Отменить</Text>
            </FilePickerOption>
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

  componentWillUnmount() {
    this.stopEditing()
    this._hideBottomSheetMenu()
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
    const { currentChat, addMessage, setDialogs, dialogs, user } = this.props
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
            // console.log('load success: ', { res })
            socket.emit('file', { room: currentChat })
            const newDialogs = [...dialogs]
            const index = newDialogs.findIndex(e => e.room === currentChat)
            newDialogs[index] = res.dialog
            setDialogs(newDialogs)
          },
          failFunc: err => {
            // console.log('load err: ', { err })
          },
        })
      }
    }, this._hideBottomSheetMenu)
  }

  selectFile = async () => {
    // let result = await DocumentPicker.getDocumentAsync({});
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
          // console.log('Geolocation error ', error)
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

  selectGeo = async () => {
    const { currentDialog } = this.props
    this._hideBottomSheetMenu()
    // const { status } = await Permissions.askAsync(Permissions.LOCATION);
    let status
    await RNPermissions.request('location').then(response => {
      // console.log('RNPermissions location: ', response)
      status = response
    })
    alert(status)
    if (status !== 'granted') {
      alert('no location permission')
      Linking.openURL('app-settings:')
      return
    }
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {},
      )
      // alert(`${granted}, ${JSON.stringify(PermissionsAndroid.RESULTS.GRANTED)}`);
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        navigator.geolocation.getCurrentPosition(
          position => {
            socket.emit('geo', {
              receiver: currentDialog._id,
              geo_data: position.coords,
            })
          },
          error => alert(error.message),
          { timeout: 20000, maximumAge: 36e5 },
        )
      } else {
        alert('location permission denied')
      }
    } catch (err) {
      alert(err)
    }
    // this.getGeolocationPromise()
    //  .then(e => alert(JSON.stringify(e)))
    //  .catch(e => alert(JSON.stringify(e)));
  }

  discardSelect = () => {}

  sendMessage = () => {
    const { currentRoom } = this.props
    const { text } = this.state
    if (text) {
      // const { dialogs, currentChat } = this.props;
      // const message = {
      //   _id: Math.random().toString(36).substring(7),
      //   room: currentRoom,
      //   sender: { _id: user._id },
      //   text: text.trim(),
      //   created_at: new Date(),
      //   type: 'text',
      //   viewers: []
      // };
      // const newDialogs = [...dialogs];
      // const newDialog = newDialogs.filter(event => event.room === currentChat)[0];
      socket.emit('message', { receiver: currentRoom, message: text.trim() })
      // if (newDialog) {
      //   newDialog.messages = [...newDialog.messages, message];
      //   newDialogs[newDialogs.findIndex(event => event.room === currentChat)] = newDialog;
      //   const newDialogSorted = newDialogs.sort((a, b) => {
      //     if (b.messages.length && a.messages.length) {
      //       const aDate = new Date(a.messages[a.messages.length - 1].created_at);
      //       const bDate = new Date(b.messages[b.messages.length - 1].created_at);
      //       return bDate - aDate;
      //     }
      //   });
      //   setDialogs(newDialogSorted);
      // } else {
      //   setRoom(currentDialog._id);
      //   setCurrentChat(`${user._id}_${currentDialog._id}`);
      // }
    }
    this.setState({ text: '' })
  }

  handleChange = e => {
    this.setState({ text: e })
  }

  pickImage = async () => {
    // const { status_roll } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    this.setState({ pickerOpened: true })
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
})
const mapDispatchToProps = dispatch => ({
  fEditMessage: _ => dispatch(editMessage(_)),
  addMessage: _ => dispatch(addMessage(_)),
  setDialogs: _ => dispatch(setDialogs(_)),
  setCurrentChat: _ => dispatch(setCurrentChat(_)),
  setCurrentRoomId: _ => dispatch(setCurrentRoomId(_)),
  setRoom: _ => dispatch(setRoom(_)),
})
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(InputComponent)
