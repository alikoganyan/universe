import React, { Component } from 'react'
import { View, Text, SafeAreaView, Image, Platform, ActionSheetIOS } from 'react-native'
import { BackIcon, BurgerIcon } from '../../assets/index'
import styled from 'styled-components'
import helper from '../../utils/helper'
const { HeaderHeight } = helper;
const Header = styled(View)`
    width: 100%;
    background: white;
    height: ${HeaderHeight}; 
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
`
const Left = styled(View)`
    display: flex;
    flex-direction: row;
    align-items: center;
`
const Right = styled(View)`
    display: flex;
    flex-direction: row;
    align-items: flex-end;
`
const Center = styled(View)`
`

export default class HeaderComponent extends Component {
    render() {
        return (
            <Header>
                <Center>
                    <Text>
                        Настройки
                    </Text>
                </Center>
                <Right style={{ position: "absolute", right: 0, }}>
                    <BurgerIcon />
                </Right>
            </Header>
        )
    }
}
