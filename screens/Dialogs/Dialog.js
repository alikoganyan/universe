import React, { Component } from 'react'
import { View, Text, Image, TouchableHighlight, Dimensions, Platform, ActionSheetIOS } from 'react-native'
import styled from 'styled-components'
import helper from '../../utils/helpers'
import { connect } from 'react-redux'
import ImageComponent from '../../common/Image'
import { socket } from '../../utils/socket'
import { FilesRedIcon, TaskIcon, LocationIcon } from '../../assets/'
const { fontSize, PressDelay, sidePadding, Colors } = helper;
const { purple, lightColor, grey2, blue, green, yellow, grey3, lightGrey2, lightBlue } = Colors;
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
  border: 0.5px solid ${lightGrey2};
  border-width: 0;
  border-bottom-width: 1px;
`

const DialogTextInner = styled(View)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: ${Dimensions.get('window').width - 120}px;
  top: 15px;
`
const DialogTitle = styled(Text)`
  font-size: ${fontSize.md};
  width: ${Dimensions.get('window').width - 20}px;
  color: #000000;
  font-weight: 400;
  padding-left: 10px;
`
const LastMessageDate = styled(Text)`
  color: ${grey2};
  font-size: ${fontSize.sl};
  text-align: center;
  margin-bottom: 5px;
`
const DialogLastMessage = styled(Text)`
  font-size: ${fontSize.sl};
  padding-right: 20px;
  color: ${grey2};
  font-weight: 400;
  padding-left: 10px;
  padding-top: 2px;
  min-height: 25px;
  margin-bottom: 20px;
`
const DialogDate = styled(View)`
  right: ${sidePadding}px;
  color: ${lightColor};
  font-size: ${fontSize.sm};
  display: flex;
  justify-content: center;
  margin-bottom: 2px;
  text-align: center;
  width: 40px;
  margin-left: 5px;
`
const UnreadMessages = styled(View)`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 25px;
`
const NewMessages = styled(View)`
  background: ${({ color }) => color || purple};
  padding: 2.5px;
  overflow: hidden;
  min-width: 25px;
  height: 25px;
  border-radius: 12.5;
  display: flex;
  justify-content: center;
  align-items: center;
`
const NewMessagesText = styled(Text)`
  color: white;
  font-size: ${fontSize.text};
  text-align: center;
`
const LastFile = styled(View)`
  height: 20px;
  padding-left: 10px;
  padding-bottom: 40px;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`
const LastFileItem = styled(View)`
  height: 20px;
  border: 0.3px ${grey3};
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 42%;
  margin-right: 5px;
`
const LastFileItemText = styled(Text)`
  font-size: ${fontSize.sm};
  color: ${grey3};
  margin-left: 5px;
`
const LastFiles = styled(Text)`
  font-size: ${fontSize.sm};
  color: ${grey2};
`
class Content extends Component {
  render() {
    const { children, title, user, image, lastMessage, item, unreadMessages } = this.props;
    const { phone, id, creator, created_at } = item;
    const daysOfTheWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    let lastTextMessage = lastMessage.filter(e => e.type === 'text')
    lastTextMessage = lastTextMessage.length ? lastTextMessage[lastTextMessage.length - 1].text : ''
    const lastFiles = lastMessage.filter(e => e.type !== 'text')
    const lastMessageDate = lastMessage[lastMessage.length - 1] ? new Date(lastMessage[lastMessage.length - 1].created_at) : null
    const dayOfTheWeek = lastMessage.length ? daysOfTheWeek[lastMessageDate.getDay()] : undefined
    const difference = Math.abs(new Date() - lastMessageDate) / 864e5;
    const timeCreatedAt = new Date(created_at);
    const timeCreated = `${timeCreatedAt.getHours() >= 10 ? timeCreatedAt.getHours() :
      '0' + timeCreatedAt.getHours()}:${timeCreatedAt.getMinutes() >= 10 ?
        timeCreatedAt.getMinutes() :
        '0' + timeCreatedAt.getMinutes()}`
    const time = difference >= 1 ? dayOfTheWeek :
      `${lastMessageDate.getHours() >= 10 ? lastMessageDate.getHours() :
        '0' + lastMessageDate.getHours()}:${lastMessageDate.getMinutes() >= 10 ?
          lastMessageDate.getMinutes() :
          '0' + lastMessageDate.getMinutes()}`
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
      <TouchableHighlight
        underlayColor={lightBlue}
        onPress={phone ?
          () => this.newDialog(id) :
          this.handleClick}
        onLongPress={this.handleHold}>
        <Wrapper>
          <DialogImage
            source={{ uri: `http://ser.univ.team${image || creator.image}` }}
            size={"large"} />
          <DialogText>
            <DialogTextInner>
              {title && <>
                <DialogTitle>{title}</DialogTitle>
                <DialogLastMessage numberOfLines={2}>
                  {lastTextMessage || 'no messages yet'}
                </DialogLastMessage>
                {lastFiles.length ? <LastFile>
                  {lastFiles.map((e, i) => {
                    const { filename, type } = e
                    return i < 2 && <LastFileItem key={i}>
                      {type === 'image' && <FilesRedIcon noPaddingAll={true} size={10} />}
                      {type === 'task' && <TaskIcon noPaddingAll={true} size={10} />}
                      {type === 'geo' && <LocationIcon noPaddingAll={true} size={10} />}
                      <LastFileItemText>
                        {filename.length > 8 ? filename.substr(-8) : filename}
                      </LastFileItemText>
                    </LastFileItem>
                  })}
                  {(lastFiles.length && lastFiles.length - 2) ? <LastFiles>+{lastFiles.length >= 2 ? lastFiles.length - 2 : lastFiles.length}</LastFiles> : <LastFiles />}
                </LastFile> : <LastFiles />}
              </>
              }
              {phone && <>
                <View>
                  <Text>{phone}</Text>
                </View>
              </>}
            </DialogTextInner>
            <DialogDate>
              <LastMessageDate>{time || timeCreated}</LastMessageDate>
              <UnreadMessages>
                {!!unreadMessages &&
                  <NewMessages color={lastType}>
                    <NewMessagesText>{unreadMessages}</NewMessagesText>
                  </NewMessages>}
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
