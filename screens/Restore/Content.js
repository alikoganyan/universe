import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Dimensions, Platform } from 'react-native'
import helper from '../../utils/helpers'
import FloatingLabel from 'react-native-floating-labels'
import styled from 'styled-components'
import {
    p_get_restore_password,
} from '../../constants/api'
import { setRegisterUserNumber, setRegisterUserSms } from '../../actions/userActions'
import sendRequest from '../../utils/request'
import { connect } from 'react-redux'
const { Colors, HeaderHeightNumber } = helper;
const { blue, grey1 } = Colors;
const Wrapper = styled(View)`
    padding: 0 20%;
    padding-bottom: 10%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    
`
const Title = styled(Text)`
    width: 100%;
    font-size: 20px;
    text-align: center;
    margin-bottom: 20px;
`
const ControlBar = styled(View)`
    display: flex;
    justify-content: center;
    width: 100%;
    align-items: center;
`
const PhoneNumber = styled(View)`
    display: flex;
    flex-direction: row;
    margin-bottom: 30px;
`
const Label = styled(Title)`
    font-size: 13px;
    color: ${grey1};
    margin-bottom: 0px;
`
const Input = (props) => {
    const { keyboardType = 'number-pad', children, password = false, value, style, editable, onChangeText } = props;
    return <FloatingLabel
        labelStyle={{ fontSize: 11 }}
        inputStyle={{
            fontSize: 11,
            borderWidth: 0,
            borderBottomWidth: 1,
            display: 'flex',
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
        const { country, phone } = this.state;
        return (
            <Wrapper>
                <Title>
                    Восстановление пароля
                </Title>
                <Label>Телефон</Label>
                <PhoneNumber>
                    <Input style={{ width: '25%' }} value={country} onChangeText={this.handleChangeCountry} keyboardType={'phone-pad'} />
                    <Input style={{ width: '75%' }} value={phone} onChangeText={this.handleChangePhone} />
                </PhoneNumber>
                <ControlBar>
                    <Button onPress={this.proceed} style={{ backgroundColor: blue }} color={'#fff'}>Восстановить пароль</Button>
                </ControlBar>
            </Wrapper>
        )
    }
    state = {
        error: false,
        country: '+380',
        phone: '637072785',
    }
    handleChangeCountry = e => {
        this.setState({ country: e });
    }
    handleChangePhone = e => {
        this.setState({ phone: e });
    }
    proceed = e => {
        this.getRestorePassword()
    }
    getRestorePassword = e => {
        const { country, phone } = this.state;
        const { navigate, setRegisterUserNumber, setRegisterUserSms } = this.props;
        const phone_number = country.concat(phone)
        sendRequest({
            r_path: p_get_restore_password,
            method: 'post',
            attr: {
                phone_number,
            },
            success: (res) => {
                setRegisterUserNumber(phone_number);
                setRegisterUserSms('1111');
                setTimeout(() => navigate('Restore2'), 0)
            },
            failFunc: (err) => {
                console.log(err)
                let { phone_number, password } = err
                this.setState({
                    loading: false,
                    invalidPhone: phone_number || null,
                    invalidPassword: password || null
                })
            }
        })
    }
}
const mapStateToProps = state => {
    return {
        id: state.userReducer.id
    };
};
const mapDispatchToProps = dispatch => ({
    setRegisterUserNumber: _ => { dispatch(setRegisterUserNumber(_)) },
    setRegisterUserSms: _ => { dispatch(setRegisterUserSms(_)) },
})
export default connect(mapStateToProps, mapDispatchToProps)(Content)