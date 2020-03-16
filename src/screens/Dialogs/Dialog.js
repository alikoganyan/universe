import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableHighlight,
  Platform,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import styled from 'styled-components'
import { connect } from 'react-redux'
import helper, { getHamsterDate } from '../../utils/helpers'
import DefaultAvatar from '../../common/DefaultAvatar'
import { socket } from '../../utils/socket'
import ImageComponent from '../../common/Image'
import sendRequest from '../../utils/request'
import { connectActionSheet } from '@expo/react-native-action-sheet'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import { setUser } from '../../actions/userActions'

// import { FilesRedIcon, TaskIcon, LocationIcon } from '../../assets'

const { fontSize, sidePadding, Colors } = helper
const {
  purple,
  lightColor,
  // grey2,
  blue,
  green,
  // grey3,
  lightGrey2,
  lightBlue,
  jumbo,
} = Colors
const Wrapper = styled(View)`
  flex-direction: row;
  align-items: center;
  padding: 4px ${sidePadding}px 2px;
  background-color: #fff;
  border: 0.5px solid ${lightGrey2};
  border-width: 0;
  border-bottom-width: 1px;
  width: 100%;
  height: 74px;
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
  font-family: 'OpenSans-Semibold';
  textShadowColor: ${Colors.black};
  textShadowOffset: {width: 0, height: 0};
  textShadowRadius: 0.01;
`
const GroupRespondent = styled(Text)`
  font-size: 14;
  color: #000000;
  font-family: OpenSans;
  textShadowColor: ${Colors.black};
  textShadowOffset: {width: 0, height: 0};
  textShadowRadius: 0.01;
`
const LastMessageDate = styled(Text)`
  color: ${({ color }) => color || '#a3a3a3'};
  font-size: 13px;
  text-align: center;
  margin-bottom: 3px;
  font-family: OpenSans;
`
const DialogLastMessage = styled(Text)`
  color: ${jumbo};
  font-size: 14;
  font-weight: 400;
  line-height: 15;
  padding-top: 2px;
  font-family: OpenSans;
`
const DialogDate = styled(View)`
  color: ${lightColor};
  font-size: ${fontSize.sm};
  justify-content: center;
  margin-bottom: 2px;
  padding-left: 4px;
  text-align: center;
  align-items: flex-end;
`
const UnreadMessages = styled(View)`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 20px;
`
const NewMessages = styled(View)`
  background: ${({ color }) => color || purple};
  padding: 2.5px;
  overflow: hidden;
  min-width: 20px;
  height: 20px;
  border-radius: 12.5;
  display: flex;
  justify-content: center;
  align-items: center;
`
const NewMessagesText = styled(Text)`
  color: white;
  font-size: ${fontSize.text};
  text-align: center;
  font-size: 13px;
`

