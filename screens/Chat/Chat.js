import React, { Component } from 'react'
import { View, Text, Image, KeyboardAvoidingView, Dimensions, Platform } from 'react-native'
import { BackIcon } from '../../assets/index'
import styled from 'styled-components'
import { setCurrentChat } from '../../actions/messageActions'
import { SafeAreaView } from '../../common'
import helper from '../../utils/helpers';
import { Header, Content, Input } from './'
import { connect } from 'react-redux'
const { socket, HeaderHeightNumber } = helper
const Wrapper = styled(View)`
    height: 100%;
`
const Bottom = styled(View)`
    position: absolute;
    bottom: 0;
    width: 100%;
    background: transparent;
    z-index: 200;
`
class Chat extends Component {
    render() {
        return (
            <SafeAreaView behavior={Platform.os === 'ios' ? 'height' : 'padding'}>
                <Wrapper>
                    <Header toProfile={this.toProfile} back={this.navigateBack} currentChat={this.props.currentChat} />
                    <Content />
                    <Bottom>
                        <Input />
                    </Bottom>
                </Wrapper>
            </SafeAreaView>
        )
    }
    state = {
        currentChat: null
    }
    componentDidMount() {
        const { currentRoom, id, setCurrentChat, currentChat } = this.props;
    }
    componentWillUnmount() {
        const { setCurrentChat, currentRoom, currentChat } = this.props;
        setCurrentChat({ currentChat: null })
        socket.emit('leave', { room: currentRoom, viewer: currentChat })
    }
    navigateBack = () => {
        const { currentRoom, navigation } = this.props;
        navigation.goBack()
    }
    toProfile = () => {
        const { navigation } = this.props;
        const { navigate } = navigation;
        navigate('Profile')
    }
}


const mapStateToProps = state => {
    return {
        messages: state.messageReducer.messages,
        currentRoom: state.messageReducer.currentRoom,
        currentChat: state.messageReducer.currentChat,
        id: state.userReducer.user.id
    };
};
const mapDispatchToProps = dispatch => ({
    getMessages: _ => dispatch(getMessages(_)),
    setRoom: _ => dispatch(setRoom(_)),
    setCurrentChat: _ => dispatch(setCurrentChat(_)),
})
export default connect(mapStateToProps, mapDispatchToProps)(Chat)
