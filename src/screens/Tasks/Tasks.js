import React, { Component } from 'react'
import { View } from 'react-native'
import styled from 'styled-components'
import SafeAreaView from '../../common/SafeAreaView'

import Header from './Header'
import Content from './Content'

const Wrapper = styled(View)`
  height: 100%;
`

export default class Tasks extends Component {
  render() {
    return (
      <SafeAreaView>
        <Wrapper>
          <Header navigate={this.navigate} back={this.navigateBack} />
          <Content navigate={this.navigate} />
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
