import React, { Component } from 'react'
import { Text, View } from 'react-native'
import styled from 'styled-components'
import { connect } from 'react-redux'
import helper from '../../utils/helpers'
import Company from '../../common/Company'
import AnimatedEllipsis from 'react-native-animated-ellipsis'

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
  margin-top: 49px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  z-index: 2;
  background-color: #ffffff;
`
class HeaderComponent extends Component {
  render() {
    const { companyLoading, connection } = this.props

    return (
      <HeaderContainer>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Title style={{ paddingRight: 0 }}>
            {!connection
              ? 'Соединение'
              : !!companyLoading
              ? 'Обновляется'
              : 'Настройки'}{' '}
          </Title>
          {!!(!connection || companyLoading) && (
            <AnimatedEllipsis
              style={{ color: 'black', top: -5, fontSize: 35, left: 0 }}
            />
          )}
        </View>
        {/*<Title>Настройки</Title>*/}
        <Company navigate={this.props.navigate} />
      </HeaderContainer>
    )
  }
}

const mapStateToProps = state => ({
  user: state.userReducer.user,
  companyLoading: state.dialogsReducer.companyLoading,
  connection: state.baseReducer.connection,
})

export default connect(mapStateToProps, null)(HeaderComponent)
