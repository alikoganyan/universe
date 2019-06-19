import React, { Component } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import styled from 'styled-components'
import { CloseTaskIcon, TriangleLeftIcon, TriangleRightIcon, RedoIcon, DoneIcon, StartIcon, EditIcon } from '../assets'
import { connect } from 'react-redux'
import { setTasks, setActiveTask } from '../actions/tasksActions'
import sendRequest from '../utils/request'
import { p_tasks } from '../constants/api'
import ImageComponent from '../common/Image'
import DefaultAvatar from '../common/DefaultAvatar'
const { Colors, fontSize, borderRadius } = helper;
const { red, yellow, green, purple, grey1 } = Colors;
const Wrapper = styled(View)
`
    display :flex;
    flex-direction: row;
    flex: 5;
    max-width: 300px;
    align-self: flex-start;
    justify-content: flex-end;
`
const MessageDate = styled(Text)
`
    color: ${({ color }) => color || '#ABABAB'};
`

const Task = styled(View)
`
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
const Status = styled(View)
`
    display: flex;
    flex-direction: column;
`
const StatusItem = styled(TouchableOpacity)
`
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
const StatusStage = styled(View)
`
    display: flex;
    flex-direction: row;
`
const StatusText = styled(Text)
`
    color: ${purple};
    margin-bottom: 5px;
`
const TaskTitle = styled(View)
`
    margin-top: 20px;
    margin-bottom: 10px;
    ${({ style }) => style}
`
const TaskBody = styled(View)
`
    margin-bottom: 10px;
`
const TaskBodyText = styled(Text)
`
    color: ${grey1};
`
const TaskDeadline = styled(View)
`
    display: flex;
    flex-direction: column;
    width: 100%;
    flex: 7;
`
const TaskDeadlineLabel = styled(Text)
`
    color: ${grey1};
    flex: 1;
    font-size: ${fontSize.sl};
`
const TaskDeadlineValue = styled(Text)
`
    color: ${purple};
`
const TaskPostTime = styled(View)
`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    padding: 0;
    width: 100%;
    margin-right: 10px;
    flex: 2;
`
const TaskFooter = styled(View)
`
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    flex: 1;
`
const TaskPostTimeText = styled(MessageDate)
`
    font-size: ${fontSize.sm};
`
const ControlBar = styled(View)
`
    display: flex;
    padding: 10px 0;
    flex: 1;
    justify-content: flex-end;
`
const OuterWrapper = styled(View)
`
    display: flex;
    justify-content: flex-start;
    flex-direction: row;
`
const ExitPlaceholder = styled(View)
`
    height: 40px;
    width: 40px;
    border-radius: 20;
    margin-top: 10px;
`
const Exit = styled(TouchableOpacity)
`
    height: 40px;
    width: 40px;
    border-radius: 20;
    margin-top: 10px;
    background: white;
    border: 1px solid red;
    display: flex;
    justify-content: center;
    align-items: center;
`
const Accept = styled(Exit)
`
    border-color: ${purple};
`
const Rearrange = styled(Exit)
`
    border-color: ${yellow};
`
const Edit = styled(Exit)
`
    border-color: ${green};
    display: flex;
    justify-content: center;
`
class TaskComponent extends Component {
    render() {
        const { children, style, triangleLeft, triangleRight, borderColor, activeTask, withImage } = this.props
        const { name, description, status, deadline, created_at, creator, _id, performers } = children
        const statuses = ['ЗАДАЧА ПОСТАВЛЕНА', 'ПРИНЯЛ В РАБОТУ', 'ВЫПОЛНЕНА', 'ПРИНЯТА', ]
        const colors = [red, yellow, green, purple];
        this.stat = ''
        switch (status) {
            case 'set':
                this.stat = 0;
                break;
            case 'accepted':
                this.stat = 1;
                break;
            case 'done':
                this.stat = 2;
                break;
            case 'completed':
                this.stat = 3;
                break;
            case 'cancelled':
                this.stat = 4;
                break;
        }
        const deadlineDate = new Date(deadline)
        const creationDate = new Date(created_at)
        const rightControl = activeTask._id === _id;
        const leftControl = activeTask._id === _id;
        return (
            <OuterWrapper style={{ justifyContent: triangleRight ? 'flex-end' : 'flex-start', left: withImage ? -10 : 0}}>
                {triangleRight && <ControlBar style={{ alignItems: 'flex-end' }}>
                    {rightControl ? <>
                        <Exit onPress={rightControl && this.unselect}><CloseTaskIcon /></Exit>
                        <Edit onPress={this.editFeed}><EditIcon noPaddingAll marginRight={false}/></Edit>
                        {(this.stat === 2) && <Accept onPress={undefined}><RedoIcon /></Accept>}
                        {(this.stat === 2) && <Rearrange onPress={rightControl && this.complete}><StartIcon /></Rearrange>}
                    </> :
                        <ExitPlaceholder />}
                </ControlBar>}
                <Wrapper style={{ alignSelf: triangleRight ? 'flex-end' : 'flex-start', }}>
                    {
                        withImage && <View style={{
                            alignSelf: 'flex-end',
                            top: -10,
                            left: 15,
                        }}>
                            {
                                creator.image === '/images/default_group.png' || creator.image === '/images/default_avatar.jpg' ?
                                    <DefaultAvatar id={_id} size={'header'} /> :
                                    <ImageComponent size={'header'} source={{ uri: `http://ser.univ.team${creator.image}` }} />
                            }
                        </View>
                    }
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
                            <StatusText>{statuses[this.stat]}</StatusText>
                            <StatusStage>
                                {statuses.map((e, i) => <StatusItem key={`statusState_${i}`} completed={i <= this.stat} color={colors[i]} onPress={() => this.changeState(i)} />)}
                            </StatusStage>
                        </Status>
                        <TaskTitle>
                            <Text>{name}</Text>
                        </TaskTitle>
                        <TaskBody>
                            <TaskBodyText>{description} 
                                {performers.map(e => e.first_name)}
                            </TaskBodyText>
                        </TaskBody>
                        <TaskFooter>
                            <TaskDeadline>
                                <TaskDeadlineLabel numberOfLines={1}>Срок: {' '}
                                    <TaskDeadlineValue>
                                        {deadlineDate.getDate() >= 10 ? deadlineDate.getDate() : `0${deadlineDate.getDate()}`}.
                                        {deadlineDate.getMonth() >= 10 ? deadlineDate.getMonth() : `0${deadlineDate.getMonth()}`}.
                                        {deadlineDate.getFullYear().toString().substr(-2)}{' '}
                                        {deadlineDate.getHours() >= 10 ? deadlineDate.getHours() : `0${deadlineDate.getHours()}`}:{deadlineDate.getMinutes() >= 10 ? deadlineDate.getMinutes() : `0${deadlineDate.getMinutes()}`}
                                    </TaskDeadlineValue>
                                </TaskDeadlineLabel>
                            </TaskDeadline>
                            <TaskPostTime>
                                <TaskPostTimeText>
                                    {creationDate.getHours()}:{creationDate.getMinutes() < 10 ? `0${creationDate.getMinutes()}` : creationDate.getMinutes()}
                                </TaskPostTimeText>
                                {/* {triangleRight && <Indicator />} */}
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
                {
                    triangleLeft && <ControlBar>
                        {leftControl ? <>
                            <Exit onPress={leftControl && this.unselect}><CloseTaskIcon /></Exit>
                            {(this.stat === 1) && <Accept onPress={leftControl && this.done}><DoneIcon /></Accept>}
                            {(this.stat === 0) && <Rearrange onPress={leftControl && this.accept}><StartIcon /></Rearrange>}</> :
                            <ExitPlaceholder />}
                    </ControlBar>
                }
            </OuterWrapper >)
    }
    editFeed = () => {
        const { editFeed } = this.props
        editFeed()
    }
    done = () => {
        this.changeState('done')
    }
    complete = () => {
        this.changeState('completed')
    }
    accept = () => {
        this.changeState('accepted')
    }
    changeState = (e) => {
        const { activeTask, setActiveTask, setTasks, tasks, currentTask } = this.props
        const newActiveTask = { ...activeTask };
        const { _id, name, description, deadline, performers } = newActiveTask
        const newTasks = [...tasks];
        const newHolder = newTasks.filter(e => e._id === currentTask._id)[0];
        const newTask = newHolder.tasks.filter(e => e._id === activeTask._id)[0]
        newTask.status = e;
        const holderId = newHolder.tasks.findIndex(e => e._id === newTask._id)
        const tasksId = newTasks.findIndex(e => e._id === newHolder._id)
        newHolder.tasks[holderId] = newTask
        newTasks[tasksId] = newHolder
        setTasks(newTasks)
        setActiveTask(newTask)
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
                    status: e,
                }
            },
            success: () => {
                // console.log({res})
            },
            failFunc: (err) => {
                console.log(err)
            }
        })
    }
    unselect = () => {
        const { setActiveTask } = this.props;
        setActiveTask({})
        // this.changeState('set')
        // console.log('unselect')
    }
    componentDidMount() {}
    componenWillUmount() {
        this.unselect()
    }
}

const mapStateToProps = state => ({
    tasks: state.tasksReducer.tasks,
    activeTask: state.tasksReducer.activeTask,
    currentTask: state.tasksReducer.currentTask,
    user: state.userReducer.user
});
const mapDispatchToProps = dispatch => ({
    setTasks: _ => dispatch(setTasks(_)),
    setActiveTask: _ => dispatch(setActiveTask(_)),
})
export default connect(mapStateToProps, mapDispatchToProps)(TaskComponent)