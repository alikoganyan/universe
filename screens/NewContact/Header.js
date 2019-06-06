import React, { Component } from 'react'
import { View, Text, SafeAreaView, Image, Platform, ActionSheetIOS } from 'react-native'
import { BackIcon, AddIcon, SearchIcon } from '../../assets/index'
import styled from 'styled-components'
import helper from '../../utils/helpers'
import { connect } from 'react-redux'
import ImageComponent from '../../common/Image'
import DefaultAvatar from '../../common/DefaultAvatar'
const { HeaderHeight, sidePadding, Colors, fontSize } = helper;
const { grey3 } = Colors
const Header = styled(View)`
    width: 100%;
    background: white;
    height: ${HeaderHeight}; 
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding-right: ${sidePadding}px;
    padding-left: ${sidePadding}px;
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
    margin-left:${sidePadding}px;
`
const MarginRight = styled(View)`
margin-right: ${sidePadding}px;
`
const HeaderText = styled(Text)`
    font-size: ${fontSize.header};
    position: relative;
    left: -10px;
    color: ${grey3};
`
export default class HeaderComponent extends Component {
    render() {
        return (
            <Header>
                <Left>
                    <MarginRight>
                        <BackIcon onPress={this.props.back} />
                    </MarginRight>
                    <HeaderText>
                        Добавить Контакт
                    </HeaderText>
                </Left>
                <Right>
                </Right>
            </Header>
        )
    }
}