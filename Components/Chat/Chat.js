import React, { Component } from 'react'
import { View, Text, Image, KeyboardAvoidingView } from 'react-native'
import { BackIcon } from '../../assets/index'
import styled from 'styled-components'
import { SafeAreaView } from '../../Common/'
import helper from '../../Helper/helper';
import { Header, Content, Input } from './'
const Wrapper = styled(View)`
    height: 100%;
`
const Bottom = styled(View)`
    position: absolute;
    bottom: 0;
    width: 100%;
    background: white;
`

export default class Chat extends Component {
    render() {
        return (
            <SafeAreaView behavior={'height'}>
                <Wrapper>
                    <Header back={this.navigateBack} />
                    <Content />
                    <Bottom>
                        <Input />
                    </Bottom>
                </Wrapper>
            </SafeAreaView>
        )
    }
    navigateBack = () => {
        this.props.navigation.goBack()
    }
    componentDidMount() { }
}
