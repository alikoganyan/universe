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

export default class ContactGroups extends Component {
  render() {
    const { navigation } = this.props
    return (
      <ActionSheetProvider>
        <SafeAreaView>
          <Wrapper>
            <Header back={this.navigateBack} navigate={navigation.navigate} />
            <Content navigate={navigation.navigate} />
            <Bottom />
          </Wrapper>
        </SafeAreaView>
      </ActionSheetProvider>
    )
  }

  navigateBack = () => {
    const { navigation } = this.props
    navigation.goBack()
  }
}
