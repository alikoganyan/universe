import React, { Component } from 'react'
import { View, Text, SafeAreaView, Image, TextInput, ActionSheetIOS, Platform, Dimensions } from 'react-native'
import { SmileIcon, FileIcon, CameraIcon, ImageIcon } from '../../assets/index'
import styled from 'styled-components'
import helper from '../../utils/helpers'
import { connect } from 'react-redux'
import { addMessage, startSearch, stopSearch } from '../../actions/messageActions'
import { ImagePicker, Permissions } from 'expo';
import { p_send_file } from '../../constants/api'
import sendRequest from '../../utils/request'
const { socket, sidePaddingNumber } = helper;
const Wrapper = styled(View)`
    background: white;
    width: ${Dimensions.get('window').width - (sidePaddingNumber * 2)}px;
    left: 0;
    bottom: 10px;
    align-self: center;
    padding: 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-radius: 5;
    border-width: 1;
    border-color: #ddd;
    border-bottom-width: 2;
`
const Input = styled(TextInput)`
    font-size: 15px;
    height: 30px;
    display: flex;
    flex-direction: column;
    width: 85%;
    z-index: 50;
    overflow: hidden;
`
const Left = styled(View)`
    display: flex;
    flex-direction: row;
`
const Right = styled(View)` 
    display: flex;
    flex-direction: row;
`

class InputComponent extends Component {
    render() {
        const { text } = this.state;
        const { startSearch, stopSearch } = this.props;
        return (
            <Wrapper>
                <Left>
                    <Input
                        placeholder='Написать сообщение'
                        onChangeText={e => this.handleChange(e)}
                        onSubmitEditing={this.sendMessage}
                        value={text}
                        blurOnSubmit={false}
                        autoFocus={true}
                    />
                </Left>
                <Right>
                    <ImageIcon
                        onPress={this.pickImage}
                    />
                </Right>

            </Wrapper>
        )
    }
    state = {
        text: '',
        height: 0,
        image: null,
    }
    componentDidMount() {
        const { messages, addMessage } = this.props
    }
    sendMessage = (event) => {
        const { currentRoom, id, addMessage } = this.props;
        const { text } = this.state;
        if (text) {
            socket.emit('message', { sender: id, receiver: currentRoom, message: text })
            addMessage({ room: currentRoom, sender: id, text, date: new Date(), type: 'text' })
        }
        this.setState({ text: '' })
    }
    handleChange = (e) => {
        this.setState({ text: e })
    }
    pickImage = async () => {
        const { image } = this.state
        const { status_roll } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        const { currentRoom, id, addMessage } = this.props;
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: false,
        });
        const form = new FormData();
        form.append("photo", { uri: result.uri, name: 'image', type: 'image/jpeg' })
        console.log(form)
        if (!result.cancelled) {
            sendRequest({
                r_path: p_send_file,
                method: 'post',
                attr: {
                    file: form,
                    room: '0_1'
                },
                config: {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                },
                success: (res) => {
                    console.log({ res })
                    socket.emit('file', { room: currentRoom })
                    addMessage({
                        room: currentRoom,
                        sender: id,
                        date: new Date(),
                        type: 'image',
                        src: result.uri,
                    })
                },
                failFunc: (err) => {
                    console.log(err)
                }
            })

        }
    };
}

const mapStateToProps = state => {
    return {
        messages: state.messageReducer.messages,
        currentRoom: state.messageReducer.currentRoom,
        id: state.userReducer.user._id
    };
};
const mapDispatchToProps = dispatch => ({
    addMessage: _ => dispatch(addMessage(_)),
    startSearch: _ => dispatch(startSearch()),
    stopSearch: _ => dispatch(stopSearch()),
})
export default connect(mapStateToProps, mapDispatchToProps)(InputComponent)
