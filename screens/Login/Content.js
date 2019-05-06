import React, { Component } from 'react'
import { View, Text, TouchableOpacity, TextInput, AsyncStorage, Platform, Dimensions } from 'react-native'
import helper from '../../utils/helpers'
import FloatingLabel from 'react-native-floating-labels'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { setUser, setAuth } from '../../actions/userActions'
import { p_login } from '../../constants/api'
import sendRequest from '../../utils/request'
import { connectToSocket } from '../../utils/socket'
const { Colors, fontSize } = helper;
const { lightColor, lightGrey1, blue } = Colors;
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
    flex-direction: column;
`

const PhoneNumber = styled(View)`
    display: flex;
    flex-direction: row;
    margin-top: 30px;
    margin-bottom: 30px;
    align-items: flex-end;
`
const Error = styled(Text)`
    color: red;
    font-size: ${text};
    width: 100%;
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
            borderColor: lightGrey1,
            borderWidth: 0,
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
        const { error, country, phone, password } = this.state;
        const { navigateToDialogs } = this.props;
        return (<Wrapper>
            <Title>
                Авторизация
                </Title>
            <PhoneNumber>
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
                    style={{ margin: 0, width: '78%', flex: 1, textAlign: 'left', paddingLeft: 10, color: error ? 'red' : undefined, borderColor: error ? 'red' : lightGrey1 }}
                />
            </PhoneNumber>
            <StyledInput password={true}
                onChangeText={this.handleChangePassword}
                value={password}
                placeholder={'Пароль'}
                secureTextEntry={true}
                style={{ color: error ? 'red' : undefined, borderColor: error ? 'red' : lightGrey1 }}
            />

            <ControlBar>
                <TouchableOpacity onPress={this.restorePass}>
                    <ForgotPass>
                        Забыли пароль?
                        </ForgotPass>
                </TouchableOpacity>
                <TouchableOpacity onPress={navigateToDialogs}>
                    <Button onPress={this.login} style={{ backgroundColor: blue }} color={'#fff'}>войти</Button>
                </TouchableOpacity>
            </ControlBar>
        </Wrapper >
        )
    }
    state = {
        country: Dimensions.get('window').width === 375 ? '+7' :  Dimensions.get('window').width === 320 ? '+7' : '+380',
        phone: Dimensions.get('window').width === 375 ? '9194274215' : Dimensions.get('window').width === 320 ? '9194274251' : '637072785',
        phone_number: '',
        password: '1111',
        error: null,
        invalidPassword: null,
        invalidPhone: null,
        loading: false,
    }
    componentDidMount = async () => {
        connectToSocket()
        this.login()
        const { navigate, setUser } = this.props;
        let value = await AsyncStorage.getItem('user');
        value = JSON.parse(value);
        if (value) {
            this.setState({ phone: value.phone.slice(2) })
            setUser({
                ...value,
                id: value.id,
                image: value.image || 'https://www.paulekman.com/wp-content/uploads/2018/06/personicon-23.png'
            })
            setTimeout(() => navigate('Dialogs'), 0)
        }
    }
    storeUserData = async (user) => {
        try {
            await AsyncStorage.setItem('user', user);
        } catch (error) {
            // Error saving data
        }
    };
    login = async (e) => {
        const { navigate, setUser } = this.props;
        const { country, phone, password } = this.state;
        let value = await AsyncStorage.getItem('user');
        value = JSON.parse(value);
        const phone_number = country.concat(phone)
        sendRequest({
            r_path: p_login,
            method: 'post',
            attr: {
                phone_number,
                password,
            },
            success: (res) => {
                const { setAuth, setUser, navigation } = this.props
                const { access_token, data } = res
                setAuth(access_token)
                setUser(data)
                this.setState({ loading: false })
                navigate('Dialogs')
            },
            failFunc: (err) => {
                let { phone_number, password } = err
                this.setState({
                    loading: false,
                    error: true,
                    invalidPhone: phone_number || null,
                    invalidPassword: password || null
                })
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
        this.setState({ password: e })

    }
    handleChangePhone = (e) => {
        e.length <= 10 && this.setState({ phone: e })
    }
    handleChangeCountry = (e) => {
        console.log(e)
        this.setState({ country: e })
    }
    componentWillMount() {

    }
}

const mapStateToProps = state => ({
        id: state.userReducer.id
})
const mapDispatchToProps = dispatch => ({
    setAuth: info => { dispatch(setAuth(info)) },
    setUser: info => { dispatch(setUser(info)) },
})
export default connect(mapStateToProps, mapDispatchToProps)(Content)