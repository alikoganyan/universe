import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { Header, Content } from './index'
import styled from 'styled-components'
import SafeAreaView from '../../common/SafeAreaView'

const Wrapper = styled(View)`
    height: 100%;
    justify-content: center;
    align-items: center;
`
export default class PinCode extends Component {
    render() {
        return (
            <SafeAreaView behavior={'padding'}>
                <Wrapper>
                    <Header />
                    <Content navigate={this.navigate} />
                </Wrapper>
            </SafeAreaView>
        )
    }
    navigate = (e) => this.props.navigation.navigate(e)
}
