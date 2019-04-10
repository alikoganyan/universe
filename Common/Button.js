import React, { Component } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import styled from 'styled-components'
import helper from '../utils/helpers'
const { Colors } = helper;
const { border, lightColor } = Colors;
const Wrapper = styled(TouchableOpacity)`
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid ${border};
    padding: 10px 35px;
    border-radius: 30;
    ${({ style }) => style}
`
const Inner = styled(Text)`
    color: ${({ color }) => color || lightColor};
`
export default Button = (props) => {
    const { children, style, color, onPress } = props;
    return (
        <Wrapper style={{ ...style }} onPress={onPress}>
            <Inner color={color}>{children}</Inner>
        </Wrapper>
    )
}
