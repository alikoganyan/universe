import React, { Component } from 'react'
import { WebView, SafeAreaView, View } from 'react-native'
import styled from 'styled-components'
import helper from '../../utils/helpers'
import { BackIcon } from '../../assets'

const { HeaderHeight } = helper
const Header = styled(View)`
  width: 100%;
  background: white;
  height: ${HeaderHeight};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
`

export default class WebViewScreen extends Component {
  render() {
    const { getParam, goBack } = this.props.navigation
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Header>
          <BackIcon
            marginLeft={false}
            noPaddingAll
            onPress={() => goBack()}
            right
            size={23}
          />
        </Header>
        <WebView source={{ uri: getParam('uri') }} style={{ flex: 1 }} />
      </SafeAreaView>
    )
  }
}
