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
const { Colors, fontSize } = helper;
const { lightColor, lightGrey1, blue, pink } = Colors;
const { large, text, sm } = fontSize;
const Wrapper = styled(View)`
    padding: 0 20%;
    height: 90%;
    display: flex;
    justify-content: center;
`
const Title = styled(Text)`
    width: 100%;
    font-size: ${large};
    text-align: center;
`
const ControlBar = styled(View)`
    display: flex;
    justify-content: center;
    width: 100%;
    align-items: center;
    align-self: center;
    flex-direction: column;
`

const PhoneNumber = styled(View)`
    display: flex;
    flex-direction: row;
    margin-top: 30px;
    margin-bottom: ${({ err }) => err ? 10 : 35};    
    align-items: flex-end;
`
const Error = styled(View)`
    color: red;
    font-size: ${text};
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`
const ErrorText = styled(Text)`
    font-size: ${sm};
    margin-bottom: 10px;
    text-align: center;
`
const ForgotPass = styled(Text)`
    font-size: ${sm};
    margin-bottom: 10px;
    color: ${blue};
`
const NoAccount = styled(View)`
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    bottom: 0;
    width: 100%;
    align-self: center;
`
const Label = styled(Text)`
    color: ${lightColor};
    font-size: ${sm};
`
const StyledInput = styled(TextInput)`
    border: 1px solid ${lightGrey1};
    border-width: 0;
    border-bottom-width: 1px;
    padding-bottom: ${Platform.OS === 'ios' ? 11 : 6}px;
    text-align: center;
    margin-bottom: 10px;
    color: black;
    ${({ style }) => style};
`
const Input = (props) => {
    const { keyboardType = 'default', onChangeText, children, password = false, value, style, editable, inputStyle, labelStyle } = props;
    return <FloatingLabel
        labelStyle={{
            fontSize: 15,
            ...labelStyle
        }}
        inputStyle={{
            fontSize: 15,
            borderWidth: 0,
            borderBottomColor: lightGrey1,
            borderBottomWidth: 1,
            display: 'flex',
            ...inputStyle
        }}
        keyboardType={keyboardType}
        password={password}
        value={value}
        style={{ ...style }}
        editable={editable}
        onChangeText={onChangeText}
    >{children}</FloatingLabel>

}
class Content extends Component {
    render() {
        const { invalidPassword, invalidPhone, country, phone, password } = this.state;
        const { navigateToDialogs } = this.props;
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <Wrapper onPress={Keyboard.dismiss}>
                    <View>
                        <Title>
                            Авторизация
                        </Title>
                    </View>
                    <PhoneNumber err={invalidPhone}>
                        <Input style={{ width: '20%' }}
                            inputStyle={{ paddingLeft: 0, textAlign: 'center' }}
                            keyboardType={'phone-pad'}
                            value={country}
                            onChangeText={this.handleChangeCountry} />
                        <StyledInput password={true}
                            onChangeText={this.handleChangePhone}
                            value={phone}
                            placeholder={'XXX-XXX-XX-XX'}
                            keyboardType={'phone-pad'}
                            maxLength={10}
                            style={{ margin: 0, width: '78%', flex: 1, textAlign: 'left', paddingLeft: 10, color: invalidPhone ? pink : 'black', borderColor: invalidPhone ? pink : lightGrey1 }}
                        />
                    </PhoneNumber>
                    <ControlBar>
                        <TouchableOpacity onPress={this.signup}>
                            {invalidPhone &&
                                <ErrorText>Номера нет в системе. <ForgotPass>
                                    Зарегистрироваться
                        </ForgotPass></ErrorText>}
                        </TouchableOpacity>
                    </ControlBar>
                    <StyledInput password={true}
                        onChangeText={this.handleChangePassword}
                        value={password}
                        placeholder={'Пароль'}
                        secureTextEntry={true}
                        style={{ color: invalidPassword ? pink : 'black', borderColor: invalidPassword ? pink : lightGrey1 }}
                    />
                    <ControlBar>
                        <TouchableOpacity onPress={this.restorePass}>
                            {invalidPassword ? <ErrorText>
                                Неверный пароль. <ForgotPass>
                                    Восстановить пароль?
                                </ForgotPass>
                            </ErrorText> : <ForgotPass>
                                    Забыли пароль?
                        </ForgotPass>
                            }
                        </TouchableOpacity>
                        <TouchableOpacity onPress={navigateToDialogs}>
                            <Button onPress={this.login} style={{ backgroundColor: blue }} color={'#fff'}>войти</Button>
                        </TouchableOpacity>
                    </ControlBar>
                </Wrapper >
            </TouchableWithoutFeedback>
        )
    }
    state = {
        country: '+7',
        // phone: Dimensions.get('window').width === 375 ? '9123456780' : Dimensions.get('window').width === 320 ? '9123456781' : '9123456782', // restore
        // password: '1111', // restore
        phone: '',
        password: '',
        phone_number: '',
        invalidPassword: false,
        invalidPhone: false,
        loading: false,
    }
    componentDidMount = () => {
        const { navigation, setUser } = this.props;
        // AsyncStorage.getItem('user').then(res => {
        //     value = JSON.parse(res);
        //     if (value) {
        //         this.setState({ phone: value.phone_number.slice(2), password: value.password })
        //         this.login() // restore
        //     }
        // });
    }
    storeUserData = async (user) => {
        try {
            await AsyncStorage.setItem('user', JSON.stringify(user));
        } catch (error) {
            // Error saving data
        }
    };
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
                this.storeUserData({ ...data, password, access_token })
                this.setState({ loading: false })
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
    signup = (e) => {
        const { navigate } = this.props;
        navigate('Signup')
    }
    restorePass = e => {
        const { navigate } = this.props;
        navigate('Restore')
    }
    handleChangePassword = (e) => {
        this.setState({ password: e, invalidPassword: false })
    }
    handleChangePhone = (e) => {
        this.setState({ phone: e, invalidPhone: false })
    }
    handleChangeCountry = (e) => {
        this.setState({ country: e })
    }
    componentWillMount() {

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
export default connect(mapStateToProps, mapDispatchToProps)(Content)