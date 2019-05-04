import React, { Component } from 'react'
import { View, Text, Image, TouchableHighlight, Dimensions, StatusBar, ActionSheetIOS } from 'react-native'
import styled from 'styled-components'
import helper from '../../utils/helpers'
import { TasksIcon } from '../../assets/index'
import { setTasks } from '../../actions/tasksActions'
import { connect } from 'react-redux'
const { fontSize, PressDelay, sidePadding, sidePaddingNumber, Colors } = helper;
const { purple, lightColor, grey2 } = Colors;

const Wrapper = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: ${sidePadding} 0;
`
const TaskImage = styled(Image)`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  margin-right: ${sidePadding};
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
  margin-bottom: 1px;
`
const LastMessageDate = styled(Text)`
  color: ${lightColor};
  font-size: ${fontSize.text};
  text-align: left;
  margin-bottom: 5px;
`
const TaskLastMessage = styled(Text)`
  margin-bottom: 2px;
  font-size: ${fontSize.text};
  color: ${lightColor};
  padding-right: 20px;

`
const TaskDate = styled(View)`
  right: ${sidePadding};
  color: ${lightColor};
  /* flex: 1; */
  font-size: ${fontSize.text};
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
`
const UnreadMessages = styled(View)`
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${purple};
  min-width: 25px;
  width: 25px;
  height: 25px;
  border-radius: 12.5;
`
const NewMessages = styled(Text)`
  color: white;
  font-size: ${fontSize.text};
  text-align: center;
`

const TaskStatus = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 1px;
`
const TaskStatusTextContainer = styled(View)`
  border: 1px solid ${lightColor};
  border-radius: 15px;
  padding: 2px 8px;
  margin-right: 5px;
  display: flex;
  flex-direction: row;
`
const TaskStatusText = styled(Text)`
  color: ${lightColor};
`
const TaskStatusAdditional = styled(Text)`
  color: ${lightColor};
`
class Tasks extends Component {
  render() {
    const { children, onClick } = this.props;
    const {first_name, last_name, phone_number, image, tasks } = children
    let stat = ''
    switch(tasks[0].status){
      case 'set':
        stat = 'В работе';
        break;
      case 'done':
        stat = 'Выполнена';
        break;
    }
    const day = new Date(tasks[0].created_at).getDay()
    const daysOfTheWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <TouchableHighlight underlayColor='#2B7DE2' onPress={() => this.handleClick(children)} onLongPress={this.handleHold}>
        <Wrapper>
          <TaskImage source={{ uri: image || 'https://facebook.github.io/react/logo-og.png' }} />
          <TaskText>
            <TaskTextInner>
              <TaskTitle>{first_name ? `${first_name} ${last_name}` : phone_number}</TaskTitle>
              <TaskLastMessage numberOfLines={1} >{tasks[0].description}</TaskLastMessage>
              <TaskStatus>
                <TaskStatusTextContainer>
                  <TasksIcon />
                  <TaskStatusText>{stat}</TaskStatusText>
                </TaskStatusTextContainer>
                <TaskStatusAdditional>+{tasks.length - 1} задачи</TaskStatusAdditional>
              </TaskStatus>
            </TaskTextInner>
            <TaskDate >
              <LastMessageDate>{daysOfTheWeek[day]}</LastMessageDate>
              <UnreadMessages onLayout={(e) => this.getUnreadMessageHeight(e)}>
                <NewMessages onLayout={(e) => this.getUnreadMessageWidth(e)}>{tasks.length - 1}</NewMessages>
              </UnreadMessages>
            </TaskDate>
          </TaskText>
        </Wrapper >
      </TouchableHighlight >
    );
  }
  state = {
    size: null
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
        }
      },
    );
  }
  handleClick = (tasks) => {
    const { setTasks, onPress } = this.props
    setTasks(tasks)
    onPress()
  }
  getUnreadMessageHeight = (e) => {
    this.setState({ height: e.nativeEvent.layout.height })
  }
  getUnreadMessageWidth = (e) => {
    this.setState({ width: e.nativeEvent.layout.width })
  }
}

const mapStateToProps = state => {
  return {
  };
};
const mapDispatchToProps = dispatch => ({
  setTasks: _ => dispatch(setTasks(_)),
})
export default connect(mapStateToProps, mapDispatchToProps)(Tasks)