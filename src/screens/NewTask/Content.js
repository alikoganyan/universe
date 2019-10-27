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
import { p_create_task } from '../../constants/api'
import sendRequest from '../../utils/request'
import { setTasks, setTaskList } from '../../actions/tasksActions'
import { GroupIcon, CloseIcon } from '../../assets'

const { Colors, HeaderHeight, sidePadding } = helper
const { lightGrey1, purple } = Colors
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
  border: 1px solid ${lightGrey1};
  border-width: 0;
  border-bottom-width: 1px;
  padding-bottom: 10px;
  text-align: center;
  margin-bottom: 50px;
  min-height: 40px;
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
const ReceiverComponent = props => {
  const { children, last = false, onDelete } = props
  const { image, phone_number, role, first_name, last_name } = children
  return (
    <Receiver last={last}>
      <View
        style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
      >
        {image === '/images/default_avatar.jpg' ? (
          <DefaultAvatar />
        ) : (
          <ImageComponent
            source={{ uri: `https://ser.univ.team${image}` }}
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
    const { taskName, taskText, deadlineDate, deadlineTime } = this.state
    // const months = [
    //   'Jan',
    //   'Feb',
    //   'Mar',
    //   'Apr',
    //   'May',
    //   'June',
    //   'July',
    //   'Aug',
    //   'Sept',
    //   'Oct',
    //   'Nov',
    //   'Dec',
    // ]
    // const date = new Date()
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
            style={{ marginBottom: 30, textAlign: 'left' }}
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
              padding: 0,
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
                minDate={new Date()}
                cancelBtnText="Отменить"
                customStyles={{
                  dateIcon: {
                    width: 0,
                    height: 0,
                  },
                  dateInput: {
                    borderWidth: 0,
                    borderBottomWidth: 1,
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
                  },
                }}
                onDateChange={e => this.setState({ deadlineTime: e })}
              />
            </DeadlineTime>
          </DeadLine>
          <Receivers>
            <DialogsLabel>
              <GroupIcon />
              <DialogsLabelText>Исполнитель</DialogsLabelText>
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
            <Button
              disabled={
                !taskName ||
                !taskText ||
                !deadlineDate ||
                !deadlineTime ||
                !receivers.length
              }
              onPress={this.proceed}
              background={purple}
              color="white"
            >
              Создать задачу
            </Button>
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
  }

  componentDidMount() {
    const { deafultValues } = this.props
    const { text } = deafultValues
    this.setState({ taskText: text })
    // setTaskReceivers(participants)
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

  proceed = e => {
    const {
      receivers,
      forward,
      tasksOut,
      tasksInc,
      tasksWithUsers,
    } = this.props
    const { deadlineDate, deadlineTime, taskName, taskText } = this.state
    const deadline = this.jsCoreDateCreator(`${deadlineDate}:${deadlineTime}`)

    const taskList = [...tasksOut]
    taskList.push({
      name: taskName,
      description: taskText,
      deadline,
      performers: [receivers[0]._id],
    })
    this.props.setTaskList({
      tasksInc,
      tasksWithUsers,
      tasksOut: taskList,
    })
    sendRequest({
      r_path: p_create_task,
      method: 'post',
      attr: {
        task: {
          name: taskName,
          description: taskText,
          deadline,
          performers: [receivers[0]._id],
        },
      },
      success: res => {
        // console.log(res)
        forward()
      },
      failFunc: err => {
        // console.log(err)
      },
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
  tasksOut: state.tasksReducer.tasksOut,
  tasksInc: state.tasksReducer.tasksInc,
  tasksWithUsers: state.tasksReducer.tasksWithUsers,
})
const mapDispatchToProps = dispatch => ({
  setUser: _ => dispatch(setUser(_)),
  setTasks: _ => dispatch(setTasks(_)),
  setTaskReceivers: _ => dispatch(setTaskReceivers(_)),
  setTaskList: _ => dispatch(setTaskList(_)),
})
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Content)
