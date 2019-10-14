import React, { Component } from 'react'
import { View, Dimensions, Platform } from 'react-native'
import styled from 'styled-components'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import SafeAreaView from '../../common/SafeAreaView'
import Header from './Header'
import Input from './Input'
import Content from './Content'

const Wrapper = styled(View)`
  flex: 1;
`
const Bottom = styled(View)`
  position: absolute;
  bottom: 0;
  width: ${Dimensions.get('window').width};
  background-color: #ffffff;
`
export default class NewsComments extends Component {
  render() {
    return (
      <SafeAreaView behavior="padding" enabled={Platform.OS === 'ios'}>
        <Wrapper>
          <Header back={this.navigateBack} navigate={e => this.navigate(e)} />
          <KeyboardAwareScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          >
            <Content navigate={this.navigate} />
          </KeyboardAwareScrollView>
          <Bottom>
            <Input />
          </Bottom>
        </Wrapper>
      </SafeAreaView>
    )
  }

  navigateBack = () => {
    this.props.navigation.goBack()
  }

  navigate = e => {
    this.props.navigation.navigate(e)
  }
}
