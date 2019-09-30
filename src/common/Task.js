import React, { Component } from 'react'
import { Text, View, TouchableOpacity, Dimensions } from 'react-native'
import styled from 'styled-components'
import {
  CloseTaskIcon,
  TriangleLeftIcon,
  TriangleRightIcon,
  RedoIcon,
  DoneIcon,
  StartIcon,
  EditIcon,
} from '../assets'
import { connect } from 'react-redux'
import moment from 'moment'
import {
  setTasks,
  setActiveTask,
  setTaskList,
  setTask,
} from '../actions/tasksActions'
import sendRequest from '../utils/request'
import { p_tasks } from '../constants/api'
import ImageComponent from './Image'
import DefaultAvatar from './DefaultAvatar'
import helper, { getHamsterDate } from '../utils/helpers'

const { Colors, fontSize, borderRadius } = helper
const { red, yellow, green, purple, grey1 } = Colors
const Wrapper = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
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
  max-width: ${Dimensions.get('window').width - 110}px;
`
const Status = styled(View)`
  display: flex;
  flex-direction: column;
`
const StatusItem = styled(View)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  width: 14%;
  height: 3px;
  border-radius: 2;
  background: ${({ completed, color }) => (completed ? color : '#D9D9D9')};
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
  margin-top: 20px;
  margin-bottom: 10px;
  ${({ style }) => style}
`
const TaskBody = styled(View)`
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`
const TaskBodyText = styled(Text)`
  color: ${grey1};
`
const TaskDeadline = styled(View)`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 0;
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
`
const TaskFooter = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  flex: 1;
  margin-top: 5px;
`
const TaskPostTimeText = styled(MessageDate)`
  font-size: ${fontSize.sm};
`
const ControlBar = styled(View)`
  display: flex;
  padding: 10px 0;
  flex: 1;
  justify-content: flex-end;
`
const OuterWrapper = styled(View)`
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
`
const ExitPlaceholder = styled(View)`
  height: 40px;
  width: 40px;
  border-radius: 20;
  margin-top: 10px;
