import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { ForwardIcon } from '../../assets/index';
import styled from 'styled-components';
import helper from '../../utils/helpers';
const { HeaderHeight, fontSize } = helper;

const Header = styled(View)`
  width: 100%;
  background: white;
  height: ${HeaderHeight};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const HeaderUserImage = styled(Image)`
  border-radius: 15;
  height: 30px;
  width: 30px;
  margin-right: 10px;
`;
const Info = styled(View)`
  display: flex;
`;
const InfoChatName = styled(Text)`
  color: black;
  font-size: ${fontSize.text};
`;
const InfoParticipants = styled(Text)`
  color: #5f7991;
  font-size: ${fontSize.sm};
`;
const Left = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const Right = styled(TouchableOpacity)`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export default class HeaderComponent extends Component {
  render() {
    return (
      <Header>
        <Left />
        <Right onPress={this.moveForward}>
          <Text>Далее</Text>
          <ForwardIcon />
        </Right>
      </Header>
    );
  }
  moveForward = () => {
    this.props.back();
  };
}
