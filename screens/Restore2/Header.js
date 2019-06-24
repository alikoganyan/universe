import React, { Component } from 'react';
import { View } from 'react-native';
import styled from 'styled-components';
import { BackIcon } from '../../assets/index';
import helper from '../../utils/helpers';

const { sidePadding, HeaderHeight } = helper;

const Header = styled(View)`
    width: 100%;
    background: white;
    height: ${HeaderHeight}; 
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding-left: ${sidePadding};
`;
export default class HeaderComponent extends Component {
  render() {
    return (
      <Header>
        <BackIcon onPress={this.goBack} />
      </Header>
    );
  }

    goBack = () => {
      const { back } = this.props;
      back();
    }
}
