import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  AsyncStorage,
  Image,
  Dimensions,
} from 'react-native'
import RNDeviceInfo from 'react-native-device-info'
import helper from '../../utils/helpers'
import styled from 'styled-components'
import { connect } from 'react-redux'
import {
  setUser,
  setAuth,
  setRegisterUserNumber,
  setPas,
} from '../../actions/userActions'
import { trySignToPushes } from '../../actions/pushesActions'
import { p_login, p_restore_password } from '../../constants/api'
import Button from '../../common/Button'
import sendRequest from '../../utils/request'
import { connectToSocket } from '../../utils/socket'
import * as ICONS from '../../assets/icons'
import { BarPasswordStrengthDisplay } from 'react-native-password-strength-meter'
import { passwordLevel } from '../../helper/validation'
import { setIsMyProfile } from '../../actions/profileAction'

const { Colors, fontSize, minPassLength } = helper
const { lightGrey1, blue, pink } = Colors
const { large, sl } = fontSize
const Wrapper = styled(View)`
  padding: 0 20%;
  height: 90%;
  display: flex;
  justify-content: center;
`
const Title = styled(Text)`
  width: 100%;
  font-size: ${large};
  text-align: center;
  margin-bottom: 30px;
`
const ErrorText = styled(Text)`
  font-size: ${sl};
  margin-bottom: 10px;
  text-align: center;
  color: ${pink};
`
const ControlBar = styled(View)`
  display: flex;
  justify-content: center;
  width: 100%;
  align-items: center;
  align-self: center;
  flex-direction: column;
`

const StyledInput = styled(TextInput)`
  border: 1px solid ${lightGrey1};
  border-width: 0;
  border-bottom-width: 1px;
  padding-bottom: ${Platform.OS === 'ios' ? 11 : 6}px;
  text-align: center;
  margin-bottom: 10px;
  color: black;
  ${({ style }) => style};
`

const ShowHidePassword = styled(TouchableOpacity)`
  position: absolute;
  right: 10px;
  top: ${Platform.OS === 'ios' ? -5 : 10}px;
  z-index: 20;
  width: 30px;
  height: 30px
  display: flex;
  justify-content: center;
  align-items: center;
`

