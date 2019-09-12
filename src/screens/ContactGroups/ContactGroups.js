import React, { Component } from 'react'
import { View } from 'react-native'
import styled from 'styled-components'
import { ActionSheetProvider } from '@expo/react-native-action-sheet'
import SafeAreaView from '../../common/SafeAreaView'
import Content from './Content'

const Wrapper = styled(View)`
  height: 100%;
`

export default class ContactGroups extends Component {
  render() {
    const { navigation } = this.props
    return (
      <ActionSheetProvider>
        <SafeAreaView>
          <Wrapper>
            <Content navigate={navigation.navigate} />
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
