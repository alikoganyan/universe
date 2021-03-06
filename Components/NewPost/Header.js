import React, { Component } from 'react'
import { View, Text, SafeAreaView, Image, Platform, TouchableOpacity } from 'react-native'
import { BackIcon, ForwardIcon, LocationIcon, SearchIcon } from '../../assets/index'
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
const Right = styled(TouchableOpacity)`
    display: flex;
    flex-direction: row;
    align-items: center;
`
const GroupImage = styled(Image)`
    background: red;
    width: 40px;
    height: 40px;
    border-radius: 20;
    margin-right: 10px;
`
export default class HeaderComponent extends Component {
    moveForward = () => {
        this.props.back()
    }
    render() {
        return (
            <Header>
                <Left>
                    <BackIcon />
                    <GroupImage />
                    <Text>Написать новость</Text>
                </Left>
            </Header>
        )
    }
}
