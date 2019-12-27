import React, { Component } from 'react'
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
// import { Constants } from 'expo';
import RNDeviceInfo from 'react-native-device-info'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { ActionSheetProvider } from '@expo/react-native-action-sheet'
import helper from '../../utils/helpers'
import SafeAreaView from '../../common/SafeAreaView'
import { socket } from '../../utils/socket'
import sendRequest from '../../utils/request'
import Header from './Header'
import Content from './Content'
import {
  setCurrentDialogs,
  setDialog,
  setDialogs,
} from '../../actions/dialogsActions'
import { p_logout } from '../../constants/api'
import { logOut } from '../../actions/userActions'
import { setIsMyProfile, setProfile } from '../../actions/profileAction'
import { setCurrentChat, setCurrentRoomId } from '../../actions/messageActions'

const { Colors, fontSize } = helper
const { pink } = Colors
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
  bottom: 30;
  z-index: 21;
  width: 100%;
  display: flex;
  align-items: center;
`
const LogoutText = styled(Text)`
  color: ${pink};
  padding: 20px;
  font-size: ${fontSize.sl};
`
const Loading = styled(ActivityIndicator)`
  position: absolute;
  width: 100%;
  height: 100%;
  background: #fff8;
`
class Profile extends Component {
  render() {
    const { loading, previousProfile } = this.state
    const { user, currentDialog, myProfile, navigation } = this.props

    const myGroup = currentDialog.isGroup
      ? currentDialog.creator._id === user._id
      : false
    return (
      <ActionSheetProvider>
        <SafeAreaView behavior="padding">
          <Wrapper>
            <Header
              edit={this.edit}
              back={this.navigateBack}
              myProfile={myProfile || myGroup}
            />
            <Content
              previousProfile={previousProfile}
              toChat={this.toChat}
              toSenderProfile={this.toSenderProfile}
              myProfile={myProfile}
              navigate={navigation.navigate}
              toDialogs={this.toDialogs}
            />
            <Bottom>
              {myProfile && (
                <Logout onPress={this.logout}>
                  <LogoutText>Выйти из аккаунта</LogoutText>
                </Logout>
              )}
            </Bottom>
            {!!loading && <Loading animating size="large" />}
          </Wrapper>
        </SafeAreaView>
      </ActionSheetProvider>
    )
  }

  state = {
    loading: false,
    previousProfile: null,
  }

  navigateBack = () => {
    const { navigation } = this.props
    const { previousProfile } = this.state

    if (previousProfile) {
      this.toSenderProfile(previousProfile)
      this.props.setDialog(previousProfile)
      this.props.setCurrentRoomId(previousProfile.room)
      this.props.setCurrentChat(previousProfile.room)
      this.props.setCurrentDialogs(previousProfile)
    } else {
      navigation.goBack()
    }
    this.setState({ previousProfile: null })
  }

  toChat = () => {
    const { currentChat, user, navigation } = this.props
    socket.emit('select chat', { chatId: currentChat.id, userId: user.id })
    navigation.navigate('Chat')
  }

  toSenderProfile = (sender, previousProfile?) => {
    const { setProfile } = this.props
    this.setState({ previousProfile })
    this.props.setIsMyProfile(sender._id === this.props.user._id)
    setProfile(sender)
  }

  toDialogs = () => {
    const { navigation } = this.props
    navigation.navigate('Dialogs')
  }

  logout = async () => {
    const { navigation, pushesToken } = this.props
    this.setState(
      {
        loading: true,
      },
      async () => {
        try {
          sendRequest({
            r_path: p_logout,
            method: 'post',
            attr: {
              push_token: pushesToken,
              deviceId: RNDeviceInfo.getDeviceId(),
            },
          })
          this.props.logOut()
          AsyncStorage.clear()
        } catch (e) {}
        this.setState({ loading: false }, () => navigation.navigate('Login'))
      },
    )
  }

  edit = () => {
    const { navigation, currentDialog, currentChat } = this.props
    navigation.navigate(
      currentChat !== null && currentDialog.isGroup
        ? 'GroupEdit'
        : 'ProfileEdit',
      {
        currentDialog,
      },
    )
  }
}

const mapStateToProps = state => ({
  user: state.userReducer.user,
  currentChat: state.messageReducer.currentChat,
  currentDialog: state.dialogsReducer.currentDialog,
  pushesToken: state.pushesReducer.token,
  myProfile: state.profileReducer.myProfile,
})
const mapDispatchToProps = dispatch => ({
  setDialogs: _ => dispatch(setDialogs(_)),
  logOut: _ => dispatch(logOut()),
  setIsMyProfile: _ => dispatch(setIsMyProfile(_)),
  setProfile: _ => dispatch(setProfile(_)),
  setCurrentRoomId: _ => dispatch(setCurrentRoomId(_)),
  setCurrentChat: _ => dispatch(setCurrentChat(_)),
  setCurrentDialogs: _ => dispatch(setCurrentDialogs(_)),
  setDialog: _ => dispatch(setDialog(_)),
})
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Profile)
