import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { Header, Content } from './index'
import styled from 'styled-components'
import { SafeAreaView } from '../../Common/'

const Wrapper = styled(View)``
export default class CreateTask extends Component {
    render() {
        return (
            <SafeAreaView>
                <Wrapper>
                    <Header back={this.navigateBack}/>
                    <Content />
                </Wrapper>
            </SafeAreaView>
        )
    }
    navigateBack = () => {
        this.props.navigation.goBack()
    }
}
