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
import Message from '../../common/Message'
import helper from '../../utils/helpers'
import { chatBg } from '../../assets/images'
import { setTaskReceivers } from '../../actions/participantsActions'
import {
  editMessage,
  forwardMessage,
  replyMessage,
} from '../../actions/messageActions'
import { setDialogs } from '../../actions/dialogsActions'
import { d_message } from '../../constants/api'
import sendRequest from '../../utils/request'

const { HeaderHeight, borderRadius } = helper
const Wrapper = styled(View)`
  background: white;
  margin-bottom: ${({ search }) => (search ? HeaderHeight * 2 : HeaderHeight)};
  z-index: 1;
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
`
const FlatListHeader = styled(View)`
  margin: ${({ editing }) => (editing ? 65 : 35)}px;
`

// const StyledImageBackground = styled(ImageBackground)`
const StyledImageBackground = styled(ImageBackground)`
  width: 100%;
  height: 100%;
`
class Content extends Component {
  render() {
    const { selectedMessage, animationCompleted } = this.state
    const { dialogs, currentChat, search, user, editedMessage } = this.props
    const dialog = [...dialogs].filter(e => e.room === currentChat)[0]
    const messages = dialog ? [...dialog.messages] : []
    const isEditing = !!editedMessage.text
    const reversedMessages = [...messages].sort(
      (x, y) => new Date(y.created_at) - new Date(x.created_at),
    )
    return (
      <>
        <Wrapper search={search}>
          <StyledImageBackground source={chatBg}>
            {animationCompleted ? (
              <FlatList
                style={{ paddingRight: 5, paddingLeft: 5, zIndex: 2 }}
                ListHeaderComponent={<FlatListHeader editing={isEditing} />}
                inverted
                data={reversedMessages}
                keyboardDismissMode="on-drag"
                initialNumToRender={10}
                animated
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    key={index}
                    onLongPress={() => this.handleHold(item)}
                  >
                    <Message withImage read={!!item.viewers.length} isGroup>
                      {item}
                    </Message>
                  </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
            ) : null}
          </StyledImageBackground>
        </Wrapper>
        <BottomSheet
          visible={selectedMessage._id}
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
      </>
    )
  }

  state = {
    selectedMessage: {},
    animationCompleted: false,
  }

  componentDidMount() {
    const { dialogs, currentChat, setDialogs, user } = this.props
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        animationCompleted: true,
      })
    })
    const dialog = [...dialogs].filter(e => e.room === currentChat)[0]
    if (dialog) {
      const dialogIndex = [...dialogs].filter(e => e.room === currentChat)
      const newDialogs = [...dialogs]
      dialog.messages = dialog
        ? [...dialog.messages].map(e => ({
            ...e,
            viewers: [...e.viewers, user._id],
          }))
        : []
      newDialogs[dialogIndex] = dialog
      setDialogs(newDialogs)
    }
  }

  editMessage = message => {
    const { editMessage } = this.props
    this.unselect()
    editMessage({ ...message })
  }

  turnToTask = () => {
    const { navigate } = this.props
    const { selectedMessage } = this.state
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
    const dialog = dialogs.filter(dialog => dialog.room === currentChat)[0]
    const dialogIndex = dialogs.findIndex(dialog => dialog.room === currentChat)
    dialog.messages = dialog.messages.filter(
      message => message._id !== selectedMessage._id,
    )
    const newDialogs = [...dialogs]
    newDialogs[dialogIndex] = dialog
    setDialogs(newDialogs)
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
    this.unselect()
  }

  unselect = () => {
    this.setState({ selectedMessage: {} })
  }

  handleHold = e => {
    this.setState({ selectedMessage: e })
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
  dialogs: state.dialogsReducer.dialogs,
  search: state.messageReducer.search,
  currentRoom: state.messageReducer.currentRoom,
  editedMessage: state.messageReducer.editMessage,
  currentDialog: state.dialogsReducer.currentDialog,
  currentChat: state.messageReducer.currentChat,
  currentRoomId: state.messageReducer.currentRoomId,
  user: state.userReducer.user,
})
const mapDispatchToProps = dispatch => ({
  editMessage: _ => dispatch(editMessage(_)),
  setTaskReceivers: _ => dispatch(setTaskReceivers(_)),
  setDialogs: _ => dispatch(setDialogs(_)),
  forwardMessage: _ => dispatch(forwardMessage(_)),
  replyMessage: _ => dispatch(replyMessage(_)),
})
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Content)
