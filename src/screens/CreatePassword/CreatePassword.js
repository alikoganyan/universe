import React, { Component } from 'react'
import { View } from 'react-native'
import styled from 'styled-components'
import Content from './Content'
import SafeAreaView from '../../common/SafeAreaView'
const Wrapper = styled(View)`
  height: 100%;
`

export default class CreatePassword extends Component {
  render() {
    return (
      <SafeAreaView behavior="padding" enabled={false}>
        <Wrapper>
          <Content navigate={this.navigate} />
        </Wrapper>
      </SafeAreaView>
    )
  }

  // componentDidMount() {
  //   BackHandler.addEventListener('hardwareBackPress', this._handleBackButton)
  // }
  //
  // componentWillUnmount() {
  //   BackHandler.removeEventListener('hardwareBackPress', this._handleBackButton)
  // }
  //
  // _handleBackButton = () => {
  //   BackHandler.exitApp()
  // }

  navigate = e => {
    const { navigation } = this.props
    navigation.navigate(e)
  }
}
