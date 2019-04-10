import React, { Component } from 'react'
import { View, Text, SafeAreaView, FlatList, Image, TouchableOpacity } from 'react-native'
import { CommentIcon, HeartIcon } from '../../assets/index'
import styled from 'styled-components'
import helper from '../../utils/helper'
import { ImageComponent } from '../../common'
const { borderRadius, Colors, fontSize, sidePadding } = helper;
const { yellow, darkBlue2, grey2 } = Colors;
const Wrapper = styled(View)`
    padding-bottom: 20px;   
    background: white;
`
const NewsList = styled(FlatList)`
    padding: ${sidePadding};
    display: flex;
    flex-grow: 1;
    padding-bottom: 20px;
`
const NewsItem = styled(View)`
    background: white;
    padding: 20px;
    padding-bottom: 10px;
    margin-bottom: 10px;
    border: 0.5px solid ${yellow};
    border-radius: ${borderRadius};
`
const Sender = styled(View)`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 15px;
`
const SenderName = styled(Text)`
    font-size: 13;
`
const SenderInfo = styled(View)`
    display: flex;
    justify-content: space-between;
    height: 35px;
    flex: 1;
`
const TimeSent = styled(Text)`
    color: #848484;
    font-size: 11;
`
const NewsItemInfo = styled(View)`
    width: 100%;
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    align-items: center;
    margin-top: 10px;
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
    font-size: 13px;
`
const NewsText = styled(Text)`
    color: ${darkBlue2};
    font-weight: 300;
    font-size: 13px;
`
const Reactions = styled(View)`
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    align-items: center;
`
const Reactionsext = styled(Text)`
    color: ${grey2};
    font-size: ${fontSize.sm};
`

export default class Content extends Component {
    render() {
        const { newsList } = this.state;
        const { proceed } = this.props;
        return (
            <SafeAreaView>
                <Wrapper>
                    <NewsList
                        data={newsList}
                        ListFooterComponent={<View style={{ margin: 10, }} />}
                        renderItem={({ item }) => <NewsItem>
                            <Sender>
                                <ImageComponent source={{ uri: item.sender.img }} size={"xs"} style={{
                                    marginRight: 10
                                }} />
                                <SenderInfo>
                                    <SenderName numberOfLines={1}>{item.sender.name}</SenderName>
                                    <TimeSent>{item.timeSent}</TimeSent>
                                </SenderInfo>
                            </Sender>
                            <NewsText numberOfLines={2}>{item.text}</NewsText>
                            <NewsItemInfo>
                                <ShowAll>
                                    <TouchableOpacity onPress={proceed}><HashTag>Читать далее</HashTag></TouchableOpacity>
                                </ShowAll>

                                <Reactions>
                                    <HeartIcon /><Reactionsext>12</Reactionsext>
                                    <CommentIcon left /><Reactionsext>12</Reactionsext>
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
                    img: 'https://facebook.github.io/react/logo-og.png',
                    name: 'Константин Константинопольский'
                },
                text: 'Добавлю, что восприятие сотворчества готично начинает этикет. Семиотика Добавлю, что восприятие сотворчества',
                hashtags: [
                    '#Константин Константинопольский',
                    '#kek'
                ],
                likes: 10,
                shares: 2,
                timeSent: '16 января 2018 17:17'
            },
            {
                sender: {
                    img: 'https://facebook.github.io/react/logo-og.png',
                    name: 'Константин Константинопольский'
                },
                text: 'Добавлю, что восприятие сотворчества готично начинает этикет. Семиотика Добавлю, что восприятие сотворчества',
                hashtags: [
                    '#Константин Константинопольский',
                    '#kek'
                ],
                likes: 10,
                shares: 2,
                timeSent: '16 января 2018 17:17'
            },
            {
                sender: {
                    img: 'https://facebook.github.io/react/logo-og.png',
                    name: 'Константин Константинопольский'
                },
                text: 'Добавлю, что восприятие сотворчества готично начинает этикет. Семиотика Добавлю, что восприятие сотворчества',
                hashtags: [
                    '#Константин Константинопольский',
                    '#kek'
                ],
                likes: 10,
                shares: 2,
                timeSent: '16 января 2018 17:17'
            },
            {
                sender: {
                    img: 'https://facebook.github.io/react/logo-og.png',
                    name: 'Константин Константинопольский'
                },
                text: 'Добавлю, что восприятие сотворчества готично начинает этикет. Семиотика Добавлю, что восприятие сотворчества',
                hashtags: [
                    '#Константин Константинопольский',
                    '#kek'
                ],
                likes: 10,
                shares: 2,
                timeSent: '16 января 2018 17:17'
            },
            {
                sender: {
                    img: 'https://facebook.github.io/react/logo-og.png',
                    name: 'Константин Константинопольский'
                },
                text: 'Добавлю, что восприятие сотворчества готично начинает этикет. Семиотика Добавлю, что восприятие сотворчества',
                hashtags: [
                    '#Константин Константинопольский',
                    '#kek'
                ],
                likes: 10,
                shares: 2,
                timeSent: '16 января 2018 17:17'
            },
            {
                sender: {
                    img: 'https://facebook.github.io/react/logo-og.png',
                    name: 'Константин Константинопольский'
                },
                text: 'Добавлю, что восприятие сотворчества готично начинает этикет. Семиотика Добавлю, что восприятие сотворчества',
                hashtags: [
                    '#Константин Константинопольский',
                    '#kek'
                ],
                likes: 10,
                shares: 2,
                timeSent: '16 января 2018 17:17'
            },

        ]
    }
}
