import React, { Component } from 'react';
import { Text, View } from 'react-native';
import Header from './Header';
import Content from './Content';
import styled from 'styled-components';
import SafeAreaView from '../../common/SafeAreaView';

const Wrapper = styled(View)``;
export default class CreateTask extends Component {
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
