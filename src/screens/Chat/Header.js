import React, { Component } from 'react'
import {
  View,
  Text,
  TextInput,
  Image,
  Platform,
  Dimensions,
  TouchableOpacity,
} from 'react-native'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Icon from 'react-native-vector-icons/FontAwesome'
import {
  BackIcon,
  LocationIcon,
  SearchIcon,
  CloseIcon,
} from '../../assets/index'
import helper from '../../utils/helpers'
import sendRequest from '../../utils/request'
import { p_search_messages } from '../../constants/api'
import {
  addMessage,
  startSearch,
  stopSearch,
  getMessages,
} from '../../actions/messageActions'
import ImageComponent from '../../common/Image'
import DefaultAvatar from '../../common/DefaultAvatar'

const {
  sidePadding,
  HeaderHeight,
  HeaderHeightInner,
  Colors,
  fontSize,
} = helper
const { border } = Colors

const Input = styled(TextInput)`
  flex: 1;
  padding-left: 10px;
`
const Header = styled(View)`
  width: ${Dimensions.get('window').width - sidePadding * 2}px;
  align-self: center;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`
const Info = styled(View)`
  display: flex;
  margin-left: 10px;
`
const InfoChatName = styled(Text)`
  color: black;
  font-size: ${fontSize.chatHeaderName};
`
const InfoParticipants = styled(Text)`
  color: #5f7991;
  font-size: ${fontSize.sm};
`
const Left = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  max-width: 200px;
`
const Right = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: flex-end;
  flex: 1;
  margin-left: ${sidePadding}px;
`
const Categories = styled(Header)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  width: ${Dimensions.get('window').width - sidePadding * 2}px;
`
const Top = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: ${HeaderHeight};
  width: 100%;
`
const Bottom = styled(Top)`
  border: 1px solid ${border};
  border-width: 0;
  border-top-width: 1px;
  margin: 0 ${sidePadding}px;
  min-height: 0;
  width: ${Dimensions.get('window').width - sidePadding * 2}px;
`
const Category = styled(Text)`
  display: flex;
  flex: 1;
  justify-content: center;
  font-size: 11px;
  text-align: center;
  padding: 10px 0;
`
const ToProfile = styled(TouchableOpacity)`
  display: flex;
  flex-direction: row;
  margin-right: 20px;
`

class HeaderComponent extends Component {
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
      'Ноября',
      'Декабря',
    ]
    const { back, search, startSearch, stopSearch, currentDialog } = this.props
    const {
      first_name,
      last_name,
      phone_number,
      image,
      _id,
      last_visit,
    } = currentDialog
    const lastVisit = new Date(last_visit)
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
    const lastSeenDate = last_visit
      ? lastVisitDifference < 5
        ? 'был недавно'
        : lastVisitDifference < 60
        ? 'был в течении часа'
        : lastVisitDifference < 1440
        ? `был онлайн в ${hours}:${minutes}`
        : `был онлайн ${date} ${month}`
      : 'неизвестно'
    return (
      <Header>
        <Top>
          <Left>
            {!search ? (
              <>
                <BackIcon onPress={back} right />
                <ToProfile onPress={this.toProfile}>
                  {!image ||
                  image === '/images/default_group.png' ||
                  image === '/images/default_avatar.jpg' ? (
                    <DefaultAvatar id={_id} size="header" />
                  ) : (
                    <ImageComponent
                      size="header"
                      source={{ uri: `https://ser.univ.team${image}` }}
                    />
                  )}
                  <Info>
                    <InfoChatName numberOfLines={1}>
                      {first_name ? `${first_name} ${last_name}` : phone_number}
                    </InfoChatName>
                    <InfoParticipants numberOfLines={1}>
                      {lastSeenDate}
                    </InfoParticipants>
                  </Info>
                </ToProfile>
              </>
            ) : (
              <>
                <SearchIcon onPress={this.focusInput} />
                <Input placeholder="поиск" onChangeText={this.find} autoFocus />
              </>
            )}
          </Left>
          <Right>
            {!search ? (
              <>
                <SearchIcon onPress={startSearch} />
                <LocationIcon />
              </>
            ) : (
              <CloseIcon onPress={stopSearch} right={false} marginRight />
            )}
          </Right>
        </Top>
        {search && (
          <Bottom>
            <Categories>
              <Category>Задачи</Category>
              <Category>Геолокация</Category>
              <Category>Контакты</Category>
              <Category>Файлы</Category>
            </Categories>
          </Bottom>
        )}
      </Header>
    )
  }

  state = {
    search: false,
  }

  componentWillUnmount() {
    const { stopSearch } = this.props
    stopSearch()
  }

  toProfile = () => {
    const { toProfile } = this.props
    toProfile()
  }

  focusInput = e => {}

  find = e => {
    const {
      getMessages,
      dialogs,
      currentRoom,
      currentChat,
      currentRoomId,
    } = this.props
    e
      ? sendRequest({
          r_path: p_search_messages,
          method: 'post',
          attr: {
            text: e,
            dialog_id: currentRoomId,
          },
          success: res => {
            getMessages(res.messages)
          },
          failFunc: err => {
            console.log(err)
          },
        })
      : getMessages(
          dialogs.filter(e => e.room.includes(currentRoom))[0].messages,
        )
  }
}
const mapStateToProps = state => ({
  search: state.messageReducer.search,
  dialogs: state.dialogsReducer.dialogs,
  currentRoom: state.messageReducer.currentRoom,
  currentRoomId: state.messageReducer.currentRoomId,
  currentChat: state.messageReducer.currentChat,
  currentDialog: state.dialogsReducer.currentDialog,
})
const mapDispatchToProps = dispatch => ({
  addMessage: _ => dispatch(addMessage(_)),
  startSearch: _ => dispatch(startSearch()),
  stopSearch: _ => dispatch(stopSearch()),
  getMessages: _ => dispatch(getMessages(_)),
})
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HeaderComponent)