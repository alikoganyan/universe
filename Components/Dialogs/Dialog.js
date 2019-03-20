import React, { Component } from 'react'
import { View, Text, Image, TouchableHighlight, Dimensions, Platform, ActionSheetIOS } from 'react-native'
import styled from 'styled-components'
import helper from '../../Helper/helper'
import { connect } from 'react-redux'
const { fontSize, PressDelay, sidePadding, Colors, socket } = helper;
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
  font-size: 14px;
  color: #000000;
  font-weight: 400;
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
  font-size: 12px;
  color: #000000;
  font-weight: 400;
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
class Content extends Component {
  render() {
    const { children, title, user, lastMessage, item } = this.props;
    const daysOfTheWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayOfTheWeek = daysOfTheWeek[new Date(lastMessage).getDay() - 1]
    return (
      <TouchableHighlight underlayColor='#2B7DE2' onPress={item.phone ? () => this.newDialog(item.id) : this.handleClick} onLongPress={this.handleHold}>
        <Wrapper>
          <DialogImage source={{ uri: user.image }} />
          <DialogText>
            <DialogTextInner>
              {title && <>
                <DialogTitle>{title}</DialogTitle>
                <DialogLastMessage numberOfLines={1} >{children}</DialogLastMessage>
              </>
              }
              {item.phone && <>
                <View>
                  <Text>{item.phone}</Text>
                </View>
              </>}
            </DialogTextInner>
            <DialogDate>
              <LastMessageDate>{dayOfTheWeek}</LastMessageDate>
              <UnreadMessages onLayout={(e) => this.getUnreadMessageHeight(e)}>
                {/* <NewMessages onLayout={(e) => this.getUnreadMessageWidth(e)}>2</NewMessages> */}
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
  newDialog = (e) => {
    const { user } = this.props;
    socket.emit('set dialogs', {userId: user.id, dialogId: e})
    this.handleClick()
  }
  handleHold = () => {
    Platform.os === 'ios' && ActionSheetIOS.showActionSheetWithOptions(
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
const mapStateToProps = state => {
  return {
    messages: state.messageReducer.messages,
    storeDialogs: state.messageReducer,
    currentRoom: state.messageReducer.currentRoom,
    user: state.userReducer.user.user
  };
};
const mapDispatchToProps = dispatch => ({
  getMessages: _ => dispatch(getMessages(_)),
  setRoom: _ => dispatch(setRoom(_)),
  setDialogs: _ => dispatch(setDialogs(_))
})
export default connect(mapStateToProps, mapDispatchToProps)(Content)
