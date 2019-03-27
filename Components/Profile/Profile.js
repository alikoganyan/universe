import React, { Component } from 'react'
import { View, Text, Image } from 'react-native'
import { BackIcon, EllipsisVIcon } from '../../assets/index'
import styled from 'styled-components'
import helper from '../../Helper/helper'
import { SafeAreaView } from '../../Common/'
import { connect } from 'react-redux'
import { setCurrentChat } from '../../actions/messageActions'
import {
    ActionSheetProvider,
    connectActionSheet,
} from '@expo/react-native-action-sheet';
import { Header, Content } from './'
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

class Profile extends Component {
    render() {
        return (
            <ActionSheetProvider>
                <SafeAreaView>
                    <Wrapper>
                        <Header back={this.navigateBack} />
                        <Content toChat={this.toChat} />
                        <Bottom>
                        </Bottom>
                    </Wrapper>
                </SafeAreaView>
            </ActionSheetProvider>
        )
    }
    navigateBack = () => {
        this.props.navigation.goBack()
    }
    toChat = () => {
        const { currentChat, user } = this.props
        socket.emit('select chat', { chatId: currentChat.id, userId: user.id })
        this.props.navigation.navigate('Chat')

    }
}

const mapStateToProps = state => {
    return {
        messages: state.messageReducer,
        dialog: state.dialogsReducer.dialogs,
        currentRoom: state.messageReducer.currentRoom,
        currentChat: state.messageReducer.currentChat,
        user: state.userReducer.user.user,
    };
};
const mapDispatchToProps = dispatch => ({
    setCurrentChat: _ => dispatch(setCurrentChat(_)),
})
export default connect(mapStateToProps, mapDispatchToProps)(Profile)
