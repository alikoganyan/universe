import React, { Component } from 'react'
import { View, Text, FlatList, Dimensions, StatusBar } from 'react-native'
import styled from 'styled-components'
import { Header, Dialog } from './index'
import { SafeAreaView } from '../../Common/'
import helper from '../../Helper/helper'
const { sidePaddingNumber, HeaderHeightNumber } = helper;
const Wrapper = styled(View)`
  max-height: ${Dimensions.get('window').height - sidePaddingNumber}px;
`
const StyledFlatList = styled(FlatList)`
`

export default class Dialogs extends Component {
  componentDidMount() {

  }
  toChat = () => {
    this.props.navigation.navigate('Chat')
  }
  toGroup = () => {
    this.props.navigation.navigate('Group')
  }
  render() {
    const FlatListData = [{ text: 'text', title: 'title' }, { text: 'text', title: 'title' }, { text: 'text', title: 'title' }, { text: 'text', title: 'title' }, { text: 'text', title: 'title' }, { text: 'text', title: 'title' }, { text: 'text', title: 'title' }, { text: 'text', title: 'title' }, { text: 'text', title: 'title' }, { text: 'text', title: 'title' }, { text: 'text', title: 'title' }, { text: 'text', title: 'title' }, { text: 'text', title: 'title' }, { text: 'text', title: 'title' }, { text: 'text', title: 'title' }, { text: 'text', title: 'title' }, { text: 'text', title: 'title' }, { text: 'text', title: 'title' }, { text: 'text', title: 'title' }]
    return (
      <SafeAreaView>
        <Wrapper>
          <Header />
          <StyledFlatList
            ListHeaderComponent={<View style={{ margin: 30, }} />}
            ref={(ref) => { this.flatList = ref; }}
            data={FlatListData}
            renderItem={({ item, index }) => <Dialog onClick={index % 2 ? this.toChat : this.toGroup} title={item.title}>{item.text}</Dialog>}
            keyExtractor={(item, index) => index.toString()}
          />
        </Wrapper>
      </SafeAreaView>
    )
  }
}
