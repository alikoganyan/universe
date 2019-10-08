import React, { useState } from 'react'
import styled from 'styled-components'
import helper from '../utils/helpers'
import FastImage from 'react-native-fast-image'
import { Placeholder } from '../assets/icons'

const { imageSize } = helper
const StyledImage = styled(FastImage)`
  width: ${({ size }) => (typeof size === 'number' ? size : imageSize[size])};
  height: ${({ size }) => (typeof size === 'number' ? size : imageSize[size])};
  border-radius: ${({ size }) =>
    typeof size === 'number' ? size / 2 : imageSize[size] / 2};
  overflow: hidden;
`
export default function ImageComponent(props) {
  const [defaultAvatar, setDefaultAvatar] = useState(true)

  const { source, style, size = 'medium' } = props

  return (
    <StyledImage
      size={size}
      source={defaultAvatar ? Placeholder : { ...source }}
      style={{ ...style }}
      onLoadEnd={() => setDefaultAvatar(false)}
    />
  )
}
