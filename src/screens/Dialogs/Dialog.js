import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
  TouchableHighlight,
  Platform,
  ActionSheetIOS,
} from 'react-native'
import styled from 'styled-components'
import { connect } from 'react-redux'
import helper, { getHamsterDate } from '../../utils/helpers'
import DefaultAvatar from '../../common/DefaultAvatar'
import { socket } from '../../utils/socket'

// import { FilesRedIcon, TaskIcon, LocationIcon } from '../../assets'

const { fontSize, sidePadding, Colors } = helper
const {
  purple,
  lightColor,
  grey2,
  blue,
  green,
  // grey3,
  lightGrey2,
  lightBlue,
} = Colors
const Wrapper = styled(View)`
  flex: 1;
  flex-direction: row;
  align-items: center;
  padding: 4px ${sidePadding}px 2px;
  border: 0.5px solid ${lightGrey2};
  border-width: 0;
  border-bottom-width: 1px;
  height: 70px;
`
const DialogImage = styled(Image)`
  width: ${({ size }) => (size ? size : 50)}px;
  height: ${({ size }) => (size ? size : 50)}px;
  border-radius: ${({ size }) => (size ? size / 2 : 25)}px;
`
const DialogText = styled(View)`
  flex: 1;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  padding-left: 10px;
`

const DialogTextInner = styled(View)`
  flex-direction: column;
  justify-content: flex-start;
  flex-grow: 1;
  width: 0;
`
const DialogTitle = styled(Text)`
  font-size: ${fontSize.dialogName};
  color: #000000;
  font-weight: 700;
`
const GroupRespondent = styled(Text)`
  font-size: ${fontSize.sl};
  color: #000000;
  font-weight: 500;
`
const LastMessageDate = styled(Text)`
  color: ${grey2};
  font-size: ${fontSize.sl};
  text-align: center;
  margin-bottom: 5px;
`
const DialogLastMessage = styled(Text)`
  color: ${grey2};
  font-size: 14;
  font-weight: 400;
  line-height: 15;
  padding-top: 2px;
`
const DialogDate = styled(View)`
  color: ${lightColor};
  font-size: ${fontSize.sm};
  justify-content: center;
  margin-bottom: 2px;
  padding-left: 4px;
  text-align: center;
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
// const LastFile = styled(View)`
//   padding-left: 10px;
//   padding-top: 4px;
//   flex-direction: row;
//   justify-content: flex-start;
//   align-items: center;
// `
// const LastFileItem = styled(View)`
//   height: 20px;
//   border: 0.3px ${grey3};
//   border-radius: 10px;
//   overflow: hidden;
//   display: flex;
//   flex-direction: row;
//   justify-content: center;
//   align-items: center;
//   width: 42%;
//   margin-right: 5px;
// `
// const LastFileItemText = styled(Text)`
//   font-size: ${fontSize.sm};
//   color: ${grey3};
//   margin-left: 5px;
// `
// const LastFiles = styled(Text)`
//   font-size: ${fontSize.sm};
//   height: ${fontSize.sm};
//   color: ${grey2};
// `
class Content extends Component {
  render() {
    const { title, user, image, lastMessage, item, unreadMessages } = this.props
    const { phone, _id, creator, /*created_at,*/ isGroup, participants } = item

    const latestMessage = lastMessage[lastMessage.length - 1] || {}
    // let lastTextMessage = lastMessage.filter(e => e.type === 'text')
    // lastTextMessage = lastTextMessage.length
    //   ? lastTextMessage[lastTextMessage.length - 1].text
    //   : ''
    // const lastFiles =
    //   latestMessage && latestMessage.type !== 'text' ? [latestMessage] : []
    const lastMessageDate = latestMessage
      ? new Date(latestMessage.created_at)
      : null
    const dialogDate = getHamsterDate(lastMessageDate, true)
    let lastType = ''
    if (lastMessage.length) {
      switch (latestMessage.type) {
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
      isGroup && lastMessage && lastMessage.length && latestMessage
        ? latestMessage.sender || {}
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
            <DefaultAvatar isGroup={isGroup} id={item._id} size={56} />
          ) : (
            <DialogImage
              source={{ uri: `https://ser.univ.team${chatImage}` }}
              size={56}
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
                    <GroupRespondent numberOfLines={1}>
                      {lastGroupSenderName}
                    </GroupRespondent>
                  )}
                  {latestMessage.type === 'text' ? (
                    <DialogLastMessage numberOfLines={isGroup ? 1 : 2}>
                      {latestMessage.text || 'no messages yet'}
                    </DialogLastMessage>
                  ) : (
                    <DialogLastMessage numberOfLines={1}>
                      {latestMessage.type === 'image'
                        ? 'Изображение'
                        : latestMessage.type === 'task'
                        ? 'Задача'
                        : latestMessage.type === 'geo'
                        ? 'Геолокация'
                        : 'Вложение'}
                    </DialogLastMessage>
                  )}

                  {/* {!!lastFiles.length && (
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
                      {lastFiles.length && lastFiles.length - 1 ? (
                        <LastFiles>
                          +
                          {lastFiles.length > 1
                            ? lastFiles.length - 1
                            : lastFiles.length}
                        </LastFiles>
                      ) : (
                        <LastFiles>123</LastFiles>
                      )}
                    </LastFile>
                  )} */}
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
