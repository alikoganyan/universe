import React, { Component } from 'react'
import { View, Text, Platform } from 'react-native'
import styled from 'styled-components'
import { SafeAreaView } from '../../Common/'
import { Header, Content } from './index'

const Wrapper = styled(View)``
export default class NewPost extends Component {
    render() {
        return (
            <SafeAreaView>
                <Wrapper>
                    <Header back={this.moveForward} />
                    <Content />
                </Wrapper>
            </SafeAreaView>
        )
    }
    moveForward = () => {
        this.props.navigation.navigate('Group')
    }
}
