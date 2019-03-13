import React, { Component } from 'react'
import { Text, View } from 'react-native'
import styled from 'styled-components'
import { CheckIcon } from '../assets/'
const { HeaderHeightNumber, Colors } = helper;
const { red, yellow, green, purple } = Colors;

const MessageDate = styled(Text)`
    color: ${({ color }) => color || '#ABABAB'};
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
    background: ${({ completed, color }) => completed ? color : '#D9D9D9'};
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
const Indicator = ({ delievered = false, read = false, color }) => {
    return <CheckIcon color={color} />
}
export default function TaskComponent({ children }) {
    const item = children;
    const { stage, author, created, deadline, text, title } = item;
    const statuses = ['Прочитано', 'Принял в работу', 'Выполнена', 'Принята',]
    const colors = [red, yellow, green, purple]
    return (<Task>
        <Status>
            <StatusText></StatusText>
            <Text>{statuses[stage]}</Text>
            <StatusStage>
                {statuses.map((e, i) => <StatusItem key={`statusState_${i}`} completed={i <= stage} color={colors[i]}/>)}

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
    </Task>)
}
