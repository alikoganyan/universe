import React, { Component } from 'react'
import { View, Dimensions } from 'react-native'
import styled from 'styled-components'
import Content from './Content'
import SafeAreaView from '../../common/SafeAreaView'
import helper from '../../utils/helpers'
import { connect } from 'react-redux'
import ScreenLoader from '../../common/ScreenLoader'

const { sidePadding } = helper
const Wrapper = styled(View)`
  max-height: ${Dimensions.get('window').height - sidePadding}px;
`

class Tasks extends Component {
  render() {
    const { companyLoading } = this.props
    return (
      <SafeAreaView behavior="padding">
        <Wrapper>
          {companyLoading && <ScreenLoader />}
          <Content navigate={this.navigate} />
        </Wrapper>
      </SafeAreaView>
    )
  }

  navigateBack = () => {
    this.props.navigation.goBack()
  }

  navigate = e => {
    this.props.navigation.navigate(e)
  }
}

const mapStateToProps = state => ({
  companyLoading: state.dialogsReducer.companyLoading,
})

export default connect(mapStateToProps)(Tasks)
