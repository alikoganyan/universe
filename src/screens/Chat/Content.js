import React, { Component } from 'react'
import RNFetchBlob from 'rn-fetch-blob'

import {
  View,
  Text,
  FlatList,
  ImageBackground,
  InteractionManager,
  Alert,
  Clipboard,
  TouchableOpacity,
  Platform,
} from 'react-native'

import Image from 'react-native-image-progress'

import styled from 'styled-components'
import { connect } from 'react-redux'
import ActionSheet from 'react-native-actionsheet'
import moment from 'moment'
import 'moment/locale/ru'
import { chatBg } from '../../assets/images'
import helper, { getHamsterDate } from '../../utils/helpers'
import Message from '../../common/Message'
import sendRequest from '../../utils/request'
import { setDialogs, setDialog } from '../../actions/dialogsActions'
import { setTaskReceivers } from '../../actions/participantsActions'
import {
  editMessage,
  forwardMessage,
  getEditedMessage,
  removePreloader,
  replyMessage,
  setCurrentRoomId,
} from '../../actions/messageActions'
import { d_message } from '../../constants/api'
import _ from 'lodash'
import * as ICONS from '../../assets/icons'
import Loader from '../../common/Loader'
import RNPermissions from 'react-native-permissions'

const {
  Colors: { gray2 },
} = helper
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
      page,
      totalPages,
      hideDate,
    } = this.state
    const {
      search,
      editedMessage,
      currentRoomId,
      uploadMessages,
      dialog,
      editedMessage2,
    } = this.props

    let { messages } = this.props

    if (!messages.length && Object.keys(dialog).length) {
      this.props.setMessages(dialog.messages)
    }
    if (messages && messages.length) {
      messages = messages.filter(m => m.type !== 'loader')
      messages = messages.concat(
        uploadMessages.filter(m => m.roomId === currentRoomId),
      )
      if (uploadMessages.length) {
        messages.push(...uploadMessages.filter(m => m.roomId === currentRoomId))
      }
      if (editedMessage2) {
        const messageIndex = messages.findIndex(
          m => m._id === editedMessage2._id,
        )
        messages[messageIndex].text = editedMessage2.text
        this.props.setMessages(messages)
        this.props.setEditedMessage(null)
      }
    }

    const isEditing = !!editedMessage.text
    const currentMessages = scrolledMessages.length
      ? scrolledMessages
      : messages

    let reversedMessages = [...currentMessages].sort(
      (x, y) => new Date(y.created_at) - new Date(x.created_at),
    )

    reversedMessages = _.uniqBy(reversedMessages, '_id')

    let previousDate
    reversedMessages.forEach((m, index) => {
      if (
        previousDate &&
        previousDate !==
          `${
            this.getDayOfMonth[new Date(m.created_at).getMonth() + 1]
          } ${new Date(m.created_at).getDate()}`
      ) {
        reversedMessages.splice(index, 0, {
          type: 'date',
          date: previousDate,
        })
      }
      previousDate = `${
        this.getDayOfMonth[new Date(m.created_at).getMonth() + 1]
      } ${new Date(m.created_at).getDate()}`
    })

    if (
      page === totalPages &&
      reversedMessages[reversedMessages.length - 1].type !== 'date'
    ) {
      reversedMessages.splice(reversedMessages.length, 0, {
        type: 'date',
        date: `${
          this.getDayOfMonth[
            new Date(
              reversedMessages[reversedMessages.length - 1].created_at,
            ).getMonth() + 1
          ]
        } ${new Date(
          reversedMessages[reversedMessages.length - 1].created_at,
        ).getDate()}`,
      })
    }

    return (
      <>
        <Wrapper search={search}>
          <StyledImageBackground source={chatBg}>
            <StyledFlatList
              onScroll={this.checkScrollPosition}
              onMomentumScrollBegin={this.showDate}
              onMomentumScrollEnd={this.hideDate}
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
                  selected={selectedMessages === item._id}
                  key={index}
                  item={item}
                  onLongPressMessage={() => this._onLongPressMessage(item)}
                  onPressMessage={() => this._onPressMessage(item)}
                />
              )}
              keyExtractor={(item, index) => index.toString()}
              ListEmptyComponent={this.renderEmptyComponent}
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
        {!!currentDate && hideDate && (
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
    hideDate: false,
  }

  componentDidMount() {
    moment.locale('ru')
    const { navigation, dialog } = this.props
    const { messages_from_pages } = dialog

    if (Object.keys(dialog).length) {
      const messages = dialog.messages
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
  }

  componentWillReceiveProps(nextProps) {
    const { removePreloader, currentRoomId } = this.props
    let { messages } = this.props
    if (nextProps.message._id !== this.props.message._id) {
      messages.push(nextProps.message)
      this.props.setMessages(messages)
      if (nextProps.message.type === 'geo') {
        removePreloader({
          roomId: currentRoomId,
          geo: true,
        })
      }
    }
    if (
      nextProps.deleteMessage.message_id !== this.props.deleteMessage.message_id
    ) {
      messages = messages.filter(
        m => m._id !== nextProps.deleteMessage.message_id,
      )
      this.props.setMessages(messages)
    }
  }

  componentWillUnmount() {
    this.props.setDialog({})
  }

  toggleDate = null

  showDate = () => {
    if (this.toggleDate) {
      clearTimeout(this.toggleDate)
    }
    this.setState({ hideDate: true })
  }
  hideDate = () => {
    this.toggleDate = setTimeout(() => {
      this.setState({ hideDate: false })
      this.toggleDate = null
    }, 300)
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

  renderEmptyComponent = () => (
    <Loader
      hint="Пока нет сообщений в диалоге."
      style={{ flex: 1, height: '100%' }}
    >
      <TouchableOpacity onPress={this.toContacts}>
        <Text style={{ color: gray2, textAlign: 'center' }}>
          Начните общение, отправив сообщение
        </Text>
      </TouchableOpacity>
    </Loader>
  )

  checkScrollPosition = event => {
    const {
      lastPosition,
      switcherDown,
      prevPage,
      scrolledMessages,
    } = this.state
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
      event.nativeEvent.contentOffset.y < 600 &&
      scrolledMessages.length
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
    let { messages } = this.props
    messages = _.uniqBy(messages, '_id')

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

  download = async item => {
    let status
    await RNPermissions.check('storage').then(async response => {
      status = response
      if (response !== 'authorized') {
        await RNPermissions.request('storage').then(response => {
          status = response
        })
      }
      if (status !== 'authorized') {
        if (Platform.OS === 'ios') {
          if (RNPermissions.canOpenSettings()) {
            Alert.alert(
              'Ошибка',
              'Для загрузки файла необходимо разрешить приложению доступ к соответствующим разделам в настройках',
              [
                { text: 'ОК', onPress: () => {} },
                {
                  text: 'Настройки',
                  onPress: () => {
                    RNPermissions.openSettings()
                  },
                },
              ],
            )
          } else {
            Alert.alert(
              'Ошибка',
              'Для загрузки файла необходимо разрешить приложению доступ к соответствующим разделам',
            )
          }
        } else {
          Alert.alert(
            'Ошибка',
            'Для загрузки файла необходимо разрешить приложению доступ к соответствующим разделам',
          )
        }
      } else {
        try {
          let url = `https://seruniverse.asmo.media${item.src}`
          let fileName = item.filename
          let date = new Date()
          let ext = this.extention(url)
          ext = `.${ext[0]}`
          const { config, fs } = RNFetchBlob
          let PictureDir = fs.dirs.PictureDir
          let options = {
            fileCache: true,
            addAndroidDownloads: {
              title: fileName,
              useDownloadManager: true,
              notification: true,
              path: `${PictureDir}/${Math.floor(
                date.getTime() + date.getSeconds() / 2,
              )}${ext}`,
              description: fileName,
            },
          }
          config(options)
            .fetch('GET', url)
            .then(res => {
              Alert.alert('Успешно сохранено')
            })
        } catch (error) {
          Alert.alert(
            'Что то пошло не так',
            error.message ? String(error.message) : String(error),
          )
        }
      }
    })
  }

  extention = filename => {
    return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined
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

  getDayOfMonth = {
    1: 'Январь',
    2: 'Февраль',
    3: 'Март',
    4: 'Апрель',
    5: 'Май',
    6: 'Июнь',
    7: 'Июль',
    8: 'Август',
    9: 'Сентябрь',
    10: 'Октябрь',
    11: 'Ноябрь',
    12: 'Декабрь',
  }

  onViewableItemsChanged = ({ viewableItems, changed }) => {
    const { currentDate } = this.state
    const item = viewableItems[viewableItems.length - 1]
    if (item && item.item && item.item.type !== 'date') {
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
    const { currentRoomId } = this.props
    let { messages } = this.props
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
    messages = messages.filter(message => message._id !== currentMessage._id)
    this.props.setMessages(messages)
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

    const {
      navigate,
      currentDialog,
      onShowPreviewImages,
      messages,
    } = this.props
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
          const dialogMessages = messages || []
          let dialogImages = []
          let imageIndex = 0
          if (dialogMessages && dialogMessages.length) {
            dialogMessages.forEach(message => {
              if (message.type === 'image') {
                dialogImages.push({
                  image: `https://seruniverse.asmo.media${message.src}`,
                  title: first_name
                    ? `${first_name} ${last_name}`
                    : phone_number,
                  description: getHamsterDate(message.created_at),
                  actions: this._getMessageActions(message).slice(0, -1),
                })
                if (message._id === _id) {
                  imageIndex = dialogImages.length - 1
                }
              }
            })
          }
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

    if (
      message._id &&
      (message.type === 'file' ||
        message.type === 'video' ||
        message.type === 'image')
    ) {
      actions.push({
        title: 'Сохранить',
        action: () => {
          this.download(message)
        },
      })
    }
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
  editedMessage2: state.messageReducer.editedMessage,
  replyMessage: state.messageReducer.replyMessage,
  uploadMessages: state.messageReducer.uploadMessages,
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
  removePreloader: _ => dispatch(removePreloader(_)),
  setDialog: _ => dispatch(setDialog(_)),
  setTaskReceivers: _ => dispatch(setTaskReceivers(_)),
  forwardMessage: _ => dispatch(forwardMessage(_)),
  replyMessage: _ => dispatch(replyMessage(_)),
  setCurrentRoomId: _ => dispatch(setCurrentRoomId(_)),
  setEditedMessage: _ => dispatch(getEditedMessage(_)),
})
export default connect(mapStateToProps, mapDispatchToProps)(Content)
