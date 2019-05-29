import React, { Component } from 'react'
import { View, Text, SafeAreaView, Image, TextInput, ActionSheetIOS, Platform, Dimensions, TouchableOpacity } from 'react-native'
import { SmileIcon, FileIcon, CameraIcon, ImageIcon, PapperPlaneIcon } from '../../assets/index'
import styled from 'styled-components'
import helper from '../../utils/helpers'
import { connect } from 'react-redux'
import { addMessage, startSearch, stopSearch, getMessages, setCurrentChat, setRoom, setCurrentRoomId, setCurrentDialog } from '../../actions/messageActions'
import { ImagePicker, DocumentPicker, Permissions, Location } from 'expo';
import { p_send_file } from '../../constants/api'
import { setDialogs, setCurrentDialogs } from '../../actions/dialogsActions'
import sendRequest from '../../utils/request'
import posed from 'react-native-pose'
import { socket } from '../../utils/socket'
const { sidePadding, borderRadius, HeaderHeight } = helper;
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
    padding: 0 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-radius: 5;
    border-width: 1;
    border-color: #ddd;
    align-items: center;
    border-bottom-width: 1;
    min-height: 50px;
    max-height: 70px;
`
const Input = styled(TextInput)`
    font-size: 15px;
    display: flex;
    flex-direction: column;
    width: 100%;
    overflow: hidden;
    min-height: 30px;
`
const Left = styled(View)`
    display: flex;
    flex-direction: row;
    width: 90%;
`
const Right = styled(View)` 
    display: flex;
    flex-direction: row;
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
const Shadow = styled(TouchableOpacity)`
    position: absolute;
    width: ${Dimensions.get('window').width};
    height: ${Dimensions.get('window').height};
    background: rgba(5,5,5,.3);
    top: -${Dimensions.get('window').height - HeaderHeight};
    z-index: 990;
`
const FilePickerOption = styled(TouchableOpacity)`
    z-index: 999;
`
class InputComponent extends Component {
    render() {
        const { text, pickerOpened } = this.state;
        const { startSearch, stopSearch } = this.props;
        return (
            <>
                {pickerOpened && <Shadow activeOpacity={1} onPress={this.unselect} />}
                <Wrapper>
                    <Left>
                        <Input
                            placeholder='Написать сообщение'
                            onChangeText={e => this.handleChange(e)}
                            value={text}
                            blurOnSubmit={false}
                            multiline={true}
                        />
                    </Left>
                    <Right>
                        {text ? <PapperPlaneIcon onPress={this.sendMessage} /> : <ImageIcon
                            onPress={this.pickImage}
                        />}
                    </Right>
                </Wrapper>
                <FilePicker pose={pickerOpened ? 'visible' : 'hidden'}>
                    <FilePickerOption onPress={this.selectPhoto}><Text>Фото или видео</Text></FilePickerOption>
                    <FilePickerOption onPress={this.selectFile}><Text>Файл</Text></FilePickerOption>
                    <FilePickerOption onPress={this.selectGeo}><Text>Мою локацию</Text></FilePickerOption>
                    <FilePickerOption onPress={this.unselect}><Text>Отменить</Text></FilePickerOption>
                </FilePicker>
            </>
        )
    }
    state = {
        text: '',
        height: 0,
        image: null,
        pickerOpened: false,
        location: null,
    }
    componentDidMount() {
        const { messages, addMessage } = this.props
    }
    unselect = (e) => {
        this.setState({ pickerOpened: false })
    }
    selectPhoto = async (e) => {
        const { currentChat, currentRoom, addMessage, getMessages, setDialogs, dialogs, user } = this.props;
        this.unselect()
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: false,
        });
        const { uri, type } = result
        const fileName = Math.random().toString(36).substring(7);
        const form = new FormData();
        const ext = uri.split('.')[uri.split('.').length - 1]
        console.log(ext)
        console.log(`photo.${fileName}.png`)
        form.append("file", {
            uri,
            name: `photo.${fileName}.${ext}`,
            type: `image/${type}`,
        })
        form.append("room", currentChat)
        if (!result.cancelled) {
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
                    socket.emit('file', { room: currentChat })
                    console.log(res.dialog)
                    const newDialogs = [...dialogs]
                    const index = newDialogs.findIndex(e => e.room === currentChat)
                    newDialogs[index] = res.dialog
                    const message = {
                        room: currentChat,
                        sender: { ...user },
                        created_at: new Date(),
                        type: 'image',
                        src: result.uri,
                        viewers: [],
                    }
                    setDialogs(newDialogs)
                    addMessage(message);
                    console.log('success')
                },
                failFunc: (err) => {
                    console.log({ err })
                }
            })
        }
    }
    selectFile = async (e) => {
        let result = await DocumentPicker.getDocumentAsync({});
    }
    selectGeo = async () => {
        const { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            this.setState({
                errorMessage: 'Permission to access location was denied',
            });
        }
        const location = await Location.getCurrentPositionAsync({});
        this.setState({ location });
    };
    discardSelect = (e) => { }
    sendMessage = (e) => {
        const { currentDialog, currentRoom, user, addMessage, setDialogs, setCurrentChat, setRoom, setCurrentRoomId, setCurrentDialog } = this.props;
        const { text } = this.state;
        if (text) {
            const { dialogs, currentChat } = this.props;
            const message = { room: currentRoom, sender: { _id: user._id }, text: text.trim(), created_at: new Date(), type: 'text', viewers: [] }
            const newDialogs = [...dialogs]
            const newDialog = newDialogs.filter(event => event.room === currentChat)[0]
            if (newDialog) {
                newDialog.messages = [...newDialog.messages, message]
                newDialogs[newDialogs.findIndex(event => event.room === currentChat)] = newDialog
                setDialogs(newDialogs)
            } else {
                setRoom(currentDialog._id)
                setCurrentChat(`${user._id}_${currentDialog._id}`)
            }
            addMessage(message)
            socket.emit('message', { receiver: currentRoom, message: text.trim() })
        }
        this.setState({ text: '' })
    }
    handleChange = (e) => {
        this.setState({ text: e })
    }
    pickImage = async () => {
        const { image } = this.state
        const { status_roll } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        const { currentRoom, currentChat, id, addMessage } = this.props;
        this.setState({ pickerOpened: true })

    };
}

const mapStateToProps = state => ({
    messages: state.messageReducer.messages,
    currentRoom: state.messageReducer.currentRoom,
    currentChat: state.messageReducer.currentChat,
    currentDialog: state.dialogsReducer.currentDialog,
    user: state.userReducer.user,
    dialogs: state.dialogsReducer.dialogs,
})
const mapDispatchToProps = dispatch => ({
    addMessage: _ => dispatch(addMessage(_)),
    startSearch: _ => dispatch(startSearch()),
    stopSearch: _ => dispatch(stopSearch()),
    getMessages: _ => dispatch(getMessages()),
    setDialogs: _ => dispatch(setDialogs(_)),
    setCurrentChat: _ => dispatch(setCurrentChat(_)),
    setCurrentRoomId: _ => dispatch(setCurrentRoomId(_)),
    setCurrentDialog: _ => dispatch(setCurrentDialog(_)),
    setRoom: _ => dispatch(setRoom(_)),
})
export default connect(mapStateToProps, mapDispatchToProps)(InputComponent)
