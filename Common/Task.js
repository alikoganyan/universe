import React, { Component } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import styled from 'styled-components'
import { CheckIcon, TriangleLeftIcon, TriangleRightIcon } from '../assets'
import { connect } from 'react-redux'
import { setTasks, setActiveTask } from '../actions/tasksActions'
import sendRequest from '../utils/request'
import { p_tasks } from '../constants/api'
const { HeaderHeight, Colors, fontSize } = helper;
const { red, yellow, green, purple, grey1 } = Colors;
const borderRadius = 5;
const Wrapper = styled(View)`
    display :flex;
    flex-direction: row;
    flex: 5;
    max-width: 300px;
    align-self: flex-start;
`
const MessageDate = styled(Text)`
    color: ${({ color }) => color || '#ABABAB'};
`

const Task = styled(View)`
    flex: 1;
    margin: 10px;
    /* margin-right: 0; */
    display: flex;
    flex-direction: column;
    padding: 10px;
    padding-bottom: 5px;
    background: #fff;
    border: 1px solid ${({ borderColor }) => borderColor || purple};
    border-radius: ${borderRadius};
    align-self: flex-end;
`
const Status = styled(View)`
    display: flex;
    flex-direction: column;
`
const StatusItem = styled(TouchableOpacity)`
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
    flex: 5;
`
const TaskDeadlineLabel = styled(Text)`
    color: ${grey1};
    flex: 1;
    font-size: ${fontSize.sl};
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
    flex: 2;
`
const TaskFooter = styled(View)`
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    flex: 1;
`
const TaskPostTimeText = styled(MessageDate)`
`
const ControlBar = styled(View)`
    display: flex;
    padding: 10px 0;
    flex: 1;
    justify-content: space-between;
`
const OuterWrapper = styled(View)`
    display: flex;
    justify-content: flex-start;
    flex-direction: row;
`
const Exit = styled(TouchableOpacity)`
    height: 40px;
    width: 40px;
    border-radius: 20;
    background: white;
    border: 1px solid red;
    display: flex;
    justify-content: center;
    align-items: center;
`
const Accept = styled(Exit)`
    border-color: ${purple};
`
const Rearrange = styled(Exit)`
    border-color: ${yellow};
`
const Edit = styled(Exit)`
    border-color: ${green};
`
const Indicator = ({ delievered = false, read = false, color }) => {
    return <CheckIcon color={color} />
}
class TaskComponent extends Component {
    render() {
        const { children, style, triangleLeft, triangleRight, borderColor, user, activeTask } = this.props
        const { name, description, status, deadline, created_at, creator, created, text, title, _id } = children
        const statuses = ['ЗАДАЧА ПОСТАВЛЕНА', 'ПРИНЯЛ В РАБОТУ', 'ВЫПОЛНЕНА', 'ПРИНЯТА',]
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec',];
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
        const deadlineDate = new Date(deadline)
        const creationDate = new Date(created_at)
        activeTask.creator && console.log(stat, _id, activeTask._id)
        return (
            <OuterWrapper style={{ justifyContent: triangleRight ? 'flex-end' : 'flex-start', }}>
                {activeTask._id === _id && triangleRight && <ControlBar style={{ alignItems: 'flex-end' }}>
                    {activeTask.creator._id !== user._id && <Edit><Text>X</Text></Edit>}
                    {(stat === 1 && activeTask.creator._id !== user._id) && <Accept onPress={this.accept}><Text>X</Text></Accept>}
                    {(stat === 1 && activeTask.creator._id === user._id) && <Rearrange onPress={this.rearrange}><Text>X</Text></Rearrange>}
                    {<Exit onPress={this.unselect}><Text>X</Text></Exit>}
                </ControlBar>}
                <Wrapper style={{ alignSelf: triangleRight ? 'flex-end' : 'flex-start', }}>
                    {triangleLeft && <TriangleRightIcon style={{
                        position: 'relative',
                        left: 11,
                        top: -10,
                        zIndex: 99,
                    }} hollow color={borderColor} />}
                    <Task style={{
                        ...style,
                        borderBottomLeftRadius: triangleLeft ? 0 : borderRadius,
                        borderBottomRightRadius: triangleRight ? 0 : borderRadius,
                    }}
                        borderColor={borderColor}
                    >
                        <Status>
                            <StatusText>{statuses[stat]}</StatusText>
                            <StatusStage>
                                {statuses.map((e, i) => <StatusItem key={`statusState_${i}`} completed={i <= stat} color={colors[i]} onPress={() => this.changeState(i)} />)}
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
                                <TaskDeadlineLabel numberOfLines={1}>Делайн: {' '}
                                    <TaskDeadlineValue>
                                        {deadlineDate.getDate()}{' '}
                                        {months[deadlineDate.getMonth()]}{' '}
                                        {deadlineDate.getFullYear()}{' '}
                                        {deadlineDate.getHours()}:{deadlineDate.getMinutes()}
                                    </TaskDeadlineValue>
                                </TaskDeadlineLabel>
                            </TaskDeadline>
                            <TaskPostTime>
                                <TaskPostTimeText>
                                    {creationDate.getHours()}:{creationDate.getMinutes() < 10 ? `0${creationDate.getMinutes()}` : creationDate.getMinutes()}
                                </TaskPostTimeText>
                                {triangleRight && <Indicator />}
                            </TaskPostTime>
                        </TaskFooter>
                    </Task>
                    {triangleRight && <TriangleLeftIcon style={{
                        position: 'relative',
                        left: -11,
                        top: -10,
                        zIndex: 99,
                    }} hollow color={borderColor} />}
                </Wrapper>
                {activeTask._id === _id && triangleLeft && <ControlBar>
                    {activeTask.creator._id !== user._id && <Edit><Text>X</Text></Edit>}
                    {(stat === 1 && activeTask.creator._id !== user._id) && <Accept onPress={this.accept}><Text>X</Text></Accept>}
                    {(stat === 1 && activeTask.creator._id === user._id) && <Rearrange onPress={this.rearrange}><Text>X</Text></Rearrange>}
                    {<Exit onPress={this.unselect}><Text>X</Text></Exit>}
                </ControlBar>}
            </OuterWrapper>)
    }
    accept = () => {
        const { activeTask, setActiveTask } = this.props
        const newActiveTask = { ...activeTask }
        newActiveTask.status = "done"
        setActiveTask(newActiveTask)
        const { _id, name, description, deadline, performers, status } = newActiveTask
        console.log({
            name,
            description,
            deadline,
            performers,
            status,
        })
        sendRequest({
            r_path: p_tasks,
            method: 'patch',
            attr: {
                task: {
                    _id,
                    name,
                    description,
                    deadline,
                    performers,
                    status,
                }
            },
            success: (res) => {
                console.log(res)
            },
            failFunc: (err) => {
                console.log(err)
            }
        })
    }
    rearrange = () => {

    }
    changeState = (e) => {
        const { children, user, tasks } = this.props;
        // console.log(e, children)
        const newTask = { ...children }
        let stat = ''
        switch (e) {
            case 0:
                stat = '0';
                break;
            case 1:
                stat = 'set';
                break;
            case 2:
                stat = '2';
                break;
            case 3:
                stat = 'done';
                break;
        }
        newTask.status = stat;
        currentTask = tasks.map(e => e.tasks.filter(e => e._id !== children._id)[0])
    }
    unselect = () => {
        const { setActiveTask } = this.props;
        setActiveTask({})
    }
    componenWillUmount() {
        this.unselect()
    }
}

const mapStateToProps = state => ({
    tasks: state.tasksReducer.tasks,
    activeTask: state.tasksReducer.activeTask,
    user: state.userReducer.user
});
const mapDispatchToProps = dispatch => ({
    setTasks: _ => dispatch(setTasks(_)),
    setActiveTask: _ => dispatch(setActiveTask(_)),
})
export default connect(mapStateToProps, mapDispatchToProps)(TaskComponent)
