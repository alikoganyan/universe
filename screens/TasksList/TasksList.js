import React, { Component } from 'react'
import { View, Text, FlatList, Dimensions, ScrollView } from 'react-native'
import styled from 'styled-components'
import { Header, Content } from './'
import { SafeAreaView } from '../../common'
import helper from '../../utils/helpers'
const { sidePaddingNumber } = helper;
const Wrapper = styled(View)`
  max-height: ${Dimensions.get('window').height - sidePaddingNumber}px;
`

export default class Tasks extends Component {
  render() {
    return (
      <SafeAreaView>
        <Wrapper>
          <Header navigate={this.navigate} back={this.navigateBack} />
          <Content />
        </Wrapper>
      </SafeAreaView>
    )
  }
  navigateBack = () => {
    this.props.navigation.goBack()
  }
  componentDidMount() { 
  }
  navigate = (e) => {
    console.log(e)
    this.props.navigation.navigate(e)
  }
  toGroup = () => {
    this.props.navigation.navigate('Group')
  }
}
