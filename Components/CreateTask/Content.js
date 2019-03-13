import React, { Component } from 'react'
import { View, Text, TouchableOpacity, TextInput, Platform } from 'react-native'

import FloatingLabel from 'react-native-floating-labels'
import styled from 'styled-components'
import helper from '../../Helper/helper'
const { Colors } = helper;
const { border, lightColor } = Colors;
const Wrapper = styled(View)`
    padding: 0 15%;
    justify-content: center;
    height: 100%;
    display: flex;
`
const InputBox = styled(View)`
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
    min-width: 100%;
`
const Label = styled(Text)`
    font-size: 11px;
`
const CreateTask = styled(TouchableOpacity)`
    position: absolute;
    border: 1px solid ${border};
    border-radius: 20;
    bottom: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    align-self: center;
    padding: 10px;
`
const CreateTaskText = styled(Text)`
    color: ${lightColor};
`

const Input = (props) => {
    const { children, password = false, value, style, editable, multiline = false } = props;
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
        multiline={multiline}
    >{children}</FloatingLabel>

}
export default class Content extends Component {
    state = {
        error: false,
    }
    render() {
        return (
            <Wrapper>
                <Input>Новая задача</Input>
                <Input multiline>Новая задача</Input>

                <InputBox>
                    <Label style={{ flex: 1 }}>Создана</Label>
                    <Input style={{ flex: 2 }} value={'25 января 2017'} />
                    <Input style={{ flex: 1 }} value={'11:11'} />
                </InputBox>
                <InputBox>
                    <Label style={{ flex: 1 }}>Дедлайн</Label>
                    <Input style={{ flex: 2 }} value={'26 января 2017'} />
                    <Input style={{ flex: 1 }} value={'11:11'} />
                </InputBox>

                <CreateTask>
                    <CreateTaskText>Создать задачу</CreateTaskText>
                </CreateTask>
            </Wrapper>
        )
    }
    handleChange = (e) => {}
}
