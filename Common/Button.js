import React, { Component } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import styled from 'styled-components'
import helper from '../utils/helpers'
import Color from 'color'
const { Colors, fontSize } = helper;
const { border, lightColor } = Colors;
const { text } = fontSize;
const Wrapper = styled(TouchableOpacity)`
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid ${border};
    padding: 10px 35px;
    border-radius: 30;
    background: ${({background, disabled}) => disabled ? Color(background).lighten(0.4).hex() : background || 'white'};
`
const Inner = styled(Text)`
    color: ${({ color }) => color || lightColor};
    font-size: ${text};
    text-align: center;
`
export default Button = (props) => {
    const { children, style, color, onPress, disabled, background } = props;
    console.log(color)
    return (
        <Wrapper style={{ ...style }} background={background} onPress={onPress} disabled={disabled}>
            <Inner color={color}>{children}</Inner>
        </Wrapper>
    )
}
