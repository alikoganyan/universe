/* eslint-disable array-callback-return */
import React, { Component } from 'react'
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import styled from 'styled-components'
import { connect } from 'react-redux'
import helper from '../../utils/helpers'
import { setUser } from '../../actions/userActions'
import Button from '../../common/Button'
// import { ImagePicker } from 'expo';
import getImageFromPicker from '../../utils/ImagePicker'
import { p_update_group, p_delete_group } from '../../constants/api'
import sendRequest from '../../utils/request'
import ImageComponent from '../../common/Image'
import DefaultAvatar from '../../common/DefaultAvatar'
import { GroupIcon, CloseIcon } from '../../assets'
import { setDialogParticipants } from '../../actions/participantsActions'
import { socket } from '../../utils/socket'

const { Colors, sidePadding } = helper
const { lightGrey1, black, green, red } = Colors
const Wrapper = styled(View)`
  padding: 0 ${sidePadding}px;
  justify-content: center;
  flex-grow: 1;
  height: 100%;
`

const StyledInput = styled(TextInput)`
  border: 1px solid ${lightGrey1};
  border-width: 0;
  border-bottom-width: 1px;
  padding-bottom: 10px;
  text-align: center;
  margin-bottom: 50px;
  ${({ style }) => style}
`
const ButtonBox = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
`
const Receivers = styled(View)`
  margin: 40px 0;
`
const Receiver = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin-top: 20px;
`
const ReceiverInfo = styled(View)`
  display: flex;
  justify-content: space-between;
  padding-left: 5px;
`
const Department = styled(Text)`
  color: ${lightGrey1};
`
const DialogsLabel = styled(View)`
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: flex-start;
  margin-top: 20px;
  margin-bottom: 20px;
`
const AddReceiver = styled(Text)`
  color: ${green};
`
const DeleteGroup = styled(Text)`
  color: ${red};
`
class Content extends Component {
  render() {
    const { text } = this.state
    const { participants } = this.props
    const ReceiverComponent = props => {
      const { children, last = false, onDelete } = props
      const { image, role, first_name, phone_number } = children
      return (
        <Receiver last={last}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            {image === '/images/default_avatar.jpg' || !image ? (
              <DefaultAvatar />
            ) : (
              <ImageComponent
                source={{ uri: `https://testser.univ.team${image}` }}
              />
            )}
            <View style={{ flex: 1 }}>
              <ReceiverInfo>
                <Text numberOfLines={1}>{first_name || phone_number}</Text>
                {role ? (
                  <Department numberOfLines={1}>{role.name}</Department>
                ) : null}
              </ReceiverInfo>
            </View>
            <CloseIcon onPress={onDelete} />
          </View>
        </Receiver>
      )
    }
    return (
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <Wrapper>
          <TouchableOpacity onPress={this.selectPhoto}>
            <DefaultAvatar
              isGroup
              style={{ alignSelf: 'center', marginBottom: 20 }}
              size={70}
            />
          </TouchableOpacity>
          <StyledInput
            password
            onChangeText={this.handleChange}
            value={text}
            placeholder="Новая группа"
            multiline
            style={{
              margin: 0,
              textAlign: 'left',
              paddingLeft: 10,
              maxHeight: 130,
            }}
          />
          <ButtonBox>
            <TouchableOpacity onPress={this.deleteGroup}>
              <DeleteGroup>Удалить группу</DeleteGroup>
            </TouchableOpacity>
            <Button onPress={this.proceed} background={green} color={black}>
              Сохранить
            </Button>
          </ButtonBox>
          <Receivers>
            <DialogsLabel>
              <TouchableOpacity
                onPress={this.addParticipant}
                style={{ flexDirection: 'row', alignItems: 'center' }}
              >
                <GroupIcon noPaddingAll right />
                <AddReceiver>Добавить участников</AddReceiver>
              </TouchableOpacity>
            </DialogsLabel>
            <ScrollView style={{ maxHeight: 300 }}>
              {participants.map((e, i) => (
                <ReceiverComponent
                  key={i}
                  onDelete={() => this.deleteParticipant(e)}
                  last={i === participants.length}
                >
                  {e}
                </ReceiverComponent>
              ))}
            </ScrollView>
          </Receivers>
        </Wrapper>
      </ScrollView>
    )
  }

  state = {
    text: '',
  }

  componentDidMount() {
    const { defaultValues, setParticipants } = this.props
    const { name, participants } = defaultValues
    this.setState({ text: name })
    setParticipants(participants)
  }

  deleteGroup = () => {
    const { defaultValues, setParticipants, forward } = this.props
    const { _id } = defaultValues
    sendRequest({
      r_path: p_delete_group,
      method: 'post',
      attr: {
        group_id: _id,
      },
      success: res => {
        setTimeout(() => socket.emit('get_dialogs'), 500)
        setParticipants([])
        forward()
      },
      failFunc: err => {
        alert(err.msg)
      },
    })
  }

  selectPhoto = async () => {
    // alert('temporary unavailable')

    getImageFromPicker(result => {
      const { uri, type } = result
      const ext = uri.split('.')[uri.split('.').length - 1]
      const fileName = Math.random()
        .toString(36)
        .substring(7)
      const form = new FormData()
      form.append('file', {
        uri,
        name: `photo.${fileName}.${ext}`,
        type: `image/${type}`,
      })
    })
  }

  deleteParticipant = e => {
    const { _id } = e
    const { participants, setParticipants } = this.props
    const newParticipants = [...participants].filter(e => e._id !== _id)
    setParticipants(newParticipants)
  }

  addParticipant = () => {
    const { addParticipant } = this.props
    addParticipant()
  }

  proceed = () => {
    const { participants, forward, setParticipants, defaultValues } = this.props
    const { name, _id } = defaultValues
    const { text } = this.state
    let idList = []
    participants.map(e => {
      idList = [...idList, e._id]
    })
    sendRequest({
      r_path: p_update_group,
      method: 'post',
      attr: {
        name: text || name,
        participants: idList,
        group_id: _id,
      },
      success: res => {
        setTimeout(() => socket.emit('get_dialogs'), 0)
        setParticipants([])
        forward()
      },
      failFunc: err => {},
    })
  }

  handleCountry = () => {}

  handleChange = e => {
    this.setState({ text: e })
  }
}
const mapStateToProps = state => ({
  id: state.userReducer.user.id,
  participants: state.participantsReducer.dialog.participants,
})
const mapDispatchToProps = dispatch => ({
  setUser: _ => dispatch(setUser(_)),
  setParticipants: _ => dispatch(setDialogParticipants(_)),
})
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Content)
