import React, { Component } from 'react'
import { View, BackHandler } from 'react-native'
import styled from 'styled-components'
import Header from './Header'
import Content from './Content'
import SafeAreaView from '../../common/SafeAreaView'

const Wrapper = styled(View)`
  height: 100%;
  align-items: center;
`
export default class PinCode extends Component {
  render() {
    return (
      <SafeAreaView behavior="padding">
        <Wrapper>
          <Header back={this.props.navigation.goBack} />
          <Content navigate={this.navigate} />
        </Wrapper>
      </SafeAreaView>
    )
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

  navigateBack = () => {
    this.props.navigation.goBack()
  }

  navigate = e => this.props.navigation.navigate(e)
}
