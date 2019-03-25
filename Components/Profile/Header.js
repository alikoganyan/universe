import React, { Component } from 'react'
import { View, Text, SafeAreaView, Image, Dimensions, Platform, ActionSheetIOS } from 'react-native'
import { BackIcon, LocationIcon } from '../../assets/index'
import styled from 'styled-components'
import helper from '../../Helper/helper'
const { sidePadding, HeaderHeight, sidePaddingNumber } = helper;
const Header = styled(View)`
    width: ${Dimensions.get('window').width - sidePaddingNumber*2}px;
    margin: ${sidePadding} 0;
    align-self: center;
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
    justify-content: flex-start;
`
const Right = styled(View)`
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: flex-start;
`
export default class HeaderComponent extends Component {
    render() {
        return (
            <Header>
                <Left>
                    <BackIcon />
                </Left>
                <Right>
                    <LocationIcon />
                </Right>
            </Header>
        )
    }
}
