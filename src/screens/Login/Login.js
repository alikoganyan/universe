import React, { Component } from 'react'
import { Text, View, TouchableOpacity, BackHandler } from 'react-native'
import styled from 'styled-components'
import Content from './Content'
import SafeAreaView from '../../common/SafeAreaView'
import helper from '../../utils/helpers'

const { Colors, fontSize } = helper
const { lightColor, blue } = Colors
const Wrapper = styled(View)`
  height: 100%;
`
const NoAccount = styled(View)`
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 10;
  width: 100%;
  align-self: center;
`
const Label = styled(Text)`
  color: ${lightColor};
  font-size: ${fontSize.text};
`
const SingUp = styled(Text)`
  color: ${blue};
`
export default class PinCode extends Component {
  render() {
    return (
      <SafeAreaView behavior="padding">
        <Wrapper>
          <Content navigate={this.navigate} />
          <NoAccount>
            <Label>Нет аккаунта?</Label>
            <TouchableOpacity onPress={this.signup}>
              <SingUp>Зарегистрироваться</SingUp>
            </TouchableOpacity>
          </NoAccount>
        </Wrapper>
      </SafeAreaView>
    )
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this._handleBackButton)
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this._handleBackButton)
  }

  _handleBackButton = () => {
    BackHandler.exitApp()
  }

  navigate = e => {
    const { navigation } = this.props
    navigation.navigate(e)
  }

  signup = () => this.navigate('Signup')
}
