import React, { Component } from 'react'
import { View, Text, Image, Dimensions, Platform, TouchableOpacity, AsyncStorage, ScrollView, KeyboardAvoidingView } from 'react-native'
import { BackIcon, EllipsisVIcon } from '../../assets/index'
import styled from 'styled-components'
import helper from '../../Helper/helper'
import { SafeAreaView, Button } from '../../Common/'
import { connect } from 'react-redux'
import { setCurrentChat } from '../../actions/messageActions'
import {
    ActionSheetProvider,
    connectActionSheet,
} from '@expo/react-native-action-sheet';

import { Header, Content } from './'
const { socket, Colors } = helper
const { blue } = Colors;
const Wrapper = styled(View)`
    height: ${Dimensions.get('window').height};
`

class ProfileEdit extends Component {
    render() {
        return (
            <ActionSheetProvider>
                <Wrapper>
                    <Header back={this.navigateBack} />
                    <KeyboardAvoidingView behavior={'padding'}>
                        <ScrollView>
                            <Content />
                        </ScrollView>
                    </KeyboardAvoidingView>
                </Wrapper>
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
    logout = async () => {
        const { navigation } = this.props
        await AsyncStorage.clear();
        navigation.navigate('Login')

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
export default connect(mapStateToProps, mapDispatchToProps)(ProfileEdit)
