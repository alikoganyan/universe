import React, { Component } from 'react';
import { View, Text, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import styled from 'styled-components';
import { connect } from 'react-redux';
import helper from '../../utils/helpers';
import Header from './Header';
import Content from './Content';
import SafeAreaView from '../../common/SafeAreaView';
const { sidePadding, topPadding } = helper;
const Outer = styled(View)`
  display: flex;
  padding-top: 15px;
  height: ${Dimensions.get('window').height};

`;
const Wrapper = styled(View)`
  height: ${Dimensions.get('window').height};
  background: white;
`;
class Drawer extends Component {
  render() {
    return (
      <Outer>
        <Wrapper>
          <Header />
          <Content navigate={this.props.navigation.navigate} dispatch={this.props.navigation.dispatch}/>
        </Wrapper>
      </Outer>
    );
  }
  componentDidMount() {
    this.props.navigation.navigate('DrawerClose');
  }
}

const mapStateToProps = state => ({
    open: state.drawerReducer.open,
  });
const mapDispatchToProps = dispatch => ({

});
export default connect(mapStateToProps, mapDispatchToProps)(Drawer);
