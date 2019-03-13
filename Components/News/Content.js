import React, { Component } from 'react'
import { View, Text, SafeAreaView, FlatList, Image, TouchableOpacity } from 'react-native'
import { CommentIcon, HeartIcon } from '../../assets/index'
import styled from 'styled-components'
import helper from '../../Helper/helper'
const { sidePadding } = helper;
const Wrapper = styled(View)`
    background: white;
    margin-bottom: 50px;   
    background: #EAEAEA;
`
const NewsList = styled(FlatList)`
    padding: 10px;
    display: flex;
    flex-grow: 1;
    padding-bottom: 20px;
`
const NewsItem = styled(View)`
    background: white;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 5;

`
const Sender = styled(View)`
    display: flex;
    flex-direction: row;
    margin-bottom: 10px;
`
const Sendermage = styled(Image)`
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
const NewsItemInfo = styled(View)`
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
export default class Content extends Component {
    render() {
        const { newsList } = this.state;
        return (
            <SafeAreaView>
                <Wrapper>
                    <NewsList
                        data={newsList}
                        ListFooterComponent={<View style={{ margin: 5, }} />}
                        renderItem={({ item }) => <NewsItem>
                            <Sender>
                                <Sendermage source={{ uri: item.sender.img }} />
                                <SenderInfo>
                                    <SenderName>{item.sender.name}</SenderName>
                                    <TimeSent>{item.timeSent}</TimeSent>
                                </SenderInfo>
                            </Sender>
                            <Text>{item.text}</Text>
                            <NewsItemInfo>
                                <HashTags>
                                    {item.hashtags.map((e, i) => <TouchableOpacity key={i}><HashTag>{e}</HashTag></TouchableOpacity>)}
                                </HashTags>

                                <Reactions>
                                    <CommentIcon onPress={this.handleHold} /><Text>12</Text>
                                    <HeartIcon /><Text>12</Text>
                                </Reactions>
                            </NewsItemInfo>
                        </NewsItem>}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </Wrapper>
            </SafeAreaView>
        )
    }
    state = {
        newsList: [
            {
                sender: {
                    img: 'https://visualpharm.com/assets/30/User-595b40b85ba036ed117da56f.svg',
                    name: 'lol'
                },
                text: 'some text',
                hashtags: [
                    '#lol',
                    '#kek'
                ],
                likes: 10,
                shares: 2,
                timeSent: 'Сегодня в 15:00'
            },
            {
                sender: {
                    img: 'https://visualpharm.com/assets/30/User-595b40b85ba036ed117da56f.svg',
                    name: 'lol'
                },
                text: 'some text',
                hashtags: [
                    '#lol',
                    '#kek'
                ],
                likes: 10,
                shares: 2,
                timeSent: 'Сегодня в 15:00'
            },
            {
                sender: {
                    img: 'https://visualpharm.com/assets/30/User-595b40b85ba036ed117da56f.svg',
                    name: 'lol'
                },
                text: 'some text',
                hashtags: [
                    '#lol',
                    '#kek'
                ],
                likes: 10,
                shares: 2,
                timeSent: 'Сегодня в 15:00'
            },
            {
                sender: {
                    img: 'https://visualpharm.com/assets/30/User-595b40b85ba036ed117da56f.svg',
                    name: 'lol'
                },
                text: 'some text',
                hashtags: [
                    '#lol',
                    '#kek'
                ],
                likes: 10,
                shares: 2,
                timeSent: 'Сегодня в 15:00'
            },
            {
                sender: {
                    img: 'https://visualpharm.com/assets/30/User-595b40b85ba036ed117da56f.svg',
                    name: 'lol'
                },
                text: 'some text',
                hashtags: [
                    '#lol',
                    '#kek'
                ],
                likes: 10,
                shares: 2,
                timeSent: 'Сегодня в 15:00'
            },
            {
                sender: {
                    img: 'https://visualpharm.com/assets/30/User-595b40b85ba036ed117da56f.svg',
                    name: 'lol'
                },
                text: 'some text',
                hashtags: [
                    '#lol',
                    '#kek'
                ],
                likes: 10,
                shares: 2,
                timeSent: 'Сегодня в 15:00'
            },

        ]
    }
}
