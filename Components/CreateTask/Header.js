import React, { Component } from 'react'
import { View, Text, SafeAreaView, Image, Platform, TouchableOpacity } from 'react-native'
import { ForwardIcon, LocationIcon, CloseIcon } from '../../assets/index'
import styled from 'styled-components'
import helper from '../../Helper/helper'
const { HeaderHeight } = helper;
const Header = styled(View)`
    width: 100%;
    background: white;
    position: absolute;
    height: ${HeaderHeight}; 
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    z-index: 10;
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

export default class HeaderComponent extends Component {
    moveForward = () => {
        this.props.back()
    }
    render() {
        return (
            <Header>
                <CloseIcon />
            </Header>
        )
    }
}
