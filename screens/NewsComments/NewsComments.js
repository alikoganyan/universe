import React, { Component } from 'react'
import { View, Text, Image, Platform } from 'react-native'
import { BackIcon } from '../../assets/index'
import styled from 'styled-components'
import { SafeAreaView } from '../../common'

import { Header, Content, Input } from './'
const Wrapper = styled(View)`
    height: 100%;
`

const Bottom = styled(View)`
    position: absolute;
    bottom: 0;
    width: 100%;
    background-color: transparent;
    
`
export default class NewsComments extends Component {
    render() {
        return (
            <SafeAreaView behavior={Platform.OS === 'ios' ? 'height' : 'padding'}>
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
}
