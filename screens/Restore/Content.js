import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Dimensions, Platform, TextInput } from 'react-native'
import helper from '../../utils/helpers'
import FloatingLabel from 'react-native-floating-labels'
import styled from 'styled-components'
import { p_get_restore_password } from '../../constants/api'
import { setRegisterUserNumber } from '../../actions/userActions'
import sendRequest from '../../utils/request'
import { connect } from 'react-redux'
const { Colors, HeaderHeight } = helper;
const { blue, grey1, lightGrey1 } = Colors;
const Wrapper = styled(View)`
    padding: 0 20%;
    padding-bottom: 10%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
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
    min-width: 250px;
    align-items: center;
`
const PhoneNumber = styled(View)`
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    margin-bottom: 20px;
`
const StyledInput = styled(TextInput)`
    border: 1px solid ${lightGrey1};
    border-width: 0;
    border-bottom-width: 1px;
    padding-bottom: 10px;
    text-align: center;
    margin-bottom: 10px;
    margin-left: 20px;
    ${({ style }) => style};
`
const Label = styled(Title)`
    font-size: 15px;
    color: ${lightGrey1};
    margin-bottom: 0px;
`
const Input = (props) => {
    const { children, password = false, value, style, editable, inputStyle, labelStyle, keyboardType } = props;
    return <FloatingLabel
        labelStyle={{ fontSize: 15, ...labelStyle }}
        inputStyle={{
            fontSize: 15,
            borderWidth: 0,
            borderBottomWidth: 1,
            display: 'flex',
            borderColor: lightGrey1,
            ...inputStyle
        }}
        keyboardType={keyboardType}
        password={password}
        value={value}
        style={{ ...style }}
        editable={editable}
    >{children}</FloatingLabel>

}
class Content extends Component {
    render() {
        const { country, phone, error } = this.state;
        return (
            <Wrapper>
                <Title>
                    Восстановление пароля
                </Title>
                <Label>Телефон</Label>
                <PhoneNumber>
                    <Input
                        value={country} onPress={this.handleCountry}
                        style={{ width: '20%' }}
                        inputStyle={{ paddingLeft: 0, textAlign: 'center' }}
                        keyboardType={'phone-pad'} />
                    <StyledInput password={true}
                        onChangeText={this.handlePhone}
                        value={phone}
                        placeholder={'XXX-XXX-XX-XX'}
                        maxLength={10}
                        style={{ margin: 0, width: '75%', flex: 1, textAlign: 'left', paddingLeft: 20, color: error ? 'red' : null, borderColor: error ? 'red' : lightGrey1 }}
                        keyboardType={'phone-pad'} />
                </PhoneNumber>
                <ControlBar>
                    <Button onPress={this.proceed} style={{ backgroundColor: blue, width: '100%' }} color={'#fff'} >Восстановить пароль</Button>
                </ControlBar>
            </Wrapper>
        )
    }
    state = {
        error: false,
        country: '+7',
        phone: '',
    }
    handleCountry = e => {
        this.setState({ country: e });
    }
    handlePhone = e => {
        this.setState({ phone: e });
    }
    proceed = e => {
        this.getRestorePassword()
    }
    getRestorePassword = e => {
        const { country, phone } = this.state;
        const { navigate, setRegisterUserNumber } = this.props;
        const phone_number = country.concat(phone)
        sendRequest({
            r_path: p_get_restore_password,
            method: 'post',
            attr: {
                phone_number,
            },
            success: (res) => {
                setRegisterUserNumber(phone_number);
                setTimeout(() => navigate('Restore2'), 0)
            },
            failFunc: (err) => {
                console.log(err)
                let { phone_number, password } = err
                this.setState({
                    error: true,
                    loading: false,
                    invalidPhone: phone_number || null,
                    invalidPassword: password || null
                })
            }
        })
    }
}
const mapStateToProps = state => ({
    id: state.userReducer.id
})
const mapDispatchToProps = dispatch => ({
    setRegisterUserNumber: _ => { dispatch(setRegisterUserNumber(_)) },
})
export default connect(mapStateToProps, mapDispatchToProps)(Content)