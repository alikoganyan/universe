import React, { Component } from 'react';
import {
  View, Text, TextInput, Dimensions, TouchableOpacity, Platform,
} from 'react-native';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { ImagePicker, DocumentPicker, Permissions } from 'expo';
import posed from 'react-native-pose';
import { BottomSheet } from 'react-native-btr';
import { ImageIconBlue, PapperPlaneIcon } from '../../assets/index';
import helper from '../../utils/helpers';
import {
  addMessage, startSearch, stopSearch, getMessages
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
    font-size: ${fontSize.sl};
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
    align-items: center;
    justify-content: center;
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
    z-index: 4;
`;
const Shadow = styled(TouchableOpacity)`
    position: absolute;
    width: ${Dimensions.get('window').width};
    height: ${Dimensions.get('window').height};
    background: rgba(5,5,5,.3);
    top: -${Dimensions.get('window').height - HeaderHeight - 3};
    z-index: 2;
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
            <TouchableOpacity onPress={this.selectPhoto}><Text>Фото или видео</Text></TouchableOpacity>
            <TouchableOpacity onPress={this.selectFile}><Text>Файл</Text></TouchableOpacity>
            <TouchableOpacity onPress={this.selectGeo}><Text>Мою локацию</Text></TouchableOpacity>
            <TouchableOpacity onPress={this.unselect}><Text>Отменить</Text></TouchableOpacity>
          </FilePicker>
        </BottomSheet>
      </>
    );
  }

    state = {
      text: '',
      height: 0,
      image: null,
      pickerOpened: false,
    }

    componentDidMount() {
    }

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
        alert('no image permission');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: false,
      });
      const { uri, type } = result;
      const ext = uri.split('.')[uri.split('.').length - 1];
      const fileName = Math.random().toString(36).substring(7);
      const form = new FormData();
      form.append('file', {
        uri,
        name: `photo.${fileName}.${ext}`,
        type: `image/${type}`,
      });
      form.append('room', currentChat);
      if (!result.cancelled) {
        const message = {
          room: currentChat,
          sender: { ...user },
          created_at: new Date(),
          type: 'image',
          src: result.uri,
          viewers: [],
        };
        addMessage(message);
        const newDialogs = [...dialogs];
        const index = newDialogs.findIndex(e => e.room === currentChat);
        // newDialogs[index] = res.dialog;
        setDialogs(newDialogs);
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
            socket.emit('file', { room: currentChat });
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
      this.unselect();
      const { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== 'granted') {
        alert('no location permission');
      }
    }

    discardSelect = () => { }

    sendMessage = () => {
      const {
        currentChat, addMessage, user, setDialogs, dialogs
      } = this.props;
      const {
        _id, first_name, last_name, middle_name, image
      } = user;
      const { text } = this.state;
      if (text) {
        const message = {
          sender: {
            _id, first_name, last_name, middle_name, image
          },
          text: text.trim(),
          created_at: new Date(),
          type: 'text',
          viewers: []
        };
        const newDialogs = [...dialogs];
        const newDialog = { ...newDialogs.filter(event => event.room === currentChat)[0] };
        if (newDialog) {
          newDialog.messages = [...newDialog.messages, message];
          newDialogs[newDialogs.findIndex(event => event.room === currentChat)] = newDialog;
          const newDialogSorted = newDialogs.length && newDialogs.sort((a, b) => {
            if (b.messages.length && a.messages.length) {
              const aCreation = new Date(a.created_at);
              const aLastMessage = new Date(a.messages[a.messages.length - 1].created_at);
              const aDate = aCreation > aLastMessage ? aCreation : aLastMessage;
              const bCreation = new Date(b.created_at);
              const bLastMessage = new Date(b.messages[b.messages.length - 1].created_at);
              const bDate = bCreation > bLastMessage ? bCreation : bLastMessage;
              return bDate - aDate;
            }
            if (b.messages.length && !a.messages.length) {
              const aCreation = new Date(a.created_at);
              const bCreation = new Date(b.created_at);
              const bLastMessage = new Date(b.messages[b.messages.length - 1].created_at);
              const bDate = bCreation > bLastMessage ? bCreation : bLastMessage;
              return bDate - aCreation;
            }
            if (!b.messages.length && a.messages.length) {
              const aCreation = new Date(a.created_at);
              const aLastMessage = new Date(a.messages[a.messages.length - 1].created_at);
              const aDate = aCreation > aLastMessage ? aCreation : aLastMessage;
              const bCreation = new Date(b.created_at);
              return bCreation - aDate;
            }
            if (!b.messages.length && !a.messages.length) {
              const aCreation = new Date(a.created_at);
              const bCreation = new Date(b.created_at);
              return bCreation - aCreation;
            }
          });
          socket.emit('group_message', { room: currentChat, message: text });
          addMessage(message);
          setDialogs(newDialogSorted);
        }
      }
      this.setState({ text: '' });
    }

    handleChange = (e) => {
      this.setState({ text: e });
    }

    pickImage = async () => {
      this.setState({ pickerOpened: true });
    };
}

const mapStateToProps = state => ({
  messages: state.messageReducer.messages,
  currentRoom: state.messageReducer.currentRoom,
  currentChat: state.messageReducer.currentChat,
  dialogs: state.dialogsReducer.dialogs,
  id: state.userReducer.user._id,
  user: state.userReducer.user,
});
const mapDispatchToProps = dispatch => ({
  addMessage: _ => dispatch(addMessage(_)),
  startSearch: _ => dispatch(startSearch(_)),
  stopSearch: _ => dispatch(stopSearch(_)),
  getMessages: _ => dispatch(getMessages(_)),
  setDialogs: _ => dispatch(setDialogs(_)),
});
export default connect(mapStateToProps, mapDispatchToProps)(InputComponent);
