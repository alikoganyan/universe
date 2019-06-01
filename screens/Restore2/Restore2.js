import React, { Component } from 'react'
import { Text, View } from 'react-native'
import Header from './Header'
import Content from './Content'
import styled from 'styled-components'
import SafeAreaView from '../../common/SafeAreaView'

const Wrapper = styled(View)`
    height: 100%;
    justify-content: space-between;
    align-items: center;
`
export default class PinCode extends Component {
    render() {
        return (
            <SafeAreaView behavior={'padding'}>
                <Wrapper>
                    <Header back={this.back}/>
                    <Content navigate={this.navigate} />
                </Wrapper>
            </SafeAreaView>
        )
    }
    navigate = (e) => this.props.navigation.navigate(e)
    back = (e) => this.props.navigation.goBack()
}
