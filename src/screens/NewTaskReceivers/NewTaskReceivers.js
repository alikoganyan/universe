import React, { Component } from 'react'
import { View } from 'react-native'
import styled from 'styled-components'
import { ActionSheetProvider } from '@expo/react-native-action-sheet'
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

export default class NewFeedReceivers extends Component {
  render() {
    const valueChange = {
      callback: null,
    }
    return (
      <ActionSheetProvider>
        <SafeAreaView>
          <Wrapper>
            <Header back={this.navigateBack} valueChange={valueChange} />
            <Content back={this.navigateBack} valueChange={valueChange} />
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
