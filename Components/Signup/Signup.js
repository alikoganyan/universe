import React, { Component } from 'react'
import { View, Text, Platform } from 'react-native'
import styled from 'styled-components'
import { SafeAreaView } from '../../Common/'
import { Header, Content } from './index'
import helper from '../../Helper/helper'

const { socket } = helper;
const Wrapper = styled(View)``
export default class Signup extends Component {
    render() {
        return (
            <SafeAreaView>
                <Wrapper>
                    <Header forward={this.moveForward} />
                    <Content />
                </Wrapper>
            </SafeAreaView>
        )
    }
    componentDidMount() {
        socket.emit('new user', { "phone": '9912391234455' })
        socket.on('reply', (e) => console.log(e))
    }
    moveForward = () => {
        this.props.navigation.navigate('Dialogs')
    }
}
