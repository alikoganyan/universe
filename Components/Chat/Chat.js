import React, { Component } from 'react'
import { View, Text, Image, KeyboardAvoidingView, Platform } from 'react-native'
import { BackIcon } from '../../assets/index'
import styled from 'styled-components'
import { SafeAreaView } from '../../Common/'
import helper from '../../Helper/helper';
import { Header, Content, Input } from './'
import {connect} from 'react-redux'
const { socket } = helper
const Wrapper = styled(View)`
    height: 100%;
`
const Bottom = styled(View)`
    position: absolute;
    bottom: 0;
    width: 100%;
    background: white;
`
class Chat extends Component {
    render() {
        return (
            <SafeAreaView behavior={Platform.os === 'ios' ? 'height' : 'padding'}>
                <Wrapper>
                    <Header back={this.navigateBack} />
                    <Content />
                    <Bottom>
                        <Input />
                    </Bottom>
                </Wrapper>
            </SafeAreaView>
        )
    }
    navigateBack = () => {
        const { currentRoom, navigation } = this.props;
        socket.emit('leave chat', { chatId: currentRoom })
        navigation.goBack()
    }
    componentDidMount() { }
}


const mapStateToProps = state => {
    return {
        messages: state.messageReducer.messages,
        currentRoom: state.messageReducer.currentRoom,
        id: state.userReducer.user.id
    };
};
const mapDispatchToProps = dispatch => ({
    getMessages: _ => dispatch(getMessages(_)),
    setRoom: _ => dispatch(setRoom(_))
})
export default connect(mapStateToProps, mapDispatchToProps)(Chat)
