import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
  TouchableHighlight,
  Dimensions,
  Platform,
  ActionSheetIOS,
} from 'react-native'
import styled from 'styled-components'
import { connect } from 'react-redux'
import helper, { getHamsterDate } from '../../utils/helpers'
import DefaultAvatar from '../../common/DefaultAvatar'
import { socket } from '../../utils/socket'

import { FilesRedIcon, TaskIcon, LocationIcon } from '../../assets'

const { fontSize, sidePadding, Colors } = helper
const {
  purple,
  lightColor,
  grey2,
  blue,
  green,
  grey3,
  lightGrey2,
  lightBlue,
} = Colors
const Wrapper = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 4px ${sidePadding}px 2px;
  border: 0.5px solid ${lightGrey2};
  border-width: 0;
  border-bottom-width: 1px;
  height: 60px;
`
const DialogImage = styled(Image)`
  width: 50px;
  height: 50px;
  border-radius: 25px;
`
const DialogText = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
`

const DialogTextInner = styled(View)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: ${Dimensions.get('window').width - 120}px;
`
const DialogTitle = styled(Text)`
  font-size: ${fontSize.dialogName};
  width: ${Dimensions.get('window').width - 20}px;
  color: #000000;
  font-weight: ${({ isGroup }) => (isGroup ? 400 : 700)};
  padding-left: 10px;
`
const LastMessageDate = styled(Text)`
  color: ${grey2};
  font-size: ${fontSize.sl};
  text-align: center;
  margin-bottom: 5px;
`
const DialogLastMessage = styled(Text)`
  padding-right: 20px;
  color: ${grey2};
  font-size: 14;
  font-weight: 400;
  line-height: 15;
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
  padding-left: 10px;
  padding-top: 4px;
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
  height: ${fontSize.sm};
  color: ${grey2};
`
class Content extends Component {
  render() {
    const { title, user, image, lastMessage, item, unreadMessages } = this.props
    const { phone, _id, creator, /*created_at,*/ isGroup, participants } = item
    let lastTextMessage = lastMessage.filter(e => e.type === 'text')
    lastTextMessage = lastTextMessage.length
      ? lastTextMessage[lastTextMessage.length - 1].text
      : ''
    const lastFiles =
      lastMessage[lastMessage.length - 1] &&
      lastMessage[lastMessage.length - 1].type !== 'text'
        ? [lastMessage[lastMessage.length - 1]]
        : []
    const lastMessageDate = lastMessage[lastMessage.length - 1]
      ? new Date(lastMessage[lastMessage.length - 1].created_at)
      : null
    const dialogDate = getHamsterDate(lastMessageDate, true)
    let lastType = ''
    if (lastMessage.length) {
      switch (lastMessage[lastMessage.length - 1].type) {
        case 'text':
          lastType = blue
          break
        case 'task':
          lastType = purple
          break
        case 'geo':
          lastType = green
          break
        default:
          lastType = blue
          break
      }
    }
    const chatImage = isGroup
      ? image
      : user._id === creator._id
      ? participants[0].image
      : creator.image
    const lastGroupSender =
      isGroup &&
      lastMessage &&
      lastMessage.length &&
      lastMessage[lastMessage.length - 1]
        ? lastMessage[lastMessage.length - 1].sender || {}
        : {}
    const lastGroupSenderName = `${lastGroupSender.first_name ||
      ''} ${lastGroupSender.last_name || ''}`
    return (
      <TouchableHighlight
        underlayColor={lightBlue}
        onPress={phone ? () => this.newDialog(_id) : this.handleClick}
        onLongPress={this.handleHold}
      >
        <Wrapper>
          {!chatImage ||
          chatImage === '/images/default_group.png' ||
          chatImage === '/images/default_avatar.jpg' ? (
            <DefaultAvatar isGroup={isGroup} id={item._id} size={50} />
          ) : (
            <DialogImage
              source={{ uri: `https://ser.univ.team${chatImage}` }}
              size="large"
            />
          )}
          <DialogText>
            <DialogTextInner>
              {title && (
                <>
                  <DialogTitle numberOfLines={1} isGroup={isGroup}>
                    {title}
                  </DialogTitle>
                  {!!isGroup && (
                    <DialogTitle numberOfLines={1}>
                      {lastGroupSenderName}
                    </DialogTitle>
                  )}
                  <DialogLastMessage numberOfLines={isGroup ? 1 : 2}>
                    {lastTextMessage || 'no messages yet'}
                  </DialogLastMessage>
                  {!!lastFiles.length && (
                    <LastFile>
                      {lastFiles.map((e, i) => {
                        const { filename, type } = e
                        return (
                          i < 2 && (
                            <LastFileItem key={i}>
                              {type === 'image' && (
                                <FilesRedIcon noPaddingAll size={10} />
                              )}
                              {type === 'task' && (
                                <TaskIcon noPaddingAll size={10} />
                              )}
                              {type === 'geo' && (
                                <LocationIcon noPaddingAll size={10} />
                              )}
                              {filename ? (
                                <LastFileItemText>
                                  {filename.length > 8
                                    ? filename.substr(-8)
                                    : filename}
                                </LastFileItemText>
                              ) : null}
                            </LastFileItem>
                          )
                        )
                      })}
                      {lastFiles.length && lastFiles.length - 2 ? (
                        <LastFiles>
                          +
                          {lastFiles.length >= 2
                            ? lastFiles.length - 2
                            : lastFiles.length}
                        </LastFiles>
                      ) : (
                        <LastFiles />
                      )}
                    </LastFile>
                  )}
                </>
              )}
              {phone && (
                <>
                  <View>
                    <Text>{phone}</Text>
                  </View>
                </>
              )}
            </DialogTextInner>
            <DialogDate>
              <LastMessageDate>{dialogDate}</LastMessageDate>
              <UnreadMessages>
                {!!unreadMessages && (
                  <NewMessages color={lastType}>
                    <NewMessagesText>{unreadMessages}</NewMessagesText>
                  </NewMessages>
                )}
              </UnreadMessages>
            </DialogDate>
          </DialogText>
        </Wrapper>
      </TouchableHighlight>
    )
  }

  state = {}

  newDialog = e => {
    const { user } = this.props
    socket.emit('set dialogs', { userId: user.id, dialogId: e })
    this.handleClick()
  }

  handleHold = () => {
    Platform.os === 'ios' &&
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Remove'],
          destructiveButtonIndex: 1,
          cancelButtonIndex: 0,
        },
        buttonIndex => {
          if (buttonIndex === 1) {
            /* destructive action */
          }
        },
      )
  }

  handleClick = () => {
    const { onClick } = this.props
    onClick()
  }

  getUnreadMessageHeight = () => {}

  getUnreadMessageWidth = () => {}
}
const mapStateToProps = state => ({
  user: state.userReducer.user,
})
const mapDispatchToProps = dispatch => ({})
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Content)
