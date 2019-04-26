import React, { Component } from 'react'
import { View, Text, TextInput, Dimensions } from 'react-native'
import FloatingLabel from 'react-native-floating-labels'
import styled from 'styled-components'
import helper from '../../utils/helpers'
import { connect } from 'react-redux'
import { setUser, setRegisterUserSms } from '../../actions/userActions'
import { Button } from '../../common'
const { Colors, fontSize, HeaderHeightNumber } = helper;
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
    margin-bottom: 30px;
    font-size: ${fontSize.text};

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
    ${({ style }) => style};
`
const Controls = styled(View)`
    align-self: center;
    justify-content: center;
    align-items: center;
`
const SendAgain = styled(Text)`
    text-align: center;
    font-size: ${fontSize.text};
    width: 100%;

`
const NoSMS = styled(SendAgain)`
    color: ${lightGrey1};
`

class Content extends Component {
    render() {
        return (
            <Wrapper>
                <Title>
                    Регистрация
                </Title>
                <SubTitle>
                    Вам выслано sms с временным паролем, введите его тут
                </SubTitle>
                <PhoneNumber>
                    <StyledInput password={true}
                        onChangeText={this.handleSMS}
                        placeholder={'**********'}
                        value={this.state.sms}
                        style={{ margin: 0, flex: 1, textAlign: 'center', paddingLeft: 10, }}
                    />
                </PhoneNumber>
                <Controls>
                    <NoSMS>Не получили sms?</NoSMS>
                    <SendAgain>Отправить sms повторно можно будет через 5:00</SendAgain>
                </Controls>
            </Wrapper>
        )
    }
    state = {
        sms: '',
        asnwer: '1111',
        error: 0,
        tries: 3
    }
    componentDidMount() {
    }
    handleSMS = (e) => {
        const { asnwer, sms, error, tries } = this.state;
        if (error <= tries) {
            sms.length <= 4 && this.setState({ sms: e }, () => {
                if (this.state.sms !== asnwer && this.state.sms.length === asnwer.length) {
                    let err = error
                    ++err
                    this.setState({ error: err, sms: '' })
                }
                if (this.state.sms === asnwer && this.state.sms.length === asnwer.length) {
                    const { setRegisterUserSms } = this.props;
                    setRegisterUserSms(this.state.sms);
                    this.props.forward()

                }
            })
        }

    }
}
const mapStateToProps = state => {
    return {
        id: state.userReducer.id
    };
};
const mapDispatchToProps = dispatch => ({
    setUser: _ => dispatch(setUser(_)),
    setRegisterUserSms: _ => dispatch(setRegisterUserSms(_)),
})
export default connect(mapStateToProps, mapDispatchToProps)(Content)