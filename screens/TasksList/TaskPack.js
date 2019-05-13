import React, { Component } from 'react'
import { View, Text, Image, TouchableHighlight, Dimensions, StatusBar, ActionSheetIOS } from 'react-native'
import styled from 'styled-components'
import helper from '../../utils/helpers'
import { TasksIcon } from '../../assets/index'
const { fontSize, PressDelay, sidePadding, Colors, sidePaddingNumber } = helper;
const { purple, lightColor } = Colors;
const Wrapper = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: ${sidePaddingNumber}px 0;
  border: 1px solid ${lightColor};
  border-width: 0;
  border-top-width: 1px;
  border-bottom-width: ${({ last }) => last ? 1 : 0}px;
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
  font-size: ${fontSize.header};
  font-weight: 500;
  flex: 1;  
  margin-bottom: 5px;
`
const LastMessageDate = styled(Text)`
  color: ${lightColor};
  font-size: ${fontSize.text};
  text-align: center;
  display: flex;
  justify-content: center;
  align-self: center;
  margin-bottom: 5px;
`
const TaskLastMessage = styled(Text)`
  font-size: ${fontSize.text};
  color: ${lightColor};
  padding-right: 20px;
  margin-bottom: 5px;

`
const TaskDate = styled(View)`
  right: ${sidePadding};
  color: ${lightColor};
  font-size: ${fontSize.text};
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 10%;
  
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
  padding-top: 2px;
  text-align: center;;
  min-width: 25px;
  height: 25px;
  border-radius: 12.5;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  align-self: center;
`
const TaskStatusTextContainer = styled(View)`
  border: 1px solid ${lightColor};
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
  color: ${lightColor};
`
const TaskStatusAdditional = styled(Text)`
  color: ${lightColor};
`
export default class TaskPack extends Component {
  render() {
    const { children, title, onClick, last, tasks } = this.props;
    const { taskPack } = this.state
    const user = {_id: 1}
    const packItems = []
    let stat = ''
    let day = ''
    const daysOfTheWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let packItems0Tasks0 = null;
    if(tasks.length){
      tasks.map(taskUser => {
        if(taskUser.tasks.length){
          taskUser.tasks.map(task => {
            if(task.creator === user._id){
              const packItemUser = {...taskUser}
              packItemUser.tasks = packItemUser.tasks.filter(e => e.creator === user._id)
              packItems.push(packItemUser)
            }
          })
        }
      })
      packItems0Tasks = packItems && packItems[0] && packItems[0].tasks && packItems[0].tasks ? packItems[0].tasks : null;
      if (packItems0Tasks) {
        day = packItems0Tasks[0] && packItems0Tasks[0].created_at ? new Date(packItems[0].tasks[0].created_at).getDay() : '';
        if (packItems0Tasks[0] && packItems0Tasks[0].status) {
          switch (packItems0Tasks[0].status){
            case 'set':
            stat = 'В работе';
            break;
            case 'done':
            stat = 'Выполнена';
            break;
          }
        }
      }
    }
    const packItemsDescription = packItems0Tasks && packItems0Tasks[0] ? packItems0Tasks[0].description : '';
    const packItemsLength = packItems0Tasks && packItems0Tasks.length ? packItems0Tasks.length - 1 : 0;
    return (
      <TouchableHighlight underlayColor='#2B7DE2' onPress={this.handleClick} onLongPress={this.handleHold}>
        <Wrapper last={last}>
          <TaskText>
            <TaskTextInner>
              <TaskTitle>{title}</TaskTitle>
              <TaskLastMessage numberOfLines={1}>{packItemsDescription}</TaskLastMessage>
              <TaskStatus>
                <TaskStatusTextContainer>
                  <TasksIcon/>
                  <TaskStatusText>{stat}</TaskStatusText>
                </TaskStatusTextContainer>
                <TaskStatusAdditional>+{packItemsLength} задач</TaskStatusAdditional>
              </TaskStatus>
            </TaskTextInner>
            <TaskDate>
              <LastMessageDate>{daysOfTheWeek[day]}</LastMessageDate>
              <UnreadMessages onLayout={(e) => this.getUnreadMessageHeight(e)}>
                <NewMessages onLayout={(e) => this.getUnreadMessageWidth(e)}>{packItems && packItems.length}</NewMessages>
              </UnreadMessages>
            </TaskDate>
          </TaskText>

        </Wrapper >
      </TouchableHighlight >
    ) ;
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
