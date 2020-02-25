import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native'
import FloatingLabel from 'react-native-floating-labels'
import styled from 'styled-components'
import { connect } from 'react-redux'
import helper from '../../utils/helpers'
import { p_restore_password, p_login } from '../../constants/api'
import Button from '../../common/Button'
import sendRequest from '../../utils/request'
import { connectToSocket } from '../../utils/socket'
import {
  setUser,
  setAuth,
  setRegisterUserNumber,
} from '../../actions/userActions'
import * as ICONS from '../../assets/icons'
import { BarPasswordStrengthDisplay } from 'react-native-password-strength-meter'
import { passwordLevel } from '../../helper/validation'

const { Colors, fontSize, minPassLength } = helper
const { blue, red } = Colors
const Wrapper = styled(View)`
  padding: 0 20%;
  padding-bottom: 10%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
const Title = styled(Text)`
  width: 100%;
  font-size: 15px;
  text-align: center;
  margin-bottom: 20px;
`
const ControlBar = styled(View)`
  display: flex;
  justify-content: center;
  width: 100%;
  align-items: center;
`
const PhoneNumber = styled(View)`
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
`
const Error = styled(Text)`
  color: ${red};
  font-size: ${fontSize.sm};
  align-self: center;
`
const ShowHidePassword = styled(TouchableOpacity)`
  position: absolute;
  right: 10px;
  top: 20px;
  z-index: 20;
  width: 30px;
  height: 30px
  display: flex;
  justify-content: center;
  align-items: center;
`

const Input = props => {
  const {
    autoFocus = false,
    keyboardType = 'default',
    children,
    password = false,
    hidePassword,
    value,
    style,
    editable,
    onChangeText,
  } = props
  return (
    <FloatingLabel
      labelStyle={{ fontSize: 11 }}
      inputStyle={{
        fontSize: 11,
        borderWidth: 0,
        borderBottomWidth: 1,
        display: 'flex',
        paddingLeft: 0,
      }}
      keyboardType={keyboardType}
      password={password && hidePassword}
      value={value}
      style={{
        ...style,
      }}
      editable={editable}
      onChangeText={onChangeText}
      autoFocus={autoFocus}
    >
      {children}
    </FloatingLabel>
  )
}
class Content extends Component {
  render() {
    const { pass, repass } = this.props
    const { err } = this.state
    return (
      <Wrapper>
        <Title>Восстановить пароль</Title>
        <PhoneNumber>
          <View>
            <ShowHidePassword onPress={() => this.hideShowPassword('password')}>
              <Image
                style={{ width: 20, height: 20 }}
                resizeMode="contain"
                source={this.state.password ? ICONS.ShowEye : ICONS.HideEye}
              />
            </ShowHidePassword>
            <Input
              autoFocus
              style={{ minWidth: '100%' }}
              value={pass}
              onChangeText={this.handleChangePass}
              password
              hidePassword={this.state.password}
            >
              Новый пароль
            </Input>
            <BarPasswordStrengthDisplay
              password={this.state.pass}
              scoreLimit={100}
              levels={passwordLevel}
              width={Math.round(Dimensions.get('window').width) / 2 + 22}
              wrapperStyle={{ display: 'flex', alignItems: 'flex-end' }}
            />
          </View>

          {err.type === 'length' || err.type === 'nopass' ? (
            <Error>{err.msg}</Error>
          ) : null}
          <View>
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
            <Input
              style={{ minWidth: '100%' }}
              value={repass}
              onChangeText={this.handleChangeRepass}
              password
              hidePassword={this.state.confirmPassword}
            >
              Повторите пароль
            </Input>
          </View>
          {err.type === 'repass' ? <Error>{err.msg}</Error> : <Error />}
        </PhoneNumber>
        <ControlBar>
          <Button onPress={this.proceed} background={blue} color="#fff">
            Сохранить и войти
          </Button>
        </ControlBar>
      </Wrapper>
    )
  }

  state = {
    pass: '',
    repass: '',
    err: {},
    password: true,
    confirmPassword: true,
  }

  componentDidMount() {
    // const { register } = this.props;
  }

  hideShowPassword = type => {
    const { password, confirmPassword } = this.state
    let togglePassword = type === 'password' ? password : confirmPassword
    togglePassword = !togglePassword
    this.setState({ [type]: togglePassword })
  }

  handleChangePass = e => {
    this.setState({ pass: e })
  }

  handleChangeRepass = e => {
    this.setState({ repass: e })
  }

  proceed = () => {
    const { pass, repass } = this.state
    if (pass === repass && pass.length >= minPassLength) {
      this.checkCode()
    } else {
      const errLength = {
        type: pass.length ? 'length' : 'nopass',
        msg: pass.length
          ? `пароль должен содержать не меньше ${minPassLength} символов`
          : 'введите пароль',
      }
      const errRepass = {
        type: 'repass',
        msg: 'пароли не совпадают',
      }
      const err = pass.length < minPassLength ? errLength : errRepass
      this.setState({ err })
    }
  }

  checkCode = () => {
    const { register } = this.props
    const { pass, repass } = this.state
    const { phone, sms } = register
    sendRequest({
      r_path: p_restore_password,
      method: 'post',
      attr: {
        phone_number: phone,
        new_password: pass,
        repeat_password: repass,
        one_time_password: sms,
      },
      success: () => {
        this.login()
      },
      failFunc: err => {},
    })
  }

  login = () => {
    const { setAuth, setUser, navigate } = this.props
    const { pass } = this.state
    sendRequest({
      r_path: p_login,
      method: 'post',
      attr: {
        phone_number: '+79194274215',
        password: '1111',
      },
      success: res => {
        const { access_token, data } = res
        setAuth(access_token)
        setUser(data)
        this.storeUserData({
          ...data,
          password: pass,
          access_token,
          lastLogin: new Date(),
        })
        setTimeout(() => {
          connectToSocket(access_token)
          navigate('Dialogs')
        }, 0)
      },
      failFunc: err => {
        navigate('Login')
        // const phone = err.length ? err.filter(e => e.param === 'phone_number')[0] : err.phone_number;
        // const pass = err.length ? err.filter(e => e.param === 'password')[0] : err.password;
      },
    })
  }
}
const mapStateToProps = state => ({
  register: state.userReducer.register,
})
const mapDispatchToProps = dispatch => ({
  setAuth: _ => dispatch(setAuth(_)),
  setUser: _ => dispatch(setUser(_)),
  setRegisterUserNumber: _ => dispatch(setRegisterUserNumber(_)),
})
export default connect(mapStateToProps, mapDispatchToProps)(Content)
