import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity, TextInput, Platform } from 'react-native'
import helper from '../../utils/helpers'
import Button from '../../common/Button'
import styled from 'styled-components'
import { IntroIcon } from '../../assets/index'

const { Colors, fontSize } = helper;
const { border, blue, grey1, lightGrey1, lightGrey2 } = Colors;
const { xs, xl, large, text } = fontSize
const Wrapper = styled(View)`
    padding-top: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
`
const FirstTime = styled(View)`
    background: #fff;
    width: 80%;
    height: 70%;
    padding: 40px 40px;
    border-radius: 10px;
    margin-bottom: 20px;
    align-items: center;
    justify-content: space-between;
`
const Header = styled(Text)`
    font-size: ${xs};
`
const Icon = styled(Image)`
    background: red;
    height: 100px;
    width: 100px;
    margin-bottom: 30px;
    border-radius: 50;
`
const FirstTimeText = styled(Text)`
    text-align: center;
    color: ${grey1};
`
const Dots = styled(View)`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 20px;
`
const Dot = styled(View)`
    width: 10px;
    height: 10px;
    background: ${({ active }) => active ? '#fff' : lightGrey1};
    border-radius: 5;
    margin-right: ${({ last }) => !last ? '20px' : 0};
`
const HaveAccount = styled(View)`
    display: flex;
    align-items: center;
    justify-content: space-between;
`
const LogIn = styled(Text)`
    color: #fff;
    font-size: ${xs};
`
const Label = styled(Text)`
    color: ${lightGrey2};
    margin-bottom: 5px;
    font-size: ${text};
`
export default class Content extends Component {
    render() {
        return (
            <Wrapper>
                <FirstTime>
                    <Header>
                        Первый раз?
                    </Header>
                    <IntroIcon size={150} />
                    <FirstTimeText>
                        Pariatur consectetur Lorem est irure et in ullamco. Proident pariatur labore aliquip fugiat ullamco sunt non. Laborum mollit velit amet
                    </FirstTimeText>
                    <Button onPress={this.goSignup} background={blue} color={'#fff'}>Зарегистрируйтесь</Button>
                </FirstTime>
                <Dots>
                    <Dot active />
                    <Dot />
                    <Dot />
                    <Dot last />
                </Dots>
                <HaveAccount>
                    <Label>есть аккаунт?</Label>
                    <TouchableOpacity onPress={this.goLogin}>
                        <LogIn>войти</LogIn>
                    </TouchableOpacity>
                </HaveAccount>
            </Wrapper>
        )
    }
    handleChange = (e) => { }
    goLogin = () => {
        const { navigate } = this.props;
        navigate('Login')
    }
    goSignup = () => {
        const { navigate } = this.props;
        navigate('Signup')
    }
}
