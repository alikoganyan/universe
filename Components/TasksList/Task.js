import React, { Component } from 'react'
import { View, Text, Image, TouchableHighlight, Dimensions, StatusBar, ActionSheetIOS } from 'react-native'
import styled from 'styled-components'
import helper from '../../Helper/helper'
import { TasksIcon } from '../../assets/index'

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
  width: 100%;
`

const TaskTextInner = styled(View)`
  display: flex;
  flex-direction: column;
  width: ${Dimensions.get('window').width - 120}px;

`
const TaskTitle = styled(Text)`
  font-size: ${fontSize.header};
  font-weight: 500;
  width: ${Dimensions.get('window').width - 20}px;
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
  flex: 1;
  font-size: ${fontSize.text};
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
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
export default class Content extends Component {
  render() {
    const { children, title, onClick } = this.props;
    const { height, width } = this.state;
    return (
      <TouchableHighlight underlayColor='#2B7DE2' onPress={this.handleClick} onLongPress={this.handleHold}>
        <Wrapper>
          <TaskImage source={{ uri: 'https://facebook.github.io/react/logo-og.png' }} />
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
            <TaskDate >
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
    onClick()
  }
  getUnreadMessageHeight = (e) => {
    this.setState({ height: e.nativeEvent.layout.height })
  }
  getUnreadMessageWidth = (e) => {
    this.setState({ width: e.nativeEvent.layout.width })
  }
}
