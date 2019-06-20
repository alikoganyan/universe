import React, { Component } from 'react';
import { View, Text, SafeAreaView, Image, Dimensions, Platform, ActionSheetIOS } from 'react-native';
import { BackIcon, LocationIcon, EditIcon } from '../../assets/index';
import styled from 'styled-components';
import helper from '../../utils/helpers';
import { connect } from 'react-redux';
const { sidePadding, HeaderHeight } = helper;
const Header = styled(View)`
    width: ${Dimensions.get('window').width - sidePadding * 2}px;
    margin: 0;
    align-self: center;
    background: white;
    height: ${HeaderHeight}; 
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`;
const Left = styled(View)`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
`;
const Right = styled(View)`
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: flex-start;
`;
export default class HeaderComponent extends Component {
    render() {
        const { myProfile } = this.props;
        return (
            <Header>
                <Left>
                    <BackIcon onPress={this.props.back} />
                </Left>
                <Right>
                    {myProfile && <EditIcon onPress={this.editProfile} />}
                </Right>
            </Header>
        );
    }
    editProfile = () => {
        const { edit } = this.props;
        edit();

    }
}
