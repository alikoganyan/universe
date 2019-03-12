import React, { Component } from 'react'
import { View, Text, SafeAreaView, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native'
import { BackIcon, EllipsisVIcon, MessageIndicatorIcon } from '../../assets/index'
import styled from 'styled-components'
import FloatingLabel from 'react-native-floating-labels'
import helper from '../../Helper/helper'
const { sidePadding } = helper;
const Wrapper = styled(View)`
    padding-top: 0px;
    background: white;
    margin-bottom: 110px;
    
`
const User = styled(View)`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    padding: 20px 0;
    border: 1px solid #E6E6E6;
    border-width: 0;
    border-bottom-width: 1px;
`
const UserImage = styled(Image)`
    width: 60px;
    height: 60px;
    border-radius: 30;
    margin: 0 10px;

`
const UserInfo = styled(View)`
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: flex-start;
    height: 60px;
`
const UserName = styled(View)`
    display: flex;
    flex-direction: row;
`
const UserStatus = styled(Text)`
    font-size: 11;
    color: #B9B9B9;
`
const ChangeName = styled(TouchableOpacity)`
    position: relative;
    right: 0px;
    top: -5px;
`
const Name = styled(Text)`
    font-size: 15;
    display: flex;
    flex-wrap: wrap;
    width: 60%;
`
const Info = styled(View)`
    padding: 0 10px;
    margin: 10px 0;
`
const Data = styled(View)``
const Value = styled(Text)`
    font-size: 15px;
`
const Type = styled(Value)`
    color: #BABABA;
`
const PersonalData = styled(View)`
    border: 1px solid #E6E6E6;
    border-width: 0;
    border-bottom-width: 1px;
    flex: 1;
`
const PrivacyData = styled(PersonalData)``
const UserAgreements = styled(PersonalData)``
const LogOut = styled(PersonalData)``
const TopLine = styled(View)`
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
`
export default class Settings extends Component {
    state = {
        userName: 'Константин Константинопольский',
        status: 'В сети',
        editingName: false,
        editing: true,
    }
    render() {
        const UserData = [
            { type: 'Тип пользователя', value: 'Стандартный' },
            { type: 'Должность', value: 'Главный инженер' },
            { type: 'Дата рождения', value: '26.09.1986' },
            { type: 'Рабочий', value: 'youmail@irkutskoil.ru' },
            { type: 'Рабочий', value: '+7(395)282-48-57' },
            { type: 'Личный', value: '+7(395)282-48-57' },
        ]
        const privacyData = [
            { value: '****', type: 'Пароль', actionText: 'Изменить пароль', action: () => console.log('password') },
            { value: 'PC-481', type: 'Текущее устройство', actionText: 'Удалить устройство', action: () => console.log('current') },
            { value: 'PC-483', type: 'Недавнее устройство', actionText: 'Удалить устройство', action: () => console.log('current') },
        ]
        const Input = (props) => {
            const { children, password = false, value, style, editable } = props;
            return <FloatingLabel
                labelStyle={{
                    fontSize: 15,
                    position: 'relative',
                    marginTop: 0,
                    bottom: 50,
                    top: 56,
                    left: -3,
                    color: '#BABABA'
                }}
                inputStyle={{
                    fontSize: 15,
                    display: 'flex',
                    borderWidth: 0,
                    flexWrap: 'wrap',
                    maxWidth: '60%',
                    minWidth: '60%',
                    height: 'auto',
                    paddingTop: -15,
                    paddingBottom: 5,
                }}
                password={password}
                value={value}
                style={{
                    marginTop: -38,
                    left: -10,
                    position: 'relative',
                    marginBottom: 13,
                }}
                editable={editable}
            > {children}</FloatingLabel >

        }
        const { userName, status, editingName, editing } = this.state;

        return (
            <SafeAreaView>
                <Wrapper>
                    <User>
                        <UserImage source={{ uri: 'https://facebook.github.io/react/logo-og.png' }} />
                        <UserInfo>
                            <UserName>
                                {!editingName ? <Name>{userName}</Name> : <Input value={userName} />}
                                <ChangeName onPress={() => this.setState({
                                    editing: !this.state.editing
                                })}><Text style={{ color: '#305576' }}>Изменить имя</Text></ChangeName>
                            </UserName>
                            <UserStatus>{status}</UserStatus>


                        </UserInfo>
                    </User>
                    <ScrollView>
                        <PersonalData>
                            {UserData.map((item, index) => {
                                return <Info key={index}>
                                    <Data>
                                        {!editing ? <Value>{item.value}</Value> : <Input value={item.value}>{item.type}</Input>}
                                        {!editing && <Type>{item.type}</Type>}
                                    </Data>
                                </Info>
                            })}
                        </PersonalData>
                        <PrivacyData>
                            {privacyData.map((item, index) => {
                                return <Info key={index}>
                                    <Data>
                                        <TopLine>
                                            <Value>{item.value}</Value>
                                            <TouchableOpacity>
                                                <Text style={{ color: '#305576' }}>{item.actionText}</Text>
                                            </TouchableOpacity>
                                        </TopLine>
                                        <Type>{item.type}</Type>
                                    </Data>
                                </Info>
                            })}
                        </PrivacyData>
                        <UserAgreements>
                            <TouchableOpacity><Text>Пользовательское соглашение</Text></TouchableOpacity>
                            <TouchableOpacity><Text>Соглашение о персональных данных</Text></TouchableOpacity>
                        </UserAgreements>
                        <LogOut>
                            <TouchableOpacity><Text>Выйти из профиля</Text></TouchableOpacity>
                        </LogOut>
                    </ScrollView>
                </Wrapper>
            </SafeAreaView>
        )
    }
}
