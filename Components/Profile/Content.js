import React, { Component } from 'react'
import { View, Text, SafeAreaView, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native'
import { BackIcon, TaskIcon, GroupIcon } from '../../assets/index'
import { Button } from '../../Common/';
import styled from 'styled-components'
import FloatingLabel from 'react-native-floating-labels'
import helper from '../../Helper/helper'
const { sidePadding, sidePaddingNumber, Colors, HeaderHeight } = helper;
const { border } = Colors;
const Wrapper = styled(View)`
    padding-top: 0px;
    background: white;
`
const User = styled(View)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding-bottom: 20px;
    margin-bottom: 10px;
`
const UserImage = styled(Image)`
    width: 80px;
    height: 80px;
    border-radius: 40;
    margin: 0 10px 40px;

`
const UserInfo = styled(View)`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 60px;
    width: 100%;
`
const UserName = styled(View)`
    display: flex;
    flex-direction: row;
    text-align: center;
    justify-content: center;
    margin-bottom: 10px;

`

const Name = styled(Text)`
    font-size: 15;
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    text-align: center;
`
const UserStatus = styled(Name)`
    font-size: 11;
    color: #B9B9B9;
    margin-bottom: 10px;

`

const Info = styled(View)`
    padding: 0 ${sidePadding};
`
const Data = styled(View)`
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: flex-start;
    border: 1px solid ${border};
    padding: ${sidePaddingNumber * 3}px 0;
    border-width: 0;
    border-top-width: 1px;
`
const Value = styled(Text)`
    font-size: 13px;
    min-width: 150px;
    text-align: left;
    flex: 1;
    display: flex;
    justify-content: flex-start;
`
const Type = styled(Value)`
    color: #BABABA;
    min-width: 110px;
    flex: 0;
`
const PersonalData = styled(View)`
    border: 1px solid #E6E6E6;
    border-width: 0;
    flex: 1;
`
const SendMessage = styled(Button)``
export default class Settings extends Component {
    render() {
        const { UserData, userName, status } = this.state;

        return (
            <Wrapper style={{ flex: 1 }}>
                <User>
                    <UserImage source={{ uri: 'https://facebook.github.io/react/logo-og.png' }} />
                    <UserInfo>
                        <UserName>
                            <Name>{userName}</Name>
                        </UserName>
                        <UserStatus>{status}</UserStatus>
                        <SendMessage>Написать сообщение</SendMessage>

                    </UserInfo>
                </User>
                <ScrollView style={{ flex: 1 }}>
                    <PersonalData>
                        {UserData.map((item, index) => {
                            return <Info key={index}>
                                <Data>
                                    <Type>{item.type}</Type>
                                    <Value>{item.value}</Value>
                                    {item.icon && item.icon}
                                </Data>
                            </Info>
                        })}
                    </PersonalData>
                </ScrollView>
            </Wrapper>
        )
    }
    state = {
        userName: 'Константин Константинопольский',
        status: 'В сети',
        UserData: [
            { type: 'Подразделение', value: 'Стандартный' },
            { type: 'Должность', value: 'Главный инженер' },
            { type: 'Личный', value: '+7(395)282-48-57' },
            { type: 'Задачи', value: '26.09.1986', icon: <TaskIcon /> },
            { type: 'Общих групп', value: 'youmail@irkutskoil.ru', icon: <GroupIcon /> },
            { type: 'Общих файлов', value: '+7(395)282-48-57', icon: <GroupIcon /> },
        ]
    }
}
