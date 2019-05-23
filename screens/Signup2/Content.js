import React, { Component } from 'react'
import { View, Text, TextInput, Dimensions } from 'react-native'
import styled from 'styled-components'
import helper from '../../utils/helpers'
import { connect } from 'react-redux'
import { Button } from '../../common'
import { setUser, setRegisterUserSms } from '../../actions/userActions'
import sendRequest from '../../utils/request'
import { p_register, p_get_sms } from '../../constants/api'
const { Colors, fontSize, HeaderHeight } = helper;
const { lightGrey1, blue, pink } = Colors;
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
`
const SendAgainButton = styled(Button)`
    background: green;
`
class Content extends Component {
    render() {
        const { deadline, sms, err } = this.state

        return (
            <Wrapper>
                <Title>
                    Регистрация
                </Title>
                <SubTitle>
                    Вам выслано sms с временным паролем, введите его тут
                </SubTitle>
                <PhoneNumber>
                    <StyledInput password={true}
                        onChangeText={this.handleSMS}
                        placeholder={'******'}
                        value={sms}
                        style={{ margin: 0, flex: 1, textAlign: 'center', paddingLeft: 10, borderBottomColor: !err ? lightGrey1 : pink }}
                        maxLength={6}
                    />
                </PhoneNumber>
                <Controls>
                    <NoSMS>Не получили sms?</NoSMS>
                    {deadline ?
                        <SendAgain>Отправить sms повторно можно будет через {deadline}</SendAgain> :

                        <Button
                            onPress={this.sendAgain}
                            style={{ background: blue, marginTop: 10 }}
                            color={'white'}>Отправить</Button>
                    }
                </Controls>
            </Wrapper>
        )
    }
    state = {
        sms: '',
        error: 0,
        deadline: 1,
        tries: 30,
        err: false,
    }
    componentDidMount() {
        const countdown = setInterval(() => {
            this.setState({ deadline: this.state.deadline - 1 })
            if (this.state.deadline === 0)
                clearInterval(countdown)
        }, 1000)

    }
    handleSMS = (e) => {
        const { sms, error, tries } = this.state;
        const { forward, register } = this.props
        if (error <= tries) {
            this.setState({ sms: e }, () => {
                if (this.state.sms.length === 6) {
                    sendRequest({
                        r_path: p_register,
                        method: 'post',
                        attr: {
                            phone_number: register.phone,
                            password: this.state.sms
                        },
                        success: (res) => {
                            console.log({ res })
                            forward();
                        },
                        failFunc: (err) => {
                            console.log(err)
                            let { phone_number } = err
                            this.setState({
                                invalidPhone: phone_number || null,
                                err: true,
                            })
                        }
                    })
                }
            })
        }

    }
    sendAgain = () => {
        const { register } = this.props;
        const { phone } = register;
        this.setState({ deadline: 30 }, () => {
            sendRequest({
                r_path: p_get_sms,
                method: 'post',
                attr: {
                    phone_number: phone,
                },
                success: (res) => {
                    forward();
                },
                failFunc: (err) => {
                    console.log(err)
                    let { phone_number } = err
                    this.setState({
                        invalidPhone: phone_number || null,
                        error: true
                    })
                }
            })
            const countdown = setInterval(() => {
                this.setState({ deadline: this.state.deadline - 1 })
                if (this.state.deadline === 0)
                    clearInterval(countdown)
            }, 1000)
        })
    }
}
const mapStateToProps = state => ({
    id: state.userReducer.user._id,
    register: state.userReducer.register
})
const mapDispatchToProps = dispatch => ({
    setUser: _ => dispatch(setUser(_)),
    setRegisterUserSms: _ => dispatch(setRegisterUserSms(_)),
})
export default connect(mapStateToProps, mapDispatchToProps)(Content)