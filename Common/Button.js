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
    ${({ style }) => style}
`
const Inner = styled(Text)`
    color: ${({color}) => color || lightColor};
`
export default Button = ({ children, style, color }) => {
    return (
        <Wrapper style={{ ...style }}>
            <Inner color={color}>{children}</Inner>
        </Wrapper>
    )
}
