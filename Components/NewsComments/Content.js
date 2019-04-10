import React, { Component } from 'react'
import { View, Text, SafeAreaView, FlatList, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native'
import { CommentIcon, HeartIcon, TriangleLeftIcon, TriangleRightIcon, CheckIcon } from '../../assets/index'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import styled from 'styled-components'
import helper from '../../utils/helper'
import { ImageComponent } from '../../common'
const { HeaderHeightNumber, sidePadding, borderRadius, Colors, fontSize } = helper;
const { yellow, black, darkBlue2, grey2 } = Colors;
const Wrapper = styled(View)`
    margin-bottom: 50px;   
    background: white;
    /* padding: 0 ${sidePadding}; */
    display: flex;
`
const NewsItem = styled(View)`
    background: white;
    padding: 20px;
    padding-bottom: 10px;
    border: 0.5px solid ${yellow};
    border-radius: ${borderRadius};
    margin: 0 ${sidePadding};
    margin-bottom: 10px;
`
const Sender = styled(View)`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 15px;
`
const Sendermage = styled(Image)`
    width: 30;
    height: 30;
    border-radius: 15;
    background: red;
    margin-right: 10px;
`
const SenderName = styled(Text)`
    font-size: 13px;
`
const SenderInfo = styled(View)`
    display: flex;
    justify-content: space-between;
    height: 35px;
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
const Reactions = styled(View)`
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    align-items: center;
`
const ReactionsText = styled(Text)`
    font-size: ${fontSize.sm};
    color: ${grey2};
`
const MyMessage = styled(View)`
    display: flex;
    justify-content: flex-end;
    text-align: right;
    margin: 5px 10px;
    align-self: stretch;
    background: ${yellow};
    border-radius: 3;
    max-width: 80%;
    margin-left: 20%;
`

const MyMessageText = styled(Text)`
    display: flex;
    justify-content: flex-end;
    text-align: left;
    padding: 10px 15px;
    font-size: 13;
    color: ${black};
`

const InterlocutorsMessage = styled(MyMessage)`
    justify-content: flex-start;
    flex-direction: column;
    text-align: left;
    align-items: flex-start;
    background: #fff1dd;
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
    color: ${darkBlue2};
    overflow: hidden;
    padding-top: 0;
    flex-wrap: wrap;
`
const InterlocutorsMessageName = styled(MyMessageText)`
    justify-content: flex-start;
    display: flex;
    justify-content: flex-end;
    text-align: left;
    color: ${black};  
    padding-bottom: 5px;
    overflow: hidden;
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
    color: ${({ color }) => color || grey2};
    margin-left: 15px;
`
const FeedText = styled(View)``

const NewsText = styled(Text)`
    color: ${darkBlue2};
    font-weight: 300;
    font-size: 13;
`
const LikeText = styled(Text)`
    font-size: ${fontSize.sm};
    color: ${({ color }) => color || grey2};
`

const Message = (props) => {
    const { children } = props;
    const { text, id, likes, name } = children;
    const myId = 1;
    return myId === id ? (
        <View style={{ display: 'flex', flexDirection: 'row', flex: 1 }}>
            <MyMessage>
                <MyMessageText>
                    {text}
                </MyMessageText>
                <MessageInfo>
                    <HeartIcon style={{ paddingRight: 5 }} /><LikeText color={darkBlue2}>{likes}</LikeText>
                    <MessageDate color={darkBlue2}>1:40</MessageDate>
                </MessageInfo>
            </MyMessage>
            <TriangleLeftIcon color={yellow} />
        </ View>
    ) : <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
            <ImageComponent
                style={{ position: 'relative', left: 5, bottom: 5 }}
                source={{ uri: 'https://cdn.pixabay.com/photo/2016/06/18/17/42/image-1465348_960_720.jpg' }} />
            <TriangleRightIcon color={'#fff1dd'} />
            <InterlocutorsMessage>
                <InterlocutorsMessageName>{name}</InterlocutorsMessageName>
                <InterlocutorsMessageText>{text}</InterlocutorsMessageText>
                <MessageInfo>
                    <HeartIcon style={{ paddingRight: 5 }} /><LikeText>{likes}</LikeText>
                    <MessageDate>1:40</MessageDate>
                </MessageInfo>
            </InterlocutorsMessage>
        </ View>
}
export default class Content extends Component {
    render() {
        const { CurrentFeed } = this.state;
        const { comments, likes } = CurrentFeed;
        const reversedCommnets = [...comments].reverse();
        const height = Dimensions.get('window').height - HeaderHeightNumber - 20 - (this.state.height || 0);
        return (
            <SafeAreaView>
                <Wrapper>
                <KeyboardAwareScrollView enableOnAndroid>
                    <NewsItem onLayout={(e) => this.getUnreadMessageHeight(e)}>
                        <Sender>
                            <Sendermage />
                            <SenderInfo>
                                <SenderName>{CurrentFeed.sender.name}</SenderName>
                                <TimeSent>{CurrentFeed.timeSent}</TimeSent>
                            </SenderInfo>
                        </Sender>
                        <FeedText>
                            <NewsText>Elit nisi ut ea fugiat mollit velit. Nulla sunt veniam eu consequat esse sunt aliqua pariatur. Anim aliquip fugiat nulla exercitation elit qui id commodo aute esse pariatur cupidatat ex. Dolor qui culpa tempor Lorem consectetur sunt consectetur minim proident irure excepteur commodo mollit. Eiusmod id laboris ea mollit magna nulla fugiat Lorem mollit aute adipisicing nulla non.Sint aute nulla adipisicing irure. Laboris qui aute dolor ex reprehenderit veniam duis culpa cillum minim sit adipisicing laborum. Culpa ea sit minim fugiat in cillum eiusmod. Ipsum do commodo est labore.</NewsText>
                        </FeedText>
                        <NewsItemInfo>
                            <ShowAll>
                            </ShowAll>
                            <Reactions>
                                <HeartIcon /><ReactionsText>{likes}</ReactionsText>
                                <CommentIcon left/><ReactionsText>{comments.length}</ReactionsText>
                            </Reactions>
                        </NewsItemInfo>
                    </NewsItem>
                    <FlatList
                        style={{ paddingRight: 5, paddingLeft: 5, }}
                        ListHeaderComponent={<View style={{ margin: 35, }} />}
                        contentContainerStyle={{ alignItems: 'stretch' }}
                        inverted={true}
                        data={reversedCommnets}
                        renderItem={({ item }) => <Message>{item}</Message>}
                        keyExtractor={(item, index) => index.toString()}
                    />
                    </KeyboardAwareScrollView>
                </Wrapper>
            </SafeAreaView>
        )
    }
    state = {
        height: null,
        CurrentFeed: {
            sender: {
                img: 'https://visualpharm.com/assets/30/User-595b40b85ba036ed117da56f.svg',
                name: 'lol'
            },
            text: 'some text',
            likes: 10,
            timeSent: 'Сегодня в 15:00',
            comments: [
                { type: 'message', likes: 2, name: 'Константин Константинопольский',text: 'Irure cillum sunt ut pariatur laboris sint nisi12123123123123123123123123123123s.', id: 0 },
                { type: 'message', likes: 2, name: 'Константин Константинопольский',text: 'Irure cillum sunt ut pariatur laboris sint nisi12123123123123123123123123123123s.', id: 0 },
                { type: 'message', likes: 2, name: 'Константин Константинопольский',text: 'Irure cillum sunt ut pariatur laboris sint nisi12123123123123123123123123123123s.', id: 0 },
                { type: 'message', likes: 2, name: 'Константин Константинопольский',text: 'Irure cillum sunt ut pariatur laboris sint nisi12123123123123123123123123123123s.', id: 0 },
                { type: 'message', likes: 2, name: 'Константин Константинопольский',text: 'Irure cillum sunt ut pariatur laboris sint nisi12123123123123123123123123123123s.', id: 0 },
                { type: 'message', likes: 2, name: 'Константин Константинопольский',text: 'Irure cillum sunt ut pariatur laboris sint nisi12123123123123123123123123123123s.', id: 0 },
                { type: 'message', likes: 2, name: 'Константин Константинопольский',text: 'Irure cillum sunt ut pariatur laboris sint nisi12123123123123123123123123123123s.', id: 0 },
                { type: 'message', likes: 2, name: 'Константин Константинопольский',text: 'Irure cillum sunt ut pariatur laboris sint nisi12123123123123123123123123123123s.', id: 1 },
            ]
        },
    }
    getUnreadMessageHeight = (e) => {
        this.setState({ height: e.nativeEvent.layout.height });
    }
}
