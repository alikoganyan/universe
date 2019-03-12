import React, { Component } from 'react'
import { View, Text, Image } from 'react-native'
import { BackIcon } from '../../assets/index'
import styled from 'styled-components'
import { SafeAreaView } from '../../Common/'

import { Header, Content, Input } from './'
const Wrapper = styled(View)`
    height: 100%;
`

export default class News extends Component {
    navigateBack = () => {
        this.props.navigation.goBack()
    }
    render() {
        return (
            <SafeAreaView>
                <Wrapper>
                    <Header back={this.navigateBack}/>
                    <Content/>
                </Wrapper>
            </SafeAreaView>
        )
    }
}
