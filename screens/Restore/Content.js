import React, { Component } from 'react'
import { View, Text, TouchableOpacity, TextInput, Platform } from 'react-native'

import FloatingLabel from 'react-native-floating-labels'
import styled from 'styled-components'
const Wrapper = styled(View)`
    padding: 0 20%;
    padding-top: 50px;
`
const Title = styled(Text)`
    width: 100%;
    font-size: 15px;
`
const ControlBar = styled(View)`
    display: flex;
    justify-content: flex-end;
    width: 100%;
    align-items: center;
    flex-direction: row;
`
const Restore = styled(Text)`
    text-align: center;
    margin-top: 50px;
    color: #002343;
    text-transform: uppercase;
`
const PhoneNumber = styled(View)`
    display: flex;
    flex-direction: row;
    margin-top: 30px;

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
            <Wrapper>
                <Title>
                    Восстановить пароль
                </Title>
                <PhoneNumber>
                    <Input style={{ width: '25%' }} value='+7' editable={false}>Телефон</Input>
                    <Input style={{ width: '75%' }}></Input>
                </PhoneNumber>
                <ControlBar>
                    <TouchableOpacity>
                        <Restore>
                            Восстановить
                        </Restore>
                    </TouchableOpacity>
                </ControlBar>
            </Wrapper>
        )
    }
    state = {
        error: false,
    }
    handleChange = (e) => {}

}
