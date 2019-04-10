import React, { Component } from 'react'
import { View, Text, TouchableOpacity, TextInput, Platform } from 'react-native'
import helper from '../../utils/helpers'
import FloatingLabel from 'react-native-floating-labels'
import styled from 'styled-components'
import { Button } from '../../common'
const { Colors } = helper;
const { green, lightGrey1, black, color } = Colors;

const Wrapper = styled(View)`
    padding: 0 10% 10%;
    display: flex;
    justify-content: center;
    height: 90%;
`
const PhoneNumber = styled(View)`
    display: flex;
    flex-direction: row;
    margin-top: 30px;
    align-items: center;
    justify-content: space-between;

`
const InputLabel = styled(Text)`
    margin-right: 10px;
    padding-bottom: 10px;
    font-size: 11px; 
    text-align: right;
    color: ${black};
`
const Input = styled(TextInput)`
    border: 1px solid ${lightGrey1};
    border-width: 0;
    border-bottom-width: 1px;
    margin-right: 10px;
    padding-bottom: 10px;
`
const ButtonBox = styled(View)`
    position: absolute;
    bottom: 10px;
    align-self: center;
    
`
export default class Content extends Component {
    render() {
        const { error } = this.state;
        const { navigateToDialogs } = this.props;
        return (
            <Wrapper>
                <PhoneNumber>
                    <InputLabel style={{ flex: 4 }}>Телефон</InputLabel>
                    <Input style={{ flex: 1, textAlign: 'center' }} placeholder={'+7'} />
                    <Input style={{ flex: 6 }} placeholder={'test'} value={'(919) 427-42-15'}/>
                </PhoneNumber>
                <PhoneNumber>
                    <InputLabel style={{ flex: 4 }}>Фамилия</InputLabel>
                    <Input style={{ flex: 7 }} placeholder={'test'} />
                </PhoneNumber>
                <PhoneNumber>
                    <InputLabel style={{ flex: 4 }}>Имя</InputLabel>
                    <Input style={{ flex: 7 }} placeholder={'test'} />
                </PhoneNumber>
                <PhoneNumber>
                    <InputLabel style={{ flex: 4 }}>Отчество</InputLabel>
                    <Input style={{ flex: 7 }} placeholder={'test'} />
                </PhoneNumber>
                <PhoneNumber>
                    <InputLabel style={{ flex: 4 }}>Должность</InputLabel>
                    <Input style={{ flex: 7 }} placeholder={'test'} />
                </PhoneNumber>
                <PhoneNumber>
                    <InputLabel style={{ flex: 4 }}>Email</InputLabel>
                    <Input style={{ flex: 7 }} placeholder={'test'} />
                </PhoneNumber>
                
                <ButtonBox>
                    <Button style={{background: green}} color={'white'}>Добавить контакт</Button>
                </ButtonBox>
                

            </Wrapper>
        )
    }
    state = {
        error: false,
    }
    handleChange = (e) => { }
}
