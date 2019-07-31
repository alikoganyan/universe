import React, { Component } from 'react'
import { View, Text, Image } from 'react-native'
import styled from 'styled-components'
import {
  ActionSheetProvider,
  connectActionSheet,
} from '@expo/react-native-action-sheet'
import { BackIcon, EllipsisVIcon } from '../../assets/index'
import SafeAreaView from '../../common/SafeAreaView'
import Header from './Header'
import Content from './Content'

const Wrapper = styled(View)`
  height: 100%;
`
const Bottom = styled(View)`
  position: absolute;
  bottom: 0;
  width: 100%;
  background: white;
`

export default class GroupInfo extends Component {
  render() {
    return (
      <ActionSheetProvider>
        <SafeAreaView>
          <Wrapper>
            <Header back={this.navigateBack} />
            <Content />
            <Bottom />
          </Wrapper>
        </SafeAreaView>
      </ActionSheetProvider>
    )
  }

  navigateBack = () => {
    this.props.navigation.goBack()
  }
}