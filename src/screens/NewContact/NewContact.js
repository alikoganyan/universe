import React, { Component } from 'react'
import { Text, View } from 'react-native'
import styled from 'styled-components'
import Header from './Header'
import Content from './Content'
import SafeAreaView from '../../common/SafeAreaView'

const Wrapper = styled(View)``

export default class NewContact extends Component {
  render() {
    return (
      <SafeAreaView behavior="padding">
        <Wrapper>
          <Header back={this.navigateBack} />
          <Content navigateToDialogs={this.navigateToDialogs} />
        </Wrapper>
      </SafeAreaView>
    )
  }

  navigateToDialogs = () => this.props.navigation.navigate('Dialogs')

  navigateBack = () => {
    this.props.navigation.goBack()
  }
}
