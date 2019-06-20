import React, { Component } from 'react';
import { View, Text, Image, KeyboardAvoidingView, Dimensions, Platform } from 'react-native';
import { BackIcon } from '../../assets/index';
import styled from 'styled-components';
import { setCurrentChat, setCurrentRoomId, setRoom } from '../../actions/messageActions';
import SafeAreaView from '../../common/SafeAreaView';
import helper from '../../utils/helpers';
import Header from './Header';
import Input from './Input';
import Content from './Content';
import { connect } from 'react-redux';
import { socket } from '../../utils/socket';
const { HeaderHeight } = helper;
const Wrapper = styled(View)`
    height: 100%;
    overflow: hidden;
`;
const Bottom = styled(View)`
    position: absolute;
    bottom: 0;
    width: 100%;
    background: transparent;
    z-index: 3;
`;
class Chat extends Component {
    render() {
        const { currentChat } = this.props;
        return (
            <SafeAreaView behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}>
                <Wrapper>
                    <Header toProfile={this.toProfile} back={this.navigateBack} currentChat={currentChat} />
                    <Content navigate={this.navigate} />
                    <Bottom>
                        <Input />
                    </Bottom>
                </Wrapper>
            </SafeAreaView>
        );
    }
    state = {
        currentChat: null
    }
    componentDidMount() {
    }
    componentWillUnmount() {
        const { setRoom, setCurrentChat, setCurrentRoomId, currentRoom, currentChat, user } = this.props;
        socket.emit('leave', { room: currentChat, viewer: user._id });
        setCurrentChat(null);
        setCurrentRoomId(null);
        setRoom(null);
    }
    navigateBack = () => {
        const { currentRoom, navigation } = this.props;
        navigation.goBack();
    }
    toProfile = () => {
        const { navigation } = this.props;
        const { navigate } = navigation;
        navigate('Profile');
    }
    navigate = (e) => {
        const { navigation } = this.props;
        navigation.navigate(e);
    }
}


const mapStateToProps = state => ({
    messages: state.messageReducer.messages,
    currentRoom: state.messageReducer.currentRoom,
    currentChat: state.messageReducer.currentChat,
    user: state.userReducer.user
});
const mapDispatchToProps = dispatch => ({
    getMessages: _ => dispatch(getMessages(_)),
    setRoom: _ => dispatch(setRoom(_)),
    setCurrentRoomId: _ => dispatch(setCurrentRoomId(_)),
    setCurrentChat: _ => dispatch(setCurrentChat(_)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Chat);
