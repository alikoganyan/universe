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
    margin-bottom: 30px;
    font-size: 15px;
    text-align: center;
`
const LogIn = styled(Text)`
    font-size: 20;
    text-align: center;
    width: 100%;
    margin-top: 50px;
`

const Input = styled(TextInput)`
    border: 1px solid black;
    border-width: 0;
    border-bottom-width: 1px;
    padding: 10px;
    text-align: center;
`
export default class Content extends Component {
    render() {
        return (
            <Wrapper>
                <Title>
                    Введите PIN для доступа на данном устройстве
                    </Title>
                <Input secureTextEntry={true} onChangeText={this.handleChange} value={this.state.pin} />
                <TouchableOpacity>
                    <LogIn>
                        Войти
                    </LogIn>
                </TouchableOpacity>
            </Wrapper>
        )
    }
    state = {
        pin: '',
    }
    handleChange = (e) => {
        e.length <= 4 && this.setState({
            pin: e
        })
    }
}
