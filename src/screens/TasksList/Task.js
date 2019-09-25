import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native'
import styled from 'styled-components'
import { connect } from 'react-redux'
import ActionSheet from 'react-native-action-sheet'
import helper from '../../utils/helpers'
import { TasksIcon } from '../../assets/index'
import { setTask } from '../../actions/tasksActions'
import ImageComponent from '../../common/Image'
import DefaultAvatar from '../../common/DefaultAvatar'

const { fontSize, sidePadding, Colors } = helper
const { purple, lightGrey1 } = Colors

const Wrapper = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  display: flex;
  align-items: center;
  padding: ${sidePadding}px 0 ${sidePadding * 2}px;
  width: ${Dimensions.get('window').width - sidePadding * 2};
`
const TaskText = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex: 1;
`

const TaskTextInner = styled(View)`
  display: flex;
  flex-direction: column;
`
const TaskTitle = styled(Text)`
  font-size: ${fontSize.taskTitle};
  margin-bottom: 1px;
`
const LastMessageDate = styled(Text)`
  color: ${lightGrey1};
  font-size: ${fontSize.text};
  text-align: left;
  margin-bottom: 5px;
`
const TaskLastMessage = styled(Text)`
  margin-bottom: 2px;
  font-size: ${fontSize.text};
  color: ${lightGrey1};
  max-width: 90%;
`
const TaskDate = styled(View)`
  right: ${sidePadding}px;
  color: ${lightGrey1};
  font-size: ${fontSize.text};
  display: flex;
  justify-content: flex-start;
  align-items: center;
`
const UnreadMessages = styled(View)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 2px;
  background: ${purple};
  width: 25px;
  height: 25px;
  border-radius: 12.5;
`
const NewMessages = styled(Text)`
  color: white;
  font-size: ${fontSize.text};
  text-align: center;
  padding-top: ${Platform.OS === 'ios' ? 2 : 0}px;
`

const TaskStatus = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 1px;
`
const TaskStatusTextContainer = styled(View)`
  border: 1px solid ${lightGrey1};
  border-radius: 15px;
  padding: 2px 8px;
  margin-right: 5px;
  display: flex;
  flex-direction: row;
`
const TaskStatusText = styled(Text)`
  color: ${lightGrey1};
`
const TaskStatusAdditional = styled(Text)`
  color: ${lightGrey1};
`
class Tasks extends Component {
  render() {
    const { children } = this.props
    const { first_name, last_name, phone_number, image, tasks } = children
    let stat = ''
    let day = ''
    const daysOfTheWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

    if (tasks.length) {
      switch (tasks[tasks.length - 1].status) {
        case 'set':
          stat = 'В работе'
          break
        case 'done':
          stat = 'Выполнена'
          break
        default:
          stat = ''
          break
      }
    }
    return tasks.length ? (
      <TouchableOpacity
        onPress={() => this.handleClick(children)}
        onLongPress={this.handleHold}
        style={{
          width: '100%',
          paddingLeft: sidePadding,
          paddingRight: sidePadding,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Wrapper>
          {image ? (
            <ImageComponent
              size={50}
              source={{ uri: `https://ser.univ.team${image}` }}
              style={{ marginRight: sidePadding }}
            />
          ) : (
            <DefaultAvatar size={50} style={{ marginRight: sidePadding }} />
          )}
          <TaskText>
            <TaskTextInner>
              <TaskTitle>
                {first_name ? `${first_name} ${last_name}` : phone_number}
              </TaskTitle>
              <TaskLastMessage numberOfLines={1}>
                {tasks[tasks.length - 1].name}
              </TaskLastMessage>
              <TaskStatus>
                <TaskStatusTextContainer>
                  <TasksIcon noPaddingAll />
                  <TaskStatusText>{stat}</TaskStatusText>
                </TaskStatusTextContainer>
                {tasks.length - 1 > 0 && (
                  <TaskStatusAdditional>
                    +{tasks.length - 1} задачи
                  </TaskStatusAdditional>
                )}
              </TaskStatus>
            </TaskTextInner>
            <TaskDate>
              <LastMessageDate>{daysOfTheWeek[day]}</LastMessageDate>
              {tasks.length > 0 && (
                <UnreadMessages>
                  <NewMessages>{tasks.length}</NewMessages>
                </UnreadMessages>
              )}
            </TaskDate>
          </TaskText>
        </Wrapper>
      </TouchableOpacity>
    ) : (
      <View />
    )
  }

  state = {}

  componentWillUnmount() {
    const { setTask } = this.props
    setTask({})
  }

  handleHold = () => {
    ActionSheet.showActionSheetWithOptions(
      {
        options: ['Cancel', 'Remove'],
        cancelButtonIndex: 1,
        destructiveButtonIndex: 0,
        tintColor: 'blue',
      },
      buttonIndex => {
        // console.log('button clicked :', buttonIndex)
      },
    )
  }

  handleClick = tasks => {
    const { setTask, onPress } = this.props
    setTask(tasks)
    onPress()
  }
}

const mapStateToProps = state => ({})
const mapDispatchToProps = dispatch => ({
  setTask: _ => dispatch(setTask(_)),
})
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Tasks)
