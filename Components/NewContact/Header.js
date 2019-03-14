import React, { Component } from 'react'
import { View, Text, SafeAreaView, Image, Platform, ActionSheetIOS } from 'react-native'
import { BackIcon } from '../../assets/index'
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
const Right = styled(View)`
    display: flex;
    flex-direction: row;
    align-items: flex-end;
`
export default class HeaderComponent extends Component {
    render() {
        const { navigateBack } = this.props;
        return (
            <Header>
                <Left>
                    <BackIcon onPress={navigateBack} />
                    <Text>
                        Информация о группе
                    </Text>
                </Left>
                <Right>
                </Right>
            </Header>
        )
    }
}
