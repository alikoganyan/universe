import React, { Component } from 'react';
import { View, Text, Image, Dimensions, Platform, TouchableOpacity, AsyncStorage, ActivityIndicator } from 'react-native';
import { Constants } from 'expo';
import { BackIcon, EllipsisVIcon } from '../../assets/index';
import styled from 'styled-components';
import helper from '../../utils/helpers';
import SafeAreaView from '../../common/SafeAreaView';
import { connect } from 'react-redux';
import { setCurrentChat } from '../../actions/messageActions';
import {
    ActionSheetProvider,
    connectActionSheet,
} from '@expo/react-native-action-sheet';
import { socket } from '../../utils/socket';
import sendRequest from '../../utils/request';
import Header from './Header';
import Content from './Content';
import { p_logout } from '../../constants/api';

const { Colors, fontSize } = helper;
const { pink } = Colors;
const Wrapper = styled(View)`
    height: ${Dimensions.get('window').height};
`;
const Bottom = styled(View)`
    position: absolute;
    bottom: ${Dimensions.get('window').height === 812 ? 20 : 0};
    width: 100%;
    background: white;
    z-index: 20;
    
`;
const Logout = styled(TouchableOpacity)`
    /* position: absolute; */
    bottom: 30;
    z-index: 21;
    width: 100%;
    display: flex;
    align-items: center;
`;
const LogoutText = styled(Text)`
    color: ${pink};
    padding: 20px;
    font-size: ${fontSize.sl};
`;
const Loading = styled(ActivityIndicator)`
    position: absolute;
    width: 100%;
    height: 100%;
    background: #fff8;
`;
class Profile extends Component {
    state = {
        loading: false,
    }
    render() {
        const { loading } = this.state;
        const { currentChat, user, currentDialog } = this.props;
        const myProfile = !currentChat || currentDialog._id === user._id;
        const myGroup = currentDialog.isGroup ? currentDialog.creator._id === user._id : false;
        return (
            <ActionSheetProvider>
                <SafeAreaView behavior={'padding'}>
                    <Wrapper>
                        <Header edit={this.edit} back={this.navigateBack} myProfile={myProfile || myGroup} />
                        <Content toChat={this.toChat} myProfile={myProfile} toDialogs={this.toDialogs} />
                        <Bottom>
                            {
                                myProfile && <Logout onPress={this.logout}><LogoutText>Выйти из аккаунта</LogoutText></Logout>
                            }
                        </Bottom>
                        {!!loading && <Loading animating size={'large'} />}
                    </Wrapper>
                </SafeAreaView>
            </ActionSheetProvider>
        );
    }
    navigateBack = () => {
        this.props.navigation.goBack();
    }
    toChat = () => {
        const { currentChat, user } = this.props;
        socket.emit('select chat', { chatId: currentChat.id, userId: user.id });
        this.props.navigation.navigate('Chat');
    }

    toDialogs = () => {
        this.props.navigation.navigate('Dialogs');
    }
    logout = async () => {
        const { navigation } = this.props;
        this.setState({
            loading: true,
        }, async () => {
            try {
                await sendRequest({
                    r_path: p_logout,
                    method: 'post',
                    attr: {
                        push_token: this.props.pushesToken,
                        deviceId: Constants.deviceId,
                    },
                    failFunc: (e) => console.log('request error: ', e)
                });
                await AsyncStorage.clear();
            } catch (e) {
                console.log('error: ', e);
            }
            this.setState({ loading: false }, () => navigation.navigate('Login'));
        })
    }
    edit = () => {
        const { navigation, currentDialog } = this.props;
        navigation.navigate(currentDialog.isGroup ? 'GroupEdit' : 'ProfileEdit', { currentDialog });
    }
}

const mapStateToProps = ({
  userReducer,
  messageReducer,
  dialogsReducer,
  pushesReducer
}) => ({
  user: userReducer.user,
  currentChat: messageReducer.currentChat,
  currentDialog: dialogsReducer.currentDialog,
  pushesToken: pushesReducer.token
});
const mapDispatchToProps = dispatch => ({
    setUser: _ => dispatch(setUser(_)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Profile);
