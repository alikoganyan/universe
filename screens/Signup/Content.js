import React, { Component } from 'react'
import { View, Text, TextInput, Dimensions } from 'react-native'
import FloatingLabel from 'react-native-floating-labels'
import styled from 'styled-components'
import helper from '../../utils/helpers'
import { connect } from 'react-redux'
import { setUser, registerUser } from '../../actions/userActions'
import { Button } from '../../common'
const { Colors, HeaderHeightNumber, socket, fontSize } = helper;
const { lightGrey1, blue } = Colors;
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
    font-size: ${fontSize.text}
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
    ${({ style }) => style}
`
const ButtonBox = styled(View)`
    width: 170px;
    align-self: center;
`
const Input = (props) => {
    const { children, password = false, value, style, editable, inputStyle, labelStyle } = props;
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
        style={{ ...style }}
        editable={editable}
    >{children}</FloatingLabel>

}
class Content extends Component {
    render() {
        const {
            country,
            phone
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
                        value='+7'
                        inputStyle={{ paddingLeft: 0, textAlign: 'center' }} />
                    <StyledInput password={true}
                        onChangeText={this.handlePhone}
                        value={phone}
                        placeholder={'XXX-XXX-XX-XX'}
                        style={{ margin: 0, width: '75%', flex: 1, textAlign: 'left', paddingLeft: 20, }}
                    />
                </PhoneNumber>
                <ButtonBox>
                    <Button
                        onPress={this.proceed}
                        style={{ background: blue }}
                        color={'white'}>Продолжить</Button>
                </ButtonBox>
            </Wrapper>
        )
    }
    state = {
        country: '+7',
        phone: '',
    }
    componentDidMount() {


        socket.on('user exists', e => {
            console.log(e)
        })
        socket.on('check user', e => {
            const { country, phone } = this.state;
            const { registerUser } = this.props;
            registerUser(country + phone)
            this.props.forward()
        })

    }
    proceed = (e) => {
        const { country, phone } = this.state;
        const { registerUser } = this.props;
        country && phone &&
            socket.emit('check user', {
                "phone": country + phone
            })

    }
    handleCountry = (e) => {
        this.setState({ country: e })
    }
    handlePhone = (e) => {
        e.length <= 10 && this.setState({ phone: e })
    }
}
const mapStateToProps = state => {
    return {
        id: state.userReducer.id
    };
};
const mapDispatchToProps = dispatch => ({
    setUser: _ => dispatch(setUser(_)),
    registerUser: _ => dispatch(registerUser(_))
})
export default connect(mapStateToProps, mapDispatchToProps)(Content)