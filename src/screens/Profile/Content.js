import React, { Component } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native'
import styled from 'styled-components'
import { connect } from 'react-redux'
import {
  TaskIcon,
  GroupIcon,
  FilesRedIcon,
  GroupIconGrey,
} from '../../assets/index'
import Button from '../../common/Button'
import { setRoom } from '../../actions/messageActions'
import helper from '../../utils/helpers'
import ImageComponent from '../../common/Image'
import { socket } from '../../utils/socket'
import { setDialogs } from '../../actions/dialogsActions'
import DefaultAvatar from '../../common/DefaultAvatar'

const { sidePadding, Colors, HeaderHeight, fontSize } = helper
const { border, grey3, pink } = Colors
const Wrapper = styled(View)`
  padding-top: 0px;
  background: white;
  height: ${Dimensions.get('window').height - HeaderHeight - 20}px;
`
const User = styled(View)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-bottom: 20px;
  margin-bottom: 10px;
`
const UserInfo = styled(View)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 10px;
`
const UserName = styled(View)`
  display: flex;
  flex-direction: row;
  text-align: center;
  justify-content: center;
  margin-bottom: 10px;
`

const Name = styled(Text)`
  font-size: 15;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  text-align: center;
`

const Account = styled(Name)``

const UserStatus = styled(Name)`
  font-size: 11;
  color: #b9b9b9;
  margin-bottom: 10px;
`

const Info = styled(View)`
  padding: 0 ${sidePadding}px;
  flex: 1;
`
const Data = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  border: 1px solid ${border};
  padding: ${sidePadding}px 0;
  border-width: 0;
  border-top-width: 1px;
`
const Value = styled(Text)`
  font-size: 13px;
  min-width: 150px;
  text-align: left;
  flex: 2;
  display: flex;
  justify-content: flex-start;
`
const Type = styled(Value)`
  min-width: 110px;
  flex: 1;
  font-size: 13px;
`
const PersonalData = styled(View)`
  border: 1px solid #e6e6e6;
  border-width: 0;
`
const SendMessage = styled(Button)``
const StyledScrollView = styled(ScrollView)``
const Participants = styled(View)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  padding-right: 10px;
  flex-direction: row;
`
const ParticipantsItem = styled(Participants)`
  padding: 0;
`
const ParticipantsText = styled(Text)`
  color: ${grey3};
`
const LeaveGroup = styled(Text)`
  font-size: ${fontSize.sm};
  color: ${pink};
`
const BoxInnerItem = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
`
const ContactInfo = styled(View)`
  margin-left: 10px;
`

const ContactName = styled(Text)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`
const ContactRole = styled(Text)`
  color: #a7b0ba;
  display: flex;
  align-items: flex-start;
  justify-content: center;
`

