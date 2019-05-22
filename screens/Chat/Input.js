import React, { Component } from 'react'
import { View, Text, SafeAreaView, Image, TextInput, ActionSheetIOS, Platform, Dimensions, TouchableOpacity } from 'react-native'
import { SmileIcon, FileIcon, CameraIcon, ImageIcon, PapperPlaneIcon } from '../../assets/index'
import styled from 'styled-components'
import helper from '../../utils/helpers'
import { connect } from 'react-redux'
import { addMessage, startSearch, stopSearch } from '../../actions/messageActions'
import { ImagePicker, DocumentPicker, Permissions, Location } from 'expo';
import { p_send_file } from '../../constants/api'
import sendRequest from '../../utils/request'
import posed from 'react-native-pose'
import { socket } from '../../utils/socket'
const { sidePaddingNumber, borderRadius, HeaderHeightNumber } = helper;
const FilePickerPosed = posed.View({
    visible: { bottom: 10 },
    hidden: { bottom: -250 }
});
const Wrapper = styled(View)`
    background: white;
    width: ${Dimensions.get('window').width - (sidePaddingNumber * 2)}px;
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
    z-index: 4;
`
const Shadow = styled(TouchableOpacity)`
    position: absolute;
    width: ${Dimensions.get('window').width};
    height: ${Dimensions.get('window').height};
    background: rgba(5,5,5,.3);
    top: -${Dimensions.get('window').height - HeaderHeightNumber - 3};
    z-index: 2;
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
                    <TouchableOpacity onPress={this.selectPhoto}><Text>Фото или видео</Text></TouchableOpacity>
                    <TouchableOpacity onPress={this.selectFile}><Text>Файл</Text></TouchableOpacity>
                    <TouchableOpacity onPress={this.selectGeo}><Text>Мою локацию</Text></TouchableOpacity>
                    <TouchableOpacity onPress={this.unselect}><Text>Отменить</Text></TouchableOpacity>
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
        this.unselect()
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: false,
        });
        const form = new FormData();
        form.append("photo", { uri: 'result.uri', name: 'image', type: 'image/jpeg' })
        if (!result.cancelled) {
            sendRequest({
                r_path: p_send_file,
                method: 'post',
                attr: {
                    file: form,
                    room: currentChat
                },
                // config: {
                //     headers: {
                //         'Content-Type': 'multipart/form-data'
                //     }
                // },
                success: (res) => {
                    console.log({ res })
                    socket.emit('file', { room: currentChat })
                    addMessage({
                        room: currentChat,
                        sender: id,
                        date: new Date(),
                        type: 'image',
                        src: result.uri,
                    })
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
    sendMessage = (event) => {
        const { currentRoom, user, addMessage } = this.props;
        const { text } = this.state;
        if (text) {
            socket.emit('message', { receiver: currentRoom, message: text })
            addMessage({ room: currentRoom, sender: { _id: user._id }, text, created_at: new Date(), type: 'text' })
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
    user: state.userReducer.user
})
const mapDispatchToProps = dispatch => ({
    addMessage: _ => dispatch(addMessage(_)),
    startSearch: _ => dispatch(startSearch()),
    stopSearch: _ => dispatch(stopSearch()),
})
export default connect(mapStateToProps, mapDispatchToProps)(InputComponent)
