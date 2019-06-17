import React, { Component } from 'react'
import { View, Text, TouchableOpacity, TextInput, AsyncStorage, Platform, Dimensions, Keyboard, TouchableWithoutFeedback } from 'react-native'
import helper from '../../utils/helpers'
import FloatingLabel from 'react-native-floating-labels'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { setUser, setAuth, setRegisterUserNumber } from '../../actions/userActions'
import { p_login } from '../../constants/api'
import sendRequest from '../../utils/request'
import { connectToSocket } from '../../utils/socket'
import { Login, Dialogs, SplashScreen } from '../'
const { Colors, fontSize } = helper;
const { lightColor, lightGrey1, blue, pink } = Colors;
const { large, text, sm } = fontSize;
class FirstScreen extends Component {
    static navigationOptions = {
        drawerLockedMode: 'locked-open',
    }
    render() {
        const { logged, loaded } = this.state
        return loaded ? <View>
                            {
                                logged ? 
                                    // <Text>Dialogs</Text> : 
                                    <Dialogs navigation={this.props.navigation}/> : 
                                    <Login navigation={this.props.navigation}/>
                            }
                        </View> : <SplashScreen />

    }

    state = {
        logged: false,
        loaded: false,
    }
    componentDidMount() {
        // AsyncStorage.getAllKeys
        // .then(res => {
        //     value = JSON.parse(res);
        //     console.log(res, '123')
        //     if(value._id) this.setState({loaded: true})
        // });
        AsyncStorage.getItem('user').then(res => {
            value = JSON.parse(res);
            if (value) {
                // this.login() // restore
                this.props.setUser({ ...value })
                this.props.setAuth(value.access_token)
                setTimeout(() => {
                    connectToSocket()
                    console.log(value.access_token)
                    this.setState({ logged: true, phone: value.phone_number.slice(2), password: value.password })
                }, 0)
            }
            setTimeout(() => this.setState({ loaded: true }), 0)
        });
    }
    login = (e) => {
        const { navigate, setUser, setRegisterUserNumber } = this.props;
        const { country, phone, password } = this.state;
        const phone_number = country.concat(phone)
        if (!phone || !phone.length) this.setState({ invalidPhone: true })
        if (!password || password.length < 4) this.setState({ invalidPassword: true })
        setTimeout(() => this.setState({ invalidPhone: false, invalidPassword: false }), 5000)
        sendRequest({
            r_path: p_login,
            method: 'post',
            attr: {
                phone_number,
                password,
            },
            success: (res) => {
                const { setAuth, setUser, navigate } = this.props
                const { access_token, data } = res
                setAuth(access_token)
                setUser(data)
                connectToSocket()
                this.storeUserData({ ...data, password })
                setTimeout(() => navigate('Dialogs'), 0)
            },
            failFunc: (err) => {
                const phone = err.length ? err.filter(e => e.param === 'phone_number')[0] : err.phone_number;
                const pass = err.length ? err.filter(e => e.param === 'password')[0] : err.password;
                setRegisterUserNumber(phone_number)
                if (phone) {
                    this.setState({ invalidPhone: true })
                }
                if (pass) {
                    this.setState({ invalidPassword: true })
                }
            }
        })
    }
}

const mapStateToProps = state => ({
    id: state.userReducer.id
})
const mapDispatchToProps = dispatch => ({
    setAuth: _ => dispatch(setAuth(_)),
    setUser: _ => dispatch(setUser(_)),
    setRegisterUserNumber: _ => dispatch(setRegisterUserNumber(_)),
})
export default connect(mapStateToProps, mapDispatchToProps)(FirstScreen)