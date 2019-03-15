import React, { Component } from 'react'
import { View, Text, TouchableOpacity, TextInput, Platform } from 'react-native'
import helper from '../../Helper/helper'
import FloatingLabel from 'react-native-floating-labels'
import styled from 'styled-components'
const { Colors, fontSize } = helper;
const { border, lightColor, lightGrey1, color, blue } = Colors;
const { large, header, text } = fontSize;
const Wrapper = styled(View)`
    padding: 0 20%;
    padding-top: 50px;
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
    flex-direction: column;
`
const SingUp = styled(Text)`
    color: ${blue};
`
const PhoneNumber = styled(View)`
    display: flex;
    flex-direction: row;
    margin-top: 30px;
    margin-bottom: 30px;
    align-items: flex-end;
`
const Error = styled(Text)`
    color: red;
    font-size: 12px;
    width: 100%;
`
const ForgotPass = styled(Text)`
    font-size: 10px;
    margin-bottom: 10px;
    color: ${blue};
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
const StyledInput = styled(TextInput)`
    border: 1px solid ${lightGrey1};
    border-width: 0;
    border-bottom-width: 1px;
    padding-bottom: 10px;
    text-align: center;
    margin-bottom: 10px;
    ${({ style }) => style}
`
const Input = (props) => {
    const { children, password = false, value, style, editable, inputStyle, labelStyle } = props;
    return <FloatingLabel
        labelStyle={{
            fontSize: 15,
            ...labelStyle
        }}
        inputStyle={{
            fontSize: 15,
            borderColor: lightGrey1,
            borderWidth: 0,
            borderBottomWidth: 1,
            display: 'flex',
            ...inputStyle
        }}
        password={password}
        value={value}
        style={{ ...style }}
        editable={editable}
    >{children}</FloatingLabel>

}
export default class Content extends Component {
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
                    <Input style={{ width: '20%', }}
                        inputStyle={{ paddingLeft: 0, textAlign: 'center' }}
                        value='+7' />
                    <StyledInput password={true}
                        onChangeText={this.handleChangePhone}
                        value={this.state.phone}
                        placeholder={'XXX-XXX-XX-XX'}
                        style={{ margin: 0, width: '78%', flex: 1, textAlign: 'left', paddingLeft: 10 }}
                    />
                </PhoneNumber>
                <StyledInput password={true}
                    onChangeText={this.handleChangePassword}
                    value={this.state.password}
                    placeholder={'Пароль'}
                    secureTextEntry={true}
                />

                <ControlBar>
                    <TouchableOpacity>
                        <ForgotPass>
                            забыли пароль?
                        </ForgotPass>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={navigateToDialogs}>
                        <Button style={{ backgroundColor: blue }} color={'#fff'}>войти</Button>
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
            </Wrapper >
        )
    }
    state = {
        error: false,
        password: '',
        phone: '',
    }
    handleChangePassword = (e) => {
        this.setState({password: e})

    }
    handleChangePhone = (e) => {
        this.setState({phone: e})
    }
}
