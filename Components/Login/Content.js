import React, { Component } from 'react'
import { View, Text, TouchableOpacity, TextInput, AsyncStorage } from 'react-native'
import { Font } from 'expo'
import helper from '../../Helper/helper'
import FloatingLabel from 'react-native-floating-labels'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { setUser } from '../../actions/userActions'
const { Colors, fontSize, socket } = helper;
const { border, lightColor, lightGrey1, color, blue } = Colors;
const { large, header, text } = fontSize;
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
    font-size: 12px;
    width: 100%;
`
const ForgotPass = styled(Text)`
    font-size: 10px;
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
    font-size: 10px;
`
const StyledInput = styled(TextInput)`
    border: 1px solid ${lightGrey1};
    border-width: 0;
    border-bottom-width: 1px;
    padding-bottom: 10px;
    text-align: center;
    margin-bottom: 10px;
    ${({ style }) => style};
`
const Input = (props) => {
    const { children, password = false, value, style, editable, inputStyle, labelStyle } = props;
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
        password={password}
        value={value}
        style={{ ...style }}
        editable={editable}
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
            {error && <Error>
                Номер телефона задан некорректно
                </Error>}
            <PhoneNumber>
                <Input style={{ width: '20%', }}
                    inputStyle={{ paddingLeft: 0, textAlign: 'center' }}
                    value={country}
                    onChangeText={this.handleChangeCountry} />
                <StyledInput password={true}
                    onChangeText={this.handleChangePhone}
                    value={phone}
                    placeholder={'XXX-XXX-XX-XX'}
                    style={{ margin: 0, width: '78%', flex: 1, textAlign: 'left', paddingLeft: 10 }}
                />
            </PhoneNumber>
            <StyledInput password={true}
                onChangeText={this.handleChangePassword}
                value={password}
                placeholder={'Пароль'}
                secureTextEntry={true}
            />

            <ControlBar>
                <TouchableOpacity>
                    <ForgotPass>
                        забыли пароль?
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
        error: false,
        password: '',
        phone: '',
        country: '+7'
    }
    componentDidMount = async () => {

        const { navigate, setUser } = this.props;
        let value = await AsyncStorage.getItem('user');
        value = JSON.parse(value);
        console.log(1);
        if (value) {
            this.setState({ phone: value.phone.slice(2) })
            setUser({
                ...value,
                id: value.id,
                image: value.image || 'https://www.paulekman.com/wp-content/uploads/2018/06/personicon-23.png'
            })
            socket.emit('update user', { id: value.id })
            socket.on('update user', e => setUser({ ...e, image: e.image || 'https://www.paulekman.com/wp-content/uploads/2018/06/personicon-23.png', }))
            console.log(2);

            setTimeout(() => navigate('Dialogs'), 0)
        }
        socket.on('login success', async ({ result }) => {
            const { image } = result;
            const user = {
                ...result,
                image: image || 'https://www.paulekman.com/wp-content/uploads/2018/06/personicon-23.png',
            }
            await AsyncStorage.setItem('user', JSON.stringify(user))
            setUser(user)
            this.storeUserData(JSON.stringify(user))
            navigate('Dialogs')
            console.log(3);

        })
        socket.on('login error', e => {
            console.log(e)
        })
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
        console.log(1);
        if (value) {
            this.setState({ phone: value.phone.slice(2) })
            setUser({
                ...value,
                id: value.id,
                image: value.image || 'https://www.paulekman.com/wp-content/uploads/2018/06/personicon-23.png'
            })
            socket.emit('update user', { id: value.id })
            socket.on('update user', e => setUser({ ...e, image: e.image || 'https://www.paulekman.com/wp-content/uploads/2018/06/personicon-23.png', }))
            console.log(2);

            setTimeout(() => navigate('Dialogs'), 0)
        } else {
            socket.emit('login', { phone: country.concat(phone), password })

        }
    }
    signup = (e) => {
        const { navigate } = this.props;
        navigate('Signup')
    }
    handleChangePassword = (e) => {
        this.setState({ password: e })

    }
    handleChangePhone = (e) => {
        e.length <= 10 && this.setState({ phone: e })
    }
    handleChangeCountry = (e) => {
        e.length <= 3 && this.setState({ country: e })
    }
    componentWillMount() {
        console.log('unmounted');
    }
}

const mapStateToProps = state => {
    return {
        id: state.userReducer.id
    };
};
const mapDispatchToProps = dispatch => ({
    setUser: _ => dispatch(setUser(_)),
})
export default connect(mapStateToProps, mapDispatchToProps)(Content)