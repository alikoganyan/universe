import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { Header, Content } from './index'
import styled from 'styled-components'
import { SafeAreaView } from '../../Common/'
import helper from '../../Helper/helper'
const { socket } = helper;
const Wrapper = styled(View)``
export default class PinCode extends Component {
    render() {
        return (
            <SafeAreaView>
                <Wrapper>
                    <Header />
                    <Content navigate={this.navigate} />
                </Wrapper>
            </SafeAreaView>
        )
    }
    navigate = (e) => this.props.navigation.navigate(e)
}
