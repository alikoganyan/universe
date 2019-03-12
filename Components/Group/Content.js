import React, { Component, Fragment } from 'react'
import { View, Text, SafeAreaView, FlatList, Image, TouchableOpacity, ActionSheetIOS } from 'react-native'
import { TriangleLeftIcon, TriangleRightIcon, CheckIcon, CommentIcon, HeartIcon } from '../../assets/index'
import styled from 'styled-components'
import helper from '../../Helper/helper'
import { connect } from 'react-redux'
const { HeaderHeightNumber, Colors } = helper;
const { lightColor } = Colors
const Wrapper = styled(View)`
    background: white;
    margin-bottom: ${({ search }) => search ? HeaderHeightNumber * 2 : HeaderHeightNumber}px;
`
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
    flex-direction: row;
    color: white;
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
    padding-bottom: 0px;
    flex-wrap: wrap;
`

const InterlocutorsMessage = styled(MyMessage)`
    justify-content: flex-start;
    flex-direction: column;
    text-align: left;
    align-items: flex-start;
    background: #F6F5F6;
    margin-left: 10px;
    position: relative;
    left: -10px;
    
`

const InterlocutorsName = styled(Text)`
    color: #243490;
    display: flex;
    flex: 1;
    font-weight: 500;
`

const InterlocutorsMessageImage = styled(Image)`
    width: 20px;
    height: 20px;
    margin: 10px;
    border-radius: 10;
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
const InterlocatorInfo = styled(View)`
    display: flex;
    flex-direction: row;
    align-items: center;

`

const NewsItem = styled(View)`
    padding: 10px;
    margin: 10px 40px;
    border-radius: 5;
    background: #F5F3F5;
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

const Task = styled(TouchableOpacity)`
    flex: 1;
    margin: 10px 40px;
    display: flex;
    flex-direction: column;
    padding: 10px;
    padding-bottom: 0;
    background: #F6F6F6;
    border-radius: 5;
`
const Status = styled(View)`
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
`
const StatusItem = styled(View)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    width: 24%;
    height: 3px;
    border-radius: 2;
    background: ${({ completed }) => completed ? '#2E2E2E' : '#D9D9D9'};
    margin: 1px;
`
const StatusStage = styled(View)`
    display: flex;
    flex-direction: row;
`
const StatusText = styled(Text)``
const TaskTitle = styled(View)`
    margin-bottom: 10px;
`
const TaskBody = styled(View)`
    margin-bottom: 10px;
`
const TaskDeadline = styled(View)`
    display: flex;
    flex-direction: row;
    flex: 1;
    width: 100%;
`
const TaskDeadlineLabel = styled(Text)`
    color: #999999;
    
`
const TaskPostTime = styled(View)`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    padding: 0;
    width: 100%;
`
const TaskPostTimeText = styled(Text)`
    color: #ABABAB;
`
const Indicator = ({ delievered = false, read = false, color }) => {
    return !read ? <CheckIcon color={color}/> : <CheckAllIcon color={color}/>
}

const Message = (props) => {
    const { children, getMessageHeight } = props;
    const { text, id } = children;
    return myId === id ? (
        <View style={{ display: 'flex', flexDirection: 'row' }}>
            <MyMessage>
                <MyMessageText>
                    {text}
                </MyMessageText>
                <MessageInfo>
                    <MessageDate color={'white'}>1:40</MessageDate>
                    <Indicator color={'white'}></Indicator>
                </MessageInfo>

            </MyMessage>
            <TriangleLeftIcon color={'#3776F9'} />
        </View>
    ) : <View style={{ display: 'flex', flexDirection: 'row' }}>
            <TriangleRightIcon color={'#F6F5F6'} />
            <InterlocutorsMessage>
                <InterlocatorInfo>
                    <InterlocutorsMessageImage source={{ uri: 'https://facebook.github.io/react/logo-og.png' }} />
                    <InterlocutorsName>Kek</InterlocutorsName>
                </InterlocatorInfo>

                <InterlocutorsMessageText>
                    {text}
                </InterlocutorsMessageText>
                <MessageInfo>
                    <MessageDate>1:40</MessageDate>
                </MessageInfo>
            </InterlocutorsMessage>

        </View>
}


const myId = 1;

class Content extends Component {
    getUnreadMessageHeight = (e) => {
        return e.nativeEvent.layout.height;
    }
    handleHold = () => {
    }
    taskAction = () => {
    }
    render() {
        const { messages, search } = this.props
        const reversedMessages = [...messages].reverse();

        return (
            <SafeAreaView>
                <Wrapper search={search}>
                    <FlatList
                        style={{ paddingRight: 5, paddingLeft: 5, }}
                        ListHeaderComponent={<View style={{ margin: 30, }} />}
                        inverted={true}
                        data={reversedMessages}
                        renderItem={({ item }) => {
                            if (item.type === 'message') {
                                return <TouchableOpacity onLongPress={this.handleHold}>
                                    <Message getMessageHeight={this.getUnreadMessageHeight}>{item}</Message>
                                </TouchableOpacity>
                            }
                            if (item.type === 'task') {
                                const { stage, author, created, deadline, text, title } = item;
                                const statuses = ['Прочитано', 'Принял в работу', 'Выполнена', 'Принята',]
                                return <Task onPress={author !== 2 && this.taskAction}>
                                    <Status>
                                        <StatusText></StatusText>
                                        <Text>{statuses[stage]}</Text>
                                        <StatusStage>
                                            {statuses.map((e, i) => <StatusItem key={`statusState_${i}`} completed={i === stage} />)}

                                        </StatusStage>
                                    </Status>
                                    <TaskTitle>
                                        <Text>{title}</Text>
                                    </TaskTitle>
                                    <TaskBody>
                                        <Text>{text}</Text>
                                    </TaskBody>
                                    <TaskDeadline>
                                        <TaskDeadlineLabel>делайн: </TaskDeadlineLabel><Text>25 января 2017 16:16</Text>
                                    </TaskDeadline>
                                    <TaskPostTime>
                                        <TaskPostTimeText>1:40</TaskPostTimeText>
                                        <Indicator />
                                    </TaskPostTime>
                                </Task>

                            }
                            if (item.type === 'feed') {
                                <NewsItem>
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
                                            {item.hashtags.map((e, i) => <TouchableOpacity key={i}>
                                                <HashTag>{e}</HashTag>
                                            </TouchableOpacity>)}
                                        </HashTags>

                                        <Reactions>
                                            <CommentIcon onPress={this.handleHold} /><Text>12</Text>
                                            <HeartIcon /><Text>12</Text>
                                        </Reactions>
                                    </NewsItemInfo>
                                </NewsItem>
                            }
                        }}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </Wrapper>
            </SafeAreaView>
        )
    }
}
const mapStateToProps = state => {
    return {
        messages: state.messageReducer.messages,
        search: state.messageReducer.search
    };
};
const mapDispatchToProps = dispatch => ({

})
export default connect(mapStateToProps, mapDispatchToProps)(Content)
