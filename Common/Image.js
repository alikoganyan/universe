import React from 'react';
import styled from 'styled-components';
import helper from '../utils/helpers';
import ImageLoader from 'react-native-image-progress';

const { imageSize } = helper;
const StyledImage = styled(ImageLoader)
`
    width: ${({ size }) => typeof size === 'number' ? size : imageSize[size]};
    height: ${({ size }) => typeof size === 'number' ? size : imageSize[size]};
    border-radius: ${({ size }) => typeof size === 'number' ? size / 2 : imageSize[size] / 2};
    overflow: hidden;
`;
export default function ImageComponent(props) {
    const { source, style, size = 'medium' } = props;
    return (
            <StyledImage
                size={size}
                source={{ ...source, cache: 'force-cache' }}
                style={{ ...style }}
            />
    );
}
