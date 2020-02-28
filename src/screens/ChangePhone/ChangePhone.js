import React, { Component } from 'react'
import { View, BackHandler } from 'react-native'
import styled from 'styled-components'
import SafeAreaView from '../../common/SafeAreaView'
import Header from './Header'
import Content from './Content'
import helper from '../../utils/helpers'

const { HeaderHeight } = helper
const Wrapper = styled(View)`
  height: 100%;
  padding-bottom: ${HeaderHeight};
`
export default class ChangePhone extends Component {
  render() {
    return (
      <SafeAreaView behavior="padding">
        <Wrapper>
          <Header back={this.navigateBack} />
          <Content
            navigate={this.navigate}
            goBack={this.props.navigation.goBack}
          />
        </Wrapper>
      </SafeAreaView>
    )
  }

  navigateBack = () => {
    this.props.navigation.goBack()
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackPress,
    )
  }

  componentWillUnmount() {
    this.backHandler.remove()
  }

  handleBackPress = () => {
    this.navigateBack()
    return true
  }

  navigate = e => {
    this.props.navigation.navigate(e)
  }
}
