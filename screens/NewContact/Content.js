import React, { Component } from 'react'
import { View, Text, TouchableOpacity, TextInput, ScrollView, Platform, Dimensions } from 'react-native'
import helper from '../../utils/helpers'
import FloatingLabel from 'react-native-floating-labels'
import styled from 'styled-components'
import { Button } from '../../common'
import sendRequest from '../../utils/request'
import { p_create_contact } from '../../constants/api'
const { Colors, HeaderHeightNumber } = helper;
const { green, lightGrey1, black, color } = Colors;

const Wrapper = styled(View)`
    padding: 0 10% 10%;
    display: flex;
    justify-content: center;
    
    height: ${Dimensions.get('window').height - HeaderHeightNumber}px;
`
const PhoneNumber = styled(View)`
    display: flex;
    flex-direction: row;
    margin-top: 30px;
    align-items: center;
    justify-content: space-between;

`
const InputLabel = styled(Text)`
    margin-right: 10px;
    padding-bottom: 10px;
    font-size: 13px; 
    text-align: right;
    color: ${black};
`
const Input = styled(TextInput)`
    border: 1px solid ${lightGrey1};
    border-width: 0;
    border-bottom-width: 1px;
    margin-right: 10px;
    padding-bottom: 10px;
    font-size: 13px; 
`
const ButtonBox = styled(View)`
    position: absolute;
    bottom: 40px;
    align-self: center;
`
export default class Content extends Component {
    render() {
        const { error, phone, country, lastName, firstName, patronymic, post, email } = this.state;
        const { navigateToDialogs } = this.props;
        return (
            <Wrapper>
                <ScrollView style={{ height: '100%' }}>
                    <PhoneNumber>
                        <InputLabel style={{ flex: 4 }}>Телефон</InputLabel>
                        <Input style={{ flex: 1, textAlign: 'center' }} onChangeText={this.handleChangeCountry} value={country} />
                        <Input style={{ flex: 7 }} placeholder={'XXX XXX XX XX'} onChangeText={this.handleChangePhone} value={phone} />
                    </PhoneNumber>
                    <PhoneNumber>
                        <InputLabel style={{ flex: 4 }}>Фамилия</InputLabel>
                        <Input style={{ flex: 9 }} placeholder={'Фамилия'} onChangeText={this.handleChangeLastName} value={lastName} />
                    </PhoneNumber>
                    <PhoneNumber>
                        <InputLabel style={{ flex: 4 }}>Имя</InputLabel>
                        <Input style={{ flex: 9 }} placeholder={'Имя'} onChangeText={this.handleChangeFirstName} value={firstName} />
                    </PhoneNumber>
                    <PhoneNumber>
                        <InputLabel style={{ flex: 4 }}>Отчество</InputLabel>
                        <Input style={{ flex: 9 }} placeholder={'Отчество'} onChangeText={this.handleChangePatronymic} value={patronymic} />
                    </PhoneNumber>
                    <PhoneNumber>
                        <InputLabel style={{ flex: 4 }}>Должность</InputLabel>
                        <Input style={{ flex: 9 }} placeholder={'Должность'} onChangeText={this.handleChangePost} value={post} />
                    </PhoneNumber>
                    <PhoneNumber>
                        <InputLabel style={{ flex: 4 }}>Email</InputLabel>
                        <Input style={{ flex: 9 }} placeholder={'Email'} onChangeText={this.handleChangeEmail} value={email} />
                    </PhoneNumber>
                </ScrollView>
                <ButtonBox>
                    <Button onPress={this.proceed} style={{ background: green }} color={'white'}>Добавить контакт</Button>
                </ButtonBox>
            </Wrapper>
        )
    }
    state = {
        error: false,
        phone: '',
        country: '+7',
        lastName: '',
        firstName: '',
        patronymic: '',
        post: '',
        email: '',
    }
    handleChangeCountry = (e) => {
        this.setState({ country: e })
    }
    handleChangePhone = (e) => {
        this.setState({ phone: e })
    }
    handleChangeLastName = (e) => {
        this.setState({ lastName: e })
    }
    handleChangeFirstName = (e) => {
        this.setState({ firstName: e })
    }
    handleChangePatronymic = (e) => {
        this.setState({ patronymic: e })
    }
    handleChangePost = (e) => {
        this.setState({ post: e })
    }
    handleChangeEmail = (e) => {
        this.setState({ email: e })
    }
    proceed = e => {
        const {
            phone,
            country,
            lastName,
            firstName,
            patronymic,
            post,
            email,
        } = this.state;
        const contact = {
            phone_number: country.concat(phone),
            email,
            first_name: firstName,
            middle_name: patronymic,
            last_name: lastName,
            post
        }
        sendRequest({
            r_path: p_create_contact,
            method: 'post',
            attr: {contact},
            success: (res) => {
                console.log(res.msg)
            },
            failFunc: (err) => {
                console.log(err)
                let { phone_number } = err
                this.setState({
                    invalidPhone: phone_number || null,
                })
            }
        })
    }
}
