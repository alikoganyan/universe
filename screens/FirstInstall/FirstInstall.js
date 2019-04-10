import React, { Component } from 'react'
import { Text, View, ImageBackground, Dimensions } from 'react-native'
import { Header, Content } from './index'
import styled from 'styled-components'
import { SafeAreaView } from '../../common'
import { fitstScreen } from '../../assets/images/'
const Wrapper = styled(View)`
    height: 100%;
    margin-bottom: 200px;
`

export default class PinCode extends Component {
    render() {
        return (
            <SafeAreaView>
                <ImageBackground source={fitstScreen} style={{
                    height: Dimensions.get('window').height

                }}>
                    <Wrapper>
                        <Content navigate={this.props.navigation.navigate} />
                    </Wrapper>
                </ImageBackground>
            </SafeAreaView>
        )
    }
}
