import React from 'react'
import { View, ActivityIndicator } from 'react-native'
import styled from 'styled-components'

const Wrapper = styled(View)`
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 15;
`

const Loading = styled(ActivityIndicator)`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: #0005;
`

const ScreenLoader = () => {
  return (
    <Wrapper>
      <Loading size="large" />
    </Wrapper>
  )
}

export default ScreenLoader
