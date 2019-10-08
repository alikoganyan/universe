import React, { Component } from 'react'
import { View } from 'react-native'
import styled from 'styled-components'
import helper from '../utils/helpers'
import { GroupIconWhite, UserIconWhite } from '../assets/'
import { connect } from 'react-redux'
const { Colors, imageSize } = helper
const { avatars } = Colors
const Wrapper = styled(View)`
  width: ${({ size }) => (typeof size === 'number' ? size : imageSize[size])};
  height: ${({ size }) => (typeof size === 'number' ? size : imageSize[size])};
  border-radius: ${({ size }) =>
    typeof size === 'number' ? size / 2 : imageSize[size] / 2};
  display: flex;
  justify-content: center;
  align-items: center;
  ${({ style }) => style};
`
class DefaultAvatar extends Component {
  render() {
    const { user, style, isGroup = false, size = 'medium', id } = this.props
    const color = avatars[id ? id % avatars.length : user._id % avatars.length]
    return (
      <Wrapper style={{ backgroundColor: color, ...style }} size={size}>
        {isGroup ? <GroupIconWhite /> : <UserIconWhite />}
      </Wrapper>
    )
  }
}
const mapStateToProps = state => ({
  user: state.userReducer.user,
})
export default connect(mapStateToProps)(DefaultAvatar)
