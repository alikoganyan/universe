import React, { Component } from 'react'
import { View, Text, FlatList, Dimensions, ScrollView } from 'react-native'
import styled from 'styled-components'
import { Header, Task, TaskPack } from './'
import { SafeAreaView } from '../../common'
import helper from '../../utils/helpers'
import sendRequest from '../../utils/request'
import { g_tasks } from '../../constants/api'
const { sidePaddingNumber, HeaderHeightNumber } = helper;
const Wrapper = styled(View)`
  max-height: ${Dimensions.get('window').height - sidePaddingNumber}px;
  `
const StyledScrollView = styled(ScrollView)`
  height: ${Dimensions.get('window').height - HeaderHeightNumber - 20}px;
  padding: 0  ${sidePaddingNumber}px;
`

export default class Tasks extends Component {
  render() {
    const { FlatListData } = this.state;
    return (
      <Wrapper>
        <StyledScrollView>
          <TaskPack title={'Все исходящие задачи'}>task</TaskPack>
          <TaskPack title={'Все исходящие задачи'} last>task</TaskPack>
          {
            FlatListData.map((e, i) => {
              return <Task key={i} title={e.name}>{e.description}</Task>
            })
          }
        </StyledScrollView>
      </Wrapper>
    )
  }
  state = {
    FlatListData: []
  }
  componentDidMount() {
    sendRequest({
      r_path: g_tasks,
      method: 'get',
      success: ({ tasks }) => {
        this.setState({FlatListData: [...this.state.FlatListData, ...tasks]}, () => console.log(this.state.FlatListData))
      },
      failFunc: (err) => {
        console.log({ err })
      }
    })
  }
  toChat = () => {
    this.props.navigation.navigate('Chat')
  }
  toGroup = () => {
    this.props.navigation.navigate('Group')
  }
}
