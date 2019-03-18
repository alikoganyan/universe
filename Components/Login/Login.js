import React, { Component } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import { Header, Content } from './index'
import styled from 'styled-components'
import { SafeAreaView } from '../../Common/'
import helper from '../../Helper/helper'
const { socket, Colors } = helper;
const { lightColor, blue } = Colors;
const Wrapper = styled(View)`
    height: 100%;
`
const NoAccount = styled(View)`
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    bottom: 10px;
    width: 100%;
    align-self: center;
`
const Label = styled(Text)`
    color: ${lightColor};
    font-size: 10px;
`
const SingUp = styled(Text)`
    color: ${blue};
`
export default class PinCode extends Component {
    render() {
        return (
            <>
                <SafeAreaView behavior={'padding'}>
                    <Wrapper>
                        <Content navigate={this.navigate} />
                    </Wrapper>
                </SafeAreaView>
                <NoAccount>
                    <Label>
                        Нет аккаунта?
                    </Label>
                    <TouchableOpacity onPress={this.signup}>
                        <SingUp>
                            Зарегистрироваться
                        </SingUp>
                    </TouchableOpacity>
                </NoAccount>
            </>
        )
    }
    navigate = (e) => this.props.navigation.navigate(e)
    signup = (e) => this.navigate('Signup') 
}
