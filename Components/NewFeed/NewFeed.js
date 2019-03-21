import React, { Component } from 'react'
import { View, Text, Dimensions } from 'react-native'
import styled from 'styled-components'
import { SafeAreaView } from '../../Common/'
import { Header, Content } from './index'
import helper from '../../Helper/helper'

const { socket, HeaderHeight } = helper;
const Wrapper = styled(View)`
    height: 100%;
    padding-bottom: ${HeaderHeight};
`
export default class Signup extends Component {
    render() {
        return (
            <SafeAreaView behavior={'padding'}>
                <Wrapper>
                    <Header/>
                    <Content forward={this.moveForward}/>
                </Wrapper>
            </SafeAreaView>
        )
    }
    componentDidMount() {

    }
    moveForward = () => {
        this.props.navigation.navigate('Login')
    }
}
