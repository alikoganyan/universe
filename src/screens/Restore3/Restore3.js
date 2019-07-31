import React, { Component } from 'react'
import { Text, View } from 'react-native'
import styled from 'styled-components'
import Header from './Header'
import Content from './Content'
import SafeAreaView from '../../common/SafeAreaView'

const Wrapper = styled(View)`
  height: 100%;
  justify-content: center;
  align-items: center;
`
export default class PinCode extends Component {
  render() {
    return (
      <SafeAreaView behavior="padding">
        <Wrapper>
          <Header />
          <Content navigate={this.navigate} />
        </Wrapper>
      </SafeAreaView>
    )
  }

  navigate = e => {
    const { navigation } = this.props
    navigation.navigate(e)
  }
}