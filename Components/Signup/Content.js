import React, { Component } from 'react'
import { View, Text, KeyboardAvoidingView, Platform } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import FloatingLabel from 'react-native-floating-labels'
import styled from 'styled-components'
const Wrapper = styled(View)`
    padding: 0 20%;
    padding-top: 50px;
`
const Title = styled(Text)`
    width: 100%;
    margin-bottom: 30px;
    font-size: 15px;
`
const SubTitle = styled(Text)`
    width: 100%;
    color: #A3A3A3;
`
const PhoneNumber = styled(View)`
    display: flex;
    flex-direction: row;

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
    render() {
        return (
            <KeyboardAwareScrollView enableOnAndroid behavior='padding'>
                <Wrapper>
                    <Title>
                        Регистрация
                    </Title>
                    <SubTitle>
                        Введите учетные данные, чтобы активировать устройство:
                    </SubTitle>
                    <Input>Фамилия</Input>
                    <Input>Имя</Input>
                    <Input>Отчество</Input>
                    <Input>E-mail</Input>
                    <PhoneNumber>
                        <Input style={{ width: '25%' }} value='+7' editable={false}>Телефон</Input>
                        <Input style={{ width: '75%' }}></Input>
                    </PhoneNumber>
                    <Input password={true}>Пароль пользователя</Input>
                </Wrapper>
            </KeyboardAwareScrollView>
        )
    }
}
