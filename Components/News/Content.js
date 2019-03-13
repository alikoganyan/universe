import React, { Component } from 'react'
import { View, Text, SafeAreaView, FlatList, Image, TouchableOpacity } from 'react-native'
import { CommentIcon, HeartIcon } from '../../assets/index'
import styled from 'styled-components'
import helper from '../../Helper/helper'
const { sidePadding, Colors } = helper;
const { yellow } = Colors;
const Wrapper = styled(View)`
    margin-bottom: 50px;   
    background: white;
`
const NewsList = styled(FlatList)`
    padding: 10px;
    display: flex;
    flex-grow: 1;
    padding-bottom: 20px;
`
const NewsItem = styled(View)`
    background: white;
    padding: 20px;
    padding-bottom: 10px;
    margin-bottom: 20px;
    border-radius: 8;
    border: 1px solid ${yellow};
    border-radius: 5;

`
const Sender = styled(View)`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 15px;
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
    height: 35px;
`
const TimeSent = styled(Text)`
    color: #848484;
    font-size: 13;
`
const NewsItemInfo = styled(View)`
    width: 100%;
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    align-items: center;
`
const ShowAll = styled(View)`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
`
const HashTag = styled(Text)`
    color: ${yellow};
    margin-right: 5px;
    font-weight: 500;
    font-size: 17px;
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
                                <ShowAll>
                                    <TouchableOpacity><HashTag>Читать далее</HashTag></TouchableOpacity>
                                </ShowAll>

                                <Reactions>
                                    <HeartIcon /><Text>12</Text>
                                    <CommentIcon /><Text>12</Text>
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
