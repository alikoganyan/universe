import React, { Component } from 'react'
import { Text, View, Image } from 'react-native'
import styled from 'styled-components'
import { TriangleLeftIcon, TriangleRightIcon, CheckIcon, CommentIcon, HeartIcon } from '../assets/index'
const { HeaderHeightNumber, Colors } = helper;

const MyMessage = styled(View)`
    display: flex;
    justify-content: flex-end;
    text-align: right;
    margin: 5px 10px;
    align-self: stretch;
    background: #3776F9;
    border-radius: 3;
    max-width: 80%;
    margin-left: 20%;
`

const MyMessageText = styled(Text)`
    display: flex;
    justify-content: flex-end;
    text-align: left;
    padding: 10px;
    padding-bottom: 0;
    color: white;
`

const InterlocutorsMessage = styled(MyMessage)`
    justify-content: flex-start;
    flex-direction: column;
    text-align: left;
    align-items: flex-start;
    background: #F6F6F6;
    margin-left: 10px;
    position: relative;
    left: -10px;
    
`

const InterlocutorsMessageText = styled(MyMessageText)`
    justify-content: flex-start;
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    text-align: left;
    color: #54585D;    
    border-radius: 3;
    overflow: hidden;
    padding: 10px;
    flex-wrap: wrap;
`
const MessageInfo = styled(View)`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    padding: 0 10px 5px;
    width: 100%;
`

const MessageDate = styled(Text)`
    color: ${({ color }) => color || '#ABABAB'};
`

const Indicator = ({ delievered = false, read = false, color }) => {
    return <CheckIcon color={color} />
}
export default function Message({ children }) {
    const { text, id } = children;
    myId = 1;
    return (myId === id ? (
        <View style={{ display: 'flex', flexDirection: 'row' }}>
            <MyMessage>
                <MyMessageText>
                    {text}
                </MyMessageText>
                <MessageInfo>
                    <MessageDate color={'white'}>1:40</MessageDate>
                    <Indicator color={'white'} />
                </MessageInfo>
            </MyMessage>
            <TriangleLeftIcon color={'#3776F9'} />
        </ View>
    ) : <View style={{ display: 'flex', flexDirection: 'row' }}>
            <TriangleRightIcon color={'#F6F6F6'} />
            <InterlocutorsMessage>
                <InterlocutorsMessageText>
                    {text}
                </InterlocutorsMessageText>
                <MessageInfo>
                    <MessageDate>1:40</MessageDate>
                </MessageInfo>
            </InterlocutorsMessage>
        </ View>
    )
}
