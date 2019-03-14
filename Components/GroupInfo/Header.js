import React, { Component } from 'react'
import { View, Text, SafeAreaView, Image, Platform, ActionSheetIOS } from 'react-native'
import { BackIcon, EllipsisVIcon } from '../../assets/index'
import styled from 'styled-components'
import helper from '../../Helper/helper'
import {
    ActionSheetProvider,
    connectActionSheet,
} from '@expo/react-native-action-sheet';
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
@connectActionSheet
export default class HeaderComponent extends Component {
    render() {
        const { back } = this.props;
        return (
            <Header>
                <Left>
                    <BackIcon onPress={back} />
                    <Text>
                        Информация о группе
                    </Text>
                </Left>
                <Right>
                    <EllipsisVIcon onPress={this.openModal} />
                </Right>
            </Header>
        )
    }
    openModal = () => {
        const options = Platform.OS === 'ios' ?
            ['Отмена', 'Редактировать группу', 'Очистить историю'] :
            ['Редактировать группу', 'Очистить историю'];
        const cancelButtonIndex = 0;
        this.props.showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
            },
            buttonIndex => { },
        );
    }
}
