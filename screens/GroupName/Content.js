import React, { Component } from 'react';
import {
  View, Text, SafeAreaView, Image, TouchableOpacity
} from 'react-native';
import styled from 'styled-components';
import FloatingLabel from 'react-native-floating-labels';

const Wrapper = styled(View)`
    padding-top: 0px;
    background: white;
    margin-bottom: 110px;
    padding: 0 50px;
    
`;
const Group = styled(View)`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 20px 0;
`;
const GroupImage = styled(Image)`
    width: 100px;
    height: 100px;
    border-radius: 50;
    margin: 0 10px;

`;
const ControlBox = styled(View)`
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    margin-top: 35px;
`;
const Create = styled(Text)`
    margin-left: 30px;
    color: #003058;

`;
const Cancel = styled(Create)`
    color: #B1B1B1;
`;
export default class Content extends Component {
  render() {
    const Input = (props) => {
      const {
        children, password = false, value, style, editable
      } = props;
      return (
        <FloatingLabel
          labelStyle={{ fontSize: 15 }}
          inputStyle={{
            fontSize: 15,
            borderWidth: 0,
            borderBottomWidth: 1,
            display: 'flex',
          }}
          password={password}
          value={value}
          style={{ ...style }}
          editable={editable}
        >
          {children}
        </FloatingLabel>
      );
    };
    return (
      <SafeAreaView>
        <Wrapper>
          <Group>
            <GroupImage source={{ uri: 'https://facebook.github.io/react/logo-og.png' }} />
          </Group>
          <Input>Название группы</Input>
          <ControlBox>
            <TouchableOpacity><Cancel>Отменить</Cancel></TouchableOpacity>
            <TouchableOpacity><Create>Создать группу</Create></TouchableOpacity>
          </ControlBox>
        </Wrapper>
      </SafeAreaView>
    );
  }
}
