import React, { Component } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import { Header, Content } from './index'
import styled from 'styled-components'
import SafeAreaView from '../../common/SafeAreaView'
import helper from '../../utils/helpers'
const { Colors, fontSize } = helper;
const { lightColor, blue } = Colors;
const Wrapper = styled(View)`
    height: 100%;
`
const NoAccount = styled(View)`
    display: flex;
    justify-content: center;
    align-items: center;
    /* position: absolute; */
    bottom: 10;
    width: 100%;
    align-self: center;
`
const Label = styled(Text)`
    color: ${lightColor};
    font-size: ${fontSize.text};
`
const SingUp = styled(Text)`
    color: ${blue};
`
export default class PinCode extends Component {
    render() {
        return (
            <SafeAreaView behavior={'padding'}>
                <Wrapper>
                    <Content navigate={this.navigate} />
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
                </Wrapper>
            </SafeAreaView>
        )
    }
    navigate = (e) => this.props.navigation.navigate(e)
    signup = (e) => this.navigate('Signup')
}
