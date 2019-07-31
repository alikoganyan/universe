import React, { Component } from 'react'
import {
  View,
  Text,
  SafeAreaView,
  Image,
  Platform,
  TouchableOpacity,
} from 'react-native'
import styled from 'styled-components'
import { BackIcon, LocationIcon, SearchIcon } from '../../assets/index'
import helper from '../../utils/helpers'

const { sidePadding, HeaderHeight } = helper

const Header = styled(View)`
  width: 100%;
  background: white;
  padding: 0 ${sidePadding}px;
  height: ${HeaderHeight};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`
const HeaderUserImage = styled(Image)`
  border-radius: 15;
  height: 30px;
  width: 30px;
  margin-right: 10px;
`
const Info = styled(View)`
  display: flex;
`
const InfoChatName = styled(Text)`
  color: black;
  font-size: 12px;
`
const InfoParticipants = styled(Text)`
  color: #5f7991;
  font-size: 10px;
`
const Left = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
`
const Right = styled(TouchableOpacity)`
  display: flex;
  flex-direction: row;
  align-items: center;
`

export default class HeaderComponent extends Component {
  render() {
    return (
      <Header>
        <BackIcon onPress={this.back} />
      </Header>
    )
  }

  back = () => {
    const { back } = this.props
    back()
  }
}