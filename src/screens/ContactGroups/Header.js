import React, { Component } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { BackIcon, SearchIcon } from '../../assets/index'
import helper from '../../utils/helpers'
import ImageComponent from '../../common/Image'
import DefaultAvatar from '../../common/DefaultAvatar'

const { HeaderHeight, sidePadding, fontSize, Colors } = helper
const { grey3 } = Colors
const Header = styled(View)`
  width: 100%;
  background: white;
  height: ${HeaderHeight};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-right: ${sidePadding}px;
  padding-left: ${sidePadding}px;
`
const Left = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
`
const Right = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
`
const HeaderText = styled(Text)`
  font-size: ${fontSize.header};
  position: relative;
  left: -10px;
  color: ${grey3};
`

class HeaderComponent extends Component {
  render() {
    const { user } = this.props
    return (
      <Header>
        <Left>
          <BackIcon onPress={this.back} right />
          <HeaderText>Контакты</HeaderText>
        </Left>
        <Right>
          <SearchIcon right />
          <TouchableOpacity onPress={this.toProfile}>
            {!user.image ||
            user.image === '/images/default_group.png' ||
            user.image === '/images/default_avatar.jpg' ? (
              <DefaultAvatar size="header" style={{ marginLeft: 10 }} />
            ) : (
              <ImageComponent
                source={{ uri: `https://ser.univ.team${user.image}` }}
                size="header"
                style={{ marginLeft: 10 }}
              />
            )}
          </TouchableOpacity>
        </Right>
      </Header>
    )
  }

  addContact = () => {
    const { navigate } = this.props
    navigate('NewContact')
  }

  back = () => {
    const { back } = this.props
    back()
  }

  toProfile = () => {
    const { navigate } = this.props
    navigate('Profile')
  }
}
const mapStateToProps = state => ({
  user: state.userReducer.user,
})
const mapDispatchToProps = dispatch => ({})
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HeaderComponent)