class Content extends Component {
  render() {
    const {
      invalidPassword,
      invalidConfirmPassword,
      password,
      confirmPassword,
    } = this.state
    const { navigateToDialogs } = this.props
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Wrapper onPress={Keyboard.dismiss}>
          <View>
            <Title>Создать пароль</Title>
          </View>
          <View style={{ minHeight: 70 }}>
            <ShowHidePassword
              onPress={() => this.hideShowPassword('hidePassword')}
            >
              <Image
                style={{ width: 20, height: 20 }}
                resizeMode="contain"
                source={this.state.hidePassword ? ICONS.ShowEye : ICONS.HideEye}
              />
            </ShowHidePassword>
            <StyledInput
              password
              maxLength={12}
              onChangeText={e => this.handleChangePassword(e, 'password')}
              value={password}
              placeholder="Пароль"
              secureTextEntry={this.state.hidePassword}
              style={{
                borderColor: invalidPassword ? pink : lightGrey1,
              }}
            />
            <BarPasswordStrengthDisplay
              password={this.state.password}
              scoreLimit={100}
              levels={passwordLevel}
              width={Math.round(Dimensions.get('window').width) / 2 + 22}
              wrapperStyle={{ display: 'flex', alignItems: 'flex-end' }}
              minLength={6}
            />
            {!!invalidPassword && <ErrorText>{invalidPassword}</ErrorText>}
          </View>
          <View style={{ minHeight: 60 }}>
            <ShowHidePassword
              onPress={() => this.hideShowPassword('hideConfirmPassword')}
            >
              <Image
                style={{ width: 20, height: 20 }}
                resizeMode="contain"
                source={
                  this.state.hideConfirmPassword ? ICONS.ShowEye : ICONS.HideEye
                }
              />
            </ShowHidePassword>
            <StyledInput
              password
              maxLength={12}
              onChangeText={e =>
                this.handleChangePassword(e, 'confirmPassword')
              }
              value={confirmPassword}
              placeholder="Повторите пароль"
              secureTextEntry={this.state.hideConfirmPassword}
              style={{
                borderColor: invalidConfirmPassword ? pink : lightGrey1,
              }}
            />
            {!!invalidConfirmPassword && (
              <ErrorText>{invalidConfirmPassword}</ErrorText>
            )}
          </View>
          <ControlBar>
            <TouchableOpacity onPress={navigateToDialogs}>
              <Button
                onPress={this.createPassword}
                background={blue}
                color="#fff"
              >
                Создать и войти
              </Button>
            </TouchableOpacity>
          </ControlBar>
        </Wrapper>
      </TouchableWithoutFeedback>
    )
  }

  state = {
    password: '',
    confirmPassword: '',
    invalidPassword: '',
    invalidConfirmPassword: '',
    hidePassword: true,
    hideConfirmPassword: true,
  }

  componentDidMount() {}

  hideShowPassword = type => {
    const { hidePassword, hideConfirmPassword } = this.state
    let togglePassword =
      type === 'hidePassword' ? hidePassword : hideConfirmPassword
    togglePassword = !togglePassword
    this.setState({ [type]: togglePassword })
  }

  storeUserData = user => {
    AsyncStorage.setItem('user', JSON.stringify(user))
  }

  createPassword = () => {
    const { register, pas } = this.props
    const {
      password,
      confirmPassword,
      invalidConfirmPassword,
      invalidPassword,
    } = this.state
    const { phone } = register

    const passwordError = !password.length
      ? 'введите пароль'
      : password.length && password.length < minPassLength
      ? `пароль должен содержать не меньше ${minPassLength} символов`
      : false
    passwordError && this.setState({ invalidPassword: passwordError })

    if (invalidPassword || invalidConfirmPassword) {
      return
    }

    sendRequest({
      r_path: p_restore_password,
      method: 'post',
      attr: {
        phone_number: phone,
        new_password: password,
        repeat_password: confirmPassword,
        one_time_password: pas,
      },
      success: () => {
        this.login()
      },
      failFunc: err => {},
    })
  }

  login = () => {
    const {
      setRegisterUserNumber,
      pushesToken,
      register,
      setIsMyProfile,
    } = this.props
    const { phone: phone_number } = register
    const { password } = this.state

    if (!password || password.length < 4) {
      this.setState({ invalidPassword: true })
      return
    }
    sendRequest({
      r_path: p_login,
      method: 'post',
      attr: {
        phone_number,
        password,
        push_token: pushesToken,
        deviceId: RNDeviceInfo.getDeviceId(),
      },
      success: res => {
        const {
          setAuth,
          setUser,
          navigate,
          trySignToPushes,
          setPas,
        } = this.props
        const {
          access_token,
          data,
          settings: {
            notifications: {
              enable: isPushesEnabled = false,
              initialized: isPushesAsked = false,
            } = {},
          } = {},
        } = res
        setAuth(access_token)
        setUser(data)
        AsyncStorage.setItem(
          'user',
          JSON.stringify({ ...data, password, access_token }),
        )
        if (!isPushesAsked || isPushesEnabled) {
          trySignToPushes(true)
        }
        this.setState({ loading: false })
        setTimeout(() => {
          connectToSocket(access_token)
          setIsMyProfile(true)
          setPas('')
          navigate('Profile')
        }, 0)
      },
      failFunc: err => {
        const phone = err.length
          ? err.filter(e => e.param === 'phone_number')[0]
          : err.phone_number
        const pass = err.length
          ? err.filter(e => e.param === 'password')[0]
          : err.password
        setRegisterUserNumber(phone_number)
        if (phone) {
          this.setState({ invalidPhone: true })
        }
        if (pass) {
          this.setState({ invalidPassword: true })
        }
      },
    })
  }

  handleChangePassword = (e, type) => {
    const { password } = this.state
    this.setState({ [type]: e, invalidPassword: false })

    if (type === 'password') {
      this.setState({ password: e })
    } else if (type === 'confirmPassword') {
      if (password !== e) {
        this.setState({ invalidConfirmPassword: 'Пароли не совпадают' })
      } else {
        this.setState({ invalidConfirmPassword: false })
      }
    }
  }
}

const mapStateToProps = state => ({
  id: state.userReducer.id,
  pushesToken: state.pushesReducer.token,
  pas: state.userReducer.pas,
  register: state.userReducer.register,
})
const mapDispatchToProps = dispatch => ({
  setAuth: _ => dispatch(setAuth(_)),
  setUser: _ => dispatch(setUser(_)),
  setRegisterUserNumber: _ => dispatch(setRegisterUserNumber(_)),
  setIsMyProfile: _ => dispatch(setIsMyProfile(_)),
  setPas: _ => dispatch(setPas(_)),
  trySignToPushes: trySignToPushes(dispatch),
})
export default connect(mapStateToProps, mapDispatchToProps)(Content)
