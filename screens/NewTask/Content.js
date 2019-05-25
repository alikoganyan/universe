import React, { Component } from 'react'
import { View, Text, TextInput, Dimensions, ScrollView, TouchableOpacity } from 'react-native'
import FloatingLabel from 'react-native-floating-labels'
import styled from 'styled-components'
import helper from '../../utils/helpers'
import { connect } from 'react-redux'
import { setUser } from '../../actions/userActions'
import { addReceiver, setReceivers } from '../../actions/participantsActions'
import { Button, ImageComponent } from '../../common'
import { p_create_task } from '../../constants/api/'
import sendRequest from '../../utils/request'
import { setTasks } from '../../actions/tasksActions'
import { GroupIcon, CloseIcon } from '../../assets/'
import DatePicker from 'react-native-datepicker'
const { Colors, HeaderHeight, sidePadding } = helper;
const { lightGrey1, black, purple } = Colors;
const Wrapper = styled(View)`
    padding: 0 ${sidePadding}px;
    display: flex;
    justify-content: center;
    align-items: center;
`
const StyledScrollView = styled(ScrollView)`
`
const StyledInput = styled(TextInput)`
    border: 1px solid ${lightGrey1};
    border-width: 0;
    border-bottom-width: 1px;
    padding-bottom: 10px;
    text-align: center;
    margin-bottom: 50px;
    height: 40px;
    max-height: 40px;
    ${({ style }) => style}
`
const ButtonBox = styled(View)`
    align-self: center;
`
const Receivers = styled(View)`
    margin: 60px 0;
`
const Receiver = styled(View)`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-top: 20px;
    
`
const ReceiverInfo = styled(View)`
    display: flex;
    justify-content: space-between;
`
const Department = styled(Text)`
    color: ${lightGrey1};
`
const DialogsLabel = styled(View)`
    display: flex;
    align-items: center;
    flex-direction:row;
    justify-content: flex-start;
    margin-top: 20px;
`
const AddReceiver = styled(Text)`
    color: ${purple};
`
const DeadLine = styled(View)`
    margin-top: 30px;
`
const DeadlineTime = styled(View)`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    max-width: 70%;
`
const ReceiverComponent = (props) => {
    const { children, last = false, onDelete } = props;
    const { image, phone_number, role, first_name, last_name } = children
    return <Receiver last={last}>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <ImageComponent source={{ uri: `http://ser.univ.team${image}` }} />
            <View style={{ flex: 1, marginLeft: 5 }}>
                <ReceiverInfo>
                    <Text numberOfLines={1}>{first_name ? `${first_name} ${last_name}` : phone_number}</Text>
                    <Department numberOfLines={1}>{role[0] || 'no role'}</Department>
                </ReceiverInfo>
            </View>
            <CloseIcon onPress={() => onDelete()} />
        </View>
    </Receiver>
}
class Content extends Component {
    render() {
        const { receivers } = this.props;
        const {
            taskName,
            taskText,
            deadlineDate,
            deadlineTime
        } = this.state
        const date = new Date();
        return (
            <Wrapper>
                <StyledScrollView
                    contentContainerStyle={{
                        flexGrow: 1,
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    <StyledInput password={true}
                        onChangeText={this.handleTaskName}
                        value={taskName}
                        placeholder={'Новая задача'}
                        multiline={true}
                        style={{ flex: 1, marginBottom: 30, textAlign: 'left', paddingLeft: 10 }} />
                    <StyledInput password={true}
                        onChangeText={this.handleTaskText}
                        value={taskText}
                        placeholder={'Текст задачи'}
                        multiline={true}
                        style={{ flex: 1, marginBottom: 30, textAlign: 'left', padding: 0 }} />
                    <DeadLine>
                        <DialogsLabel>
                            <GroupIcon />
                            <Text>Дедлайн</Text>
                        </DialogsLabel>
                        <DeadlineTime>
                            <DatePicker
                                date={deadlineDate}
                                mode="date"
                                placeholder={`${date.getDay()} ${'Мая'} ${date.getFullYear()}`}
                                confirmBtnText="Подтвердить"
                                format="YYYY-MM-DD"
                                cancelBtnText="Отменить"
                                customStyles={{
                                    dateIcon: {
                                        width: 0,
                                        height: 0,
                                    },
                                    dateInput: {
                                        borderWidth: 0,
                                        borderBottomWidth: 1
                                    }
                                }}
                                onDateChange={e => this.setState({ deadlineDate: e })}
                            />
                            <DatePicker
                                date={deadlineTime}
                                mode="time"
                                placeholder="11:12"
                                confirmBtnText="Подтвердить"
                                cancelBtnText="Отменить"
                                customStyles={{
                                    dateIcon: {
                                        width: 0,
                                        height: 0,
                                    },
                                    dateInput: {
                                        borderWidth: 0,
                                        borderBottomWidth: 1
                                    }
                                }}
                                onDateChange={e => this.setState({ deadlineTime: e })}
                            />
                        </DeadlineTime>
                    </DeadLine>
                    <Receivers>
                        <DialogsLabel>
                            <GroupIcon />
                            <Text>Исполнитель</Text>
                        </DialogsLabel>
                        {receivers.length > 0 ? receivers.map((e, i) => (
                            <ReceiverComponent key={i} last={i === receivers.length} onDelete={() => this.deleteReceiver(e)}>{e}</ReceiverComponent>
                        )) : <DialogsLabel>
                                <TouchableOpacity onPress={this.addParticipant}>
                                    <AddReceiver>Добавить</AddReceiver>
                                </TouchableOpacity>
                            </DialogsLabel>}
                    </Receivers>
                    <ButtonBox>
                        <Button
                            onPress={this.proceed}
                            style={{ background: purple }}
                            color={'white'}>Создать задачу</Button>
                    </ButtonBox>
                </StyledScrollView>
            </Wrapper>
        )
    }
    state = {
        taskName: '',
        taskText: '',
        deadlineDate: '',
        deadlineTime: ''
    }
    componentDidMount() {
    }
    componentWillUpdate() {
    }
    jsCoreDateCreator = (dateString) => {
        // dateString *HAS* to be in this format "YYYY-MM-DD HH:MM:SS"  
        let dateParam = dateString.split(/[\s-:]/)
        dateParam[1] = (parseInt(dateParam[1], 10) - 1).toString()
        return new Date(...dateParam)
    }
    deleteReceiver = (e) => {
        const { addReceiver, setReceivers, receivers } = this.props
        let newReceivers = [...receivers];
        newReceivers = newReceivers.filter(item => e._id !== item._id)
        setReceivers(newReceivers)
    }
    addParticipant = () => {
        const { addParticipants } = this.props;
        addParticipants()
    }
    proceed = (e) => {
        const { receivers, forward, setTasks, user, tasks } = this.props
        const { deadlineDate, deadlineTime, taskName, taskText } = this.state;
        const deadline = this.jsCoreDateCreator(`${deadlineDate}:${deadlineTime}`)
        const newTaskUser = tasks.filter(e => e._id === user._id)[0]
        const newTask = {
            _id: Math.floor(Math.random()*10000),
            name: taskName,
            description: taskText,
            deadline,
            performers: [receivers[0]._id],
            creator: { ...user },
            created_at: new Date(),
            updated_at: new Date(),
            status: 'set',
        }
        if (newTaskUser) {
            const newTasks = [...tasks]
            newTaskUser.tasks = [...newTaskUser.tasks, newTask]
            const index = newTasks.findIndex(e => e._id === user._id)
            newTasks[index] = newTaskUser
            setTasks(newTasks)
        } else {
            const newTasks = [...tasks, {
                ...user,
                tasks: [...user.tasks, newTask]
            }]
            setTasks(newTasks)
        }
        forward()
        // sendRequest({
        //     r_path: p_create_task,
        //     method: 'post',
        //     attr: {
        //         task: { name: taskName, description: taskText, deadline, performers: [receivers[0]._id] }
        //     },
        //     success: (res) => {
        //         console.log(res)
        //         forward()
        //     },
        //     failFunc: (err) => {
        //         console.log(err)
        //     }
        // })
    }
    handleCountry = (e) => {
        this.setState({ country: e })
    }
    handleTaskName = (e) => {
        this.setState({ taskName: e })
    }
    handleTaskText = (e) => {
        this.setState({ taskText: e })
    }
    handleDeadlineDate = (e) => {
        this.setState({ deadlineDate: e })
    }
    handleDeadlineTime = (e) => {
        this.setState({ deadlineTime: e })
    }
}
const mapStateToProps = state => ({
    user: state.userReducer.user,
    receivers: state.participantsReducer.tasks.receivers,
    tasks: state.tasksReducer.tasks,
})
const mapDispatchToProps = dispatch => ({
    setUser: _ => dispatch(setUser(_)),
    addReceiver: _ => dispatch(addReceiver(_)),
    setReceivers: _ => dispatch(setReceivers(_)),
    setTasks: _ => dispatch(setTasks(_)),
})
export default connect(mapStateToProps, mapDispatchToProps)(Content)