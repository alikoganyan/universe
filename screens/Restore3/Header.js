import React, { Component } from 'react'
import { View } from 'react-native'
import styled from 'styled-components'
import helper from '../../utils/helpers'
const { HeaderHeight } = helper;

const Header = styled(View)`
    width: 100%;
    background: white;
    height: ${HeaderHeight}; 
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`

export default class HeaderComponent extends Component {
    render() {
        return (
            <Header>
            </Header>
        )
    }
}
