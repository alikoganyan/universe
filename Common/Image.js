import React from 'react'
import { Text, View, Image } from 'react-native'
import styled from 'styled-components'
const sizes = {
    small: 20,
    medium: 24,
    xs: 40,
    large: 48,
}
const StyledImage = styled(Image)`
    borderColor: black;
    width: ${({ size }) => typeof size === 'number' ? size : sizes[size]};
    height: ${({ size }) => typeof size === 'number' ? size : sizes[size]};
    border-radius: ${({ size }) => typeof size === 'number' ? size/2 : sizes[size]/2};
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
