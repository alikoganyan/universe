import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { Header, Content } from './index'
import styled from 'styled-components'
import { SafeAreaView } from '../../common'

const Wrapper = styled(View)``
export default class PinCode extends Component {
    render() {
        return (
            <SafeAreaView>
                <Wrapper>
                    <Header />
                    <Content />
                </Wrapper>
            </SafeAreaView>
        )
    }
}
