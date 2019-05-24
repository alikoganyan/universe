import React, { Component } from 'react'
import { Text, View } from 'react-native'
import styled from 'styled-components'
import helper from '../../utils/helpers'
import { LogoText } from '../../assets/'
const { sidePadding, Colors } = helper;
const { blue } = Colors
const Wrapper = styled(View)`
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: flex-start;
`
const Header = styled(Text)`
    font-size: 20px;
    font-weight: 500;
    color: ${blue};
`
export default function HeaderComponent(props) {
    return (
        <Wrapper>
            <LogoText size={85}/>
        </Wrapper>
    )
}
