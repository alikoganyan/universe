import React, { Component } from 'react'
import { View, Text, SafeAreaView, Image, Platform } from 'react-native'
import { BackIcon, AddIcon, SearchIcon, BurgerIcon, EditIcon, FunnelIcon } from '../../assets/index'
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
    padding-right: ${sidePadding};
    padding-left: ${sidePadding};
`
const Left = styled(View)`
    display: flex;
    flex-direction: row;
    align-items: center;
`
const Center = styled(View)``
const Right = styled(Left)`
    justify-content: flex-end;
`
const UserImage = styled(Image)`
    background: red;
    width: 30px;
    height: 30px;
    border-radius: 15px;
    margin-left:${sidePaddingNumber};
`
const MarginRight = styled(View)`
    margin-right:${sidePaddingNumber};
`

export default class HeaderComponent extends Component {
    render() {
        const { back } = this.props
        return (
            <Header>
                <Left>
                    <MarginRight>
                        <BackIcon onPress={back} />
                    </MarginRight>
                    <Text>Новости</Text>
                </Left>
                <Right>
                    <SearchIcon />
                    {/* <AddIcon /> */}
                    <UserImage />
                </Right>
            </Header>
        )
    }
}
