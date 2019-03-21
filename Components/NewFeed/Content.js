import React, { Component } from 'react'
import { View, Text, TextInput, Dimensions } from 'react-native'
import FloatingLabel from 'react-native-floating-labels'
import styled from 'styled-components'
import helper from '../../Helper/helper'
import { connect } from 'react-redux'
import { setUser } from '../../actions/userActions'
import { Button } from '../../Common'
import { GroupIcon, CloseIcon } from '../../assets/'
const { Colors, HeaderHeightNumber, socket } = helper;
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
const ButtonBox = styled(View)`
    width: 170px;
    align-self: center;
`
const Recievers = styled(View)``
const Reciever = styled(View)`
    display: flex;
    flex-direction: row;
    align-items: center;
`
const RecieverInfo = styled(View)``
const Department = styled(Text)`
    color: ${lightGrey1};
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
                <StyledInput password={true}
                    onChangeText={this.handlePhone}
                    value={phone}
                    placeholder={'Текст новости'}
                    style={{ margin: 0, width: '78%', textAlign: 'left', paddingLeft: 10, }}
                />
                <Reciever>
                    <View>
                        <GroupIcon />
                        <RecieverInfo>
                            <Text>123</Text>
                            <Department>123</Department>
                        </RecieverInfo>
                    </View>
                    <View>
                        <CloseIcon />
                    </View>

                </Reciever>

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
        socket.on('user created', e => {
            this.props.forward()
        })

    }
    proceed = (e) => {
        const { country, phone } = this.state;
        country && phone && socket.emit('new user', {
            "phone": country + phone
        })

    }
    handleCountry = (e) => {
        this.setState({ country: e })
    }
    handlePhone = (e) => {
        this.setState({ phone: e })
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