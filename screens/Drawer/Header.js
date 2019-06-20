import React, { Component } from 'react';
import { Text, View, Dimensions } from 'react-native';
import styled from 'styled-components';
import helper from '../../utils/helpers';
import { LogoText } from '../../assets/';
const { sidePadding, Colors, HeaderHeight } = helper;
const { blue, lightGrey3 } = Colors;
const Wrapper = styled(View)`
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    max-height: ${Dimensions.get('window').height >= 812 ? HeaderHeight + 27 : HeaderHeight + 3}px;
    border: 1px solid ${lightGrey3};
    padding-left: 40px;
    padding-right: 40px;
    border-width: 0;
    border-bottom-width: 0.3;

`;
const Header = styled(Text)`
    font-size: 20px;
    font-weight: 500;
    color: ${blue};
`;
export default function HeaderComponent(props) {
    return (
        <Wrapper>
            <LogoText width={85} height={30} noPadding />
        </Wrapper>
    );
}
