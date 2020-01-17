import React from 'react'
import { View, ActivityIndicator } from 'react-native'
import styled from 'styled-components'

const Wrapper = styled(View)`
  padding-left: 10;
  z-index: 15;
`

const Loading = styled(ActivityIndicator)``

const ScreenLoader = () => {
  return (
    <Wrapper>
      <Loading size="small" color="white" />
    </Wrapper>
  )
}

export default ScreenLoader
