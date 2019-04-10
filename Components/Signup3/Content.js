import React, { Component } from 'react'
import { View, Text, TextInput, TouchableOpacity, } from 'react-native'
import FloatingLabel from 'react-native-floating-labels'
import styled from 'styled-components'
import CheckboxFormX from 'react-native-checkbox-form';
import helper from '../../utils/helpers'
import { connect } from 'react-redux'
import { setUser } from '../../actions/userActions'
import { Button } from '../../common'
import CheckBox from 'react-native-check-box'

const { Colors, fontSize, HeaderHeightNumber, socket } = helper;
const { lightGrey1, blue } = Colors;
const Wrapper = styled(View)`
    padding: 0 5%;
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
    flex-direction: column;
    align-items: flex-start;
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
    align-self: center;
    justify-content: center;
    align-items: center;
`
const Checkbox = styled(View)`
    display: flex;
    flex-direction: row;
    align-items: center;
`
const CheckBoxLabel = styled(View)`
    display: flex;
    flex-direction: row;
    align-items: center;
    `
const LinkText = styled(Text)`
    color: ${blue};
`
class Content extends Component {
    render() {
        return (
            <Wrapper>
                <Title>
                    Регистрация
                </Title>
                <SubTitle>
                    Поздравляем, вы зарегистрированы
                </SubTitle>
                <PhoneNumber>
                    {this.state.agreements.map((e, i) => {
                        return <Checkbox>
                            <CheckBox
                                checkBoxColor={blue}
                                isChecked={e.value}
                                onClick={() => this.setInputState(e)}
                            />
                            <CheckBoxLabel>
                                <Text>{e.label} </Text>
                                <TouchableOpacity>
                                    <LinkText>{e.linkText}</LinkText>
                                </TouchableOpacity>
                            </CheckBoxLabel>
                        </Checkbox>
                    })}
                </PhoneNumber>
                <ButtonBox>
                    <Button
                        onPress={this.proceed}
                        style={{ background: blue }}
                        color={'white'}>зарегистрироваться</Button>
                </ButtonBox>
            </Wrapper>
        )
    }
    state = {
        agreements: [
            {
                value: true,
                label: 'согласен с',
                linkText: 'условиями пользования',
                linkComp: 'linkComp'
            },
            {
                value: true,
                label: 'ознакомился с',
                linkText: 'пользовательским соглашением',
                linkComp: 'linkComp'
            },
            {
                value: false,
                label: 'согласен на',
                linkText: 'использование персональных данные',
                linkComp: 'linkComp'
            }
        ]
    }
    componentDidMount() {
        socket.on('user exists', e => {
            console.log(e)
        })
    }
    setInputState = (e) => {
        const newAgreements = [...this.state.agreements];
        const item = newAgreements.filter((item) => e.linkText === item.linkText)[0];
        item.value = !item.value
        this.setState({ agreements: newAgreements })
    }
    proceed = (e) => {
        const { register } = this.props;
        const checkboxes = [];
        Object.values(this.state.agreements).map((e, i) => {
            checkboxes.push(e.value);
        })
        const checked = !checkboxes.includes(false);
        if (checked) {
            this.props.forward()
            socket.emit('new user', {
                "phone": register.phone
            })
        }else{
            console.log('unchecked')
        }
    }
}
const mapStateToProps = state => {
    return {
        id: state.userReducer.id,
        register: state.userReducer.register
    };
};
const mapDispatchToProps = dispatch => ({
    setUser: _ => dispatch(setUser(_)),
})
export default connect(mapStateToProps, mapDispatchToProps)(Content)