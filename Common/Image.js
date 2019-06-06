import React from 'react'
import { Text, View, Image, Dimensions } from 'react-native'
import styled from 'styled-components'
import helper from '../utils/helpers'
const { imageSize } = helper
const StyledImage = styled(Image)`
    width: ${({ size }) => typeof size === 'number' ? size : imageSize[size]};
    height: ${({ size }) => typeof size === 'number' ? size : imageSize[size]};
    border-radius: ${({ size }) => typeof size === 'number' ? size / 2 : imageSize[size] / 2};
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
