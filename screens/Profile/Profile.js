import React, { Component } from 'react';
import {
  View, Text, Dimensions, TouchableOpacity, AsyncStorage
} from 'react-native';
import styled from 'styled-components';
import { connect } from 'react-redux';
import {
  ActionSheetProvider,
} from '@expo/react-native-action-sheet';
import helper from '../../utils/helpers';
import SafeAreaView from '../../common/SafeAreaView';
import { socket } from '../../utils/socket';
import Header from './Header';
import Content from './Content';
import { setDialogs } from '../../actions/dialogsActions';

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
class Profile extends Component {
  render() {
    const { currentChat, user, currentDialog } = this.props;
    const myProfile = !currentChat || currentDialog._id === user._id;
    const myGroup = currentDialog.isGroup ? currentDialog.creator._id === user._id : false;
    return (
      <ActionSheetProvider>
        <SafeAreaView behavior="padding">
          <Wrapper>
            <Header edit={this.edit} back={this.navigateBack} myProfile={myProfile || myGroup} />
            <Content toChat={this.toChat} myProfile={myProfile} toDialogs={this.toDialogs} />
            <Bottom>
              {
                  myProfile && <Logout onPress={this.logout}><LogoutText>Выйти из аккаунта</LogoutText></Logout>
              }
            </Bottom>
          </Wrapper>
        </SafeAreaView>
      </ActionSheetProvider>
    );
  }

    navigateBack = () => {
      const { navigation } = this.props;
      navigation.goBack();
    }

    toChat = () => {
      const { currentChat, user, navigation } = this.props;
      socket.emit('select chat', { chatId: currentChat.id, userId: user.id });
      navigation.navigate('Chat');
    }

    toDialogs = () => {
      const { navigation } = this.props;
      navigation.navigate('Dialogs');
    }

    logout = async () => {
      const { navigation,setDialogs } = this.props;
      await AsyncStorage.clear();
      setDialogs([]);
      navigation.navigate('Login');
    }

    edit = () => {
      const { navigation, currentDialog } = this.props;
      navigation.navigate(currentDialog.isGroup ? 'GroupEdit' : 'ProfileEdit', { currentDialog });
    }
}

const mapStateToProps = state => ({
  user: state.userReducer.user,
  currentChat: state.messageReducer.currentChat,
  currentDialog: state.dialogsReducer.currentDialog,

});
const mapDispatchToProps = dispatch => ({
  setDialogs: _ => dispatch(setDialogs(_))
});
export default connect(mapStateToProps, mapDispatchToProps)(Profile);
