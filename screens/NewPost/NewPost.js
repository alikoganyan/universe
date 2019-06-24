import React, { Component } from 'react';
import { View, Text, Platform } from 'react-native';
import styled from 'styled-components';
import SafeAreaView from '../../common/SafeAreaView';
import Header from './Header';
import Content from './Content';

const Wrapper = styled(View)``;
export default class NewPost extends Component {
  render() {
    return (
      <SafeAreaView>
        <Wrapper>
          <Header back={this.navigateBack} />
          <Content />
        </Wrapper>
      </SafeAreaView>
    );
  }

    navigateBack = () => {
      this.props.navigation.goBack();
    }
}
