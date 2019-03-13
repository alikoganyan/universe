import React, { Component } from 'react'
import { View, Text, SafeAreaView, Image, Platform } from 'react-native'
import { BackIcon, LocationIcon, SearchIcon, BurgerIcon, EditIcon, FunnelIcon } from '../../assets/index'
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
const Center = styled(View)``
const Right = styled(Left)``
const UserIcon = styled(Image)`
    background: red;
    width: 30px;
    height: 30px;
    border-radius: 15px;
    margin-right: ${sidePadding};
`

export default class HeaderComponent extends Component {
    render() {
        return (
            <Header>
                <Left>
                    <BackIcon />
                    <Text>Новости</Text>
                </Left>
                <Right>
                    <SearchIcon />
                    <UserIcon />
                </Right>
            </Header>
        )
    }
}
