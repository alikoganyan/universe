import React, { Component } from 'react';
import { View, Text, Dimensions } from 'react-native';
import styled from 'styled-components';
import SafeAreaView from '../../common/SafeAreaView';
import Header from './Header';
import Content from './Content';
import helper from '../../utils/helpers';

const { HeaderHeight } = helper;
const Wrapper = styled(View)`
    height: 100%;
    padding-bottom: ${HeaderHeight};
`;
export default class Signup extends Component {
    render() {
        return (
            <SafeAreaView behavior={'padding'}>
                <Wrapper>
                    <Header back={this.navigateBack}/>
                    <Content forward={this.moveForward}/>
                </Wrapper>
            </SafeAreaView>
        );
    }
    navigateBack = () => {
        this.props.navigation.goBack();
    }
    componentDidMount() {

    }
    moveForward = () => {
        this.props.navigation.navigate('Login');
    }
}
