import React, { Component } from 'react'
import { View, Text, TouchableOpacity, TextInput, Platform } from 'react-native'
import styled from 'styled-components'
import { connect } from 'react-redux'
import helper from '../../utils/helpers'
import { p_get_restore_password } from '../../constants/api'
import { setRegisterUserNumber } from '../../actions/userActions'
import sendRequest from '../../utils/request'
import Button from '../../common/Button'
import PhoneInput from 'react-native-phone-input'
import CountryPicker from 'react-native-country-picker-modal'

const { Colors, fontSize } = helper
const { blue, lightGrey1, pink, black } = Colors
const Wrapper = styled(View)`
  padding: 0 20%;
  justify-content: center;
  flex-grow: 1;
`
const Title = styled(Text)`
  width: 100%;
  margin-bottom: 30px;
  font-size: ${fontSize.large};
  text-align: center;
`

const PhoneNumber = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
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
const ControlBar = styled(View)`
  display: flex;
  justify-content: center;
  min-width: 250px;
  align-items: center;
  margin-top: 20px;
`

const Error = styled(Text)`
  font-size: ${fontSize.sm};
`

const ErrorText = styled(Text)`
  font-size: ${fontSize.sm};
  text-align: center;
`
const ErrorTextLink = styled(ErrorText)`
  color: ${blue};
`

class Content extends Component {
  render() {
    const { phone, error } = this.state
    return (
      <Wrapper>
        <Title>Восстановление пароля</Title>
        <PhoneNumber
          style={{
            borderColor: error ? pink : lightGrey1,
            borderBottomWidth: 1,
            alignItems: 'center',
          }}
        >
          <StyledPhoneInput
            password
            onChangeText={this.handlePhone}
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
              color: error ? pink : black,
            }}
            maxLength={15}
            value={phone}
            onChangeText={this.validatePhoneInput}
            keyboardType="numeric"
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
        {error ? <View>{error}</View> : null}
        <ControlBar>
          <Button
            onPress={this.proceed}
            style={{ width: '100%' }}
            background={blue}
            color="#fff"
          >
            Восстановить пароль
          </Button>
        </ControlBar>
      </Wrapper>
    )
  }

  state = {
    error: false,
    country: '+7',
    phone: '+7',
    cca2: '+7',
  }

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

  handlePhone = e => {
    this.setState({ phone: e, error: false })
  }

  proceed = () => {
    this.getRestorePassword()
  }

  getRestorePassword = () => {
    const { phone } = this.state
    const { navigate, setRegisterUserNumber } = this.props
    if (!phone) {
      this.setState({ error: <Error>Введите телефон</Error> })
    }
    if (phone && phone.length < 9) {
      this.setState({
        error: <Error>Проверьте правильность введенного номера</Error>,
      })
    }
    phone &&
      phone.length >= 9 &&
      sendRequest({
        r_path: p_get_restore_password,
        method: 'post',
        attr: {
          phone_number: phone,
        },
        success: () => {
          setRegisterUserNumber(phone)
          setTimeout(() => navigate('Restore2'), 0)
        },
        failFunc: err => {
          this.setState({
            error: err.msg ? (
              <ErrorText>{err.msg}</ErrorText>
            ) : (
              <TouchableOpacity onPress={this.signup}>
                <ErrorText>
                  Телефона нет в системе.
                  <ErrorTextLink>Зарегистрируйтесь</ErrorTextLink>
                </ErrorText>
              </TouchableOpacity>
            ),
          })
        },
      })
  }

  signup = () => {
    const { navigate } = this.props
    navigate('Signup')
  }
}
const mapStateToProps = state => ({
  id: state.userReducer.id,
  register: state.userReducer.register,
})
const mapDispatchToProps = dispatch => ({
  setRegisterUserNumber: _ => dispatch(setRegisterUserNumber(_)),
})
export default connect(mapStateToProps, mapDispatchToProps)(Content)
