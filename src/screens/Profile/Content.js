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
import {
  setCurrentChat,
  setCurrentRoomId,
  setRoom,
} from '../../actions/messageActions'
import helper from '../../utils/helpers'
import ImageComponent from '../../common/Image'
import { socket } from '../../utils/socket'
import {
  setCurrentDialogs,
  setDialogs,
  setDialog,
} from '../../actions/dialogsActions'
import DefaultAvatar from '../../common/DefaultAvatar'
import { setIsMyProfile, setProfile } from '../../actions/profileAction'

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
const BoxInnerItem = styled(TouchableOpacity)`
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
    const months = [
      'Января',
      'Февраля',
      'Марта',
      'Апреля',
      'Мая',
      'Июня',
      'Июля',
      'Августа',
      'Сентября',
      'Октябрь',
      'Ноября',
      'Декабря',
    ]
    const { UserData } = this.state
    const { user, myProfile, currentDialog, profile } = this.props
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
    } = myProfile ? user : profile

    const { last_visit } = profile | user

    const lastVisit = new Date(last_visit)
    const lastVisitDay = Math.floor(lastVisit.getTime() / 1000 / 60 / 60 / 24)
    const day = Math.floor(new Date().getTime() / 1000 / 60 / 60 / 24)
    const lastVisitDifference = Math.abs(new Date() - lastVisit) / 60000
    const minutes =
      lastVisit.getMinutes() >= 10
        ? lastVisit.getMinutes()
        : `0${lastVisit.getMinutes()}`
    const hours =
      lastVisit.getHours() >= 10
        ? lastVisit.getHours()
        : `0${lastVisit.getHours()}`
    const date =
      lastVisit.getDate() >= 10
        ? lastVisit.getDate()
        : `0${lastVisit.getDate()}`
    const month = months[lastVisit.getMonth()]
    const lastSeenDate =
      day - lastVisitDay === 1
        ? `был вчера ${hours}:${minutes}`
        : last_visit
        ? lastVisitDifference < 5
          ? 'был недавно'
          : lastVisitDifference < 60
          ? 'был в течении часа'
          : lastVisitDifference < 1440
          ? `был онлайн в ${hours}:${minutes}`
          : `был онлайн ${date} ${month}`
        : 'неизвестно'

    const userName = name
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
                source={{ uri: `https://seruniverse.asmo.media${image}` }}
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
                <Name>{userName}</Name>
              </UserName>
              {department &&
              department.name &&
              department.name === 'Персональный' ? (
                <Account>Персональный режим</Account>
              ) : null}
              {!myProfile && !isGroup && (
                <UserStatus>{lastSeenDate}</UserStatus>
              )}
              {!myProfile && !isGroup && (
                <SendMessage
                  onPress={() => {
                    this.toChat()
                  }}
                >
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
                <BoxInnerItem
                  // style={}
                  onPress={() =>
                    this.props.toSenderProfile(creator, currentDialog)
                  }
                >
                  {creator.image === '/images/default_avatar.jpg' ||
                  !creator.image ? (
                    <DefaultAvatar size={36} />
                  ) : (
                    <ImageComponent
                      size={36}
                      source={{
                        uri: `https://seruniverse.asmo.media${creator.image}`,
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
                      <BoxInnerItem
                        onPress={() =>
                          this.props.toSenderProfile(item, currentDialog)
                        }
                      >
                        {image === '/images/default_avatar.jpg' || !image ? (
                          <DefaultAvatar size={36} />
                        ) : (
                          <ImageComponent
                            size={36}
                            source={{
                              uri: `https://seruniverse.asmo.media${image}`,
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
    const { myProfile, user, profile } = this.props

    this.createUserInfo(myProfile ? user : profile)
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const { myProfile } = this.props
    if (myProfile && nextProps.user.email !== this.props.user.email) {
      this.createUserInfo(nextProps.user)
    }
  }

  componentWillUnmount() {}

  createUserInfo = profile => {
    const { myProfile } = this.props
    const {
      role,
      phone_number,
      email,
      department,
      tasks,
      isGroup,
      participants,
    } = profile

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
      { type: 'Электронная почта', value: email || '', isGroup: false },
      !myProfile && !isGroup
        ? {
            type: 'Задачи',
            value: tasks && tasks.length ? tasks.length : 0,
            icon: <TaskIcon />,
            isGroup: false,
          }
        : null,
      !myProfile
        ? {
            type: 'Общих групп',
            value: '32',
            icon: <GroupIcon />,
            isGroup: false,
          }
        : null,
      !myProfile
        ? {
            type: 'Пользователей',
            value:
              participants && participants.length && participants.length + 1,
            icon: <GroupIcon />,
            isGroup: true,
          }
        : null,
      !myProfile
        ? {
            type: 'Общих файлов',
            value: '10',
            icon: <FilesRedIcon />,
            isGroup: false,
          }
        : null,
      !myProfile
        ? {
            type: 'Общих файлов',
            value: '10',
            icon: <FilesRedIcon />,
            isGroup: true,
          }
        : null,
    ]
    this.setState({ UserData: newUserData })
  }

  toChat = () => {
    const {
      dialogs,
      profile,
      setRoom,
      setCurrentRoomId,
      setCurrentChat,
      setCurrentDialogs,
      user,
      navigate,
      setDialog,
    } = this.props
    const currentDialog = dialogs.find(
      dialog =>
        !dialog.isGroup &&
        ((dialog.creator._id && dialog.creator._id === profile._id) ||
          (dialog.participants[0] &&
            dialog.participants[0]._id === profile._id)),
    )
    setDialog(currentDialog)
    if (currentDialog) {
      const { participants, creator, room, _id } = currentDialog
      const cDialog =
        user._id === creator._id ? { ...participants[0] } : { ...creator }
      setRoom(profile._id)
      setCurrentRoomId(_id)
      setCurrentChat(room)
      setCurrentDialogs(cDialog)
      socket.emit('view', { room, viewer: user._id })
    } else {
      const { _id } = profile
      setRoom(_id)
      // setCurrentDialogs(profile)
    }
    navigate('Chat')
  }

  leaveGroup = () => {
    const { dialog, toDialogs, dialogs, setDialogs } = this.props

    socket.emit('leave_group', { dialog_id: dialog._id }, res => {
      if (res.ok) {
        const newDialogs = [...dialogs].filter(e => e._id !== dialog._id)
        setDialogs(newDialogs)
        toDialogs()
      }
    })
  }
}

const mapStateToProps = state => ({
  messages: state.messageReducer,
  dialog: state.dialogsReducer.dialog,
  dialogs: state.dialogsReducer.dialogs,
  currentRoom: state.messageReducer.currentRoom,
  currentChat: state.messageReducer.currentChat,
  currentDialog: state.dialogsReducer.currentDialog,
  user: state.userReducer.user,
  profile: state.profileReducer.profile,
})
const mapDispatchToProps = dispatch => ({
  setProfile: _ => dispatch(setProfile(_)),
  setIsMyProfile: _ => dispatch(setIsMyProfile(_)),
  setRoom: _ => dispatch(setRoom(_)),
  setDialogs: _ => dispatch(setDialogs(_)),
  setCurrentRoomId: _ => dispatch(setCurrentRoomId(_)),
  setCurrentChat: _ => dispatch(setCurrentChat(_)),
  setCurrentDialogs: _ => dispatch(setCurrentDialogs(_)),
  setDialog: _ => dispatch(setDialog(_)),
})
export default connect(mapStateToProps, mapDispatchToProps)(Content)
