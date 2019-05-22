import React, { Component } from 'react'
import { View, Text, Image, Dimensions, Platform, TouchableOpacity, AsyncStorage } from 'react-native'
import { BackIcon, EllipsisVIcon } from '../../assets/index'
import styled from 'styled-components'
import helper from '../../utils/helpers'
import { SafeAreaView } from '../../common'
import { connect } from 'react-redux'
import { setCurrentChat } from '../../actions/messageActions'
import {
    ActionSheetProvider,
    connectActionSheet,
} from '@expo/react-native-action-sheet';
import { socket } from '../../utils/socket'
import { Header, Content } from './'

const { Colors, fontSize } = helper
const { pink } = Colors;
const Wrapper = styled(View)`
    height: ${Dimensions.get('window').height};
`
const Bottom = styled(View)`
    position: absolute;
    bottom: ${Dimensions.get('window').height === 812 ? 20 : 0};
    width: 100%;
    background: white;
    z-index: 20;
    
`
const Logout = styled(TouchableOpacity)`
    /* position: absolute; */
    bottom: 20;
    z-index: 21;
    width: 100%;
    display: flex;
    align-items: center;
`
const LogoutText = styled(Text)`
    color: ${pink};
    padding: 20px;
    font-size: ${fontSize.sm};
`
class Profile extends Component {
    render() {
        const { currentChat, user } = this.props;
        const myProfile = !currentChat
        return (
            <ActionSheetProvider>
                <SafeAreaView behavior={'padding'}>
                    <Wrapper>
                        <Header edit={this.edit} back={this.navigateBack} myProfile={myProfile} />
                        <Content toChat={this.toChat} myProfile={myProfile} />
                        <Bottom>
                            {
                                myProfile && <Logout onPress={this.logout}><LogoutText>Выйти из аккаунта</LogoutText></Logout>
                            }
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
    logout = async () => {
        const { navigation } = this.props
        await AsyncStorage.clear();
        navigation.navigate('Login')
    }
    edit = () => {
        const { navigation } = this.props;
        navigation.navigate('ProfileEdit')
    }
}

const mapStateToProps = state => ({
    user: state.userReducer.user,
    currentChat: state.messageReducer.currentChat
})
const mapDispatchToProps = dispatch => ({
    setUser: _ => dispatch(setUser(_)),
})
export default connect(mapStateToProps, mapDispatchToProps)(Profile)
