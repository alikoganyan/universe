import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity, TextInput, AsyncStorage, Platform } from 'react-native'
import helper from '../../Helper/helper'
import styled from 'styled-components'
import { setUser } from '../../actions/userActions'
import { connect } from 'react-redux'
// import PINCode from '@haskkor/react-native-pincode'
const { Colors, fontSize } = helper;
const { border, blue, grey1, lightGrey1, lightBlue } = Colors;
const { xs, xl, large, text } = fontSize
const Wrapper = styled(View)`
    padding-bottom: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
`
const Header = styled(Text)`
    font-size: ${xs};
    color: white;
    margin-bottom: 20px;
`
const Dots = styled(View)`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 20px;
`
const Dot = styled(View)`
    width: 10px;
    height: 10px;
    background: ${({ active }) => active ? '#fff' : lightGrey1};
    border-radius: 5;
    margin-right: ${({ last }) => !last ? '20px' : 0};
`
const ButtonBox = styled(View)`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 0 20px;
`
const NumberButton = styled(TouchableOpacity)`
    background: ${({ transparent }) => transparent ? 'transparent' : blue};
    align-items: center;
    justify-content: center;
    margin-right: ${({ right }) => right ? 0 : 20}px;
    padding: 10px;
    width: 100px;
    height: 100px;
    border-radius: 200;
    margin-bottom: 15px;

`
const NumberButtonText = styled(Text)`
    color: white;
    font-size: ${xs};
`
class Content extends Component {
    render() {
        const buttons = [
            1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, null
        ]
        const dots = [];
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
    handleChange = (e) => {
        const { pin, user } = this.state;
        const newPin = [...pin];
        newPin.push(e);
        if (pin.length < 4) {
            this.setState({ pin: newPin });
        }
        if (pin.length === 3) {
            this.setState({ pin: [] });
            this.tryLogin()

        }
    }
    tryLogin = async () => {
        const { toDialogs, user } = this.props;
        let value = await AsyncStorage.getItem('user');
        value = JSON.parse(value);
        setUser({
            id: value.id,
            image: value.image || 'https://www.paulekman.com/wp-content/uploads/2018/06/personicon-23.png',
        })
        setTimeout(() => {
            toDialogs()
        }, 0)
    }
    goLogin = () => {
        const { navigate } = this.props;
        navigate('Login')
    }
    goSignup = () => {
        const { navigate } = this.props;
        navigate('Signup')
    }
}

const mapStateToProps = state => {
    return {
        id: state.userReducer.id,
        user: state,
    };
};
const mapDispatchToProps = dispatch => ({
    setUser: _ => dispatch(setUser(_)),
})
export default connect(mapStateToProps, mapDispatchToProps)(Content)