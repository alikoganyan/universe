import React from 'react'
import { Text, View, Image, Dimensions } from 'react-native'
import styled from 'styled-components'
const sizes = {
    small: 20,
    medium: Dimensions.get('window').height >= 1080 ? 72 : 24,
    xs: 40,
    large: 48,
}
console.log(Dimensions.get('window').height)
const StyledImage = styled(Image)`
    /* border-color: black; */
    width: ${({ size }) => typeof size === 'number' ? size : sizes[size]};
    height: ${({ size }) => typeof size === 'number' ? size : sizes[size]};
    border-radius: ${({ size }) => typeof size === 'number' ? size / 2 : sizes[size] / 2};
    overflow: hidden;
`
export default function ImageComponent(props) {
    const { source, style, size = "medium" } = props;
    return (
        <StyledImage
            size={size}
            source={source}
            style={{ ...style }}
        />
    )
}
