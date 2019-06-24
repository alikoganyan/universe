import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import styled from 'styled-components';
import {
  ActionSheetProvider,
  connectActionSheet,
} from '@expo/react-native-action-sheet';
import { BackIcon, EllipsisVIcon } from '../../assets/index';
import SafeAreaView from '../../common/SafeAreaView';

import Header from './Header';
import Content from './Content';

const Wrapper = styled(View)`
    height: 100%;
`;
const Bottom = styled(View)`
    position: absolute;
    bottom: 0;
    width: 100%;
    background: white;
    
`;

export default class ContactGroups extends Component {
  render() {
    return (
      <ActionSheetProvider>
        <SafeAreaView>
          <Wrapper>
            <Header toProfile={this.toProfile} back={this.navigateBack} />
            <Content navigate={this.props.navigation.navigate} />
            <Bottom />
          </Wrapper>
        </SafeAreaView>
      </ActionSheetProvider>
    );
  }

    navigateBack = () => {
      this.props.navigation.goBack();
    }

    toProfile = () => {
      this.props.navigation.navigate('Profile');
    }
}
