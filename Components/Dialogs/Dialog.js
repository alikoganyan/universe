import React, { Component } from 'react'
import { View, Text, Image, TouchableHighlight, Dimensions, StatusBar, ActionSheetIOS } from 'react-native'
import styled from 'styled-components'
import helper from '../../Helper/helper'
const { fontSize, PressDelay, sidePadding, Colors } = helper;
const { purple, lightColor } = Colors;
const Wrapper = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 20px;
  padding: 0 ${sidePadding} ${sidePadding};
`
const DialogImage = styled(Image)`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  margin-right: ${sidePadding};
`
const DialogText = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`

const DialogTextInner = styled(View)`
  display: flex;
  flex-direction: column;
  width: ${Dimensions.get('window').width - 100}px;

`
const DialogTitle = styled(Text)`
  font-size: ${fontSize.header};
  font-weight: 500;
  flex: 1;
  width: ${Dimensions.get('window').width - 20}px;
`
const LastMessageDate = styled(Text)`
  color: ${lightColor};
  font-size: ${fontSize.text};
  text-align: left;
`
const DialogLastMessage = styled(Text)`
  flex: 1;
  font-size: ${fontSize.text};
  color: ${lightColor};
  padding-right: 20px;
`
const DialogDate = styled(View)`
  right: ${sidePadding};
  color: ${lightColor};
  flex: 1;
  font-size: ${fontSize.text};
  display: flex;
  justify-content: center;
  
`
const UnreadMessages = styled(View)`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
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
export default class Content extends Component {
  render() {
    const { children, title, onClick } = this.props;
    const { height, width } = this.state;
    return (
      <TouchableHighlight underlayColor='#2B7DE2' onPress={this.handleClick} onLongPress={this.handleHold}>
        <Wrapper>
          <DialogImage source={{ uri: 'https://facebook.github.io/react/logo-og.png' }} />
          <DialogText>
            <DialogTextInner>
              <DialogTitle>{title}</DialogTitle>
              <DialogLastMessage numberOfLines={1} >{children}Labore quis nulla velit sit occaecat deserunt cillum occaecat dolor et elit duis. Dolore laboris nostrud esse ullamco irure cupidatat mollit nisi nostrud in irure aliquip adipisicing proident. Eu aliquip consectetur velit quis pariatur velit sint esse incididunt laborum aute aliqua. Laboris laboris aliqua magna laborum reprehenderit nostrud aliquip consectetur proident aliquip commodo elit officia.</DialogLastMessage>
            </DialogTextInner>
            <DialogDate>
              <LastMessageDate>Thu</LastMessageDate>
              <UnreadMessages onLayout={(e) => this.getUnreadMessageHeight(e)}>
                <NewMessages onLayout={(e) => this.getUnreadMessageWidth(e)}>2</NewMessages>
              </UnreadMessages>
            </DialogDate>
          </DialogText>

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
    this.props.onClick()
  }
  getUnreadMessageHeight = (e) => {
    this.setState({ height: e.nativeEvent.layout.height })
  }
  getUnreadMessageWidth = (e) => {
    this.setState({ width: e.nativeEvent.layout.width })
  }
}
