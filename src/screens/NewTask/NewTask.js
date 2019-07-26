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
    const { navigation } = this.props
    const deafultValues = navigation.getParam(
      'task',
      navigation.state.params || {},
    )
    return (
      <SafeAreaView behavior="padding">
        <Wrapper>
          <Header back={navigation.goBack} />
          <Content
            addParticipants={this.addParticipants}
            forward={this.moveForward}
            deafultValues={deafultValues}
          />
        </Wrapper>
      </SafeAreaView>
    )
  }

  componentDidMount() {}

  moveForward = () => {
    const { navigation } = this.props
    navigation.navigate('TasksList')
  }

  addParticipants = () => {
    const { navigation } = this.props
    navigation.navigate('NewTaskReceivers')
  }
}
