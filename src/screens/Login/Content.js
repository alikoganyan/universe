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
} from 'react-native'
// import { Constants } from 'expo';
import RNDeviceInfo from 'react-native-device-info'
import PhoneInput from 'react-native-phone-input'
import helper from '../../utils/helpers'
import FloatingLabel from 'react-native-floating-labels'
import styled from 'styled-components'
import { connect } from 'react-redux'
import {
  setUser,
  setAuth,
  setRegisterUserNumber,
} from '../../actions/userActions'
import { trySignToPushes } from '../../actions/pushesActions'
import { p_login } from '../../constants/api'
import Button from '../../common/Button'
import sendRequest from '../../utils/request'
import { connectToSocket } from '../../utils/socket'
import * as ICONS from '../../assets/icons'
import CountryPicker from 'react-native-country-picker-modal'

const { Colors, fontSize } = helper
const { lightGrey1, blue, pink, black } = Colors
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
`
const ControlBar = styled(View)`
  display: flex;
  justify-content: center;
  width: 100%;
  align-items: center;
  align-self: center;
  flex-direction: column;
`

const PhoneNumber = styled(View)`
  display: flex;
  flex-direction: row;
  margin-top: 30px;
  margin-bottom: ${({ err }) => (err ? 10 : 35)};
  align-items: flex-end;
`
const ErrorText = styled(Text)`
  font-size: ${sl};
  margin-bottom: 10px;
  text-align: center;
