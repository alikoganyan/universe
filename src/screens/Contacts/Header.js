import React, { Component } from 'react'
import {
  View,
  Text,
  SafeAreaView,
  Image,
  Platform,
  ActionSheetIOS,
} from 'react-native'
import styled from 'styled-components'
import { BackIcon, BurgerIcon } from '../../assets/index'
import helper from '../../utils/helpers'

const { HeaderHeight, Colors, fontSize } = helper
const { green, grey3 } = Colors
const Header = styled(View)`
  width: 100%;
  background: white;
  height: ${HeaderHeight};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
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
const Center = styled(View)``
const HeaderText = styled(Text)`
  font-size: ${fontSize.header};
  position: relative;
  left: -10px;
  color: ${grey3};
`
export default class HeaderComponent extends Component {
  render() {
    return (
      <Header>
        <Center>
          <HeaderText>Настройки</HeaderText>
        </Center>
        <Right style={{ position: 'absolute', right: 0 }}>
          <BurgerIcon />
        </Right>
      </Header>
    )
  }
}
