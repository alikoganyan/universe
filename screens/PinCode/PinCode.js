import React, { Component } from 'react';
import { Text, View, ImageBackground, Dimensions } from 'react-native';
import Header from './Header';
import Content from './Content';
import styled from 'styled-components';
import SafeAreaView from '../../common/SafeAreaView';
import { fitstScreen } from '../../assets/images/';

const Wrapper = styled(View)``;
export default class PinCode extends Component {
    render() {
        return (
            <SafeAreaView>
                <Wrapper>
                    <ImageBackground source={fitstScreen} style={{ height: Dimensions.get('window').height }}>
                        <Content toDialogs={this.toDialogs} />
                    </ImageBackground>
                </Wrapper>
            </SafeAreaView>
        );
    }
    toDialogs = () => {
        this.props.navigation.navigate('Dialogs');
    }
}
