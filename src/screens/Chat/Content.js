import React, { Component } from 'react'
import {
  View,
  Text,
  FlatList,
  ImageBackground,
  InteractionManager,
  Alert,
  Clipboard,
  TouchableOpacity,
} from 'react-native'
import Image from 'react-native-image-progress'

import styled from 'styled-components'
import { connect } from 'react-redux'
import ActionSheet from 'react-native-actionsheet'
import moment from 'moment'
import 'moment/locale/ru'
import { chatBg } from '../../assets/images'
import { getHamsterDate } from '../../utils/helpers'
import Message from '../../common/Message'
import sendRequest from '../../utils/request'
import { setDialogs, setDialog } from '../../actions/dialogsActions'
import { setTaskReceivers } from '../../actions/participantsActions'
import {
  editMessage,
  forwardMessage,
  replyMessage,
  setCurrentRoomId,
} from '../../actions/messageActions'
import { d_message } from '../../constants/api'
import _ from 'lodash'
import * as ICONS from '../../assets/icons'

const Wrapper = styled(View)`
  background: white;
  z-index: 1;
  position: relative;
`
const StyledFlatList = styled(FlatList)`
  padding-right: 5;
  padding-left: 5;
  z-index: 2;
`
const FlatListHeader = styled(View)`
  margin-bottom: 15px;
`
const StyledImageBackground = styled(ImageBackground)`
  width: 100%;
  height: 100%;
`
const DateContainer = styled(View)`
  position: absolute;
  top: 10px;
  z-index: 10;
  width: 100%;
  align-items: center;
`
const DateView = styled(View)`
  background-color: #ececec;
  border-radius: 20px;
  padding: 3px 5px;
`

