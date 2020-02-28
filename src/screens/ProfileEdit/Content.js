import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
} from 'react-native'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { TaskIcon, GroupIcon, FilesRedIcon } from '../../assets/index'
import Button from '../../common/Button'
import { setRoom } from '../../actions/messageActions'
import { alterUser, setUser } from '../../actions/userActions'
import helper from '../../utils/helpers'
import ImageComponent from '../../common/Image'
import RNDeviceInfo from 'react-native-device-info'
import { getImageFromPicker } from '../../utils/ImagePicker'
import { socket } from '../../utils/socket'
import {
  d_profile_avatar,
  p_profile,
  p_profile_avatar,
} from '../../constants/api'
import sendRequest from '../../utils/request'
import DefaultAvatar from '../../common/DefaultAvatar'
import { validateEmail, passwordLevel } from '../../helper/validation'
import * as ICONS from '../../assets/icons'

import { BarPasswordStrengthDisplay } from 'react-native-password-strength-meter'

const { Colors, HeaderHeight, fontSize, IconMiddle } = helper
const { grey2, blue, lightGrey1 } = Colors
const Wrapper = styled(View)`
  padding-top: 30px;
  background: white;
`
const User = styled(View)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-bottom: 20px;
  margin-bottom: 10px;
`
const UserInfo = styled(View)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 90%;
`
const InputBox = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: center;
  height: 40px;
  margin-bottom: ${({ err }) => (err ? 0 : 28)};
`
const InputLabel = styled(Text)`
  flex: 1;
  text-align: right;
  color: ${grey2};
  z-index: 20;
  margin-bottom: 10px;
  font-size: ${fontSize.sl};
  margin-right: 15px;
`
const Bottom = styled(View)`
  margin-top: 30px;
  margin-bottom: ${HeaderHeight}px;
  width: 60%;
  display: flex;
  align-self: center;
  justify-content: center;
  background: white;
`
const ButtonText = styled(Text)`
  font-size: ${fontSize.text};
  text-align: center;
  display: flex;
  align-self: center;
  justify-content: center;
`
const DeleteAvatar = styled(TouchableOpacity)`
  position: absolute;
  right: 10;
`
const StyledInput = styled(TextInput)`
  flex: 2;
  width: 50%;
  border: 0.3px solid ${lightGrey1};
  border-width: 0;
  border-bottom-width: 0.3px;
  padding-bottom: 10px;
  font-size: ${fontSize.sl};
`
const Error = styled(View)`
  width: 100%;
  display: flex;
  align-items: center;
  margin-top: 8px;
  margin-bottom: 8px;
`
const ErrorText = styled(Text)`
  font-size: ${fontSize.sm};
  text-align: center;
`
const ShowHidePassword = styled(TouchableOpacity)`
  position: absolute;
  right: 10px;
  z-index: 20;
  width: 30px;
  height: 30px
  display: flex;
  justify-content: center;
  align-items: center;