class Content extends Component {
  render() {
    const { title, user, image, lastMessage, item, unreadMessages } = this.props

    const { phone, _id, creator, isGroup, participants } = item

    const latestMessage = lastMessage[lastMessage.length - 1] || {}

    const lastMessageDate = Object.keys(latestMessage).length
      ? new Date(latestMessage.created_at)
      : new Date(item.created_at)
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
      ? participants.length && participants[0].image
      : creator.image
    const lastGroupSender =
      isGroup && lastMessage && lastMessage.length && latestMessage
        ? latestMessage.sender || {}
        : {}
    const lastGroupSenderName = `${lastGroupSender.first_name ||
      ''} ${lastGroupSender.last_name || ''}`
    return (
      <Swipeable
        renderRightActions={() =>
          Platform.OS === 'ios' && this.RightActions(item)
        }
      >
        <TouchableHighlight
          underlayColor={lightBlue}
          onPress={phone ? () => this.newDialog(_id) : this.handleClick}
          onLongPress={Platform.OS === 'android' && this.handleHold}
        >
          <Wrapper>
            {!chatImage ||
            chatImage === '/images/default_group.png' ||
            chatImage === '/images/default_avatar.jpg' ? (
              <DefaultAvatar isGroup={isGroup} id={item._id} size={56} />
            ) : (
              <ImageComponent
                source={{
                  uri: `https://seruniverse.asmo.media${chatImage}`,
                }}
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
                        {!Object.keys(latestMessage).length && isGroup
                          ? 'Пока нет сообшений в группе.'
                          : !Object.keys(latestMessage).length && !isGroup
                          ? 'Нет сообшений'
                          : latestMessage.type === 'image'
                          ? 'Изображение'
                          : latestMessage.type === 'task'
                          ? 'Задача'
                          : latestMessage.type === 'geo'
                          ? 'Геолокация'
                          : latestMessage.type === 'video'
                          ? 'Видео'
                          : 'Файл'}
                      </DialogLastMessage>
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
                <LastMessageDate color={unreadMessages ? lastType : ''}>
                  {dialogDate}
                </LastMessageDate>
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
      </Swipeable>
    )
  }

  state = {}

  RightActions = item => {
    const {
      user,
      user: { disabled_notifications_users = [] },
    } = this.props
    const participant =
      item.participants[0]._id !== user._id
        ? item.participants[0]
        : item.creator
    return (
      <View style={{ display: 'flex', flexDirection: 'row' }}>
        <TouchableOpacity
          style={[styles.rightAction, { backgroundColor: 'red' }]}
          onPress={() => this.deleteDialog(item._id)}
        >
          <Text style={styles.actionText}>Удалить</Text>
        </TouchableOpacity>
        {!item.isGroup && (
          <TouchableOpacity
            style={[styles.rightAction]}
            onPress={() =>
              this.toggleUserNotification(
                participant._id,
                disabled_notifications_users.includes(participant._id),
              )
            }
          >
            <Text style={styles.actionText}>
              {disabled_notifications_users.includes(participant._id)
                ? 'Вкл уведомления'
                : 'Выкл уведомления'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    )
  }

  deleteDialog = dialog_id => {
    sendRequest({
      r_path: '/dialogs/delete_dialog',
      method: 'delete',
      attr: { dialog_id },
      success: res => {},
      failFunc: e => {},
    })
  }

  toggleUserNotification = (user_id, enable) => {
    const { setUser, user } = this.props
    let {
      user: { disabled_notifications_users = [] },
    } = this.props
    sendRequest({
      r_path: '/profile/notifications_from_user',
      method: 'patch',
      attr: {
        user_id,
        enable,
      },
      success: res => {
        if (!enable) {
          disabled_notifications_users.push(user_id)
        } else {
          disabled_notifications_users = disabled_notifications_users.filter(
            id => id !== user_id,
          )
        }
        setUser({ ...user, disabled_notifications_users })
      },
      failFunc: e => {},
    })
  }

  newDialog = e => {
    const { user } = this.props
    socket.emit('set dialogs', { userId: user.id, dialogId: e })
    this.handleClick()
  }

  handleHold = () => {
    const {
      item,
      user,
      user: { disabled_notifications_users = [] },
    } = this.props
    const options = ['Удалить', 'Отменить']

    const participant =
      item.participants[0]._id !== user._id
        ? item.participants[0]
        : item.creator
    if (!item.isGroup) {
      disabled_notifications_users.includes(participant._id)
        ? options.unshift('Вкл уведомления')
        : options.unshift('Выкл уведомления')
    }

    this.props.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: options.length === 2 ? 1 : 2,
        showSeparators: true,
        textStyle: {
          textAlign: 'center',
          width: '100%',
          color: blue,
          fontSize: 18,
        },
      },
      buttonIndex => {
        if (options.length === 3 && buttonIndex === 0) {
          this.toggleUserNotification(
            participant._id,
            disabled_notifications_users.includes(participant._id),
          )
        } else if (
          (options.length === 3 && buttonIndex === 1) ||
          (options.length === 2 && buttonIndex === 0)
        ) {
          this.deleteDialog(item._id)
        }
      },
    )
  }

  handleClick = () => {
    const { onClick } = this.props
    onClick()
  }
}

const styles = StyleSheet.create({
  rightAction: {
    backgroundColor: '#388e3c',
    justifyContent: 'center',
    zIndex: 10,
  },
  actionText: {
    color: '#ffffff',
    fontWeight: '600',
    padding: 20,
  },
})

const mapStateToProps = state => ({
  user: state.userReducer.user,
})
const mapDispatchToProps = dispatch => ({
  setUser: _ => dispatch(setUser(_)),
})
const ConnectedApp = connectActionSheet(Content)

export default connect(mapStateToProps, mapDispatchToProps)(ConnectedApp)
