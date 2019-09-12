import React, { PureComponent } from 'react'
import { View, Animated } from 'react-native'
import styled from 'styled-components'
import { WriteMessageBlue } from '../assets/index'
import helper from '../utils/helpers'

const { Colors } = helper

const PreHeader = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 8px 12px;
  backgroundcolor: #ffffff;
  z-index: 2;
`

const SubTitle = styled(Animated.Text)`
  font-family: 'OpenSans-Bold';
  font-size: 15px;
  color: ${Colors.black};
`

class PreHeaderComponent extends PureComponent {
  render() {
    const { opacity, title, onWritePress } = this.props
    return (
      <PreHeader>
        <View style={{ width: 28 }} />
        <SubTitle style={{ opacity }}>{title}</SubTitle>
        <WriteMessageBlue onPress={onWritePress} />
      </PreHeader>
    )
  }
}

export default PreHeaderComponent
