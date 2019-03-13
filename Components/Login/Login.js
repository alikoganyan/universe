import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { Header, Content } from './index'
import styled from 'styled-components'
import { SafeAreaView } from '../../Common/'

const Wrapper = styled(View)``

export default class PinCode extends Component {
    render() {
        return (
            <SafeAreaView>
                <Wrapper>
                    <Header />
                    <Content navigateToDialogs={this.navigateToDialogs}/>
                </Wrapper>
            </SafeAreaView>
        )
    }
    navigateToDialogs = () => this.props.navigation.navigate('Dialogs')
}
