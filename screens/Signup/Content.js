import React, { Component } from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import FloatingLabel from 'react-native-floating-labels'
import styled from 'styled-components'
import helper from '../../utils/helpers'
import { connect } from 'react-redux'
import { setUser, setRegisterUserNumber } from '../../actions/userActions'
import sendRequest from '../../utils/request'
import { p_get_sms } from '../../constants/api'
import Button from '../../common/Button'
const { Colors, fontSize } = helper;
const { lightGrey1, blue, pink, black } = Colors;
const Wrapper = styled(View)`
    padding: 0 20%;
    justify-content: center;
    flex-grow: 1;
    
`
const Title = styled(Text)`
    width: 100%;
    margin-bottom: 30px;
    font-size: ${fontSize.large};
    text-align: center;
`
const SubTitle = styled(Text)`
    width: 100%;
    color: ${lightGrey1};
    text-align: center;
    font-size: ${fontSize.text};
`
const PhoneNumber = styled(View)`
    display: flex;
    flex-direction: row;
    align-items: flex-end;
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
const ButtonBox = styled(View)`
    width: 170px;
    align-self: center;
    margin-top: 20px;
`
const ErrorText = styled(Text)`
    font-size: ${fontSize.sm};
    text-align: center;
`
const ErrorTextLink = styled(ErrorText)`
    color: ${blue};
    padding-top: 10px;
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
        password={password}
        value={value}
        keyboardType={keyboardType}
        style={{ ...style }}
        editable={editable}
    >{children}</FloatingLabel>

}
class Content extends Component {
    render() {
        const {
            country,
            phone,
            error
        } = this.state
        return (
            <Wrapper>
                <Title>
                    Регистрация
                </Title>
                <SubTitle>
                    Телефон
                </SubTitle>
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
                        style={{ margin: 0, width: '75%', flex: 1, textAlign: 'left', paddingLeft: 20, color: error ? pink : black, borderColor: error ? pink : lightGrey1 }}
                        keyboardType={'phone-pad'} />
                </PhoneNumber>
                {
                    error ? <View>{error}</View> : null
                }
                <ButtonBox>
                    <Button
                        onPress={this.proceed}
                        background={blue}
                        color={'white'}>Продолжить</Button>
                </ButtonBox>
            </Wrapper>
        )
    }
    state = {
        country: '+7',
        phone: '',
        error: false,
        invalidPhone: false,
    }
    componentDidMount() { }
    proceed = () => {
        const { country, phone } = this.state;
        const { setRegisterUserNumber, forward } = this.props;
        phone_number = country.concat(phone)
        if (!phone) {
            this.setState({ error: <ErrorText>Введите телефон</ErrorText> })
        }
        if (phone && phone.length < 9) {
            this.setState({ error: <ErrorText>Проверьте правильность введенного номера</ErrorText> })
        }
        if (phone_number && phone && phone.length >= 9) {
            setRegisterUserNumber(phone_number);
            sendRequest({
                r_path: p_get_sms,
                method: 'post',
                attr: {
                    phone_number,
                },
                success: () => {
                    forward();
                },
                failFunc: (err) => {
                    console.log(err)
                    let { phone_number } = err
                    this.setState({
                        invalidPhone: phone_number || null,
                        error: err.msg === 'Извините, функция недоступна. Попробуйте позже.' ? <ErrorText>{err.description || 'функция временно недоступна'}</ErrorText> : <TouchableOpacity onPress={this.login}><ErrorText>Телефон уже зарегистрирован в системе </ErrorText><ErrorTextLink>Авторизируйтесь</ErrorTextLink></TouchableOpacity>
                    })
                }
            })

        }

    }
    login = () => {
        const { navigate } = this.props;
        navigate('Login')
    }
    handleCountry = (e) => {
        this.setState({ country: e, error: false })
    }
    handlePhone = (e) => {
        this.setState({ phone: e, error: false })
    }
}
const mapStateToProps = state => ({
    id: state.userReducer.id
})
const mapDispatchToProps = dispatch => ({
    setUser: _ => dispatch(setUser(_)),
    setRegisterUserNumber: _ => dispatch(setRegisterUserNumber(_))
})
export default connect(mapStateToProps, mapDispatchToProps)(Content)