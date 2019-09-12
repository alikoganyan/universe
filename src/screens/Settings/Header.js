import React, { Component } from 'react'
import { Text } from 'react-native'
import styled from 'styled-components'
import helper from '../../utils/helpers'

const { Colors } = helper
const Title = styled(Text)`
  font-family: 'OpenSans-Bold';
  font-size: 30px;
  color: ${Colors.black};
  margin-top: 37px;
  padding: 0 16px 8px;
  background-color: ${Colors.white};
  z-index: 2;
`
class HeaderComponent extends Component {
  render() {
    return <Title>Настройки</Title>
  }
}
export default HeaderComponent
