import React, { Component } from 'react'
import { View, Text } from 'react-native'
import styled from 'styled-components'
import { BackIcon } from '../../assets/index'
import helper from '../../utils/helpers'

const { HeaderHeight } = helper
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

export default class HeaderComponent extends Component {
  render() {
    const { back } = this.props
    return (
      <Header>
        <Left>
          <BackIcon onPress={back} />
          <Text>Название группы</Text>
        </Left>
      </Header>
    )
  }
}
