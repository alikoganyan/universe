import React, { Component } from 'react'
import { View, Text, Image, Dimensions, Platform, TouchableOpacity, AsyncStorage, ScrollView, KeyboardAvoidingView } from 'react-native'
import { BackIcon, EllipsisVIcon } from '../../assets/index'
import styled from 'styled-components'
import helper from '../../utils/helpers'
import Button from '../../common/Button'
import SafeAreaView from '../../common/SafeAreaView'
import { connect } from 'react-redux'
import { setCurrentChat } from '../../actions/messageActions'
import {
    ActionSheetProvider,
    connectActionSheet,
} from '@expo/react-native-action-sheet';
import { socket } from '../../utils/socket'
import { Header, Content } from './'

const { Colors } = helper
const { blue } = Colors;
const Wrapper = styled(View)`
    height: 100%;
`

class ProfileEdit extends Component {
    render() {
        return (
            <ActionSheetProvider>
                <SafeAreaView behavior={'padding'}>
                    <Wrapper>
                        <Header back={this.navigateBack} />
                        <ScrollView keyboardDismissMode={'on-drag'}>
                            <Content back={this.navigateBack} />
                        </ScrollView>
                    </Wrapper>
                </SafeAreaView>
            </ActionSheetProvider>
        )
    }
    navigateBack = () => {
        this.props.navigation.goBack()
    }
    toChat = () => {
        const { currentChat, user, navigation } = this.props
        socket.emit('select chat', { chatId: currentChat.id, userId: user.id })
        navigation.navigate('Chat')
    }
    logout = async () => {
        const { navigation } = this.props
        await AsyncStorage.clear();
        navigation.navigate('Login')

    }
}

const mapStateToProps = state => ({
    messages: state.messageReducer,
    dialog: state.dialogsReducer.dialogs,
    currentRoom: state.messageReducer.currentRoom,
    currentChat: state.messageReducer.currentChat,
    user: state.userReducer.user,
})
const mapDispatchToProps = dispatch => ({
    setCurrentChat: _ => dispatch(setCurrentChat(_)),
})
export default connect(mapStateToProps, mapDispatchToProps)(ProfileEdit)