class Content extends Component {
  render() {
    const {
      messageLongPressActions,
      currentDate,
      scrolledMessages,
      buttonToDown,
      selectedMessages,
    } = this.state
    const { search, editedMessage, messages } = this.props

    // to do
    // console.log(dialogs, currentChat, currentRoomId)

    // const _dialog = Object.keys(dialog).length
    //   ? dialog
    //   : [...dialogs].find(e => {
    //     if (!currentChat) {
    //       return (
    //         !e.isGroup &&
    //         (e.creator._id === currentDialog._id ||
    //           e.participants.some(p => p._id === currentDialog._id))
    //       )
    //     } else {
    //       return e.room === currentChat
    //     }
    //     // if(e._id === currentRoomId) {
    //     //   this.props.setDialog(e)
    //     // }
    //   })
    // console.log(_dialog)
    const isEditing = !!editedMessage.text
    // const messages = _dialog ? [..._dialog.messages] : []
    const currentMessages = scrolledMessages.length
      ? scrolledMessages
      : messages

    let reversedMessages = [...currentMessages].sort(
      (x, y) => new Date(y.created_at) - new Date(x.created_at),
    )

    reversedMessages = _.uniqBy(reversedMessages, '_id')

    return (
      <>
        <Wrapper search={search}>
          <StyledImageBackground source={chatBg}>
            <StyledFlatList
              onScroll={this.checkScrollPosition}
              onEndReached={this.handleScroll}
              ref="flatList"
              ListHeaderComponent={<FlatListHeader editing={isEditing} />}
              inverted={!!reversedMessages.length}
              data={reversedMessages}
              initialNumToRender={30}
              keyboardDismissMode="on-drag"
              animated
              onViewableItemsChanged={this.onViewableItemsChanged}
              viewabilityConfig={{
                itemVisiblePercentThreshold: 50,
              }}
              renderItem={({ item, index }) => (
                <Message
                  selected={selectedMessages === item._id ? true : false}
                  key={index}
                  item={item}
                  onLongPressMessage={() => this._onLongPressMessage(item)}
                  onPressMessage={() => this._onPressMessage(item)}
                />
              )}
              keyExtractor={(item, index) => index.toString()}
            />
            {buttonToDown ? (
              <TouchableOpacity
                onPress={this._scrollToBottom}
                style={{
                  position: 'absolute',
                  width: 40,
                  height: 40,
                  right: 20,
                  bottom: 20,
                  zIndex: 10,
                  backgroundColor: '#fff',
                  borderRadius: 50 / 2,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Image
                  style={{ width: 16, height: 16 }}
                  source={ICONS.Arrow_down}
                />
              </TouchableOpacity>
            ) : null}
          </StyledImageBackground>
        </Wrapper>
        {!!currentDate && (
          <DateContainer>
            <DateView>
              <Text>{this.getMessageDate()}</Text>
            </DateView>
          </DateContainer>
        )}
        <ActionSheet
          ref={node => (this.ActionSheetMessage = node)}
          options={messageLongPressActions.map(({ title }) => title)}
          cancelButtonIndex={messageLongPressActions.length - 1}
          onPress={index =>
            messageLongPressActions[index] &&
            messageLongPressActions[index].action &&
            messageLongPressActions[index].action()
          }
        />
      </>
    )
  }

  state = {
    messageLongPressActions: [],
    animationCompleted: false,
    currentDate: '',
    totalPages: 0,
    page: 1,
    nextPage: null,
    prevPage: null,
    messages: [],
    scrolledMessages: [],
    switcher: true,
    switcherDown: true,
    buttonToDown: false,
    selectedMessages: null,
  }

  componentDidMount() {
    moment.locale('ru')
    const { navigation, dialog } = this.props
    const { messages_from_pages } = dialog

    if (Object.keys(dialog).length) {
      const messages = messages_from_pages.docs
      this.props.setMessages(messages)
      this.setState({
        nextPage: messages_from_pages.nextPage,
        totalPages: messages_from_pages.totalPages,
      })
    }
    navigation.setParams({
      scrollToBottom: this._scrollToBottom,
    })
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        animationCompleted: true,
      })
    })

    // const dialogIndex = dialogs.findIndex(dialog => dialog.room === currentChat)

    // if (dialogIndex > -1) {
    //   dialogs[dialogIndex].messages = dialogs[dialogIndex].messages.map(
    //     message => ({
    //       ...message,
    //       viewers: [...message.viewers, user._id],
    //     }),
    //   )
    //   if (!Object.keys(dialog).length) {
    //     this.props.setDialog(dialogs[dialogIndex])
    //   }
    //   setDialogs(dialogs)
    // }
  }

  componentWillReceiveProps(nextProps) {
    const { messages } = this.props
    if (nextProps.message._id !== this.props.message._id) {
      messages.push(nextProps.message)
      this.props.setMessages(messages)
    }
  }

  componentWillUnmount() {
    // const { dialogs, setDialogs, user, currentChat } = this.props
    // const dialogIndex = dialogs.findIndex(dialog => dialog.room === currentChat)

    // if (dialogIndex > -1) {
    // //   dialogs[dialogIndex].messages = dialogs[dialogIndex].messages.map(
    // //     message => ({
    // //       ...message,
    // //       viewers: [...message.viewers, user._id],
    // //     }),
    // //   )
    // //   setDialogs(dialogs)
    // // }
    this.props.setDialog({})
  }

  getMessage = (scrollDown?) => {
    let { dialog, messages } = this.props
    let { page, scrolledMessages, prevPage } = this.state
    sendRequest({
      r_path: '/dialogs/messages_from_page_reverse',
      method: 'post',
      attr: {
        dialog_id: dialog._id,
        page: scrollDown ? prevPage : page,
      },
      success: res => {
        // todo next  pageri vra heto ashxatel
        // this.setState({ nextPage: res.nextPage, totalPages: res.totalPages })
        if (!scrolledMessages.length) {
          messages = messages.concat(res.docs)
          this.props.setMessages(messages)
        } else {
          scrolledMessages = res.docs.concat(scrolledMessages)
          this.setState({
            scrolledMessages: scrolledMessages,
            page: res.nextPage,
          })
        }
        if (scrollDown) {
          this.setState({ prevPage: res.prevPage })
          this.refs.flatList.scrollToIndex({
            animated: false,
            index: 29,
            viewPosition: 0,
          })
        }
        this.setState({ switcher: true })
      },
      failFunc: err => {},
    })
  }

  getSelectedMessage = id => {
    const { dialog } = this.props
    sendRequest({
      r_path: '/dialogs/messages_from_message',
      method: 'post',
      attr: {
        dialog_id: dialog._id,
        message_id: id,
      },
      success: res => {
        this.setState({
          scrolledMessages: res.docs,
          page: res.nextPage,
          prevPage: res.prevPage,
        })
        const index = this.refs.flatList.props.data.findIndex(
          el => el._id === id,
        )
        if (index !== -1) {
          this.refs.flatList.scrollToIndex({
            animated: true,
            index: index,
            viewPosition: 0.5,
          })
        }
      },
      failFunc: err => {},
    })
  }

  checkScrollPosition = event => {
    const { lastPosition, switcherDown, prevPage } = this.state
    if (event.nativeEvent.contentOffset.y > 400) {
      this.setState({ buttonToDown: true })
    } else {
      this.setState({ buttonToDown: false })
    }
    if (
      prevPage &&
      switcherDown &&
      lastPosition &&
      lastPosition > event.nativeEvent.contentOffset.y &&
      event.nativeEvent.contentOffset.y < 600
    ) {
      this.getMessage(true)

      this.setState({ switcherDown: false })
    } else if (!switcherDown && event.nativeEvent.contentOffset.y > 600) {
      this.setState({ switcherDown: true })
      // this.setState({page: nextPage})
    }
    this.setState({ lastPosition: event.nativeEvent.contentOffset.y })
  }

  handleScroll = () => {
    const { switcher, nextPage, scrolledMessages } = this.state
    const { messages } = this.props
    if (switcher && nextPage) {
      if (!scrolledMessages.length) {
        this.setState({ page: Math.floor(messages.length / 30) + 1 })
      }
      this.setState({ switcher: false })
      this.getMessage()
    }
  }

  _scrollToBottom = () => {
    const { scrolledMessages, messages } = this.state
    if (scrolledMessages.length) {
      // todo next page
      // const nextPage = Math.floor(messages.length / 30) + 1 < totalPages ?  Math.floor(messages.length / 30) + 1 : null
      this.setState({ scrolledMessages: [] })
      this.setState({
        page: Math.floor(messages.length / 30) + 1,
        prevPage: null,
      })
    }
    if (messages.length) {
      this.refs.flatList.scrollToIndex({
        animated: true,
        index: 0,
        viewPosition: 1,
      })
    }
  }

  getMessageDate = () => {
    const { currentDate } = this.state
    const [now] = new Date().toISOString().split('T')

    const diff = (new Date(currentDate) - new Date(now)) / (3600 * 24) / 1000

    if (diff === 0) {
      return 'Сегодня'
    } else if (diff === 1) {
      return 'Вчера'
    } else if (this.isSameWeek(currentDate, now)) {
      return this.getDayOfWeek(new Date(currentDate).getDay())
    } else if (
      new Date(currentDate).getFullYear() === new Date(now).getFullYear()
    ) {
      return moment(currentDate).format('DD MMMM')
    }

    return moment(currentDate).format('DD MMMM YYYY г.')
  }

  isSameWeek(firstDay, secondDay, offset) {
    var firstMoment = moment(firstDay)
    var secondMoment = moment(secondDay)

    var startOfWeek = function(_moment, _offset) {
      return _moment.add(
        'days',
        _moment.weekday() * -1 +
          (_moment.weekday() >= 7 + _offset ? 7 + _offset : _offset),
      )
    }

    return startOfWeek(firstMoment, offset).isSame(
      startOfWeek(secondMoment, offset),
      'day',
    )
  }

  getDayOfWeek(day) {
    switch (day) {
      case 0:
        return 'Понедельник'
      case 1:
        return 'Вторник'
      case 2:
        return 'Среда'
      case 3:
        return 'Четверг'
      case 4:
        return 'Пятница'
      case 5:
        return 'Суббота'
      case 6:
        return 'Воскресенье'
      default:
        return null
    }
  }

  onViewableItemsChanged = ({ viewableItems, changed }) => {
    const { currentDate } = this.state
    const item = viewableItems[viewableItems.length - 1]
    if (item) {
      const [date] =
        typeof item.item.created_at === 'string'
          ? item.item.created_at.split('T')
          : item.item.created_at.toISOString().split('T')
      if (!currentDate) {
        this.setState({
          currentDate: date,
        })
      } else if (new Date(date) - new Date(currentDate)) {
        this.setState({
          currentDate: date,
        })
      }
    }
  }

  turnToTask = message => {
    const { navigate, setTaskReceivers, currentDialog } = this.props
    setTaskReceivers([currentDialog])
    const { text } = message
    const task = {
      text,
    }
    navigate({ routeName: 'NewTask', params: task })
  }

  messageDeleteConfirmation = message => {
    Alert.alert('Внимание', 'Вы уверены что хотите удалить сообщение', [
      { text: 'Нет' },
      { text: 'Да', onPress: () => this.deleteMessage(message) },
    ])
  }

  deleteMessage = currentMessage => {
    const {
      dialogs,
      setDialogs,
      currentChat,
      currentRoomId,
      dialog,
    } = this.props
    sendRequest({
      r_path: d_message,
      method: 'delete',
      attr: {
        dialog_id: currentRoomId,
        messages: [currentMessage._id],
      },
      success: res => {},
      failFunc: err => {},
    })
    // const dialog = dialogs.filter(dialog => dialog.room === currentChat)[0]
    const dialogIndex = dialogs.findIndex(dialog => dialog.room === currentChat)
    dialog.messages = dialog.messages.filter(
      message => message._id !== currentMessage._id,
    )
    const newDialogs = [...dialogs]
    newDialogs[dialogIndex] = dialog
    this.props.setDialog(dialog)
    setDialogs(newDialogs)
  }

  _scrollToBottom = () => {
    const { scrolledMessages } = this.state
    const { messages } = this.props
    if (scrolledMessages.length) {
      // todo next page
      // const nextPage = Math.floor(messages.length / 30) + 1 < totalPages ?  Math.floor(messages.length / 30) + 1 : null
      this.setState({ scrolledMessages: [] })
      this.setState({
        page: Math.floor(messages.length / 30) + 1,
        prevPage: null,
      })
    }
    if (messages.length) {
      this.refs.flatList.scrollToIndex({
        animated: true,
        index: 0,
        viewPosition: 1,
      })
    }
  }

  _onPressMessage = item => {
    if (item.reply && item.reply._id) {
      const index = this.refs.flatList.props.data.findIndex(
        el => el._id === item.reply._id,
      )
      if (index !== -1) {
        this.refs.flatList.scrollToIndex({
          animated: true,
          index: index,
          viewPosition: 0.5,
        })
      } else {
        this.getSelectedMessage(item.reply._id)
      }
      this.setState({ selectedMessages: item.reply._id })
      setTimeout(() => {
        this.setState({ selectedMessages: false })
      }, 2000)
    }

    const { navigate, dialog, currentDialog, onShowPreviewImages } = this.props
    const { first_name, last_name, phone_number } = currentDialog
    const {
      _id = 0,
      type = '',
      data: { latitude = 0, longitude = 0 } = {},
      src = '',
    } = item
    switch (type) {
      case 'geo':
        navigate &&
          navigate({
            routeName: 'MapView',
            params: {
              title: 'Геолокация',
              latitude,
              longitude,
            },
          })
        break
      case 'video':
        navigate &&
          navigate({
            routeName: 'VideoView',
            params: {
              title: 'Видео',
              uri: `https://seruniverse.asmo.media${src}`,
            },
          })
        break
      case 'image':
        {
          const dialogMessages = dialog.messages || []
          let dialogImages = []
          let imageIndex = 0
          dialogMessages.forEach(message => {
            if (message.type === 'image') {
              dialogImages.push({
                image: `https://seruniverse.asmo.media${message.src}`,
                title: first_name ? `${first_name} ${last_name}` : phone_number,
                description: getHamsterDate(message.created_at),
                actions: this._getMessageActions(message).slice(0, -1),
              })
              if (message._id === _id) {
                imageIndex = dialogImages.length - 1
              }
            }
          })
          onShowPreviewImages(dialogImages, imageIndex)
        }
        break

      default:
        break
    }
  }

  _getMessageActions = message => {
    const { user, dialog } = this.props
    this.props.setCurrentRoomId(dialog._id)
    let actions = []
    if (
      message._id &&
      message.type === 'text' &&
      message.sender._id === user._id
    ) {
      actions.push({
        title: 'Сделать задачей',
        action: () => this.turnToTask(message),
      })
      actions.push({
        title: 'Редактировать',
        action: () => this.editMessage(message),
      })
    }
    if (message._id && message.type === 'text') {
      actions.push({
        title: 'Копировать',
        action: () => this.copyMessage(message),
      })
    }
    actions.push({
      title: 'Ответить',
      action: () => this.replyMessage(message),
    })
    actions.push({
      title: 'Переслать',
      action: () => this.forwardMessage(message),
    })

    // if (message._id && message.type === 'image') {
    //   actions.push({
    //     title: 'Сохранить',
    //     action: () => {},
    //   })
    // }
    if (message._id && message.sender._id === user._id) {
      actions.push({
        title: 'Удалить',
        action: () => this.messageDeleteConfirmation(message),
      })
    }
    actions.push({
      title: 'Отменить',
      action: () => {},
    })
    return actions
  }

  _onLongPressMessage = message => {
    this.setState(
      {
        messageLongPressActions: this._getMessageActions(message),
      },
      () => {
        this.ActionSheetMessage && this.ActionSheetMessage.show()
      },
    )
  }

  copyMessage = message => {
    Clipboard.setString(message.text)
  }

  editMessage = message => {
    const { editMessage } = this.props
    editMessage({ ...message })
  }

  forwardMessage = message => {
    const { forwardMessage, goBack } = this.props
    forwardMessage(message)
    goBack()
  }

  replyMessage = message => {
    const { replyMessage } = this.props
    replyMessage(message)
  }
}

const mapStateToProps = state => ({
  search: state.messageReducer.search,
  currentChat: state.messageReducer.currentChat,
  editedMessage: state.messageReducer.editMessage,
  replyMessage: state.messageReducer.replyMessage,
  deleteMessage: state.messageReducer.deleteMessage,
  file: state.messageReducer.file,
  forwardMessage: state.messageReducer.forwardMessage,
  currentRoomId: state.messageReducer.currentRoomId,
  currentRoom: state.messageReducer.currentRoom,
  user: state.userReducer.user,
  dialogs: state.dialogsReducer.dialogs,
  dialog: state.dialogsReducer.dialog,
  currentDialog: state.dialogsReducer.currentDialog,
  message: state.messageReducer.message,
})

const mapDispatchToProps = dispatch => ({
  editMessage: _ => dispatch(editMessage(_)),
  setDialogs: _ => dispatch(setDialogs(_)),
  setDialog: _ => dispatch(setDialog(_)),
  setTaskReceivers: _ => dispatch(setTaskReceivers(_)),
  forwardMessage: _ => dispatch(forwardMessage(_)),
  replyMessage: _ => dispatch(replyMessage(_)),
  setCurrentRoomId: _ => dispatch(setCurrentRoomId(_)),
})
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Content)
