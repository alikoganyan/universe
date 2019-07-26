import React, { Component } from 'react'
import { View, Text, TextInput } from 'react-native'
import styled from 'styled-components'
import { connect } from 'react-redux'
import helper from '../../utils/helpers'
import Button from '../../common/Button'
import { setUser, setRegisterUserSms } from '../../actions/userActions'
import sendRequest from '../../utils/request'
import { p_register, p_get_sms } from '../../constants/api'

const { Colors, fontSize } = helper
const { lightGrey1, blue, pink } = Colors
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
const SubTitle = styled(Text)`
  width: 100%;
  color: ${lightGrey1};
  text-align: center;
  margin-bottom: 30px;
  font-size: ${fontSize.text};
`
const PhoneNumber = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  margin-bottom: 20px;
`

const StyledInput = styled(TextInput)`
  border: 1px solid ${lightGrey1};
  border-width: 0;
  border-bottom-width: 1px;
  padding-bottom: 10px;
  text-align: center;
  margin-bottom: 10px;
  ${({ style }) => style};
`
const Controls = styled(View)`
  align-self: center;
  justify-content: center;
  align-items: center;
`
const SendAgain = styled(Text)`
  text-align: center;
  font-size: ${fontSize.text};
  max-width: 90%;
`
const NoSMS = styled(SendAgain)`
  color: ${lightGrey1};
  margin-bottom: 10px;
`
class Content extends Component {
  render() {
    const { deadline, sms, err } = this.state

    return (
      <Wrapper>
        <Title>Регистрация</Title>
        <SubTitle>
          Вам выслано sms с временным паролем, введите его тут
        </SubTitle>
        <PhoneNumber>
          <StyledInput
            password
            onChangeText={this.handleSMS}
            placeholder="******"
            value={sms}
            style={{
              margin: 0,
              flex: 1,
              textAlign: 'center',
              paddingLeft: 10,
              borderBottomColor: !err ? lightGrey1 : pink,
            }}
            maxLength={6}
          />
        </PhoneNumber>
        <Controls>
          <NoSMS>Не получили sms?</NoSMS>
          {deadline ? (
            <SendAgain>
              Отправить sms повторно можно будет через 0:
              {deadline >= 10 ? deadline : `0${deadline}`}
            </SendAgain>
          ) : (
            <Button
              onPress={this.sendAgain}
              style={{ marginTop: 10 }}
              background={blue}
              color="white"
            >
              Отправить
            </Button>
          )}
        </Controls>
      </Wrapper>
    )
  }

  state = {
    sms: '',
    error: 0,
    deadline: 30,
    tries: 30,
    err: false,
  }

  componentDidMount() {
    const countdown = setInterval(() => {
      const { deadline } = this.state
      this.setState({ deadline: deadline - 1 })
      if (deadline === 0) clearInterval(countdown)
    }, 1000)
  }

  handleSMS = e => {
    const { error, tries, sms } = this.state
    const { forward, register } = this.props
    if (error <= tries) {
      this.setState({ sms: e }, () => {
        if (e.length === 6) {
          sendRequest({
            r_path: p_register,
            method: 'post',
            attr: {
              phone_number: register.phone,
              password: e,
            },
            success: res => {
              console.log({ res })
              forward()
            },
            failFunc: err => {
              console.log(err)
              const { phone_number } = err
              this.setState({
                err: true,
              })
            },
          })
        }
      })
    }
  }

  sendAgain = () => {
    const { register } = this.props
    const { phone } = register
    this.setState({ deadline: 30 }, () => {
      sendRequest({
        r_path: p_get_sms,
        method: 'post',
        attr: {
          phone_number: phone,
        },
        success: () => {
          // forward();
        },
        failFunc: err => {
          console.log(err)
          const { phone_number } = err
          this.setState({
            error: true,
          })
        },
      })
      const countdown = setInterval(() => {
        const { deadline } = this.state
        this.setState({ deadline: deadline - 1 })
        if (deadline === 0) clearInterval(countdown)
      }, 1000)
    })
  }
}
const mapStateToProps = state => ({
  id: state.userReducer.user._id,
  register: state.userReducer.register,
})
const mapDispatchToProps = dispatch => ({
  setUser: _ => dispatch(setUser(_)),
  setRegisterUserSms: _ => dispatch(setRegisterUserSms(_)),
})
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Content)
