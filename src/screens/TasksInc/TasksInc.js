import React, { Component } from 'react'
import { View, Text, Image } from 'react-native'
import styled from 'styled-components'
import { BackIcon } from '../../assets/index'
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
          <Content />
        </Wrapper>
      </SafeAreaView>
    )
  }

  navigateBack = () => {
    this.props.navigation.goBack()
  }
}
