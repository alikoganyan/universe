import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Dimensions, Platform, TextInput } from 'react-native'
import helper from '../../utils/helpers'
import FloatingLabel from 'react-native-floating-labels'
import styled from 'styled-components'
import { connect } from 'react-redux'
import {
    p_get_restore_password,
    p_check_restore_password,
    p_restore_password,
} from '../../constants/api'
import sendRequest from '../../utils/request'
const { Colors, HeaderHeight } = helper;
const { blue, grey1, lightGrey1, pink } = Colors;
const Wrapper = styled(View)`
    flex: 1;
    padding: 0 20%;
    padding-bottom: 10%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    
`
const Title = styled(Text)`
    width: 100%;
    font-size: 18px;
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
    flex-direction: row;
    margin-bottom: 30px;
`
const Label = styled(Title)`
    font-size: 13px;
    color: ${grey1};
    margin-bottom: 0px;
`
const NoCode = styled(View)`
    display: flex;
    justify-content: center;
`
const NoCodeLabel = styled(Text)`
    font-size: 11px;
    color: ${grey1};
    text-align: center;
`
const NoCodeLabelLink = styled(NoCodeLabel)`
    color: ${blue};
`
const NoCodeTimer = styled(Text)`
    font-size: 11px;
    text-align: center;
`
const StyledInput = styled(TextInput)`
    border-width: 0;
    border-bottom-width: 1;
    border-bottom-color: ${lightGrey1};
    display: flex;
    text-align: center;
    padding-left: 0;
    width: 100%;
    padding-bottom: 10px;
`
const Input = (props) => {
    const { autoFocus = false, keyboardType = 'number-pad', children, password = false, value, style, editable, onChangeText, inputStyle, maxLength } = props;
    return <FloatingLabel
        labelStyle={{ fontSize: 11 }}
        inputStyle={{
            fontSize: 11,
            borderWidth: 0,
            borderBottomWidth: 1,
            borderBottomColor: lightGrey1,
            display: 'flex',
            textAlign: 'center',
            paddingLeft: 0,
            ...inputStyle
        }}
        keyboardType={keyboardType}
        password={password}
        value={value}
        style={{
            ...style
        }}
        editable={editable}
        onChangeText={onChangeText}
        maxLength={maxLength}
        autoFocus={autoFocus}
    >{children}</FloatingLabel>

}
class Content extends Component {
    render() {
        const { code, error, deadline } = this.state;
        return (
            <Wrapper>
                <Title>
                    Восстановление пароля
                </Title>
                <Label>Вам отправлено sms с временным паролем, {'\n'}введите его тут</Label>
                <PhoneNumber>
                    <StyledInput
                        autoFocus={true}
                        style={{ color: error ? pink : 'black', borderBottomColor: error ? pink : lightGrey1 }}
                        value={code}
                        maxLength={6}
                        onChangeText={this.handleChangeCode}
                        keyboardType={'phone-pad'} />
                </PhoneNumber>
                <ControlBar>
                    {(this.state.code.length === 6 && !error) ? <Button onPress={this.proceed} style={{ backgroundColor: blue }} color={'#fff'}>Отправить</Button> :
                        <NoCode>
                            {error &&
                                <TouchableOpacity onPress={this.sendAgain}><NoCodeLabel>Неверный пароль, <NoCodeLabelLink>отправить sms повторно?</NoCodeLabelLink></NoCodeLabel></TouchableOpacity>}
                            {(deadline > 0 && !error) && <NoCodeTimer>Отправить sms повторно можно будет через 0:{deadline >= 10 ? deadline : `0${deadline}`}</NoCodeTimer>}
                            {(deadline === 0 && !error) && <TouchableOpacity onPress={this.sendAgain}><NoCodeLabelLink>Отправить sms повторно</NoCodeLabelLink></TouchableOpacity>}
                        </NoCode>}
                </ControlBar>
            </Wrapper>
        )
    }
    state = {
        error: false,
        code: '',
        answer: '4444',
        deadline: 2,
    }
    componentDidMount() {
        const { register } = this.props;
        const { sms } = register;
        this.setState({ answer: sms })
        const countdown = setInterval(() => {
            this.setState({ deadline: this.state.deadline - 1 })
            if (this.state.deadline === 0)
                clearInterval(countdown)
        }, 1000)

    }
    handleChangeCode = e => {
        this.setState({ code: e, error: false });
    }
    proceed = e => {
        const { code, answer } = this.state;

        if (this.state.code.length === 4) {
            this.checkCode();
        } else {
            this.setState({ error: true })
        }
    }
    checkCode = e => {
        const { navigate, register } = this.props;
        const { code } = this.state;
        const phone_number = register.phone;
        sendRequest({
            r_path: p_check_restore_password,
            method: 'post',
            attr: {
                phone_number,
                password: code,
            },
            success: (res) => {
                navigate('Restore3');
            },
            failFunc: (err) => {
                console.log(err);
                this.setState({ error: true })
            }
        })
    }
    sendAgain = e => {
        const { register } = this.props;
        const { phone } = register;
        this.setState({ deadline: 30 }, () => {
            // sendRequest({
            //     r_path: p_get_restore_password,
            //     method: 'post',
            //     attr: {
            //         phone_number: phone,
            //     },
            //     success: (res) => {
            //         console.log(res)
            //     },
            //     failFunc: (err) => {
            //         console.log(err)
            //     }
            // })
            const countdown = setInterval(() => {
                this.setState({ deadline: this.state.deadline - 1 })
                if (this.state.deadline === 0)
                    clearInterval(countdown)
            }, 1000)
        })
    }
}
const mapStateToProps = state => ({
    register: state.userReducer.register,
})
const mapDispatchToProps = dispatch => ({
})
export default connect(mapStateToProps, mapDispatchToProps)(Content)