`

const Input = props => {
  const {
    style,
    value,
    children,
    onChange,
    pass,
    keyboardType,
    hidePassword,
    maxLength,
  } = props
  return (
    <StyledInput
      value={value}
      style={{ ...style }}
      multiline={false}
      onChange={onChange}
      placeholder={children}
      secureTextEntry={pass && hidePassword}
      placeholderTextColor={lightGrey1}
      keyboardType={keyboardType}
      maxLength={maxLength}
    />
  )
}

class Content extends Component {
  render() {
    const {
      user,
      // permissionError,
      lastNameError,
      firstNameError,
      middleNameError,
      emailError,
      passwordError,
      repasswordError,
      image,
      imageFormData,
    } = this.state
    const { first_name, last_name, middle_name, email } = user || {}
    return (
      <Wrapper>
        <User>
          <View style={{ position: 'relative' }}>
            <TouchableOpacity onPress={this.selectImage}>
              {!image ||
              image === '/images/default_group.png' ||
              image === '/images/default_avatar.jpg' ? (
                <DefaultAvatar size={80} />
              ) : (
                <>
                  <ImageComponent
                    size={80}
                    source={{
                      uri: imageFormData
                        ? image
                        : `https://seruniverse.asmo.media${image}`,
                    }}
                    style={{
                      marginTop: 0,
                      marginBottom: 16,
                      marginRight: 10,
                      marginLeft: 10,
                    }}
                  />
                </>
              )}
            </TouchableOpacity>
            {!!image && (
              <DeleteAvatar onPress={this.deleteImageIsState}>
                <Image
                  style={{ width: IconMiddle, height: IconMiddle }}
                  resizeMode="contain"
                  source={ICONS.Delete}
                />
              </DeleteAvatar>
            )}
          </View>

          <UserInfo>
            <InputBox key={0} err={!!lastNameError}>
              <InputLabel numberOfLines={1}>Фамилия</InputLabel>
              <Input
                value={last_name}
                onChange={e => this.handleChange(e, 'last_name')}
              />
            </InputBox>
            {!!lastNameError && (
              <Error>
                <ErrorText>{lastNameError}</ErrorText>
              </Error>
            )}
            <InputBox key={1} err={!!firstNameError}>
              <InputLabel numberOfLines={1}>Имя</InputLabel>
              <Input
                value={first_name}
                onChange={e => this.handleChange(e, 'first_name')}
              />
            </InputBox>
            {!!firstNameError && (
              <Error>
                <ErrorText>{firstNameError}</ErrorText>
              </Error>
            )}
            <InputBox key={2} err={!!middleNameError}>
              <InputLabel numberOfLines={1}>Отчество</InputLabel>
              <Input
                value={middle_name}
                onChange={e => this.handleChange(e, 'middle_name')}
              />
            </InputBox>
            {!!middleNameError && (
              <Error>
                <ErrorText>{middleNameError}</ErrorText>
              </Error>
            )}
            <InputBox key={3} err={!!emailError}>
              <InputLabel numberOfLines={1}>Email</InputLabel>
              <Input
                value={email}
                keyboardType="email-address"
                onChange={e => {
                  this.handleChange(e, 'email')
                  validateEmail(e.nativeEvent.text, this)
                }}
              >
                example@gmail.com
              </Input>
            </InputBox>
            {!!emailError && (
              <Error>
                <ErrorText>{emailError}</ErrorText>
              </Error>
            )}
            <InputBox key={4} err={!!passwordError}>
              <ShowHidePassword
                onPress={() => this.hideShowPassword('password')}
              >
                <Image
                  style={{ width: 20, height: 20 }}
                  resizeMode="contain"
                  source={this.state.password ? ICONS.ShowEye : ICONS.HideEye}
                />
              </ShowHidePassword>
              <InputLabel numberOfLines={1}>Пароль</InputLabel>
              <Input
                pass
                hidePassword={this.state.password}
                onChange={e => this.handleChange(e, 'password')}
                maxLength={20}
              />
            </InputBox>
            <View
              style={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
              }}
            >
              <BarPasswordStrengthDisplay
                password={this.state.passwordText}
                scoreLimit={100}
                levels={passwordLevel}
                width={Math.round(Dimensions.get('window').width) / 2 + 22}
                wrapperStyle={{ display: 'flex', alignItems: 'flex-end' }}
              />
            </View>

            {!!passwordError && (
              <Error>
                <ErrorText>{passwordError}</ErrorText>
              </Error>
            )}
            <InputBox key={5} err={!!repasswordError}>
              <ShowHidePassword
                onPress={() => this.hideShowPassword('confirmPassword')}
              >
                <Image
                  style={{ width: 20, height: 20 }}
                  resizeMode="contain"
                  source={
                    this.state.confirmPassword ? ICONS.ShowEye : ICONS.HideEye
                  }
                />
              </ShowHidePassword>
              <InputLabel numberOfLines={2}>Повторите пароль</InputLabel>
              <Input
                pass
                hidePassword={this.state.confirmPassword}
                onChange={e => this.handleChange(e, 'repassword')}
                maxLength={20}
              />
            </InputBox>
            {!!repasswordError && (
              <Error>
                <ErrorText>{repasswordError}</ErrorText>
              </Error>
            )}
          </UserInfo>
        </User>
        <Bottom>
          <Button background={blue} color="#fff" onPress={this.apply}>
            <ButtonText>Сохранить изменения</ButtonText>
          </Button>
        </Bottom>
      </Wrapper>
    )
  }

  state = {
    password: true,
    confirmPassword: true,
    passwordText: '',
    lastNameError: false,
    firstNameError: false,
    middleNameError: false,
    emailError: false,
    passwordError: false,
    repasswordError: false,
    imageFormData: null,
    image: '',
    imageDeleted: false,
    user: {
      email: '',
      first_name: '',
      middle_name: '',
      last_name: '',
      password: '',
      repassword: '',
    },
    status: 'В сети',
    UserData: [
      { type: 'Подразделение', value: 'Стандартный' },
      { type: 'Должность', value: 'Главный инженер' },
      { type: 'Личный', value: '+7(395)282-48-57' },
      { type: 'Задачи', value: '4', icon: <TaskIcon /> },
      { type: 'Общих групп', value: '32', icon: <GroupIcon /> },
      { type: 'Общих файлов', value: '10', icon: <FilesRedIcon /> },
    ],
  }

  componentDidMount() {
    const { user } = this.props
    const statUser = this.state.user
    this.setState({
      user: { ...statUser, ...user, password: '' },
      image: user.image,
    })
  }

  hideShowPassword = type => {
    const { password, confirmPassword } = this.state
    let togglePassword = type === 'password' ? password : confirmPassword
    togglePassword = !togglePassword
    this.setState({ [type]: togglePassword })
  }

  selectImage = () => {
    getImageFromPicker(result => {
      const { imageFormData = {} } = result
      if (!result.cancelled) {
        this.setState({ imageFormData, image: imageFormData.uri })
      }
    })
  }

  saveImage = () => {
    const { imageFormData } = this.state
    const { setUser, user } = this.props
    const form = new FormData()
    form.append('file', imageFormData)
    sendRequest({
      r_path: p_profile_avatar,
      method: 'post',
      attr: form,
      config: {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
      success: res => {
        const newUser = { ...user }
        newUser.image = res.newImage
        setUser(newUser)
        this.setState({ user: newUser, imageDeleted: false })
      },
      failFunc: err => {},
    })
  }

  deleteImageIsState = () => {
    this.setState({ image: '', imageDeleted: true })
  }

  deleteImage = () => {
    const { setUser, user } = this.props

    sendRequest({
      r_path: d_profile_avatar,
      method: 'delete',
      attr: {},
      success: res => {
        const newUser = { ...user }
        newUser.image = ''
        setUser(newUser)
      },
      failFunc: err => {},
    })
  }

  handleChange = (e, unit) => {
    const { user, passwordText } = this.state
    const newUser = { ...user }
    newUser[unit] = e.nativeEvent.text
    this.setState({ user: newUser })

    if (unit === 'password') {
      this.setState({ passwordText: e.nativeEvent.text })
    } else if (unit === 'repassword') {
      if (passwordText !== e.nativeEvent.text) {
        this.setState({ repasswordError: 'Пароли не совпадают' })
      } else {
        this.setState({ repasswordError: false })
      }
    }
  }

  toChat = () => {
    const { toChat, setRoom, user } = this.props
    const { id } = user
    socket.emit('select chat', { chatId: id, userId: id })
    setRoom(id)
    toChat()
  }

  apply = () => {
    const {
      user,
      imageFormData,
      emailError,
      repasswordError,
      imageDeleted,
    } = this.state
    const { back, alterUser } = this.props
    const userRedux = this.props.user
    const {
      first_name,
      last_name,
      middle_name,
      email,
      password,
      repassword,
      phone_number,
    } = user
    this.setState({
      lastNameError: !last_name ? 'Не менее 2х символов' : '',
      firstNameError: !first_name ? 'Не менее 2х символов' : '',
      middleNameError: !middle_name ? 'Не менее 2х символов' : '',
      emailError: !email ? 'Неправильный электронная почта' : '',
    })
    validateEmail(email, this)
    if (emailError || repasswordError) {
      return
    }
    if (first_name && last_name && middle_name && email) {
      sendRequest({
        r_path: p_profile,
        method: 'patch',
        attr: {
          user: {
            email: email || userRedux.email,
            first_name: first_name || userRedux.firstName,
            middle_name: middle_name || userRedux.patronymic,
            last_name: last_name || userRedux.lastName,
            new_password: password || userRedux.password,
            repeat_password: repassword || userRedux.repassword,
          },
          deviceId: RNDeviceInfo.getDeviceId(),
        },
        success: () => {
          imageFormData && this.saveImage()
          alterUser({
            email: email || userRedux.email,
            first_name: first_name || userRedux.firstName,
            middle_name: middle_name || userRedux.patronymic,
            last_name: last_name || userRedux.lastName,
            phone_number,
          })
          back()
        },
        failFunc: err => {},
      })
      if (imageDeleted) {
        this.deleteImage()
      }
      back()
    }
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
  setRoom: _ => dispatch(setRoom(_)),
  setUser: _ => dispatch(setUser(_)),
  alterUser: _ => dispatch(alterUser(_)),
})
export default connect(mapStateToProps, mapDispatchToProps)(Content)
