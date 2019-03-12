import React, { Component } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import styled from 'styled-components'
import helper from '../Helper/helper'
const { Colors } = helper;
const { border, lightColor } = Colors; 
const Wrapper = styled(TouchableOpacity)`
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid ${border};
    padding: 15px 30px;
    border-radius: 30;
`
const Inner = styled(Text)`
    color: ${lightColor};
`
export default Button = ({children}) => {

    return (
        <Wrapper>
            <Inner>{children}</Inner>
        </Wrapper>
    )
}