class Content extends Component {
  render() {
    const { UserData, status } = this.state
    const { user, myProfile, currentDialog } = this.props

    const {
      _id,
      image,
      last_name,
      first_name,
      phone_number,
      isGroup,
      participants,
      name,
      creator,
      department,
    } = myProfile ? user : currentDialog
    const chatName = isGroup
      ? name
      : first_name
      ? `${first_name} ${last_name}`
      : phone_number
    const myGroup = creator && creator._id === user._id
    const sortedParticipants =
      creator && [...participants].sort((a, b) => b._id === creator._id)
    return (
      <Wrapper>
        <StyledScrollView>
          <User>
            {!image ||
            image === '/images/default_group.png' ||
            image === '/images/default_avatar.jpg' ? (
              <DefaultAvatar isGroup={isGroup} id={_id} size={80} />
            ) : (
              <ImageComponent
                size={80}
                source={{ uri: `https://testser.univ.team${image}` }}
                style={{
                  marginTop: 0,
                  marginBottom: 16,
                  marginRight: 10,
                  marginLeft: 10,
                }}
              />
            )}
            <UserInfo>
              <UserName>
                <Name>{chatName}</Name>
              </UserName>
              {department &&
              department.name &&
              department.name === 'Персональный' ? (
                <Account>Персональный режим</Account>
              ) : null}
              {!myProfile && !isGroup && <UserStatus>{status}</UserStatus>}
              {!myProfile && !isGroup && (
                <SendMessage onPress={this.toChat}>
                  Написать сообщение
                </SendMessage>
              )}
            </UserInfo>
          </User>
          {isGroup ? (
            <>
              <PersonalData>
                {UserData.map(
                  item =>
                    item &&
                    item.isGroup &&
                    (!myProfile || !item.icon) && (
                      <Info key={item._id}>
                        <Data>
                          <Type numberOfLines={1}>{item.type}</Type>
                          <Value>{item.value}</Value>
                          {item.icon && item.icon}
                        </Data>
                      </Info>
                    ),
                )}
              </PersonalData>
              <Participants>
                <ParticipantsItem>
                  <GroupIconGrey noPaddingAll />
                  <ParticipantsText>Участники</ParticipantsText>
                </ParticipantsItem>
                <ParticipantsItem>
                  {!myGroup && (
                    <TouchableOpacity onPress={this.leaveGroup}>
                      <LeaveGroup>ВЫЙТИ ИЗ ГРУППЫ</LeaveGroup>
                    </TouchableOpacity>
                  )}
                </ParticipantsItem>
              </Participants>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 10,
                }}
              >
                <BoxInnerItem>
                  {creator.image === '/images/default_avatar.jpg' ||
                  !creator.image ? (
                    <DefaultAvatar size={36} />
                  ) : (
                    <ImageComponent
                      size={36}
                      source={{
                        uri: `https://testser.univ.team${creator.image}`,
                      }}
                      style={{ marginRight: 8 }}
                    />
                  )}
                  <ContactInfo>
                    <ContactName>
                      {creator.first_name
                        ? `${creator.first_name} ${creator.last_name}`
                        : creator.phone_number}
                    </ContactName>
                    {creator.role && creator.role.name && (
                      <ContactRole>{creator.role.name}</ContactRole>
                    )}
                  </ContactInfo>
                </BoxInnerItem>
                <Text>admin</Text>
              </View>
              <FlatList
                style={{ paddingRight: 5, paddingLeft: 5 }}
                data={sortedParticipants}
                renderItem={({ item }) => {
                  const {
                    first_name,
                    last_name,
                    role,
                    image,
                    phone_number,
                  } = item
                  return (
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: 10,
                      }}
                    >
                      <BoxInnerItem>
                        {image === '/images/default_avatar.jpg' || !image ? (
                          <DefaultAvatar size={36} />
                        ) : (
                          <ImageComponent
                            size={36}
                            source={{
                              uri: `https://testser.univ.team${image}`,
                            }}
                            style={{ marginRight: 8 }}
                          />
                        )}
                        <ContactInfo>
                          <ContactName>
                            {first_name
                              ? `${first_name} ${last_name}`
                              : phone_number}
                          </ContactName>
                          {role && role.name && (
                            <ContactRole>{role.name}</ContactRole>
                          )}
                        </ContactInfo>
                      </BoxInnerItem>
                    </View>
                  )
                }}
                keyExtractor={item => item._id.toString()}
              />
            </>
          ) : (
            <PersonalData>
              {UserData.map(
                (item, index) =>
                  item &&
                  !item.isGroup &&
                  (!myProfile || !item.icon) && (
                    <Info key={index}>
                      <Data>
                        <Type numberOfLines={1}>{item.type}</Type>
                        <Value>
                          {item.value &&
                            (item.value.name ? item.value.name : item.value)}
                        </Value>
                        {item.icon && item.icon}
                      </Data>
                    </Info>
                  ),
              )}
            </PersonalData>
          )}
          <View style={{ height: 10 }} />
        </StyledScrollView>
      </Wrapper>
    )
  }

  state = {
    status: 'В сети',
    UserData: [],
  }

  componentDidMount() {
    const { myProfile, user, currentDialog } = this.props
    const { role, phone_number, department } = myProfile ? user : currentDialog
    const newUserData = [
      department && department.name !== 'Персональный'
        ? {
            type: 'Подразделение',
            value: department || 'без подразделения',
            isGroup: false,
          }
        : null,
      department && department.name !== 'Персональный'
        ? {
            type: 'Должность',
            value: role
              ? role.length
                ? role.name
                : 'без должности'
              : 'без должности',
            isGroup: false,
          }
        : null,
      { type: 'Телефон', value: phone_number || 'без номера', isGroup: false },
      !myProfile
        ? {
            type: 'Задачи',
            value: '4',
            icon: <TaskIcon />,
            isGroup: false,
          }
        : undefined,
      !myProfile
        ? {
            type: 'Общих групп',
            value: '32',
            icon: <GroupIcon />,
            isGroup: false,
          }
        : undefined,
      !myProfile
        ? {
            type: 'Пользователей',
            value: '4',
            icon: <GroupIcon />,
            isGroup: true,
          }
        : undefined,
      !myProfile
        ? {
            type: 'Задачи',
            value: '32',
            icon: <TaskIcon />,
            isGroup: true,
          }
        : undefined,
      !myProfile
        ? {
            type: 'Общих файлов',
            value: '10',
            icon: <FilesRedIcon />,
            isGroup: false,
          }
        : undefined,
      !myProfile
        ? {
            type: 'Общих файлов',
            value: '10',
            icon: <FilesRedIcon />,
            isGroup: true,
          }
        : undefined,
    ]
    this.setState({ UserData: newUserData })
  }

  toChat = () => {
    const { toChat, setRoom, user } = this.props
    const { id } = user
    socket.emit('select chat', { chatId: id, userId: id })
    setRoom(id)
    toChat()
  }

  leaveGroup = () => {
    const {
      // currentRoom,
      currentDialog,
      setDialogs,
      dialog,
      toDialogs,
    } = this.props
    const newDialogs = [...dialog].filter(e => e._id !== currentDialog._id)
    setDialogs(newDialogs)
    toDialogs()
  }
}

const mapStateToProps = state => ({
  messages: state.messageReducer,
  dialog: state.dialogsReducer.dialogs,
  currentRoom: state.messageReducer.currentRoom,
  currentChat: state.messageReducer.currentChat,
  currentDialog: state.dialogsReducer.currentDialog,
  user: state.userReducer.user,
})
const mapDispatchToProps = dispatch => ({
  // getMessages: _ => dispatch(getMessages(_)),
  setRoom: _ => dispatch(setRoom(_)),
  setDialogs: _ => dispatch(setDialogs(_)),
  // addMessage: _ => dispatch(addMessage(_)),
})
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Content)
