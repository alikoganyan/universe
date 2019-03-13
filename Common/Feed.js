import React, { Component } from 'react'
import { Text, View, Image, TouchableOpacity } from 'react-native'
import styled from 'styled-components'
import { TriangleLeftIcon, TriangleRightIcon, CheckIcon, CommentIcon, HeartIcon } from '../assets/index'
const { HeaderHeightNumber, Colors } = helper;
const { yellow, purple, red } = Colors;
const Feed = styled(View)`
    padding: 10px;
    padding-bottom: 0;
    margin: 10px 40px 10px;
    border-radius: 5;
    background: #fff;
    border: 1px solid ${yellow};
    
`
const Sender = styled(View)`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 10px;
`
const SenderImage = styled(Image)`
    width: 40;
    height: 40;
    border-radius: 20;
    background: #f00;
    margin-right: 10px;
`
const SenderName = styled(Text)`
    font-size: 15px;
`
const SenderInfo = styled(View)`
    display: flex;
    justify-content: space-between;
    height: 30px;
`
const TimeSent = styled(Text)`
    color: #848484;
    font-size: 12;
`
const FeedInfo = styled(View)`
    width: 100%;
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    align-items: center;
`
const ShowMore = styled(View)`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
`
const ShowMoreText = styled(Text)`
    color: ${yellow};
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
                <ShowMore>
                    <TouchableOpacity>
                        <ShowMoreText>Читать далее</ShowMoreText>
                    </TouchableOpacity>
                </ShowMore>

                <Reactions>
                    <CommentIcon onPress={this.handleHold} color={purple} />
                    <Text>12</Text>
                    <HeartIcon color={red} />
                    <Text>12</Text>
                </Reactions>
            </FeedInfo>
        </Feed>
    )
}
