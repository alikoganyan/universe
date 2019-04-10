import React, { Component } from 'react'
import { View, Text, FlatList, Dimensions, ScrollView } from 'react-native'
import styled from 'styled-components'
import { Header, Task, TaskPack } from './'
import { SafeAreaView } from '../../common'
import helper from '../../utils/helpers'
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
              return <Task key={i} title={e.title}>{e.text}</Task>
            })
          }
        </StyledScrollView>
      </Wrapper>
    )
  }
  state = {
    FlatListData: [
      { text: 'text', title: 'title' },
      { text: 'text', title: 'title' },
      { text: 'text', title: 'title' },
      { text: 'text', title: 'title' },
      { text: 'text', title: 'title' },
      { text: 'text', title: 'title' },
      { text: 'text', title: 'title' },
      { text: 'text', title: 'title' },
      { text: 'text', title: 'title' },
      { text: 'text', title: 'title' },
      { text: 'text', title: 'title' },
      { text: 'text', title: 'title' },
      { text: 'text', title: 'title' },
      { text: 'text', title: 'title' },
      { text: 'text', title: 'title' },
      { text: 'text', title: 'title' },
      { text: 'text', title: 'title' },
      { text: 'text', title: 'title' },
      { text: 'text', title: 'title' }
    ]
  }
  componentDidMount() { }
  toChat = () => {
    this.props.navigation.navigate('Chat')
  }
  toGroup = () => {
    this.props.navigation.navigate('Group')
  }
}
