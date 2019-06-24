import React, { Component } from 'react';
import { View, Text } from 'react-native';
import styled from 'styled-components';
import { BackIcon } from '../../assets/index';
import helper from '../../utils/helpers';

const {
  HeaderHeight, sidePadding, Colors, fontSize
} = helper;
const { grey3 } = Colors;
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
`;
const Left = styled(View)`
    display: flex;
    flex-direction: row;
    align-items: center;
`;
const Right = styled(View)`
    display: flex;
    flex-direction: row;
    align-items: center;
`;
const MarginRight = styled(View)`
margin-right: ${sidePadding}px;
`;
const HeaderText = styled(Text)`
    font-size: ${fontSize.header};
    position: relative;
    left: -10px;
    color: ${grey3};
`;
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
        <Right />
      </Header>
    );
  }
}
