import React, { Component } from 'react'
import { View } from 'react-native'
import styled from 'styled-components'
import SafeAreaView from '../../common/SafeAreaView'

import Header from './Header'
import Content from './Content'

const Wrapper = styled(View)`
  height: 100%;
`

export default class News extends Component {
  render() {
    return (
      <SafeAreaView>
        <Wrapper>
          <Header back={this.navigateBack} />
          <Content navigate={this.props.navigation.navigate} />
        </Wrapper>
      </SafeAreaView>
    )
  }

  navigateBack = () => {
    this.props.navigation.goBack()
  }
}
