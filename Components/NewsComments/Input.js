import React, { Component } from 'react'
import { View, Text, SafeAreaView, Image, TextInput, ActionSheetIOS, Platform, Dimensions } from 'react-native'
import { SmileIcon, FileIcon, CameraIcon, ImageIcon } from '../../assets/index'
import styled from 'styled-components'
import helper from '../../Helper/helper'
import { connect } from 'react-redux'
import { addMessage, startSearch, stopSearch } from '../../actions/messageActions'

const { socket, sidePaddingNumber } = helper;
const Wrapper = styled(View)`
    position: absolute;
    background: white;
    width: ${Dimensions.get('window').width - (sidePaddingNumber * 2)}px;
    left: 10px;
    bottom: 10px;
    z-index: 2;
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
        const { messages, addMessage } = this.props
    }
    sendMessage = (event) => {
        this.props.addMessage({ payload: this.state.text })
        this.setState({ text: '' })
    }
    handleChange = (e) => {
        this.setState({ text: e })
    }
}

const mapStateToProps = state => {
    return {
        messages: state.messageReducer.messages
    };
};
const mapDispatchToProps = dispatch => ({
    addMessage: _ => dispatch(addMessage(_)),
    startSearch: _ => dispatch(startSearch()),
    stopSearch: _ => dispatch(stopSearch()),
})
export default connect(mapStateToProps, mapDispatchToProps)(InputComponent)
