import React, { Component } from 'react'
import { View, Dimensions } from 'react-native'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { CloseIcon } from '../../assets/index'
import helper from '../../utils/helpers'
const { sidePadding, HeaderHeight } = helper
const Wrapper = styled(View)`
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
const Top = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: ${HeaderHeight};
  width: 100%;
`
class Header extends Component {
  render() {
    return (
      <Wrapper>
        <Top>
          <Left>
            <CloseIcon right onPress={this.back} />
          </Left>
        </Top>
      </Wrapper>
    )
  }

  back = () => {
    const { back } = this.props
    back()
  }
}
const mapStateToProps = () => ({})
const mapDispatchToProps = () => ({})
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Header)
