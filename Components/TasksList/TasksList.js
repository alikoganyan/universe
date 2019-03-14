import React, { Component } from 'react'
import { View, Text, FlatList, Dimensions, ScrollView } from 'react-native'
import styled from 'styled-components'
import { Header, Content } from './'
import { SafeAreaView } from '../../Common/'
import helper from '../../Helper/helper'
const { sidePaddingNumber } = helper;
const Wrapper = styled(View)`
  max-height: ${Dimensions.get('window').height - sidePaddingNumber}px;
`

export default class Tasks extends Component {
  render() {
    return (
      <SafeAreaView>
        <Wrapper>
          <Header />
          <Content />
        </Wrapper>
      </SafeAreaView>
    )
  }
  componentDidMount() { }
  toChat = () => {
    this.props.navigation.navigate('Chat')
  }
  toGroup = () => {
    this.props.navigation.navigate('Group')
  }
}
