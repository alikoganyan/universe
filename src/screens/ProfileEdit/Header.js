import React, { Component } from 'react'
import { View, Text } from 'react-native'
import styled from 'styled-components'
import { BackIcon } from '../../assets/index'
import helper from '../../utils/helpers'

const { sidePadding, HeaderHeight } = helper
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
`
const Left = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`
const MarginRight = styled(View)`
  margin-right: ${sidePadding}px;
`
export default class HeaderComponent extends Component {
  render() {
    return (
      <Header>
        <Left>
          <MarginRight>
            <BackIcon onPress={this.props.back} />
          </MarginRight>
          <Text>Редактирование профиля</Text>
        </Left>
      </Header>
    )
  }

  editProfile = () => {}
}
