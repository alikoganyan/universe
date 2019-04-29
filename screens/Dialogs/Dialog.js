import React, { Component } from 'react'
import { View, Text, Image, TouchableHighlight, Dimensions, Platform, ActionSheetIOS } from 'react-native'
import styled from 'styled-components'
import helper from '../../utils/helpers'
import { connect } from 'react-redux'
import { ImageComponent } from '../../common'
import { socket } from '../../utils/socket'

const { fontSize, PressDelay, sidePadding, sidePaddingNumber, Colors } = helper;
const { purple, lightColor, grey2 } = Colors;
const Wrapper = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center; 
  padding: 15px ${sidePadding} 15px;
`
const DialogImage = styled(Image)`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  margin-top: 5px;
`
const DialogText = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const DialogTextInner = styled(View)`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: ${Dimensions.get('window').width - 110}px;

`
const DialogTitle = styled(Text)`
  font-size: ${fontSize.md};
  width: ${Dimensions.get('window').width - 20}px;
  color: #000000;
  font-weight: 400;
  padding-left: 10px;
`
const LastMessageDate = styled(Text)`
  color: ${lightColor};
  font-size: ${fontSize.text};
  text-align: left;
  margin-bottom: 5px;
`
const DialogLastMessage = styled(Text)`
  font-size: ${fontSize.text};
  color: ${lightColor};
  padding-right: 20px;
  color: ${grey2};
  font-weight: 400;
  padding-left: 10px;
  padding-top: 2px;
`
const DialogDate = styled(View)`
  right: ${sidePadding};
  color: ${lightColor};
  flex: 1;
  font-size: ${fontSize.sm};
  display: flex;
  justify-content: flex-start;
  margin-bottom: 2px;
  text-align: center;
  margin-left: -5px;
`
const UnreadMessages = styled(View)`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
`
const NewMessages = styled(View)`
  background: ${purple};
  padding: 2.5px;
  overflow: hidden;
  min-width: 25px;
  height: 25px;
  border-radius: 12.5;
  margin-top: 5px;
  margin-left: 7.5px;
  display: flex;
  justify-content: center;
  align-items: center;
`
const NewMessagesText = styled(Text)`
  color: white;
  font-size: ${fontSize.text};
`
class Content extends Component {
  render() {
    const { children, title, user, lastMessage, item } = this.props;
    const { phone, id } = item;
    const daysOfTheWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayOfTheWeek = daysOfTheWeek[new Date(lastMessage).getDay() - 1]
    // const last = lastMessage ? lastMessage[lastMessage.length - 1].text : ''
    return (
      <TouchableHighlight underlayColor='#2B7DE2' onPress={phone ? () => this.newDialog(id) : this.handleClick} onLongPress={this.handleHold}>
        <Wrapper>
          <DialogImage source={{ uri: user.image }} size={"large"} />
          <DialogText>
            <DialogTextInner>
              {title && <>
                <DialogTitle>{title}</DialogTitle>
                {/* <DialogLastMessage numberOfLines={2} >{last}</DialogLastMessage> */}
              </>
              }
              {phone && <>
                <View>
                  <Text>{phone}</Text>
                </View>
              </>}
            </DialogTextInner>
            <DialogDate>
              <LastMessageDate>{dayOfTheWeek}</LastMessageDate>
              <UnreadMessages onLayout={(e) => this.getUnreadMessageHeight(e)}>
                {lastMessage && (!!lastMessage.length &&
                  <NewMessages onLayout={(e) => this.getUnreadMessageWidth(e)}>
                    <NewMessagesText>{lastMessage.length}</NewMessagesText>
                  </NewMessages>)}
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
    socket.emit('set dialogs', { userId: user.id, dialogId: e })
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
    user: state.userReducer.user
  };
};
const mapDispatchToProps = dispatch => ({
  getMessages: _ => dispatch(getMessages(_)),
  setRoom: _ => dispatch(setRoom(_)),
  setDialogs: _ => dispatch(setDialogs(_))
})
export default connect(mapStateToProps, mapDispatchToProps)(Content)
