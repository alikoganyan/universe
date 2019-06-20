import React, { Component } from 'react';
import { View } from 'react-native';
import styled from 'styled-components';
import SafeAreaView from '../../common/SafeAreaView';
import {
    ActionSheetProvider,
} from '@expo/react-native-action-sheet';
import Header from './Header';
import Content from './Content';
const Wrapper = styled(View)`
    height: 100%;
`;
export default class GroupInfo extends Component {
    render() {
        return (
            <ActionSheetProvider>
                <SafeAreaView>
                    <Wrapper>
                        <Header back={this.navigateBack} />
                        <Content />
                    </Wrapper>
                </SafeAreaView>
            </ActionSheetProvider>
        );
    }
    navigateBack = () => {
        this.props.navigation.goBack();
    }
}
