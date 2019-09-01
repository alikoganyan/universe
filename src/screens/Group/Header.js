import React, { Component } from 'react'
import {
  View,
  Text,
  TextInput,
  Dimensions,
  TouchableOpacity,
} from 'react-native'
import { connect } from 'react-redux'
import styled from 'styled-components'
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

const { sidePadding, HeaderHeight, Colors, fontSize } = helper
const { border } = Colors
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
  font-family: OpenSans-Bold;
`
const InfoParticipants = styled(Text)`
  color: ${Colors.jumbo};
  font-size: ${fontSize.sm};
  font-family: OpenSans;
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
const Input = styled(TextInput)`
  padding-left: 10px;
  flex: 1;
`
const ToProfile = styled(TouchableOpacity)`
  display: flex;
  flex-direction: row;
  margin-right: 10px;
`

class HeaderComponent extends Component {
  render() {
    const { back, search, startSearch, stopSearch, currentDialog } = this.props
    const { name, participants, image, _id } = currentDialog
    return (
      <Header>
        <Top>
          <Left>
            {!search ? (
              <>
                <BackIcon
                  marginLeft={false}
                  noPaddingAll
                  onPress={back}
                  right
                />
                <ToProfile onPress={this.toProfile}>
                  {!image ||
                  image === '/images/default_avatar.jpg' ||
                  image === '/images/default_group.png' ? (
                    <DefaultAvatar id={_id} size="header" isGroup />
                  ) : (
                    <ImageComponent
                      source={{ uri: `https://ser.univ.team${image}` }}
                      size="header"
                    />
                  )}
                  <Info>
                    <InfoChatName numberOfLines={1}>{name}</InfoChatName>
                    {participants && (
                      <InfoParticipants>
                        {participants.length + 1} участника
                      </InfoParticipants>
                    )}
                  </Info>
                </ToProfile>
              </>
            ) : (
              <>
                <SearchIcon onPress={this.focusInput} />
                <Input placeholder="поиск" onChangeText={this.find} />
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

  componentWillUnmount() {
    const { stopSearch } = this.props
    stopSearch()
  }

  toProfile = () => {
    const { toProfile } = this.props
    toProfile()
  }

  find = e => {
    const { getMessages, dialogs, currentRoom, currentRoomId } = this.props
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
            // console.log(err)
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
  startSearch: _ => dispatch(startSearch(_)),
  stopSearch: _ => dispatch(stopSearch(_)),
  getMessages: _ => dispatch(getMessages(_)),
})
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HeaderComponent)