`
const Exit = styled(TouchableOpacity)`
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
const Accept = styled(Exit)`
  border-color: ${purple};
`
const Rearrange = styled(Exit)`
  border-color: ${yellow};
`
const Edit = styled(Exit)`
  border-color: ${green};
  display: flex;
  justify-content: center;
`
const ReceiverInfo = styled(View)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  margin-left: 10px;
`
const statuses_index = {
  in_work: 3,
  set: 0,
  canceled: 2,
  accepted: 1,
  completed: 4,
  done: 5,
}
class TaskComponent extends Component {
  render() {
    const {
      children,
      style,
      triangleLeft,
      triangleRight,
      borderColor,
      activeTask,
      withImage,
      withReceiver,
    } = this.props
    const {
      name,
      description,
      status,
      deadline,
      created_at,
      creator,
      _id,
      performers,
    } = children
    const performer = performers[0]

    const { first_name, last_name, phone_number, post, image } = withImage
      ? creator
      : performer
    const statuses = [
      'ЗАДАЧА ПОСТАВЛЕНА',
      'ПРИНЯЛ В РАБОТУ',
      'ОТКЛОНЕНА',
      'В РАБОТЕ',
      'ВЫПОЛНЕНА',
      'СДАНА',
    ]
    const colors = [red, red, red, yellow, green, purple]
    this.stat = statuses_index[status]

    const deadlineDate = new Date(deadline)
    const creationDate = getHamsterDate(created_at)
    const rightControl = activeTask._id === _id
    const leftControl = activeTask._id === _id
    return (
      <OuterWrapper
        style={{
          justifyContent: triangleRight ? 'flex-end' : 'flex-start',
          left: withImage ? -10 : 0,
        }}
      >
        {triangleRight && (
          <ControlBar style={{ alignItems: 'flex-end' }}>
            {rightControl ? (
              <>
                <Exit onPress={() => this.reject(status)}>
                  <CloseTaskIcon />
                </Exit>
                <Edit onPress={this.editFeed}>
                  <EditIcon nonClickable noPaddingAll marginRight={false} />
                </Edit>
                {this.stat === 2 && (
                  <Accept onPress={undefined}>
                    <RedoIcon />
                  </Accept>
                )}
                {this.stat === 4 && (
                  <Accept onPress={leftControl && this.done}>
                    <DoneIcon />
                  </Accept>
                )}
                {this.stat === 0 && (
                  <Rearrange onPress={rightControl && this.complete}>
                    <StartIcon />
                  </Rearrange>
                )}
              </>
            ) : (
              <ExitPlaceholder />
            )}
          </ControlBar>
        )}
        <Wrapper
          style={{ alignSelf: triangleRight ? 'flex-end' : 'flex-start' }}
        >
          {withImage && (
            <View
              style={{
                alignSelf: 'flex-end',
                top: -10,
                left: 15,
              }}
            >
              {!creator.image ||
              creator.image === '/images/default_group.png' ||
              creator.image === '/images/default_avatar.jpg' ? (
                <DefaultAvatar id={_id} size="header" />
              ) : (
                <ImageComponent
                  size="header"
                  source={{ uri: `https://ser.univ.team${creator.image}` }}
                />
              )}
            </View>
          )}
          {triangleLeft && (
            <TriangleRightIcon
              style={{
                position: 'relative',
                left: 11,
                top: -10,
                zIndex: 99,
              }}
              hollow
              color={borderColor}
            />
          )}
          <Task
            style={{
              ...style,
              borderBottomLeftRadius: triangleLeft ? 0 : borderRadius,
              borderBottomRightRadius: triangleRight ? 0 : borderRadius,
            }}
            borderColor={borderColor}
          >
            <Status>
              <StatusText>{statuses[this.stat]}</StatusText>
              <StatusStage>
                {statuses.map((e, i) => (
                  <StatusItem
                    key={`statusState_${i}`}
                    completed={i <= this.stat}
                    color={colors[i]}
                  />
                ))}
              </StatusStage>
            </Status>
            <TaskTitle>
              <Text>{name}</Text>
            </TaskTitle>
            <TaskBody>
              <TaskBodyText>{description}</TaskBodyText>
            </TaskBody>
            {withReceiver ? (
              <TaskBody>
                {!image ||
                image === '/images/default_group.png' ||
                image === '/images/default_avatar.jpg' ? (
                  <DefaultAvatar id={performer._id} size="header" />
                ) : (
                  <ImageComponent
                    size="header"
                    source={{ uri: `https://ser.univ.team${image}` }}
                  />
                )}
                <ReceiverInfo>
                  <Text>
                    {first_name ? `${first_name} ${last_name}` : phone_number}
                  </Text>
                  {post ? <Text>{post}</Text> : null}
                </ReceiverInfo>
              </TaskBody>
            ) : null}
            {withImage ? (
              <TaskDeadlineLabel numberOfLines={1}>
                Поставил:{' '}
                <TaskDeadlineValue>
                  {first_name ? `${first_name} ${last_name}` : phone_number}
                </TaskDeadlineValue>
              </TaskDeadlineLabel>
            ) : null}
            <TaskFooter>
              <TaskDeadline>
                <TaskDeadlineLabel numberOfLines={1}>
                  Срок:{' '}
                  <TaskDeadlineValue>
                    {moment(deadlineDate).format()}
                  </TaskDeadlineValue>
                </TaskDeadlineLabel>
              </TaskDeadline>
              <TaskPostTime>
                <TaskPostTimeText>{creationDate}</TaskPostTimeText>
                {/* {triangleRight && <Indicator />} */}
              </TaskPostTime>
            </TaskFooter>
          </Task>
          {triangleRight && (
            <TriangleLeftIcon
              style={{
                position: 'relative',
                left: -11,
                top: -10,
                zIndex: 99,
              }}
              hollow
              color={borderColor}
            />
          )}
        </Wrapper>
        {triangleLeft && (
          <ControlBar>
            {leftControl ? (
              <>
                <Exit onPress={() => this.reject(status)}>
                  <CloseTaskIcon />
                </Exit>
                {this.stat === 1 && (
                  <Accept onPress={leftControl && this.toWork}>
                    <DoneIcon />
                  </Accept>
                )}
                {this.stat === 3 && (
                  <Accept onPress={leftControl && this.complete}>
                    <DoneIcon />
                  </Accept>
                )}
                {this.stat === 0 && (
                  <Rearrange onPress={leftControl && this.accept}>
                    <StartIcon />
                  </Rearrange>
                )}
              </>
            ) : (
              <ExitPlaceholder />
            )}
          </ControlBar>
        )}
      </OuterWrapper>
    )
  }

  editFeed = () => {
    const { editFeed } = this.props
    editFeed()
  }

  toWork = () => {
    this.changeState('in_work')
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

  completed = () => {
    this.changeState('completed')
  }

  changeState = e => {
    const {
      activeTask,
      tasksInc,
      tasksOut,
      inc,
      tasksWithUsers,
      userTask,
      currentTask,
    } = this.props
    const { _id, name, description, deadline, performers } = activeTask

    if (inc) {
      const list = [...tasksInc]
      const taskId = list.findIndex(item => item._id === _id)
      list[taskId].status = e

      this.props.setTaskList({ tasksInc: list, tasksOut, tasksWithUsers })
    } else if (userTask) {
      const list = { ...currentTask }
      const taskId = list.tasks.findIndex(item => item._id === _id)
      list.tasks[taskId].status = e

      this.props.setTask(list)
    } else {
      const list = [...tasksOut]
      const taskId = list.findIndex(item => item._id === _id)
      list[taskId].status = e

      this.props.setTaskList({ tasksInc, tasksOut: list, tasksWithUsers })
    }
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
        },
      },
      success: res => {
        // console.log(res)
      },
      failFunc: err => {
        // console.log(err)
      },
    })
  }

  unselect = () => {
    const { setActiveTask } = this.props
    setActiveTask({})
    // this.changeState('set')
    // console.log('unselect')
  }

  componentDidMount() {}

  componentWillUnmount() {
    this.unselect()
  }

  reject = status => {
    if (status === 'set') {
      this.changeState('canceled')
    }
    this.unselect()
  }
}

const mapStateToProps = state => ({
  tasks: state.tasksReducer.tasks,
  activeTask: state.tasksReducer.activeTask,
  currentTask: state.tasksReducer.currentTask,
  user: state.userReducer.user,
  tasksInc: state.tasksReducer.tasksInc,
  tasksOut: state.tasksReducer.tasksOut,
  tasksWithUsers: state.tasksReducer.tasksWithUsers,
})
const mapDispatchToProps = dispatch => ({
  setTasks: _ => dispatch(setTasks(_)),
  setActiveTask: _ => dispatch(setActiveTask(_)),
  setTaskList: _ => dispatch(setTaskList(_)),
  setTask: _ => dispatch(setTask(_)),
})
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TaskComponent)
