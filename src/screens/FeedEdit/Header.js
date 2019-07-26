import React, { Component } from 'react'
import { View, Text, Dimensions } from 'react-native'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { CloseIcon } from '../../assets/index'
import helper from '../../utils/helpers'

const { sidePadding, HeaderHeight, Colors, fontSize } = helper
const { grey3 } = Colors
const Header = styled(View)`
  width: ${Dimensions.get('window').width - sidePadding * 2}px;
  align-self: center;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`
const Left = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
`
const Right = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: flex-end;
`
const Top = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: ${HeaderHeight};
  width: 100%;
`
const HeaderText = styled(Text)`
  font-size: ${fontSize.header};
  position: relative;
  left: -10px;
  color: ${grey3};
`
class HeaderComponent extends Component {
  render() {
    return (
      <Header>
        <Top>
          <Left>
            <CloseIcon right onPress={this.back} />
            <HeaderText>Редактирование новости</HeaderText>
          </Left>
          <Right />
        </Top>
      </Header>
    )
  }

  back = () => {
    const { back } = this.props
    back()
  }
}
const mapStateToProps = state => ({})
const mapDispatchToProps = dispatch => ({})
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HeaderComponent)
