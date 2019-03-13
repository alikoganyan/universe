import React, { Component } from 'react'
import { Text, View, Image, TouchableOpacity } from 'react-native'
import styled from 'styled-components'
import { TriangleLeftIcon, TriangleRightIcon, CheckIcon, CommentIcon, HeartIcon } from '../assets/index'
const { HeaderHeightNumber, Colors } = helper;

const Feed = styled(View)`
    padding: 10px;
    padding-bottom: 0;
    margin: 10px 40px 10px;
    border-radius: 5;
    background: #F5F3F5;
    
`
const Sender = styled(View)`
    display: flex;
    flex-direction: row;
    margin-bottom: 10px;
`
const SenderImage = styled(Image)`
    width: 40;
    height: 40;
    border-radius: 20;
    background: red;
    margin-right: 10px;
`
const SenderName = styled(Text)`
    font-size: 16px;
`
const SenderInfo = styled(View)`
    display: flex;
    justify-content: space-between;
    height: 40px;
`
const TimeSent = styled(Text)`
    color: #848484;
    font-size: 14;
`
const FeedInfo = styled(View)`
    width: 100%;
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    align-items: center;
`
const HashTags = styled(View)`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
`
const HashTag = styled(Text)`
    color: #436786;
    margin-right: 5px;
`
const Reactions = styled(View)`
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    align-items: center;
`
export default function FeedComponent({ children }) {
    const item = children
    return (
        <Feed>
            <Sender>
                <SenderImage source={{ uri: item.sender.img }} />
                <SenderInfo>
                    <SenderName>{item.sender.name}</SenderName>
                    <TimeSent>{item.timeSent}</TimeSent>
                </SenderInfo>
            </Sender>
            <Text>{item.text}</Text>
            <FeedInfo>
                <HashTags>
                    {item.hashtags.map((e, i) => <TouchableOpacity key={i}>
                        <HashTag>{e}</HashTag>
                    </TouchableOpacity>)}
                </HashTags>

                <Reactions>
                    <CommentIcon onPress={this.handleHold} />
                    <Text>12</Text>
                    <HeartIcon />
                    <Text>12</Text>
                </Reactions>
            </FeedInfo>
        </Feed>
    )
}
