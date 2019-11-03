import React, { Component } from 'react'
import { View } from 'react-native'
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
export default class Signup extends Component {
  render() {
    return (
      <SafeAreaView behavior="padding">
        <Wrapper>
          <Header back={this.back} />
          <Content
            addParticipants={this.addParticipants}
            forward={this.moveForward}
            back={this.back}
            getParam={this.props.navigation.getParam}
            navigate={this.props.navigation.navigate}
          />
        </Wrapper>
      </SafeAreaView>
    )
  }

  componentDidMount() {}

  back = () => {
    const { navigation } = this.props
    navigation.goBack()
  }

  moveForward = () => {
    const { navigation } = this.props
    navigation.goBack()
  }

  addParticipants = () => {
    const { navigation } = this.props
    navigation.navigate('NewTaskReceivers')
  }
}
