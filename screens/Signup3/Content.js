import React, { Component } from 'react'
import { View, Text, TextInput, TouchableOpacity, } from 'react-native'
import styled from 'styled-components'
import helper from '../../utils/helpers'
import { connect } from 'react-redux'
import { p_register } from '../../constants/api'
import sendRequest from '../../utils/request'
import Button from '../../common/Button'
import CheckBox from 'react-native-check-box'

const { Colors, fontSize, HeaderHeight } = helper;
const { lightGrey1, blue, blueDisabled, pink } = Colors;
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
    color: ${({ error }) => error ? pink : lightGrey1};
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
        const { btnDisabled } = this.state
        return (
            <Wrapper>
                <Title>
                    Регистрация
                </Title>
                <SubTitle error={btnDisabled}>
                    Примите пользовательские соглашения
                </SubTitle>
                <PhoneNumber>
                    {this.state.agreements.map((e, i) => {
                        return <Checkbox key={i}>
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
                        style={{ background: !btnDisabled ? blue : blueDisabled }}
                        color={'white'}>зарегистрироваться</Button>
                </ButtonBox>
            </Wrapper>
        )
    }
    state = {
        btnDisabled: false,
        agreements: [
            {
                value: false,
                label: 'согласен с',
                linkText: 'условиями пользования',
                linkComp: 'linkComp'
            },
            {
                value: false,
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
    }
    componentWillUpdate() {
    }
    setInputState = (e) => {
        const newAgreements = [...this.state.agreements];
        const item = newAgreements.filter((item) => e.linkText === item.linkText)[0];
        item.value = !item.value
        this.setState({ agreements: [...newAgreements], btnDisabled: false })
    }
    proceed = (e) => {
        const checked = !this.state.agreements.filter(e => e.value === false)[0];
        this.setState({ btnDisabled: !checked })
        if (checked) {
            const { forward } = this.props;
            forward()
        } else {
        }
    }
}
const mapStateToProps = state => ({
    id: state.userReducer.id,
    register: state.userReducer.register
})
const mapDispatchToProps = dispatch => ({
    setUser: _ => dispatch(setUser(_)),
})
export default connect(mapStateToProps, mapDispatchToProps)(Content)