import React, { Component } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import styled from 'styled-components'
import helper from '../utils/helpers'
import { LogoPlaceholder } from '../assets/'
const { Colors, fontSize } = helper
const { border, lightColor, grey2 } = Colors
const Wrapper = styled(TouchableOpacity)`
  display: flex;
  justify-content: center;
  align-items: center;
`
const LogoLable = styled(View)`
  width: 250px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`
const LogoText = styled(Text)`
  color: ${grey2};
  font-size: ${fontSize.text};
  text-align: center;
  margin-bottom: 20px;
`
export default Loader = props => {
  const { style, width, height, children, labelStyle, textStyle, hint } = props
  return (
    <Wrapper style={{ ...style }}>
      <LogoPlaceholder width={width || 200} height={height || 200} />
      <LogoLable style={labelStyle}>
        <LogoText style={textStyle}>{hint}</LogoText>
        {children}
      </LogoLable>
    </Wrapper>
  )
}
