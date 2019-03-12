import React, { Component } from 'react'
import { View, Text, TouchableOpacity, TextInput, Platform } from 'react-native'
import helper from '../../Helper/helper'
import FloatingLabel from 'react-native-floating-labels'
import styled from 'styled-components'
const { Colors } = helper;
const { border, lightColor, color } = Colors;

const Wrapper = styled(View)`
    padding: 0 20%;
    padding-top: 50px;
    height: 90%;
`
const Title = styled(Text)`
    width: 100%;
    font-size: 15px;
`
const ControlBar = styled(View)`
    display: flex;
    justify-content: center;
    width: 100%;
    align-items: center;
    flex-direction: column;
`
const LogIn = styled(Text)`
    text-align: center;
    margin-top: 50px;
    color: ${lightColor};
    text-transform: uppercase;
    padding: 10px 20px;
    border-radius: 20px;
    border: 1px solid ${border};
    font-size: 10px;
`
const SingUp = styled(Text)`
    color: ${color};
`
const PhoneNumber = styled(View)`
    display: flex;
    flex-direction: row;
    margin-top: 30px;

`
const Error = styled(Text)`
    color: red;
    font-size: 12px;
    width: 100%;
`
const ForgotPass = styled(Text)`
    font-size: 10px;
`
const NoAccount = styled(View)`
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    bottom: 0;
    width: 100%;
    align-self: center;
`
const Label = styled(Text)`
    color: ${lightColor};
    font-size: 10px;
`
const InputLabel = styled(Text)`
    position: absolute;
    font-size: 11;

`
const Input = (props) => {
    const { children, password = false, value, style, editable } = props;
    return <FloatingLabel
        labelStyle={{ fontSize: 11 }}
        inputStyle={{
            fontSize: 11,
            borderWidth: 0,
            borderBottomWidth: 1,
            display: 'flex',
        }}
        password={password}
        value={value}
        style={{ ...style }}
        editable={editable}
    >{children}</FloatingLabel>

}
export default class Content extends Component {
    state = {
        error: false,
    }
    handleChange = (e) => {
    }

    render() {
        const { error } = this.state;
        const { navigateToDialogs } = this.props;
        return (
            <Wrapper>
                <Title>
                    Авторизация
                </Title>
                {error && <Error>
                    Номер телефона задан некорректно
                </Error>}
                <PhoneNumber>
                    <InputLabel>Телефон</InputLabel>
                    <Input style={{ width: '25%' }} value='+7' />
                    <Input style={{ width: '75%' }}></Input>
                </PhoneNumber>
                <Input password={true} onChangeText={this.handleChange} value={this.state.pin} />

                <ControlBar>
                    <TouchableOpacity>
                        <ForgotPass>
                            забыли пароль?
                        </ForgotPass>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={navigateToDialogs}>
                        <LogIn>
                            войти
                        </LogIn>
                    </TouchableOpacity>
                </ControlBar>
                <NoAccount>
                    <Label>
                        Нет аккаунта?
                    </Label>
                    <TouchableOpacity>
                        <SingUp>
                            Зарегистрироваться
                        </SingUp>
                    </TouchableOpacity>
                </NoAccount>
            </Wrapper>
        )
    }
}
