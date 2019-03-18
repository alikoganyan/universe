import React, { Component } from 'react'
import { View, Text, SafeAreaView, Image, Platform, TouchableOpacity } from 'react-native'
import { BackIcon, LocationIcon, SearchIcon } from '../../assets/index'
import styled from 'styled-components'
import helper from '../../Helper/helper'
const { sidePadding, HeaderHeight } = helper;
const Header = styled(View)`
    width: 100%;
    background: white;
    height: ${HeaderHeight}; 
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
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

export default class HeaderComponent extends Component {
    render() {
        const { back } = this.props
        return (
            <Header>
                <Left>
                    <BackIcon onPress={back} />
                </Left>
                <Right onPress={this.moveForward}>
                </Right>
            </Header>
        )
    }
    moveForward = () => {
        this.props.forward()
    }
}
