import React, { Component } from 'react'
import {
  View,
  Text,
  TextInput,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import styled from 'styled-components'
import { connect } from 'react-redux'
import DatePicker from 'react-native-datepicker'
import helper from '../../utils/helpers'
import { setUser } from '../../actions/userActions'
import { setTaskReceivers } from '../../actions/participantsActions'
import ImageComponent from '../../common/Image'
import DefaultAvatar from '../../common/DefaultAvatar'
import Button from '../../common/Button'
import { p_tasks, g_profile } from '../../constants/api'
import sendRequest from '../../utils/request'
import {
  setTasks,
  setCurrentTask,
  setTaskList,
  setActiveTask,
} from '../../actions/tasksActions'
import { GroupIcon, CloseIcon } from '../../assets'
import moment from 'moment'

const { Colors, HeaderHeight, sidePadding } = helper
const { lightGrey1, purple, red, pink, black } = Colors
const Wrapper = styled(View)`
  padding: 0 ${sidePadding}px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${Dimensions.get('window').height - HeaderHeight - 20}px;
  width: 100%;
`
const StyledScrollView = styled(ScrollView)`
  height: ${Dimensions.get('window').height - HeaderHeight - 20}px;
  width: 100%;
`
const StyledInput = styled(TextInput)`
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
  flex-direction: row;
  justify-content: flex-start;
  margin-top: 20px;
`
const DialogsLabelText = styled(Text)`
  margin-left: 10px;
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
const DeleteTask = styled(Text)`
  color: ${red};
  text-align: center;
  margin-top: 20px;
`
const ReceiverComponent = props => {
  const { children, last = false, onDelete } = props
  const { image, phone_number, role, first_name, last_name } = children
  return (
    <Receiver last={last}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        {image === '/images/default_avatar.jpg' ? (
          <DefaultAvatar />
        ) : (
          <ImageComponent
            source={{ uri: `https://testser.univ.team${image}` }}
          />
        )}
        <View style={{ flex: 1, marginLeft: 5 }}>
          <ReceiverInfo>
            <Text numberOfLines={1}>
              {first_name ? `${first_name} ${last_name}` : phone_number}
            </Text>
            {role ? (
              <Department numberOfLines={1}>{role.name}</Department>
            ) : null}
          </ReceiverInfo>
        </View>
        <CloseIcon onPress={onDelete} />
      </View>
    </Receiver>
  )
}
class Content extends Component {
  render() {
    const { receivers } = this.props
    const {
      taskName,
      taskText,
      deadlineDate,
      deadlineTime,
      touched,
    } = this.state

    return (
      <Wrapper>
        <StyledScrollView
          contentContainerStyle={{
            flexGrow: 1,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <StyledInput
            password
            onChangeText={this.handleTaskName}
            value={taskName}
            placeholder="Название задачи"
            multiline
            style={{
              marginBottom: 30,
              textAlign: 'left',
              borderBottomWidth: 1,
              borderBottomColor: !taskName && touched ? pink : lightGrey1,
            }}
          />
          <StyledInput
            password
            onChangeText={this.handleTaskText}
            value={taskText}
            placeholder="Текст задачи"
            multiline
            style={{
              marginBottom: 30,
              textAlign: 'left',
              borderBottomWidth: 1,
              borderBottomColor: !taskText && touched ? pink : lightGrey1,
            }}
          />
          <DeadLine>
            <DialogsLabel>
              <GroupIcon />
              <DialogsLabelText>Срок исполнения</DialogsLabelText>
            </DialogsLabel>
            <DeadlineTime>
              <DatePicker
                date={deadlineDate}
                mode="date"
                confirmBtnText="Подтвердить"
                format="DD-MM-YYYY"
                cancelBtnText="Отменить"
                customStyles={{
                  dateIcon: {
                    width: 0,
                    height: 0,
                  },
                  dateInput: {
                    borderWidth: 0,
                    borderBottomWidth: 1,
                    borderBottomColor:
                      !deadlineDate && touched ? pink : lightGrey1,
                  },
                }}
                onDateChange={e => this.setState({ deadlineDate: e })}
              />
              <DatePicker
                date={deadlineTime}
                mode="time"
                confirmBtnText="Подтвердить"
                cancelBtnText="Отменить"
                customStyles={{
                  dateIcon: {
                    width: 0,
                    height: 0,
                  },
                  dateInput: {
                    borderWidth: 0,
                    borderBottomWidth: 1,
                    borderBottomColor:
                      !deadlineTime && touched ? pink : lightGrey1,
                  },
                }}
                onDateChange={e => this.setState({ deadlineTime: e })}
              />
            </DeadlineTime>
          </DeadLine>
          <Receivers>
            <DialogsLabel>
              <GroupIcon />
              <DialogsLabelText
                style={{
                  color: touched && !receivers.length ? pink : black,
                }}
              >
                Исполнитель
              </DialogsLabelText>
            </DialogsLabel>
            {receivers.length > 0 ? (
              receivers.map((e, i) => (
                <ReceiverComponent
                  key={i}
                  last={i === receivers.length}
                  onDelete={() => this.deleteReceiver(e)}
                >
                  {e}
                </ReceiverComponent>
              ))
            ) : (
              <DialogsLabel>
                <TouchableOpacity onPress={this.addParticipant}>
                  <AddReceiver>Добавить исполнителя</AddReceiver>
                </TouchableOpacity>
              </DialogsLabel>
            )}
          </Receivers>
          <ButtonBox>
            <Button onPress={this.proceed} background={purple} color="white">
              Сохранить
            </Button>
            <TouchableOpacity onPress={this.deleteTask}>
              <DeleteTask>Удалить задачу</DeleteTask>
            </TouchableOpacity>
          </ButtonBox>
        </StyledScrollView>
      </Wrapper>
    )
  }

  state = {
    taskName: '',
    taskText: '',
    deadlineDate: new Date(),
    deadlineTime: new Date(),
    touched: false,
  }

  componentDidMount() {
    const { activeTask } = this.props
    const { name, deadline, description } = activeTask

    this.setState({
      taskName: name,
      taskText: description,
      deadlineDate: moment(new Date(deadline)).format('DD-MM-YYYY'),
      deadlineTime: moment(new Date(deadline)).format('HH:mm'),
    })
    this.props.setTaskReceivers(activeTask.performers)
  }

  jsCoreDateCreator = dateString => {
    // dateString *HAS* to be in this format "YYYY-MM-DD HH:MM:SS"
    const dateParam = dateString.split(/[\s-:]/)
    dateParam[1] = (parseInt(dateParam[1], 10) - 1).toString()
    return new Date(...dateParam)
  }

  deleteReceiver = e => {
    const { _id } = e
    const { receivers, setTaskReceivers } = this.props
    const newReceivers = [...receivers].filter(e => e._id !== _id)
    setTaskReceivers(newReceivers)
  }

  addParticipant = () => {
    const { addParticipants } = this.props
    addParticipants()
  }

  deleteTask = () => {
    const { back, activeTask } = this.props
    const { _id } = activeTask

    sendRequest({
      r_path: '/tasks',
      method: 'delete',
      attr: {
        _id,
      },
      success: async () => {
        this.getProfile()
        back()
      },
      failFunc: err => {},
    })
  }

  proceed = async () => {
    const { activeTask, back, receivers } = this.props
    const { _id, status, performers, creator } = activeTask
    const { deadlineDate, deadlineTime, taskName, taskText } = this.state

    if (
      !taskName ||
      !taskText ||
      !deadlineDate ||
      !deadlineTime ||
      !receivers.length
    ) {
      this.setState({ touched: true })
    } else {
      const deadline = moment(
        `${deadlineDate} ${deadlineTime}`,
        'DD-MM-YYYY HH:mm',
      )

      const newTask = {
        _id,
        name: taskName,
        description: taskText,
        deadline,
        performers,
        status,
        creator,
      }

      sendRequest({
        r_path: p_tasks,
        method: 'patch',
        attr: {
          task: { ...newTask },
        },
        success: res => {
          this.getProfile()
          back()
          // getMessages(res.messages);
        },
        failFunc: err => {},
      })
    }
  }

  getProfile = () => {
    sendRequest({
      r_path: g_profile,
      method: 'get',
      success: res => {
        const userData = { ...res }
        const tasksInc = [...userData.user.tasks]
        const tasksOut = [...userData.user.created_tasks]
        const tasksWithUsers = [...tasksInc, ...tasksOut]
        this.props.setTaskList({ tasksInc, tasksOut, tasksWithUsers })
        this.props.setActiveTask({})
      },
      failFunc: () => {},
    })
  }

  handleCountry = e => {
    this.setState({ country: e })
  }

  handleTaskName = e => {
    this.setState({ taskName: e })
  }

  handleTaskText = e => {
    this.setState({ taskText: e })
  }

  handleDeadlineDate = e => {
    this.setState({ deadlineDate: e })
  }

  handleDeadlineTime = e => {
    this.setState({ deadlineTime: e })
  }
}
const mapStateToProps = state => ({
  user: state.userReducer.user,
  receivers: state.participantsReducer.tasks.receivers,
  tasks: state.tasksReducer.tasks,
  activeTask: state.tasksReducer.activeTask,
  currentTask: state.tasksReducer.currentTask,
  tasksInc: state.tasksReducer.tasksInc,
  tasksOut: state.tasksReducer.tasksOut,
  tasksWithUsers: state.tasksReducer.tasksWithUsers,
})
const mapDispatchToProps = dispatch => ({
  setUser: _ => dispatch(setUser(_)),
  setCurrentTask: _ => dispatch(setCurrentTask(_)),
  setActiveTask: _ => dispatch(setActiveTask(_)),
  setTasks: _ => dispatch(setTasks(_)),
  setTaskReceivers: _ => dispatch(setTaskReceivers(_)),
  setTaskList: _ => dispatch(setTaskList(_)),
})
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Content)
