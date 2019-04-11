import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Dimensions, Platform } from 'react-native'
import helper from '../../utils/helpers'
import FloatingLabel from 'react-native-floating-labels'
import styled from 'styled-components'
import { connect } from 'react-redux'
import {
    p_get_restore_password,
    p_check_restore_password,
    p_restore_password,
} from '../../constants/api'
import sendRequest from '../../utils/request'
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
    font-size: 15px;
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
    flex-direction: column;
    margin-bottom: 30px;
`
const Input = (props) => {
    const { autoFocus = 'false', keyboardType = 'default', children, password = false, value, style, editable, onChangeText } = props;
    return <FloatingLabel
        labelStyle={{ fontSize: 11 }}
        inputStyle={{
            fontSize: 11,
            borderWidth: 0,
            borderBottomWidth: 1,
            display: 'flex',
            paddingLeft: 0,
        }}
        keyboardType={keyboardType}
        password={password}
        value={value}
        style={{
            ...style,
        }}
        editable={editable}
        onChangeText={onChangeText}
        autoFocus={autoFocus}
    >{children}</FloatingLabel>

}
class Content extends Component {
    render() {
        const { pass, repass } = this.props;
        return (
            <Wrapper>
                <Title>
                    Восстановить пароль
                </Title>
                <PhoneNumber>
                    <Input autoFocus={'true'} style={{ minWidth: '100%' }} value={pass} onChangeText={this.handleChangePass} password={true}>Новый пароль</Input>
                    <Input style={{ minWidth: '100%' }} value={repass} onChangeText={this.handleChangeRepass} password={true}>Повторите пароль</Input>
                </PhoneNumber>
                <ControlBar>
                    <Button onPress={this.proceed} style={{ backgroundColor: blue }} color={'#fff'}>Сохранить и войти</Button>
                </ControlBar>
            </Wrapper>
        )
    }
    state = {
        error: false,
        pass: '',
        repass: '',
    }
    componentDidMount() {
        const { register } = this.props;
        const { sms } = register;
        this.setState({ answer: sms })
    }
    handleChangePass = e => {
        this.setState({ pass: e });
    }
    handleChangeRepass = e => {
        this.setState({ repass: e });
    }
    proceed = e => {
        const { pass, repass } = this.state;
        (pass === repass && pass.length >= 4) && this.checkCode()

    }
    checkCode = e => {
        const { navigate, register } = this.props;
        const { pass, repass } = this.state;
        const phone_number = register.phone;
        sendRequest({
            r_path: p_restore_password,
            method: 'post',
            attr: {
                phone_number,
                new_password: pass,
                repeat_password: repass
            },
            success: (res) => {
                navigate('Login');
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
        register: state.userReducer.register,
    };
};
const mapDispatchToProps = dispatch => ({
})
export default connect(mapStateToProps, mapDispatchToProps)(Content)
