import React, { Component } from 'react'
import { View, Text, Image, TouchableHighlight, Dimensions, StatusBar, ActionSheetIOS, Platform } from 'react-native'
import styled from 'styled-components'
import helper from '../../utils/helpers'
import { connect } from 'react-redux'
import { TasksIcon } from '../../assets/index'
import { setIncTasks, setOutTasks } from '../../actions/tasksActions'
const { fontSize, PressDelay, sidePadding, Colors } = helper;
const { purple, lightColor, lightGrey1, grey2 } = Colors;
const Wrapper = styled(View)`
	display: flex;
	flex-direction: row;
	align-self: center;
	align-items: center;
	padding: ${sidePadding}px 0;
	border: 0.3px solid ${lightGrey1};
	border-width: 0;
 	width: ${Dimensions.get('window').width - sidePadding * 2};
	border-top-width: 0.3px;
	border-bottom-width: ${({ last }) => last ? 0.3 : 0}px;
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
	padding-left: ${sidePadding}px;
`
const TaskTitle = styled(Text)`
	font-size: ${fontSize.header};
	flex: 1;  
	margin-bottom: 5px;
`
const LastMessageDate = styled(Text)`
	color: ${lightGrey1};
	font-size: ${fontSize.text};
	text-align: center;
	display: flex;
	justify-content: center;
	align-self: center;
	text-align: left;
	margin-bottom: 5px;
`
const TaskLastMessage = styled(Text)`
	font-size: ${fontSize.text};
	color: ${lightGrey1};
	margin-bottom: 5px;
	max-width: 90%;
`
const TaskDate = styled(View)`
	right: ${sidePadding}px;
	color: ${lightGrey1};
	font-size: ${fontSize.text};
	display: flex;
	justify-content: flex-start;
	align-items: flex-start;
	height: 50px;
`
const UnreadMessages = styled(View)`
	display: flex;
	justify-content: center;
	align-items: center;
	flex: 1;
`
const NewMessages = styled(Text)`
	color: white;
	font-size: ${fontSize.text};
	background: ${purple};
	overflow: hidden;
	padding: 5px;
	padding-top: ${Platform.OS === 'ios' ? 4 : 2}px;
	text-align: center;;
	min-width: 25px;
	height: 25px;
	border-radius: 12.5;
	display: flex;
	justify-content: center;
	align-items: flex-end;
	align-self: center;
`
const TaskStatusTextContainer = styled(View)`
	border: 1px solid ${lightGrey1};
	border-radius: 15px; 
	padding: 2px 8px;
	margin-right: 5px;
	display: flex;
	flex-direction: row;
`
const TaskStatus = styled(View)`
	display: flex;
	flex-direction: row;
	align-items: center;
`
const TaskStatusText = styled(Text)`
	color: ${lightGrey1};
`
const TaskStatusAdditional = styled(Text)`
	color: ${lightGrey1};
`
class TaskPack extends Component {
  render() {
    const { children, title, onClick, last, tasks, onPress, setIncTasks, setOutTasks } = this.props;
    const { taskPack } = this.state
    const user = { _id: 1 }
    const packItems = []
    let stat = ''
    title === 'inc' && console.log({ tasks: tasks.length })
    let day = ''
    const daysOfTheWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    let packItems0Tasks0 = null;
    const flatten = list => list.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), [])
    const itemCount = flatten([...tasks].map(e => e.tasks))

    if (itemCount.length) {
      tasks.map(taskUser => {
        if (taskUser.tasks.length) {
          taskUser.tasks.map(task => {
            if (task.creator._id === user._id && title === 'inc') {
              const packItemUser = { ...taskUser }
              packItemUser.tasks = packItemUser.tasks.filter(e => e.creator._id === user._id)
              packItems.push(packItemUser)
            }
            if (task.creator._id !== user._id && title === 'out') {
              const packItemUser = { ...taskUser }
              packItemUser.tasks = packItemUser.tasks.filter(e => e.creator._id !== user._id)
              packItems.push(packItemUser)
            }
          })
        }
      })
      switch (itemCount[itemCount.length - 1].status) {
        case 'set':
          this.stat = 'В работе';
          break;
        case 'accepted':
          this.stat = 'В работе';
          break;
        case 'done':
          this.stat = 'В работе';
          break;
        case 'completed':
          this.stat = 'В работе';
          break;
        case 'cancelled':
          this.stat = 'В работе';
          break;
      }
      day = new Date(itemCount[itemCount.length - 1].created_at).getDay()

      packItems0Tasks = packItems && packItems[0] && packItems[0].tasks && packItems[0].tasks ? packItems[0].tasks : null;
    }
    // title === 'inc' ? setInc Tasks(packItems) : setOutTasks(packItems)
    console.log('test', day)
    const packItemsDescription = packItems0Tasks && packItems0Tasks[0] ? packItems0Tasks[0].description : '';
    const packItemsLength = packItems0Tasks && packItems0Tasks.length ? packItems0Tasks.length - 1 : 0;
    return (
      <TouchableHighlight underlayColor='#2B7DE2' onPress={onPress} onLongPress={this.handleHold}>
        <Wrapper last={last}>
          <TaskText>
            <TaskTextInner>
              <TaskTitle>{title === 'inc' ? 'Все входящие задачи' : 'Все исходящие задачи'}</TaskTitle>
              {itemCount.length ? <TaskLastMessage numberOfLines={1}>{itemCount[itemCount.length - 1].description}</TaskLastMessage> : null}
              <TaskStatus>
                <TaskStatusTextContainer>
                  <TasksIcon noPaddingAll />
                  <TaskStatusText>{this.stat}</TaskStatusText>
                </TaskStatusTextContainer>
                <TaskStatusAdditional>{itemCount.length ? `+${itemCount.length - 1}` : itemCount.length} задач</TaskStatusAdditional>
              </TaskStatus>
            </TaskTextInner>
            <TaskDate>
              <LastMessageDate>{daysOfTheWeek[day]}</LastMessageDate>
              {itemCount.length ? <UnreadMessages onLayout={(e) => this.getUnreadMessageHeight(e)}>
                <NewMessages onLayout={(e) => this.getUnreadMessageWidth(e)}>{itemCount.length}</NewMessages>
              </UnreadMessages> : null}
            </TaskDate>
          </TaskText>

        </Wrapper >
      </TouchableHighlight >
    );
  }
  state = {
    size: null,
    taskPack: []
  }
  handleHold = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Cancel', 'Remove'],
        destructiveButtonIndex: 1,
        cancelButtonIndex: 0,
      },
      (buttonIndex) => {
        if (buttonIndex === 1) {
          /* destructive action */
        }
      },
    );
  }
  handleClick = () => {
  }
  getUnreadMessageHeight = (e) => {
    this.setState({ height: e.nativeEvent.layout.height })
  }
  getUnreadMessageWidth = (e) => {
    this.setState({ width: e.nativeEvent.layout.width })
  }
}
const mapStateToProps = state => ({
  user: state.userReducer.user
});
const mapDispatchToProps = dispatch => ({
  setIncTasks: _ => dispatch(setIncTasks(_)),
  setOutTasks: _ => dispatch(setOutTasks(_)),
})
export default connect(mapStateToProps, mapDispatchToProps)(TaskPack)
