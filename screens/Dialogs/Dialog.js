import React, { Component } from 'react'
import { View, Text, Image, TouchableHighlight, Dimensions, Platform, ActionSheetIOS } from 'react-native'
import styled from 'styled-components'
import helper from '../../utils/helpers'
import { connect } from 'react-redux'
import { ImageComponent } from '../../common'
import { socket } from '../../utils/socket'

const { fontSize, PressDelay, sidePadding, Colors } = helper;
const { purple, lightColor, grey2, blue, green, yellow } = Colors;
const Wrapper = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center; 
  padding: 15px ${sidePadding}px 15px;
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
  right: ${sidePadding}px;
  color: ${lightColor};
  font-size: ${fontSize.sm};
  display: flex;
  justify-content: center;
  margin-bottom: 2px;
  text-align: center;
  margin-left: 5px;
`
const UnreadMessages = styled(View)`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
`
const NewMessages = styled(View)`
  background: ${({ color }) => color || purple};
  padding: 2.5px;
  overflow: hidden;
  min-width: 25px;
  height: 25px;
  border-radius: 12.5;
  margin-top: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
`
const NewMessagesText = styled(Text)`
  color: white;
  font-size: ${fontSize.text};
  text-align: center;
`
class Content extends Component {
  render() {
    const { children, title, user, image, lastMessage, item } = this.props;
    const { phone, id } = item;
    const { creator } = item
    const daysOfTheWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const last = lastMessage.length ? lastMessage[lastMessage.length - 1].text : ''
    const dayOfTheWeek = lastMessage.length ? daysOfTheWeek[new Date(lastMessage[lastMessage.length - 1].created_at).getDay()] : undefined
    let lastMessageType = ''
    let lastType = ''
    if (lastMessage.length) switch (lastMessage[lastMessage.length - 1].type) {
      case 'text':
        lastType = blue;
        lastMessageType = 'text';
        break;
      case 'task':
        lastType = purple;
        lastMessageType = 'task';
        break;
      case 'geo':
        lastType = green;
        lastMessageType = 'geo';
        break;
      default:
        lastType = blue;
        lastMessageType = 'image';
        break;
    }
    return (
      <TouchableHighlight underlayColor='#2B7DE2' onPress={phone ? () => this.newDialog(id) : this.handleClick} onLongPress={this.handleHold}>
        <Wrapper>
          <DialogImage source={{ uri: `http://ser.univ.team${image || creator.image}` }} size={"large"} />
          <DialogText>
            <DialogTextInner>
              {title && <>
                <DialogTitle>{title}</DialogTitle>
                <DialogLastMessage numberOfLines={1} >{last || lastMessageType || 'no messages yet'}</DialogLastMessage>
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
              <UnreadMessages>
                {lastMessage && (!!lastMessage.length &&
                  <NewMessages color={lastType}>
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
