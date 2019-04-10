import React, { Component } from 'react'
import { View, Text, Image, TouchableHighlight, Dimensions, StatusBar, ActionSheetIOS } from 'react-native'
import styled from 'styled-components'
import helper from '../../utils/helper'
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
  max-width: 90%;
`
const TaskTitle = styled(Text)`
  font-size: ${fontSize.header};
  font-weight: 500;
  max-width: 90%;  
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
  justify-content: flex-start;
  align-items: flex-end;
  flex: 1;
`
const NewMessages = styled(Text)`
  color: white;
  font-size: ${fontSize.text};
  background: ${purple};
  padding: 5px;
  overflow: hidden;
  text-align: center;;
  min-width: 25px;
  height: 25px;
  border-radius: 12.5;
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
    const { children, title, onClick, last } = this.props;
    return (
      <TouchableHighlight underlayColor='#2B7DE2' onPress={this.handleClick} onLongPress={this.handleHold}>
        <Wrapper last={last}>
          <TaskText>
            <TaskTextInner>
              <TaskTitle>{title}</TaskTitle>
              <TaskLastMessage numberOfLines={1} >{children}Labore quis nulla velit sit occaecat deserunt cillum occaecat dolor et elit duis. Dolore laboris nostrud esse ullamco irure cupidatat mollit nisi nostrud in irure aliquip adipisicing proident. Eu aliquip consectetur velit quis pariatur velit sint esse incididunt laborum aute aliqua. Laboris laboris aliqua magna laborum reprehenderit nostrud aliquip consectetur proident aliquip commodo elit officia.</TaskLastMessage>
              <TaskStatus>
                <TaskStatusTextContainer>
                  <TasksIcon/>
                  <TaskStatusText>в работе</TaskStatusText>
                </TaskStatusTextContainer>
                <TaskStatusAdditional>+4 задачи</TaskStatusAdditional>
              </TaskStatus>
            </TaskTextInner>
            <TaskDate>
              <LastMessageDate>Thu</LastMessageDate>
              <UnreadMessages onLayout={(e) => this.getUnreadMessageHeight(e)}>
                <NewMessages onLayout={(e) => this.getUnreadMessageWidth(e)}>2</NewMessages>
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
