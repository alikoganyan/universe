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
    padding: 0 ${sidePadding}px;
`;

export default class HeaderComponent extends Component {
  render() {
    const { back } = this.props;
    return (
      <Header>
        <BackIcon onPress={back} />
      </Header>
    );
  }
}
