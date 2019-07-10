import React, { Component } from 'react';
import {
  View, Text, TextInput, Dimensions, TouchableOpacity, Platform, Linking, PermissionsAndroid
} from 'react-native';
import styled from 'styled-components';
import { connect } from 'react-redux';
import {
  ImagePicker, DocumentPicker, Permissions, Location
} from 'expo';
import posed from 'react-native-pose';
import { BottomSheet } from 'react-native-btr';
import { PapperPlaneIcon, ImageIconBlue } from '../../assets/index';
import helper from '../../utils/helpers';
import {
  addMessage, startSearch, stopSearch, getMessages, setCurrentChat, setRoom, setCurrentRoomId
} from '../../actions/messageActions';
import { p_send_file } from '../../constants/api';
import { setDialogs } from '../../actions/dialogsActions';
import sendRequest from '../../utils/request';
import { socket } from '../../utils/socket';

const {
  sidePadding, borderRadius, HeaderHeight, fontSize
} = helper;
const FilePickerPosed = posed.View({
  visible: { bottom: 10 },
  hidden: { bottom: -250 }
});
const Wrapper = styled(View)`
    background: white;
    width: ${Dimensions.get('window').width - (sidePadding * 2)}px;
    left: 0;
    bottom: 10px;
    align-self: center;
    padding: 0 15px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: ${Platform.OS === 'ios' ? 'center' : 'flex-start'};
    border-radius: ${borderRadius};
    border-width: 1;
    border-color: #ddd;
    border-bottom-width: 1;
    min-height: 44px;
    max-height: 65px;
`;
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
`;
const Left = styled(View)`
    display: flex;
    flex-direction: row;
    width: 90%;
    align-items: center;
    justify-content: center;
`;
const Right = styled(View)` 
    display: flex;
    flex-direction: row;
    padding-top: ${Platform.OS === 'ios' ? 0 : 3}px;
`;
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
`;
const Shadow = styled(TouchableOpacity)`
    position: absolute;
    width: ${Dimensions.get('window').width};
    height: ${Dimensions.get('window').height};
    background: rgba(5,5,5,.3);
    top: -${Dimensions.get('window').height - HeaderHeight * 3}px;
    z-index: 990;
`;
const FilePickerOption = styled(TouchableOpacity)`
    z-index: 999;
`;
class InputComponent extends Component {
  render() {
    const { text, pickerOpened } = this.state;
    return (
      <>
        {pickerOpened && <Shadow activeOpacity={1} onPress={this.unselect} />}
        <Wrapper>
          <Left>
            <Input
              placeholder="Написать сообщение"
              onChangeText={e => this.handleChange(e)}
              value={text}
              blurOnSubmit={false}
            />
          </Left>
          <Right>
            {text ? <PapperPlaneIcon onPress={this.sendMessage} /> : (
              <ImageIconBlue
                onPress={this.pickImage}
              />
            )}
          </Right>
        </Wrapper>
        <BottomSheet
          visible={pickerOpened}
          onBackButtonPress={this.unselect}
          onBackdropPress={this.unselect}
        >
          <FilePicker>
            <FilePickerOption onPress={this.selectPhoto}><Text>Фото или видео</Text></FilePickerOption>
            <FilePickerOption onPress={this.selectFile}><Text>Файл</Text></FilePickerOption>
            <FilePickerOption onPress={this.selectGeo}><Text>Мою локацию</Text></FilePickerOption>
            <FilePickerOption onPress={this.unselect}><Text>Отменить</Text></FilePickerOption>
          </FilePicker>
        </BottomSheet>

      </>
    );
  }

    state = {
      text: '',
      pickerOpened: false,
    }

    componentDidMount() {}

    unselect = () => {
      this.setState({ pickerOpened: false });
    }

    selectPhoto = async () => {
      const {
        currentChat, addMessage, setDialogs, dialogs, user
      } = this.props;
      this.unselect();
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('no camera roll permission');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: false,
      });
      const { uri, type } = result;
      const fileName = Math.random().toString(36).substring(7);
      const form = new FormData();
      const ext = uri.split('.')[uri.split('.').length - 1];
      form.append('file', {
        uri,
        name: `photo.${fileName}.${ext}`,
        type: `image/${type}`,
      });
      form.append('room', currentChat);
      const message = {
        room: currentChat,
        sender: { ...user },
        created_at: new Date(),
        type: 'image',
        src: result.uri,
        viewers: [],
      };
      if (!result.cancelled) {
        addMessage(message);
        sendRequest({
          r_path: p_send_file,
          method: 'post',
          attr: form,
          // config: {
          //     headers: {
          //         'Content-Type': 'multipart/form-data'
          //     }
          // },
          success: (res) => {
            socket.emit('file', { room: currentChat });
            const newDialogs = [...dialogs];
            const index = newDialogs.findIndex(e => e.room === currentChat);
            newDialogs[index] = res.dialog;
            setDialogs(newDialogs);
          },
          failFunc: (err) => {
            console.log({ err });
          }
        });
      }
    }

    selectFile = async () => {
      // let result = await DocumentPicker.getDocumentAsync({});
    }

    selectGeo = async () => {
      const { currentDialog } = this.props;
      this.unselect();
      // const { status } = await Permissions.askAsync(Permissions.LOCATION);
      // alert(status);
      // if (status !== 'granted') {
      //   alert('no location permission');
      //   Linking.openURL('app-settings:');
      //   return;
      // }
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {},
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          alert('You can use the location');
          navigator.geolocation.getCurrentPosition(
            (position) => {
              alert('geo sent')
              socket.emit('geo', { receiver: currentDialog._id, geo_data: position.coords });
            },
            error => alert(error.message),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
          );
        } else {
          alert('location permission denied');
        }
      } catch (err) {
        alert(err);
      }
      
    };

    discardSelect = () => { }

    sendMessage = () => {
      const {
        currentRoom
      } = this.props;
      const { text } = this.state;
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
        socket.emit('message', { receiver: currentRoom, message: text.trim() });
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
      this.setState({ text: '' });
    }

    handleChange = (e) => {
      this.setState({ text: e });
    }

    pickImage = async () => {
      // const { status_roll } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      this.setState({ pickerOpened: true });
    };
}

const mapStateToProps = state => ({
  messages: state.messageReducer.messages,
  currentRoom: state.messageReducer.currentRoom,
  currentChat: state.messageReducer.currentChat,
  currentDialog: state.dialogsReducer.currentDialog,
  user: state.userReducer.user,
  dialogs: state.dialogsReducer.dialogs,
});
const mapDispatchToProps = dispatch => ({
  addMessage: _ => dispatch(addMessage(_)),
  startSearch: _ => dispatch(startSearch(_)),
  stopSearch: _ => dispatch(stopSearch(_)),
  setDialogs: _ => dispatch(setDialogs(_)),
  setCurrentChat: _ => dispatch(setCurrentChat(_)),
  setCurrentRoomId: _ => dispatch(setCurrentRoomId(_)),
  setRoom: _ => dispatch(setRoom(_)),
});
export default connect(mapStateToProps, mapDispatchToProps)(InputComponent);
