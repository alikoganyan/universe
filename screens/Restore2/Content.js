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
    font-size: 18px;
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
const NoCode = styled(View)`
    display: flex;
    justify-content: center;
`
const NoCodeLabel = styled(Text)`
    font-size: 11px;
    color: ${grey1};
    text-align: center;
`
const NoCodeTimer = styled(Text)`
    font-size: 11px;
    text-align: center;
`
const Input = (props) => {
    const { autoFocus = 'false', keyboardType = 'number-pad', children, password = false, value, style, editable, onChangeText, inputStyle } = props;
    return <FloatingLabel
        labelStyle={{ fontSize: 11 }}
        inputStyle={{
            fontSize: 11,
            borderWidth: 0,
            borderBottomWidth: 1,
            display: 'flex',
            textAlign: 'center',
            paddingLeft: 0,
            ...inputStyle
        }}
        keyboardType={keyboardType}
        password={password}
        value={value}
        style={{
            ...style
        }}
        editable={editable}
        onChangeText={onChangeText}
        autoFocus={autoFocus}
    >{children}</FloatingLabel>

}
class Content extends Component {
    render() {
        const { code, error } = this.state;
        console.log(error)
        return (
            <Wrapper>
                <Title>
                    Восстановление пароля
                </Title>
                <Label>Вам отправлено sms с временным паролем, {'\n'}введите его тут</Label>
                <PhoneNumber>
                    <Input autoFocus={'true'} style={{
                        width: '100%', textAlign: 'center',
                    }} inputStyle={{ color: error ? 'red' : undefined, borderColor: error ? 'red' : undefined }} value={code} onChangeText={this.handleChangeCode} keyboardType={'phone-pad'} />
                </PhoneNumber>
                <ControlBar>
                    {code.length === 4 ? <Button onPress={this.proceed} style={{ backgroundColor: blue }} color={'#fff'}>Отправить</Button> :
                        <NoCode>
                            <NoCodeLabel>Не получили смс?</NoCodeLabel>
                            <NoCodeTimer>Отправить sms повторно можно будет через 4:56</NoCodeTimer>
                        </NoCode>}
                </ControlBar>
            </Wrapper>
        )
    }
    state = {
        error: false,
        code: '',
        answer: '4444',
    }
    componentDidMount() {
        const { register } = this.props;
        const { sms } = register;
        this.setState({ answer: sms }, () => console.log(this.state.answer))
    }
    handleChangeCode = e => {
        const { answer } = this.state;
        e.length <= answer.length && this.setState({ code: e });
    }
    proceed = e => {
        const { code, answer } = this.state;

        if (code === answer) {
            this.checkCode();
        } else {
            this.setState({ error: true })
        }
    }
    checkCode = e => {
        const { navigate, register } = this.props;
        const { code } = this.state;
        console.log(register.phone);
        const phone_number = register.phone;
        sendRequest({
            r_path: p_check_restore_password,
            method: 'post',
            attr: {
                phone_number,
                password: code,
            },
            success: (res) => {
                navigate('Restore3');
            },
            failFunc: (err) => {
                console.log(err);
                this.setState({ error: true })
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
