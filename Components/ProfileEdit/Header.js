import React, { Component } from 'react'
import { View, Text, SafeAreaView, Image, Dimensions, Platform, ActionSheetIOS } from 'react-native'
import { BackIcon, LocationIcon, EditIcon } from '../../assets/index'
import styled from 'styled-components'
import helper from '../../utils/helpers'
import { connect } from 'react-redux'
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
    justify-content: flex-start;
`
const Right = styled(View)`
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: flex-start;
`
const MarginRight = styled(View)`
    margin-right: ${sidePaddingNumber};
`
export default class HeaderComponent extends Component {
    render() {
        const { myProfile } = this.props;
        return (
            <Header>
                <Left>
                    <MarginRight>
                        <BackIcon onPress={this.props.back} />
                    </MarginRight>
                    <Text>Изменить профиль</Text>
                </Left>
            </Header>
        )
    }
    editProfile = () => {
    }
}