import React, { Component } from 'react'
import { View } from 'react-native'
import styled from 'styled-components'
import { ActionSheetProvider } from '@expo/react-native-action-sheet'
import SafeAreaView from '../../common/SafeAreaView'
import Header from './Header'
import Content from './Content'
import { connect } from 'react-redux'

const Wrapper = styled(View)`
  height: 100%;
`
class GroupInfo extends Component {
  render() {
    return (
      <ActionSheetProvider>
        <SafeAreaView>
          <Wrapper>
            <Header navigate={this.props.navigation.navigate} />
            <Content navigate={this.props.navigation.navigate} />
          </Wrapper>
        </SafeAreaView>
      </ActionSheetProvider>
    )
  }

  navigateBack = () => {
    const { navigation } = this.props
    navigation.goBack()
  }
}

const mapStateToProps = state => ({})

export default connect(mapStateToProps)(GroupInfo)
