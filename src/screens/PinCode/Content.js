import React, { Component } from 'react'
import { View, AsyncStorage } from 'react-native'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { setUser } from '../../actions/userActions'
// import PINCode from '@haskkor/react-native-pincode'
import helper from '../../utils/helpers'
const Wrapper = styled(View)`
  padding-bottom: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`

const Dot = styled(View)`
  width: 10px;
  height: 10px;
  background: ${({ active }) => (active ? '#fff' : helper.Colors.lightGrey1)};
  border-radius: 5;
  margin-right: ${({ last }) => (!last ? '20px' : 0)};
`
class Content extends Component {
  render() {
    const dots = []
    for (let i = 0; i < 4; i++) {
      dots.push(<Dot active={i < this.state.pin.length} last={i === 3} />)
    }
    return (
      <Wrapper>
        {/* < PINCode
                    titleEnter={'Введите PIN'}
                    disableLockScreen={true}
                    status={'enter'}
                    timeLocked={100}
                    colorCircleButtons={blue}
                    numbersButtonOverlayColor={lightBlue}
                /> */}
      </Wrapper>
    )
  }

  state = {
    pin: [],
  }

  handleChange = e => {
    const { pin } = this.state
    const newPin = [...pin]
    newPin.push(e)
    if (pin.length < 4) {
      this.setState({ pin: newPin })
    }
    if (pin.length === 3) {
      this.setState({ pin: [] })
      this.tryLogin()
    }
  }

  tryLogin = async () => {
    const { toDialogs } = this.props
    let value = await AsyncStorage.getItem('user')
    value = JSON.parse(value)
    setUser({
      id: value.id,
      image:
        value.image ||
        'https://www.paulekman.com/wp-content/uploads/2018/06/personicon-23.png',
    })
    setTimeout(() => {
      toDialogs()
    }, 0)
  }

  goLogin = () => {
    const { navigate } = this.props
    navigate('Login')
  }

  goSignup = () => {
    const { navigate } = this.props
    navigate('Signup')
  }
}

const mapStateToProps = state => ({
  id: state.userReducer.id,
  user: state,
})
const mapDispatchToProps = dispatch => ({
  setUser: _ => dispatch(setUser(_)),
})
export default connect(mapStateToProps, mapDispatchToProps)(Content)
