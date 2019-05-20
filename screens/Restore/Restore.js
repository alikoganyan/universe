import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { Header, Content } from './index'
import styled from 'styled-components'
import { SafeAreaView } from '../../common'

const Wrapper = styled(View)`
    height: 100%;
    align-items: center;
`
export default class PinCode extends Component {
    render() {
        return (
            <SafeAreaView behavior={'padding'}>
                <Wrapper>
                    <Header back={this.props.navigation.goBack}/>
                    <Content navigate={this.navigate} />
                </Wrapper>
            </SafeAreaView>
        )
    }
    navigate = (e) => this.props.navigation.navigate(e)

}
