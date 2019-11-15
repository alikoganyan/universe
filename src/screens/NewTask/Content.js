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
import moment from 'moment'

const { Colors, HeaderHeight, sidePadding } = helper
const { lightGrey1, purple, pink, black } = Colors
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
            onChangeText={this.handleTaskText}
            value={taskText}
            placeholder="Текст задачи"
            multiline
            style={{
              marginBottom: 30,
              textAlign: 'left',
              padding: 0,
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
    deadlineDate: moment(new Date()).format('DD-MM-YYYY'),
    deadlineTime: moment(new Date()).format('HH:mm'),
    touched: false,
  }

  componentDidMount() {
    const { deafultValues } = this.props
    const { text } = deafultValues
    this.setState({ taskText: text })
    // setTaskReceivers(participants)
  }

  componentWillUnmount() {
    this.props.setTaskReceivers([])
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

  proceed = async e => {
    const { receivers } = this.props
    const { taskName, taskText, deadlineDate, deadlineTime } = this.state
    const deadline = moment(
      `${deadlineDate} ${deadlineTime}`,
      'DD-MM-YYYY HH:mm',
    )
      .utc()
      .format()

    if (
      !taskName ||
      !taskText ||
      !deadlineDate ||
      !deadlineTime ||
      !receivers.length
    ) {
      this.setState({ touched: true })
    } else {
      const { receivers, forward } = this.props

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
        success: async res => {
          this.getProfile()
          forward()
        },
        failFunc: err => {},
      })
    }
  }

  getProfile = () => {
    sendRequest({
      r_path: '/profile',
      method: 'get',
      success: res => {
        const userData = { ...res }
        const tasksInc = [...userData.user.tasks]
        const tasksOut = [...userData.user.created_tasks]
        const tasksWithUsers = [...tasksInc, ...tasksOut]
        this.props.setTaskList({ tasksInc, tasksOut, tasksWithUsers })
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
