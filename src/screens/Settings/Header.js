import React, { Component } from 'react'
import { Text, View } from 'react-native'
import styled from 'styled-components'
import { connect } from 'react-redux'
import helper from '../../utils/helpers'
import Company from '../../common/Company'

const { Colors } = helper
const Title = styled(Text)`
  font-family: 'OpenSans-Bold';
  font-size: 30px;
  color: ${Colors.black};
  padding: 0 16px 8px;
  background-color: ${Colors.white};
  z-index: 2;
`

const HeaderContainer = styled(View)`
  margin-top: 37px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  z-index: 2;
  background-color: #ffffff;
`
class HeaderComponent extends Component {
  render() {
    return (
      <HeaderContainer>
        <Title>Настройки</Title>
        <Company navigate={this.props.navigate} />
      </HeaderContainer>
    )
  }
}

const mapStateToProps = state => ({
  user: state.userReducer.user,
})

export default connect(
  mapStateToProps,
  null,
)(HeaderComponent)
