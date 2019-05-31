import React, { Component } from 'react'
import { View, Text, Image } from 'react-native'
import { BackIcon, EllipsisVIcon } from '../../assets/index'
import styled from 'styled-components'
import SafeAreaView from '../../common/SafeAreaView'
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
                        <Header toProfile={this.toProfile} back={this.navigateBack} />
                        <Content navigate={this.props.navigation.navigate}/>
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
    toProfile = () => {
        this.props.navigation.navigate('Profile')
    }
}
