import React, { Component } from 'react'
import { View, Text, SafeAreaView, FlatList, Image, TouchableOpacity, ActionSheetIOS } from 'react-native'
import { TriangleLeftIcon, TriangleRightIcon, CheckIcon, CommentIcon, HeartIcon } from '../../assets/index'
import styled from 'styled-components'
import helper from '../../Helper/helper'
import { connect } from 'react-redux'
const { HeaderHeightNumber } = helper;
const Wrapper = styled(View)`
    background: white;
    margin-bottom: ${({ search }) => search ? HeaderHeightNumber * 2 : HeaderHeightNumber};
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
    color: #ABABAB;
`

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
const Task = styled(View)`
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
const TaskPostTimeText = styled(MessageDate)`
`
const Indicator = ({ delievered = false, read = false }) => {
    return <CheckIcon />
}
const Message = (props) => {
    const { children } = props;
    const { text, id } = children;
    return myId === id ? (
        <View style={{ display: 'flex', flexDirection: 'row' }}>
            <MyMessage>
                <MyMessageText>
                    {text}
                </MyMessageText>
                <MessageInfo>
                    <MessageDate>1:40</MessageDate>
                    <Indicator />
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
                    <Indicator />
                </MessageInfo>
            </InterlocutorsMessage>
        </ View>
}


const myId = 1;
class Content extends Component {
    componentDidMount() {

    }
    handleHold = () => {
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: ['Отменить', 'Ответить', 'Копировать', 'Изменить', 'Удалить'],
                cancelButtonIndex: 0,
            },
            (buttonIndex) => {
                if (buttonIndex === 1) {
                    /* destructive action */
                }
            },
        );
    }
    render() {
        const { messages, search } = this.props

        const revesedMessages = [...messages].reverse();
        return (
            <SafeAreaView>
                <Wrapper search={search}>
                    <FlatList
                        style={{ paddingRight: 5, paddingLeft: 5, }}
                        ListHeaderComponent={<View style={{ margin: 30, }} />}
                        inverted={true}
                        data={revesedMessages}
                        renderItem={({ item }) => {
                            if (item.type === 'message') {
                                return <TouchableOpacity onLongPress={this.handleHold}>
                                    <Message>{item}</Message>
                                </TouchableOpacity>

                            }
                            if (item.type === 'task') {
                                const { stage, author, created, deadline, text, title } = item;
                                const statuses = ['Прочитано', 'Принял в работу', 'Выполнена', 'Принята',]
                                return <Task>
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
                                return <Feed>
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
