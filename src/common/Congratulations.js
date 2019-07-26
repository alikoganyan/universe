import React, { Component } from 'react'
import { Text, View, TouchableOpacity, Dimensions } from 'react-native'
import styled from 'styled-components'
import helper from '../utils/helpers'
import { LogoPlaceholder } from '../assets'
const { Colors, fontSize } = helper
const { border, lightColor } = Colors
const { text } = fontSize
const Wrapper = styled(View)`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  position: absolute;
  z-index: 200;
  width: ${Dimensions.get('window').width + 20}px;
  height: ${Dimensions.get('window').height + 20};
  height: 100%;
  align-self: center;
  ${({ style }) => style};
`
const Shadow = styled(TouchableOpacity)`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  border: 1px solid ${border};
  position: absolute;
  z-index: -1;
  top: -25px;
  width: ${Dimensions.get('window').width + 20}px;
  height: ${Dimensions.get('window').height + 20};
  opacity: 0.5;
  background: black;
  align-self: center;
  ${({ style }) => style};
`
const Inner = styled(View)`
  height: 45%;
  width: 80%;
  background: white;
  position: absolute;
  opacity: 1;
  border-radius: 30;
  padding: 10px;
  z-index: 200;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`
const Title = styled(Text)`
  color: ${lightColor};
  margin: 20px 0;
  text-align: center;
`
export default Congratualtions = props => {
  const { children, style, title, onClickOutside } = props
  return (
    <Wrapper style={{ ...style }}>
      <Shadow onPress={onClickOutside} />
      <Inner>
        <LogoPlaceholder width={150} height={100} />
        <Title>{title}</Title>
        {children}
      </Inner>
    </Wrapper>
  )
}