`
const ForgotPass = styled(Text)`
  font-size: ${sl};
  margin-bottom: 15px;
  color: ${blue};
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
const StyledPhoneInput = styled(PhoneInput)`
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
// eslint-disable-next-line no-unused-vars
const Input = props => {
  const {
    keyboardType = 'default',
    onChangeText,
    children,
    password = false,
    value,
    style,
    editable,
    inputStyle,
    labelStyle,
  } = props
  return (
    <FloatingLabel
      labelStyle={{
        fontSize: 15,
        ...labelStyle,
      }}
      inputStyle={{
        fontSize: 15,
        paddingTop: 10,
        borderWidth: 0,
        borderBottomColor: lightGrey1,
        borderBottomWidth: 1,
        display: 'flex',
        ...inputStyle,
      }}
      keyboardType={keyboardType}
      password={password}
      value={value}
      style={{ ...style }}
      editable={editable}
      onChangeText={onChangeText}
    >
      {children}
    </FloatingLabel>
  )
}

class Content extends Component {
  render() {
    const { invalidPassword, invalidPhone, phone, password } = this.state
    const { navigateToDialogs } = this.props
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Wrapper onPress={Keyboard.dismiss}>
          <View>
            <Title>Авторизация</Title>
          </View>
          <PhoneNumber
            err={invalidPhone}
            style={{
              borderColor: invalidPhone ? pink : lightGrey1,
              borderBottomWidth: 1,
              alignItems: 'center',
            }}
          >
            <StyledPhoneInput
              password
              onChangePhoneNumber={this.handleChangePhone}
              allowZeroAfterCountryCode={false}
              initialCountry="ru"
              value={phone}
              placeholder="XXX-XXX-XX-XX"
              keyboardType="phone-pad"
              onSelectCountry={this.onSelectCountry}
              onPressFlag={this.onPressFlag}
              ref={ref => (this.inputRef = ref)}
              style={{
                margin: 0,
                width: '20%',
                textAlign: 'left',
                paddingLeft: 10,
                borderColor: '#ffffff',
              }}
            />
            <TextInput
              style={{
                margin: 0,
                width: '80%',
                flex: 1,
                textAlign: 'left',
                position: 'absolute',
                right: 0,
                top: 0,
                height: 22,
                padding: 0,
                color: invalidPhone ? pink : black,
              }}
              maxLength={15}
              value={phone}
              keyboardType="numeric"
              onChangeText={this.validatePhoneInput}
            />
            <CountryPicker
              hideAlphabetFilter
              showCallingCode
              ref={ref => {
                this.countryPicker = ref
              }}
              onChange={value => this.selectCountry(value)}
              translation="rus"
              cca2={this.state.cca2}
            >
              <View />
            </CountryPicker>
          </PhoneNumber>
          <ControlBar>
            <TouchableOpacity onPress={this.signup}>
              {invalidPhone && (
                <ErrorText>
                  Номера нет в системе.
                  <ForgotPass>Зарегистрироваться</ForgotPass>
                </ErrorText>
              )}
            </TouchableOpacity>
          </ControlBar>
          <View>
            <ShowHidePassword onPress={this.hideShowPassword}>
              <Image
                style={{ width: 20, height: 20 }}
                resizeMode="contain"
                source={this.state.hidePassword ? ICONS.ShowEye : ICONS.HideEye}
              />
            </ShowHidePassword>
            <StyledInput
              password
              maxLength={12}
              onChangeText={this.handleChangePassword}
              value={password}
              placeholder="Пароль"
              secureTextEntry={this.state.hidePassword}
              style={{
                color: invalidPassword ? pink : black,
                borderColor: invalidPassword ? pink : lightGrey1,
              }}
            />
          </View>
          <ControlBar>
            <TouchableOpacity onPress={this.restorePass}>
              {invalidPassword ? (
                <ErrorText>
                  Неверный пароль. <ForgotPass>Восстановить пароль?</ForgotPass>
                </ErrorText>
              ) : (
                <ForgotPass>Забыли пароль?</ForgotPass>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={navigateToDialogs}>
              <Button onPress={this.login} background={blue} color="#fff">
                войти
              </Button>
            </TouchableOpacity>
          </ControlBar>
        </Wrapper>
      </TouchableWithoutFeedback>
    )
  }

  state = {
    country: '+7',
    phone: '+7',
    password: '',
    invalidPassword: false,
    invalidPhone: false,
    hidePassword: true,
    cca2: '+7',
  }
  inputRef = null

  componentDidMount() {
    this.onPressFlag = this.onPressFlag.bind(this)
    this.selectCountry = this.selectCountry.bind(this)
    this.setState({
      pickerData: this.inputRef.getPickerData(),
    })
  }

  onPressFlag() {
    this.countryPicker.openModal()
  }

  selectCountry(country) {
    this.inputRef.selectCountry(country.cca2.toLowerCase())
  }

  validatePhoneInput = e => {
    if (e.length > 0 && /^[0-9]*$/.test(e.substring(1).toString())) {
      this.handleChangePhone(e)
    }
  }

  onSelectCountry = country => {
    this.setState({
      phone: `+${this.inputRef.getCountryCode(country)}`,
    })
  }

  hideShowPassword = () => {
    const { hidePassword } = this.state
    let togglePassword = hidePassword
    togglePassword = !togglePassword
    this.setState({ hidePassword: togglePassword })
  }

  storeUserData = user => {
    AsyncStorage.setItem('user', JSON.stringify(user))
  }

  login = () => {
    const { setRegisterUserNumber, pushesToken } = this.props
    const { phone: phone_number, password } = this.state
    if (!this.inputRef.isValidNumber()) this.setState({ invalidPhone: true })

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
        const { setAuth, setUser, navigate, trySignToPushes } = this.props
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
          const pushOptions = {
            all_users: true,
            news: true,
            tasks: true,
          }
          trySignToPushes(true, pushOptions)
        }
        this.setState({ loading: false })
        setTimeout(() => {
          connectToSocket(access_token)
          navigate('Dialogs')
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

  signup = () => {
    const { navigate } = this.props
    navigate('Signup')
  }

  restorePass = () => {
    const { navigate } = this.props
    navigate('Restore')
  }

  handleChangePassword = e => {
    this.setState({ password: e, invalidPassword: false })
  }

  handleChangePhone = e => {
    this.setState({ phone: e, invalidPhone: false })
  }
}

const mapStateToProps = state => ({
  id: state.userReducer.id,
  pushesToken: state.pushesReducer.token,
})
const mapDispatchToProps = dispatch => ({
  setAuth: _ => dispatch(setAuth(_)),
  setUser: _ => dispatch(setUser(_)),
  setRegisterUserNumber: _ => dispatch(setRegisterUserNumber(_)),
  trySignToPushes: trySignToPushes(dispatch),
})
export default connect(mapStateToProps, mapDispatchToProps)(Content)
