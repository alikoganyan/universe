import React, { Component } from 'react'
import { View, Text, SafeAreaView, Image, Platform, TouchableOpacity } from 'react-native'
import { BackIcon, LocationIcon, SearchIcon } from '../../assets/index'
import styled from 'styled-components'
import helper from '../../Helper/helper'
const { sidePadding, HeaderHeight, sidePaddingNumber } = helper;
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
const MarginLeft = styled(View)`
    margin-left:${sidePaddingNumber};
`
export default class HeaderComponent extends Component {
    render() {
        const { back } = this.props
        return (
            <Header>
                <Left>
                    <MarginLeft>
                        <BackIcon onPress={back} />
                    </MarginLeft>
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
