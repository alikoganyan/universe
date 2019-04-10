import React, { Component } from 'react'
import { View, Text, FlatList, Dimensions, TouchableOpacity } from 'react-native'
import styled from 'styled-components'
import { connect } from 'react-redux'
import helper from '../../utils/helper'
import { Header, Content } from './'
import { SafeAreaView } from '../../common'
const Outer = styled(View)`
  display: flex;
  padding-top: 10%;
  height: ${Dimensions.get('window').height};

`
const Wrapper = styled(View)`
  height: ${Dimensions.get('window').height};
  background: white;
`
class Drawer extends Component {
  render() {
    return (
      <Outer>
        <Wrapper>
          <Header />
          <Content navigate={this.props.navigation.navigate} dispatch={this.props.navigation.dispatch}/>
        </Wrapper>
      </Outer>
    )
  }
  componentDidMount() {
    this.props.navigation.navigate('DrawerClose')
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
