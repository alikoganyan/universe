import React, { Component } from 'react'
import { View, Text, SafeAreaView, Image, Platform, ActionSheetIOS } from 'react-native'
import { BackIcon, AddIcon, SearchIcon } from '../../assets/index'
import styled from 'styled-components'
import helper from '../../Helper/helper'
import { ImageComponent } from '../../Common/'
const { HeaderHeight, sidePadding, sidePaddingNumber } = helper;
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
const Right = styled(View)`
    display: flex;
    flex-direction: row;
    align-items: center;
`
const Center = styled(View)`
`
const UserImage = styled(Image)`
    width: 30px;
    height: 30px;
    border-radius: 15px;
    background: red;
    margin-left:${sidePaddingNumber};
`
const MarginRight = styled(View)`
margin-right: ${sidePaddingNumber};
`

export default class HeaderComponent extends Component {
    render() {
        return (
            <Header>
                <Left>
                    <MarginRight>
                        <BackIcon onPress={this.props.back}/>
                    </MarginRight>
                    <Text>
                        Контакты
                    </Text>
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
