import React from 'react'
import { Text, View, Image } from 'react-native'
import styled from 'styled-components'
const sizes = {
    medium: 24,
    large: 48,
}
const StyledImage = styled(Image)`
    width: ${({ size }) => sizes[size]};
    height: ${({ size }) => sizes[size]};
    border-radius: 12px;
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
