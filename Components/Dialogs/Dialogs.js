import React, { Component } from 'react'
import { View, Text, FlatList, Dimensions, StatusBar } from 'react-native'
import styled from 'styled-components'
import { Header, Dialog } from './index'
import { SafeAreaView } from '../../Common/'
import { DrawerActions } from 'react-navigation-drawer';

import helper from '../../Helper/helper'
const { sidePaddingNumber, HeaderHeightNumber } = helper;
const Wrapper = styled(View)`
  max-height: ${Dimensions.get('window').height - sidePaddingNumber}px;
`
const StyledFlatList = styled(FlatList)`
`

export default class Dialogs extends Component {
  render() {
    const { FlatListData } = this.state;
    return (
      <SafeAreaView>
        <Wrapper>
          <Header toggleDrawer={this.props.navigation.openDrawer} />
          <StyledFlatList
            ListHeaderComponent={<View style={{ margin: 30, }} />}
            ref={(ref) => { this.flatList = ref; }}
            data={FlatListData}
            renderItem={({ item, index }) => <Dialog onClick={this.toChat} title={item.title}>{item.text}</Dialog>}
            keyExtractor={(item, index) => index.toString()}
          />
        </Wrapper>
      </SafeAreaView>
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
