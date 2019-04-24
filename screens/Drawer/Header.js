import React, { Component } from 'react'
import { Text, View } from 'react-native'
import styled from 'styled-components'
import helper from '../../utils/helpers'
const { sidePaddingNumber} = helper;
const Wrapper = styled(View)`
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding-left: ${sidePaddingNumber - 5}px;

`
const Header = styled(Text)`
    font-size: 20px;
    font-weight: 500;
`
export default function HeaderComponent(props) {
    return (
        <Wrapper>
            <Header>Universe</Header>
        </Wrapper>
    )
}
