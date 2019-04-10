import React, { Component } from 'react'
import { View, Text, SafeAreaView, Image, TextInput, ActionSheetIOS, Platform, Dimensions } from 'react-native'
import { SmileIcon, FileIcon, CameraIcon, ImageIcon } from '../../assets/index'
import styled from 'styled-components'
import helper from '../../utils/helpers'
import { connect } from 'react-redux'
import { addMessage, startSearch, stopSearch } from '../../actions/messageActions'
const { socket, sidePaddingNumber, Colors} = helper;
const { yellow } = Colors;
const Wrapper = styled(View)`
    width: ${Dimensions.get('window').width - (sidePaddingNumber * 2)}px;
    left: 0;
    bottom: 0px;
    align-self: center;
    padding: 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-radius: 5;
    border-width: 1;
    border-color: ${yellow};
    background-color: white;
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
                    />
                </Left>
                <Right>
                    <ImageIcon
                        onpress={startSearch}
                    />
                </Right>

            </Wrapper>
        )
    }
    state = {
        text: '', height: 0
    }
    componentDidMount() {
    }
    sendMessage = (event) => {
        const { currentRoom, id } = this.props;
        const { text } = this.state;
        text && socket.emit('chat message', { text, senderId: id, type: 'message', chatId: currentRoom })
        this.setState({ text: '' })
    }
    handleChange = (e) => {
        this.setState({ text: e })
    }
}

const mapStateToProps = state => {
    return {
        messages: state.messageReducer.messages,
        currentRoom: state.messageReducer.currentRoom,
        id: state.userReducer.user.user.id
    };
};
const mapDispatchToProps = dispatch => ({
    addMessage: _ => dispatch(addMessage(_)),
    startSearch: _ => dispatch(startSearch()),
    stopSearch: _ => dispatch(stopSearch()),
})
export default connect(mapStateToProps, mapDispatchToProps)(InputComponent)
