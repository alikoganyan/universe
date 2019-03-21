import React, { Component } from 'react'
import { View, Text, Image } from 'react-native'
import { BackIcon, EllipsisVIcon } from '../../assets/index'
import styled from 'styled-components'
import { SafeAreaView } from '../../Common/'
import {
    ActionSheetProvider,
    connectActionSheet,
} from '@expo/react-native-action-sheet';

import { Header, Content } from './'
const Wrapper = styled(View)`
    height: 100%;
`
const Bottom = styled(View)`
    position: absolute;
    bottom: 0;
    width: 100%;
    background: white;
    
`

export default class ContactGroups extends Component {
    render() {
        return (
            <ActionSheetProvider>
                <SafeAreaView>
                    <Wrapper>
                        <Header back={this.navigateBack} />
                        <Content />
                        <Bottom>
                        </Bottom>
                    </Wrapper>
                </SafeAreaView>
            </ActionSheetProvider>
        )
    }
    navigateBack = () => {
        this.props.navigation.goBack()
    }
}
