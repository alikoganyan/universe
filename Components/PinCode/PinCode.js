import React, { Component } from 'react'
import { Text, View, ImageBackground, Dimensions } from 'react-native'
import { Header, Content } from './index'
import styled from 'styled-components'
import { SafeAreaView } from '../../Common/'
import { fitstScreen } from '../../assets/images/'

const Wrapper = styled(View)``
export default class PinCode extends Component {
    render() {
        return (
            <SafeAreaView>
                <Wrapper>
                    <ImageBackground source={fitstScreen} style={{ height: Dimensions.get('window').height }}>
                        <Content toDialogs={this.toDialogs} />
                    </ImageBackground>
                </Wrapper>
            </SafeAreaView>
        )
    }
    toDialogs = () => {
        this.props.navigation.navigate('Dialogs')
    }
}
