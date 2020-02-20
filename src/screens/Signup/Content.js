import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Platform, TextInput } from 'react-native'
import FloatingLabel from 'react-native-floating-labels'
import styled from 'styled-components'
import { connect } from 'react-redux'
import PhoneInput from 'react-native-phone-input'
import CountryPicker from 'react-native-country-picker-modal'
import helper from '../../utils/helpers'
import { setUser, setRegisterUserNumber } from '../../actions/userActions'
import sendRequest from '../../utils/request'
import { p_get_sms } from '../../constants/api'
import Button from '../../common/Button'
const { Colors, fontSize } = helper
const { lightGrey1, blue, pink, black } = Colors
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
// const SubTitle = styled(Text)`
//   width: 100%;
//   color: ${lightGrey1};
//   text-align: center;
//   font-size: ${fontSize.text};
// `
const PhoneNumber = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
`

const ButtonBox = styled(View)`
  width: 170px;
  align-self: center;
  margin-top: 20px;
`
const ErrorText = styled(Text)`
  font-size: ${fontSize.sm};
  text-align: center;
`
const ErrorTextLink = styled(ErrorText)`
  color: ${blue};
  padding-top: 10px;
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
// eslint-disable-next-line no-unused-vars
const Input = props => {
  const {
    children,
    password = false,
    value,
    style,
    editable,
    inputStyle,
    labelStyle,
    keyboardType,
    ...rest
  } = props
  return (
    <FloatingLabel
      labelStyle={{ fontSize: 15, ...labelStyle }}
      inputStyle={{
        fontSize: 15,
        borderWidth: 0,
        borderBottomWidth: 1,
        display: 'flex',
        borderColor: lightGrey1,
        ...inputStyle,
      }}
      password={password}
      value={value}
      keyboardType={keyboardType}
      style={{ ...style }}
      editable={editable}
      {...rest}
    >
      {children}
    </FloatingLabel>
  )
}
class Content extends Component {
  render() {
    const { phone, error } = this.state
    return (
      <Wrapper>
        <Title>Регистрация</Title>
        {/*<SubTitle>Телефон</SubTitle>*/}
        <PhoneNumber
          style={{
            borderColor: error ? pink : lightGrey1,
            borderBottomWidth: 1,
            alignItems: 'center',
          }}
        >
          <StyledPhoneInput
            password
            onChangePhoneNumber={this.handlePhone}
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
            keyboardType="phone-pad"
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
        <ButtonBox>
          <Button onPress={this.proceed} background={blue} color="white">
            Продолжить
          </Button>
        </ButtonBox>
      </Wrapper>
    )
  }

  state = {
    country: '+7',
    phone: '+7',
    error: false,
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
  onSelectCountry = country => {
    this.setState({
      phone: `+${this.inputRef.getCountryCode(country)}`,
    })
  }

  validatePhoneInput = e => {
    if (e.length > 0) {
      this.handlePhone(e)
    }
  }

  proceed = () => {
    const { phone: phone_number } = this.state
    const { setRegisterUserNumber, forward } = this.props
    if (!phone_number) {
      this.setState({ error: <ErrorText>Введите телефон</ErrorText> })
    }
    if (!this.inputRef.isValidNumber()) {
      this.setState({
        error: <ErrorText>Проверьте правильность введенного номера</ErrorText>,
      })
    }
    if (phone_number && this.inputRef.isValidNumber()) {
      setRegisterUserNumber(phone_number)
      sendRequest({
        r_path: p_get_sms,
        method: 'post',
        attr: {
          phone_number,
        },
        success: () => {
          forward()
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
  }

  login = () => {
    const { navigate } = this.props
    navigate('Login')
  }

  handlePhone = e => {
    this.setState({ phone: e, error: false })
  }
}
const mapStateToProps = state => ({
  id: state.userReducer.id,
})
const mapDispatchToProps = dispatch => ({
  setUser: _ => dispatch(setUser(_)),
  setRegisterUserNumber: _ => dispatch(setRegisterUserNumber(_)),
})
export default connect(mapStateToProps, mapDispatchToProps)(Content)
