import React, { Component } from 'react'
import {
  View,
  Text,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  InteractionManager,
  Alert,
} from 'react-native'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { BottomSheet } from 'react-native-btr'
import moment from 'moment'
import 'moment/locale/ru'
import { chatBg } from '../../assets/images'
import helper from '../../utils/helpers'
import Message from '../../common/Message'
import ImagesViewer from '../../common/ImagesViewer'
import sendRequest from '../../utils/request'
import { setDialogs } from '../../actions/dialogsActions'
import { setTaskReceivers } from '../../actions/participantsActions'
import {
  editMessage,
  forwardMessage,
  replyMessage,
} from '../../actions/messageActions'
import { d_message } from '../../constants/api'

const { HeaderHeight, borderRadius } = helper
const Wrapper = styled(View)`
  background: white;
  margin-bottom: ${({ search }) => (search ? HeaderHeight * 2 : HeaderHeight)};
  z-index: 1;
  position: relative;
`
const MessageOptions = styled(View)`
  background: white;
  width: 94%;
  position: absolute;
  margin: 0 3%;
  padding: 30px 7% 0;
  bottom: 10px;
  border-radius: ${borderRadius};
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
  z-index: 9999;
`
const MessageOption = styled(TouchableOpacity)`
  padding-bottom: 30px;
  width: 100%;
`
const StyledFlatList = styled(FlatList)`
  padding-right: 5;
  padding-left: 5;
  z-index: 2;
`
const FlatListHeader = styled(View)`
  margin: ${({ editing }) => (editing ? 65 : 35)}px;
`
// const StyledImageBackground = styled(ImageBackground)`
const StyledImageBackground = styled(ImageBackground)`
  width: 100%;
  height: 100%;
`
const DateContainer = styled(View)`
  position: absolute;
  top: 65px;
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
      selectedMessage,
      optionsSelector,
      previewImages,
      previewImagesIndex,
      previewImagesIsVisible,
    } = this.state
    const { search, user, dialogs, currentChat, editedMessage } = this.props
    const dialog = [...dialogs].filter(e => e.room === currentChat)[0]
    const isEditing = !!editedMessage.text
    const messages = dialog ? [...dialog.messages] : []
    const reversedMessages = [...messages]
      .reverse()
      .sort((x, y) => new Date(y.created_at) - new Date(x.created_at))

    return (
      <>
        <Wrapper search={search}>
          <StyledImageBackground source={chatBg}>
            <StyledFlatList
              ListHeaderComponent={<FlatListHeader editing={isEditing} />}
              inverted
              data={reversedMessages}
              initialNumToRender={15}
              keyboardDismissMode="on-drag"
              animated
              onViewableItemsChanged={this.onViewableItemsChanged}
              viewabilityConfig={{
                itemVisiblePercentThreshold: 50,
              }}
              renderItem={({ item, index }) => (
                <Message
                  key={index}
                  item={item}
                  onLongPressMessage={() => this._onLongPressMessage(item)}
                  onPressMessage={() => this._onPressMessage(item)}
                />
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          </StyledImageBackground>
        </Wrapper>
        <ImagesViewer
          isVisible={previewImagesIsVisible}
          images={previewImages}
          index={previewImagesIndex}
          onClose={this._onCLosePreviewImages}
        />
        <BottomSheet
          visible={optionsSelector}
          onBackButtonPress={this.unselect}
          onBackdropPress={this.unselect}
        >
          <MessageOptions>
            {selectedMessage._id && selectedMessage.sender._id === user._id ? (
              <MessageOption onPress={this.turnToTask}>
                <Text>Сделать задачей</Text>
              </MessageOption>
            ) : (
              <MessageOption onPress={() => this.replyMessage(selectedMessage)}>
                <Text>Ответить</Text>
              </MessageOption>
            )}
            <MessageOption onPress={() => this.forwardMessage(selectedMessage)}>
              <Text>Переслать</Text>
            </MessageOption>
            {selectedMessage._id && selectedMessage.sender._id === user._id && (
              <>
                <MessageOption
                  onPress={() => this.editMessage(selectedMessage)}
                >
                  <Text>Редактировать</Text>
                </MessageOption>
                {selectedMessage.type === 'image' && (
                  <MessageOption>
                    <Text>Сохранить</Text>
                  </MessageOption>
                )}
                <MessageOption onPress={this.messageDeleteConfirmation}>
                  <Text>Удалить</Text>
                </MessageOption>
              </>
            )}
            <MessageOption onPress={this.unselect}>
              <Text>Отменить</Text>
            </MessageOption>
          </MessageOptions>
        </BottomSheet>
        <DateContainer>
          <DateView>
            <Text>{this.getMessageDate()}</Text>
          </DateView>
        </DateContainer>
      </>
    )
  }

  state = {
    selectedMessage: {},
    animationCompleted: false,
    optionsSelector: false,
    previewImages: [],
    previewImagesIndex: 0,
    previewImagesIsVisible: false,
    currentDate: '',
  }

  componentDidMount() {
    moment.locale('ru')
    const { dialogs, currentDialog, setDialogs, user } = this.props
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        animationCompleted: true,
      })
    })
    const dialog = dialogs.filter(
      dialog =>
        dialog.participants[0]._id === currentDialog._id ||
        dialog.creator._id === currentDialog._id,
    )[0]
    if (dialog) {
      const dialogIndex = dialogs.findIndex(
        dialog =>
          dialog.participants[0]._id === currentDialog._id ||
          dialog.creator._id === currentDialog._id,
      )
      const messages = [...dialog.messages].map(message => ({
        ...message,
        viewers: [...message.viewers, user._id],
      }))
      const newDialogs = [...dialogs]
      newDialogs[dialogIndex].messages = messages
      setDialogs(newDialogs)
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
      const [date] = item.item.created_at.split('T')
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

  turnToTask = () => {
    const { navigate, setTaskReceivers, currentDialog } = this.props
    const { selectedMessage } = this.state
    setTaskReceivers([currentDialog])
    const { text } = selectedMessage
    const task = {
      text,
    }
    navigate({ routeName: 'NewTask', params: task })
    this.unselect()
  }

  messageDeleteConfirmation = () => {
    Alert.alert('Внимание', 'Вы уверены что хотите удалить сообщение', [
      { text: 'Нет' },
      { text: 'Да', onPress: this.deleteMessage },
    ])
  }

  deleteMessage = () => {
    const { dialogs, setDialogs, currentChat, currentRoomId } = this.props
    const { selectedMessage } = this.state
    // console.log({
    //   r_path: d_message,
    //   method: 'delete',
    //   attr: {
    //     dialog_id: currentRoomId,
    //     messages: [selectedMessage._id],
    //   },
    // })
    sendRequest({
      r_path: d_message,
      method: 'delete',
      attr: {
        dialog_id: currentRoomId,
        messages: [selectedMessage._id],
      },
      success: res => {
        // console.log(res)
      },
      failFunc: err => {
        // console.log(err)
      },
    })
    const dialog = dialogs.filter(dialog => dialog.room === currentChat)[0]
    const dialogIndex = dialogs.findIndex(dialog => dialog.room === currentChat)
    dialog.messages = dialog.messages.filter(
      message => message._id !== selectedMessage._id,
    )
    const newDialogs = [...dialogs]
    newDialogs[dialogIndex] = dialog
    setDialogs(newDialogs)
    this.unselect()
  }

  unselect = () => {
    this.setState({ selectedMessage: {}, optionsSelector: false })
  }

  _onPressMessage = item => {
    const { navigate, dialogs, currentChat } = this.props
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
              uri: `https://ser.univ.team${src}`,
            },
          })
        break
      case 'image':
        {
          const dialog = dialogs.filter(
            dialog => dialog.room === currentChat,
          )[0]
          const dialogMessages = dialog.messages || []
          let dialogImages = []
          let imageIndex = 0
          dialogMessages.forEach(message => {
            if (message.type === 'image') {
              dialogImages.push(`https://ser.univ.team${message.src}`)
              if (message._id === _id) {
                imageIndex = dialogImages.length - 1
              }
            }
          })
          this.setState({
            previewImages: dialogImages,
            previewImagesIndex: imageIndex,
            previewImagesIsVisible: true,
          })
        }
        break

      default:
        break
    }
  }

  _onLongPressMessage = item => {
    this.setState({ optionsSelector: true, selectedMessage: item }, () => {
      // ActionSheetIOS.showActionSheetWithOptions(
      //   {
      //     options: [
      //       'Отменить',
      //       'Ответить',
      //       'Копировать',
      //       'Изменить',
      //       'Удалить',
      //     ],
      //     cancelButtonIndex: 0,
      //   },
      //   buttonIndex => {
      //     if (buttonIndex === 1) {
      //       /* destructive action */
      //     }
      //   },
      // )
    })
  }

  _onCLosePreviewImages = () => {
    this.setState({
      previewImages: [],
      previewImagesIndex: 0,
      previewImagesIsVisible: false,
    })
  }

  editMessage = message => {
    const { editMessage } = this.props
    this.unselect()
    editMessage({ ...message })
  }

  forwardMessage = message => {
    const { forwardMessage, goBack } = this.props
    this.unselect()
    forwardMessage(message)
    goBack()
  }

  replyMessage = message => {
    const { replyMessage } = this.props
    this.unselect()
    replyMessage(message)
  }
}

const mapStateToProps = state => ({
  search: state.messageReducer.search,
  currentChat: state.messageReducer.currentChat,
  editedMessage: state.messageReducer.editMessage,
  currentRoomId: state.messageReducer.currentRoomId,
  user: state.userReducer.user,
  dialogs: state.dialogsReducer.dialogs,
  currentDialog: state.dialogsReducer.currentDialog,
})
const mapDispatchToProps = dispatch => ({
  editMessage: _ => dispatch(editMessage(_)),
  setDialogs: _ => dispatch(setDialogs(_)),
  setTaskReceivers: _ => dispatch(setTaskReceivers(_)),
  forwardMessage: _ => dispatch(forwardMessage(_)),
  replyMessage: _ => dispatch(replyMessage(_)),
})
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Content)
