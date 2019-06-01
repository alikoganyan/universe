import React, { Component } from 'react'
import { View, Text, SafeAreaView, Image, Platform, TouchableOpacity } from 'react-native'
import { BackIcon } from '../../assets/index'
import styled from 'styled-components'
import helper from '../../utils/helpers'
const { sidePadding, HeaderHeight } = helper;
const Header = styled(View)`
    width: 100%;
    background: white;
    height: ${HeaderHeight}; 
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0 ${sidePadding}px;
`
const Left = styled(View)`
    display: flex;
    flex-direction: row;
    align-items: center;
`
const Right = styled(TouchableOpacity)`
    display: flex;
    flex-direction: row;
    align-items: center;
`
const MarginLeft = styled(View)`
    margin-left:${sidePadding}px;
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
