import React, { Component } from 'react'
import { Text, View } from 'react-native'
import styled from 'styled-components'
import { CheckIcon, TriangleLeftIcon, TriangleRightIcon } from '../assets'
const { HeaderHeightNumber, Colors } = helper;
const { red, yellow, green, purple, grey1 } = Colors;
const borderRadius = 5;
const Wrapper = styled(View)`
    display :flex;
    flex-direction: row;
`
const MessageDate = styled(Text)`
    color: ${({ color }) => color || '#ABABAB'};
`

const Task = styled(View)`
    flex: 1;
    margin: 10px 40px;
    display: flex;
    flex-direction: column;
    padding: 10px;
    padding-bottom: 5px;
    background: #fff;
    border: 1px solid ${purple};
    border-radius: ${borderRadius};
    align-self: flex-end;
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
const StatusText = styled(Text)`
    color: ${purple};
    margin-bottom: 5px;
`
const TaskTitle = styled(View)`
    margin-bottom: 10px;
    ${({ style }) => style}
`
const TaskBody = styled(View)`
    margin-bottom: 10px;
`
const TaskBodyText = styled(Text)`
    color: ${grey1};
`
const TaskDeadline = styled(View)`
    display: flex;
    flex-direction: column;
    width: 100%;
    flex: 6;
`
const TaskDeadlineLabel = styled(Text)`
    color: ${grey1};
    flex: 1;
    
`
const TaskDeadlineValue = styled(Text)`
    color: ${purple};
`
const TaskPostTime = styled(View)`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    padding: 0;
    width: 100%;
    flex: 1;
`
const TaskFooter = styled(View)`
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    flex: 1;
`
const TaskPostTimeText = styled(MessageDate)`
`
const Indicator = ({ delievered = false, read = false, color }) => {
    return <CheckIcon color={color} />
}
export default function TaskComponent({ children, style, triangleLeft, triangleRight }) {
    const { name, description, status, deadline, created_at, creator, created, text, title } = children;
    const statuses = ['Прочитано', 'Принял в работу', 'Выполнена', 'Принята',]
    const colors = [red, yellow, green, purple];
    let stat = ''
    switch (status) {
        case 'set':
            stat = 1;
            break;
        case 'done':
            stat = 2;
            break;
    }
    return (<Wrapper style={{ alignSelf: triangleRight ? 'flex-end' : 'flex-start', }}>
        {triangleLeft && <TriangleRightIcon style={{
            position: 'relative',
            left: 11,
            top: -10,
            zIndex: 99,
        }} hollow color={purple} />}
        <Task style={{
            ...style,
            borderBottomLeftRadius: triangleLeft ? 0 : borderRadius,
            borderBottomRightRadius: triangleRight ? 0 : borderRadius,
        }}>
            <Status>
                <StatusText>{statuses[stat]}</StatusText>
                <StatusStage>
                    {statuses.map((e, i) => <StatusItem key={`statusState_${i}`} completed={i <= stat} color={colors[i]} />)}
                </StatusStage>
            </Status>
            <TaskTitle>
                <Text>{name}</Text>
            </TaskTitle>
            <TaskBody>
                <TaskBodyText>{description}</TaskBodyText>
            </TaskBody>
            <TaskFooter>
                <TaskDeadline>
                    <TaskDeadlineLabel numberOfLines={1}>Делайн: <TaskDeadlineValue>25 января 2017 16:16</TaskDeadlineValue></TaskDeadlineLabel>
                </TaskDeadline>
                <TaskPostTime>
                    <TaskPostTimeText>1:40</TaskPostTimeText>
                    <Indicator />
                </TaskPostTime>
            </TaskFooter>
        </Task>
        {triangleRight && <TriangleLeftIcon style={{
            position: 'relative',
            left: -11,
            top: -10,
            zIndex: 99,
        }} hollow={true} color={purple} />}
    </Wrapper>)
}
