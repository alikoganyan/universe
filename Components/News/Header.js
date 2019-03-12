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
    justify-content: center;
`
const HeaderUserImage = styled(Image)`
    border-radius: 15;
    height: 30px;
    width: 30px;
    margin-right: 10px;
`
const Info = styled(View)`
    display: flex;
`
const InfoChatName = styled(Text)`
    color: black;
    font-size: 12px;
`
const InfoParticipants = styled(Text)`
    color: #5F7991;
    font-size: 10px;
`
const Left = styled(View)`
    display: flex;
    flex-direction: row;
    align-items: center;
`
const Right = styled(View)`
    display: flex;
    flex-direction: row;
    align-items: center;
    position: absolute;
    right: 0;

`
const Center = styled(View)`

`
const IconsBox = styled(View)`
`
export default class HeaderComponent extends Component {
    render() {
        return (
            <Header>
                <Center>
                    <Text>Новости</Text>
                </Center>
                <Right>
                    <EditIcon />
                    <FunnelIcon />
                    <BurgerIcon />
                </Right>
            </Header>
        )
    }
}
