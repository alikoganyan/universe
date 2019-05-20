import React, { Component } from 'react'
import { View, Text, SafeAreaView, Image, Platform, TouchableOpacity } from 'react-native'
import { BackIcon } from '../../assets/index'
import styled from 'styled-components'
import helper from '../../utils/helpers'
const { sidePadding, HeaderHeight, sidePaddingNumber } = helper;
const Header = styled(View)`
    width: 100%;
    background: white;
    padding: 0 ${sidePadding};
    height: ${HeaderHeight}; 
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`

export default class HeaderComponent extends Component {
    render() {
        const { back } = this.props
        return (
            <Header>
                <BackIcon onPress={back} />
            </Header>
        )
    }
}
