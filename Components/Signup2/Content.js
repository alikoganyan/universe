import React, { Component } from 'react'
import { View, Text, TextInput, Dimensions } from 'react-native'
import FloatingLabel from 'react-native-floating-labels'
import styled from 'styled-components'
import helper from '../../Helper/helper'
import { connect } from 'react-redux'
import { setUser } from '../../actions/userActions'
import { Button } from '../../Common'
const { Colors, fontSize, HeaderHeightNumber, socket } = helper;
const { lightGrey1, blue } = Colors;
const Wrapper = styled(View)`
    padding: 0 20%;
    justify-content: center;
    flex-grow: 1;
    
`
const Title = styled(Text)`
    width: 100%;
    margin-bottom: 30px;
    font-size: 15px;
    text-align: center;
`
const SubTitle = styled(Text)`
    width: 100%;
    color: ${lightGrey1};
    text-align: center;
    margin-bottom: 30px;

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
    ${({ style }) => style}
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
                    вам выслано sms с временным паролем, введите его тут
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
                    <NoSMS>не получили sms?</NoSMS>
                    <SendAgain>отправить sms повтороно можно будет через 5:00</SendAgain>
                </Controls>
            </Wrapper>
        )
    }
    state = {
        sms: '',
    }
    componentDidMount() {
        socket.on('user exists', e => {
            console.log(e)
        })
    }
    handleSMS = (e) => {
        this.state.sms.length < 4 && this.setState({ sms: e })
        this.state.sms.length === 3 && this.props.forward()
        
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