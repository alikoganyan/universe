import React, { Component } from 'react'
import { Text, View, ImageBackground } from 'react-native'
import { Header, Content } from './index'
import styled from 'styled-components'
import { SafeAreaView } from '../../Common/'
import { fitstScreen } from '../../assets/images/'

const Wrapper = styled(View)`
`

export default class PinCode extends Component {
    render() {
        return (
            <SafeAreaView>
                <ImageBackground source={fitstScreen} style={{ width: '100%', height: '100%' }}>
                    <Wrapper>
                        <Content navigate={this.props.navigation.navigate} />
                    </Wrapper>
                </ImageBackground>
            </SafeAreaView>
        )
    }
}
