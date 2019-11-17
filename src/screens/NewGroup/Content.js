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
import ImageComponent from '../../common/Image'
import DefaultAvatar from '../../common/DefaultAvatar'
import { GroupIcon, CloseIcon } from '../../assets'
import { setDialogParticipants } from '../../actions/participantsActions'
import { socket } from '../../utils/socket'

const { Colors, sidePadding } = helper
const { lightGrey1, black, green } = Colors
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
const DialogsLabelText = styled(Text)`
  margin-left: 5px;
`
class Content extends Component {
  render() {
    const { text } = this.state
    const { participants } = this.props
    const ReceiverComponent = props => {
      const { children, last = false, onDelete } = props
      const { image, role, first_name, _id, phone_number } = children
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
              <DefaultAvatar id={_id} />
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
            <TouchableOpacity onPress={this.addParticipant}>
              <AddReceiver>Добавить</AddReceiver>
            </TouchableOpacity>
            <Button
              disabled={!participants.length || !text}
              onPress={this.proceed}
              background={green}
              color={black}
            >
              Сохранить
            </Button>
          </ButtonBox>
          <Receivers>
            <DialogsLabel>
              <GroupIcon />
              <DialogsLabelText>Участники</DialogsLabelText>
            </DialogsLabel>
            {participants.map((e, i) => (
              <ReceiverComponent
                key={i}
                onDelete={() => this.deleteParticipant(e)}
                last={i === participants.length - 1}
              >
                {e}
              </ReceiverComponent>
            ))}
          </Receivers>
        </Wrapper>
      </ScrollView>
    )
  }

  state = {
    text: '',
    image: null,
  }

  componentDidMount() {}

  selectPhoto = async e => {
    alert('temporary unavailable')
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

  proceed = e => {
    const { participants, forward, setParticipants } = this.props
    const { text } = this.state
    let idList = []
    participants.map(e => (idList = [...idList, e._id]))
    setParticipants([])
    socket.emit('new_group', { name: text, participants: idList })
    setTimeout(() => socket.emit('get_dialogs'), 500)
    forward()
  }

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
