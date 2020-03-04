import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  TextInput,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native'
import styled from 'styled-components'
import { connect } from 'react-redux'
import PhoneInput from 'react-native-phone-input'
import CountryPicker from 'react-native-country-picker-modal'
import helper from '../../utils/helpers'
import {
  setUser,
  setRegisterUserNumber,
  alterUser,
} from '../../actions/userActions'
import sendRequest from '../../utils/request'
import {
  p_change_phone_number,
  p_get_pin_for_change_phone,
} from '../../constants/api'
import Button from '../../common/Button'
import * as ICONS from '../../assets/icons'

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
  margin-bottom: ${Platform.OS === 'ios' ? 18 : 13}px;
  align-items: flex-end;
`
const ErrorText = styled(Text)`
  font-size: ${sl};
  margin-bottom: 10px;
  text-align: center;
`

const StyledInput = styled(TextInput)`
  border: 1px solid ${lightGrey1};
  border-width: 0;
  border-bottom-width: 1px;
  padding-bottom: ${Platform.OS === 'ios' ? 18 : 13}px;
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

class Content extends Component {
  render() {
    const {
      invalidPassword,
      invalidPhone,
      phone,
      password,
      pin,
      invalidPin,
      success,
      errorMessage,
    } = this.state
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Wrapper onPress={Keyboard.dismiss}>
          <View>
            <Title>Изменить номер телефона</Title>
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
            {!!invalidPhone && <ErrorText>{invalidPhone}</ErrorText>}
          </ControlBar>
          {success && (
            <>
              <View>
                <StyledInput
                  maxLength={6}
                  onChangeText={this.handleChangePin}
                  value={pin}
                  placeholder="Пин код"
                  style={{
                    color: invalidPassword ? pink : black,
                    borderColor: invalidPassword ? pink : lightGrey1,
                  }}
                />
              </View>
              <ControlBar>
                {!!invalidPin && <ErrorText>{invalidPin}</ErrorText>}
              </ControlBar>
              <View>
                <ShowHidePassword onPress={this.hideShowPassword}>
                  <Image
                    style={{ width: 20, height: 20 }}
                    resizeMode="contain"
                    source={
                      this.state.hidePassword ? ICONS.ShowEye : ICONS.HideEye
                    }
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
            </>
          )}
          <ControlBar>
            {!!(invalidPassword && success) && (
              <ErrorText>{invalidPassword}</ErrorText>
            )}
            <Button
              onPress={!success ? this.getPinCode : this.changePhone}
              background={blue}
              color="#fff"
            >
              {!success ? 'Продолжить' : 'Сохранить'}
            </Button>
            {!!errorMessage && <ErrorText>{errorMessage}</ErrorText>}
          </ControlBar>
        </Wrapper>
      </TouchableWithoutFeedback>
    )
  }

  state = {
    country: '+7',
    phone: '+7',
    invalidPhone: '',
    error: false,
    cca2: '+7',
    password: '',
    hidePassword: true,
    invalidPassword: false,
    pin: '',
    invalidPin: false,
    success: false,
    errorMessage: false,
  }
  inputRef = null

  componentDidMount() {
    const {
      user: { phone_number },
    } = this.props
    this.setState({ phone: phone_number })
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

  onSelectCountry = country => {
    this.setState({
      phone: `+${this.inputRef.getCountryCode(country)}`,
    })
  }

  validatePhoneInput = e => {
    if (e.length > 0 && /^[0-9]*$/.test(e.substring(1).toString())) {
      this.handlePhone(e)
    }
  }

  getPinCode = () => {
    const { user } = this.props
    const { phone: new_phone_number, invalidPhone } = this.state

    if (new_phone_number === user.phone_number) {
      this.setState({ invalidPhone: 'Вы не изменили номер телефона' })
      return
    }
    if (!this.inputRef.isValidNumber() || invalidPhone) {
      this.setState({ invalidPhone: 'Вы ввели неверный номер телефона' })
      return
    }

    sendRequest({
      r_path: p_get_pin_for_change_phone,
      method: 'post',
      attr: {
        new_phone_number,
      },
      success: res => {
        this.setState({ success: true })
      },
      failFunc: err => {
        this.setState({ invalidPhone: err.msg })
      },
    })
  }

  changePhone = () => {
    const { phone: new_phone_number, pin: pin_code, password } = this.state
    const { user } = this.props

    if (!pin_code || !password) {
      this.setState({ errorMessage: 'Все поля должны быть заполнены' })
      return
    }
    sendRequest({
      r_path: p_change_phone_number,
      method: 'patch',
      attr: {
        new_phone_number,
        pin_code,
        password,
      },
      success: res => {
        this.props.alterUser({
          email: user.email,
          first_name: user.first_name,
          middle_name: user.middle_name,
          last_name: user.last_name,
          phone_number: new_phone_number,
        })
        this.props.goBack()
      },
      failFunc: err => {
        this.setState({ errorMessage: err.msg })
      },
    })
  }

  handlePhone = e => {
    this.setState({ phone: e, invalidPhone: false })
  }

  hideShowPassword = () => {
    const { hidePassword } = this.state
    let togglePassword = hidePassword
    togglePassword = !togglePassword
    this.setState({ hidePassword: togglePassword })
  }

  handleChangePin = e => {
    this.setState({ pin: e, invalidPin: false, errorMessage: false })
  }

  handleChangePassword = e => {
    this.setState({ password: e, invalidPassword: false, errorMessage: false })
  }
}

const mapStateToProps = state => ({
  id: state.userReducer.id,
  user: state.userReducer.user,
})
const mapDispatchToProps = dispatch => ({
  setUser: _ => dispatch(setUser(_)),
  setRegisterUserNumber: _ => dispatch(setRegisterUserNumber(_)),
  alterUser: _ => dispatch(alterUser(_)),
})
export default connect(mapStateToProps, mapDispatchToProps)(Content)
