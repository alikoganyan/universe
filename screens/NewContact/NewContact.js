import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { Header, Content } from './index'
import styled from 'styled-components'
import { SafeAreaView } from '../../common'

const Wrapper = styled(View)`
`

export default class NewContact extends Component {
    render() {
        return (
            <SafeAreaView behavior={'height'}>
                <Wrapper>
                    <Header back={this.navigateBack} />
                    <Content navigateToDialogs={this.navigateToDialogs} />
                </Wrapper>
            </SafeAreaView>
        )
    }
    navigateToDialogs = () => this.props.navigation.navigate('Dialogs')
    navigateBack = () => {
        this.props.navigation.goBack()
    }
}
