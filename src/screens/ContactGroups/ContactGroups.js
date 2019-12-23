import React, { Component } from 'react'
import { View } from 'react-native'
import styled from 'styled-components'
import { ActionSheetProvider } from '@expo/react-native-action-sheet'
import SafeAreaView from '../../common/SafeAreaView'
import Content from './Content'
import { connect } from 'react-redux'
import ScreenLoader from '../../common/ScreenLoader'

const Wrapper = styled(View)`
  height: 100%;
`

class ContactGroups extends Component {
  render() {
    const { navigation, companyLoading } = this.props
    return (
      <ActionSheetProvider>
        <SafeAreaView>
          {companyLoading && <ScreenLoader />}
          <Wrapper>
            <Content navigate={navigation.navigate} />
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

const mapStateToProps = state => ({
  companyLoading: state.dialogsReducer.companyLoading,
})

export default connect(mapStateToProps)(ContactGroups)
