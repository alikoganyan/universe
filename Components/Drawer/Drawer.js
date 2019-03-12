import React, { Component } from 'react'
import { View, Text, FlatList, Dimensions, TouchableOpacity } from 'react-native'
import styled from 'styled-components'
import { connect } from 'react-redux'
import helper from '../../Helper/helper'
import { Header, Content } from './'
import { SafeAreaView } from '../../Common/'
const Outer = styled(View)`
  display: flex;

`
const Wrapper = styled(View)`
  height: 100%;
  background: white;
  width: 80%;
  background: white;
`
const Closer = styled(TouchableOpacity)`
  flex: 1;
  width: 20%;
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  background: rgba(0,0,0,.5);
`
class Drawer extends Component {
  componentDidMount() {
  }
  render() {
    return (
      <SafeAreaView>
        <Outer>
          <Wrapper>
            <Header />
            <Content />
          </Wrapper>
          <Closer onPress={this.props.closeDrawer} />
        </Outer>
      </SafeAreaView>
    )
  }
}

const mapStateToProps = state => {
  return {
    open: state.drawerReducer.open,
  };
};
const mapDispatchToProps = dispatch => ({

})
export default connect(mapStateToProps, mapDispatchToProps)(Drawer)
