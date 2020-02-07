/* eslint-disable array-callback-return */
import React, { Component } from 'react'
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native'
import styled from 'styled-components'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import posed from 'react-native-pose'
import Collapsible from 'react-native-collapsible'
import { connect } from 'react-redux'
import { GroupIconWhite, ArrowDownIcon } from '../../assets/index'
import helper from '../../utils/helpers'
import sendRequest from '../../utils/request'
import { p_users_from_role_or_position } from '../../constants/api'
import ImageComponent from '../../common/Image'
import { setContacts, setAllUsers } from '../../actions/userActions'
import DefaultAvatar from '../../common/DefaultAvatar'
import {
  getMessages,
  setRoom,
  addMessage,
  setCurrentChat,
  setCurrentRoomId,
} from '../../actions/messageActions'
import {
  setDialogs,
  setCurrentDialogs,
  setDialog,
} from '../../actions/dialogsActions'
import _ from 'lodash'
import {
  filterAllContacts,
  filterWithDepartaments,
} from '../../helper/filterContacts'
import { socket } from '../../utils/socket'
import { setProfile } from '../../actions/profileAction'

const { Colors, HeaderHeight, fontSize } = helper
const { green, black, grey2 } = Colors

const AnimatedBox = posed.View({
  visible: { flex: 1 },
  hidden: { flex: 0 },
})
const AnimatedArrowWrapper = posed.View({
  down: { rotate: '0deg' },
  right: { rotate: '-90deg' },
})
const Wrapper = styled(View)`
  padding-top: 0px;
  background: white;
  margin-top: ${HeaderHeight};
`
const ContactList = styled(Animated.FlatList)`
  padding: 30px;
  padding-top: 10px;
  padding-bottom: 10px;
  max-width: ${Dimensions.get('window').width};
  overflow: hidden;
  flex: 1;
`
const Box = styled(View)`
  padding-top: 20px;
  border: 1px solid #e8ebee;
  border-width: 0;
  border-top-width: 1px;
  border-bottom-width: ${({ last }) => (last ? 1 : 0)}px;
`
const BoxTitle = styled(TouchableOpacity)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
`
const BoxInner = styled(AnimatedBox)`
  padding: 0 0 20px;
  border: 1px solid #e8ebee;
  border-width: 0;
  border-top-width: 1px;
  border-bottom-width: ${({ last }) => (last ? 1 : 0)}px;
`
const BoxItem = styled(Text)`
  padding-bottom: ${({ title }) => (title ? 20 : 0)}px;
  color: #a7b0ba;
  width: 80%;
`
const BoxInnerItem = styled(View)`
  padding: 20px 0;
  padding-bottom: ${({ title }) => (title ? 20 : 0)}px;
  display: flex;
  flex-direction: row;
  align-items: center;
`
const ContactInfo = styled(View)`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  margin-left: 8px;
`
const ContactName = styled(Text)`
  font-size: ${fontSize.text};
  color: ${black};
`
const ContactRole = styled(Text)`
  font-size: ${fontSize.text - 1};
  color: ${grey2};
`
const ArrowWrapper = styled(AnimatedArrowWrapper)``
const CreateDialog = styled(TouchableOpacity)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  align-self: center;
  background: ${green};
  padding: 5px 10px;
  padding-left: 0px;
  width: 184px;
  height: 38px;
  border-radius: 50000px;
  margin-top: 10px;
`
const CreateDialogText = styled(Text)`
  color: white;
  font-size: ${fontSize.text};
`

class Content extends Component {
  render() {
    return (
      <SafeAreaView>
        {/* <ScrollView keyboardShouldPersistTaps="handled"> */}
        <Wrapper>
          <KeyboardAwareScrollView enableOnAndroid>
            <CreateDialog onPress={this.newGroup}>
              <GroupIconWhite />
              <CreateDialogText>Создать группу</CreateDialogText>
            </CreateDialog>
            {!!Object.keys(this.props.user).length && <this.AllContacts />}
          </KeyboardAwareScrollView>
        </Wrapper>
        {/* </ScrollView> */}
      </SafeAreaView>
    )
  }

  state = {
    collapsed: [],
    userContactsAll: [],
    filteredUserContactsAll: null,
    departments: [],
    filteredDepartments: null,
    options: {
      active: 0,
    },
  }

  AllContacts = () => {
    const {
      userContactsAll,
      filteredUserContactsAll,
      departments,
      filteredDepartments,
    } = this.state

    if (
      this.props.user.company._id === 0 ||
      !this.props.user.settings.partition_contacts
    ) {
      return (
        <ContactList
          bounces={false}
          contentContainerStyle={{ paddingBottom: 170 }}
          data={filteredUserContactsAll || userContactsAll}
          ref={ref => (this.usersRef = ref)}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => this.toChat(item)}>
              <BoxInnerItem>
                {!item.image || item.image === '/images/default_avatar.jpg' ? (
                  <DefaultAvatar
                    isGroup={item.isGroup}
                    id={item._id}
                    size={36}
                  />
                ) : (
                  <ImageComponent
                    size={33}
                    source={{
                      uri: item.image
                        ? `https://seruniverse.asmo.media${item.image}`
                        : 'https://simpleicon.com/wp-content/uploads/user1.png',
                    }}
                  />
                )}
                <ContactInfo>
                  <ContactName>
                    {item.first_name
                      ? `${item.first_name} ${item.last_name}`
                      : item.phone_number}
                  </ContactName>
                  {item.role ? (
                    <ContactRole>{item.role.name}</ContactRole>
                  ) : null}
                </ContactInfo>
              </BoxInnerItem>
            </TouchableOpacity>
          )}
        />
      )
    } else {
      return (
        <ContactList
          bounces={false}
          data={filteredDepartments || departments}
          ref={ref => (this.usersRef = ref)}
          renderItem={({ item, index }) =>
            !!(item.users_this && item.users_this.length) && (
              <Box last={index === this.state.departments.length - 1}>
                <BoxTitle
                  onPress={() =>
                    this.state.collapsed[index]
                      ? this.collapseDepartment(index)
                      : this.showDepartment(index)
                  }
                >
                  <BoxItem title>{item.name}</BoxItem>
                  <ArrowWrapper
                    pose={this.state.collapsed[index] ? 'right' : 'down'}
                  >
                    <ArrowDownIcon />
                  </ArrowWrapper>
                </BoxTitle>
                <Collapsible collapsed={this.state.collapsed[index] || false}>
                  <BoxInner>
                    {!!(item.users_this && item.users_this.length) &&
                      item.users_this.map((e, i) => (
                        <TouchableOpacity
                          key={i}
                          onPress={() => this.toChat(e)}
                        >
                          <BoxInnerItem>
                            {!e.image ||
                            e.image === '/images/default_avatar.jpg' ? (
                              <DefaultAvatar
                                isGroup={e.isGroup}
                                id={e._id}
                                size={36}
                              />
                            ) : (
                              <ImageComponent
                                size={33}
                                source={{
                                  uri: `https://seruniverse.asmo.media${e.image}`,
                                }}
                              />
                            )}
                            <ContactInfo>
                              <ContactName>
                                {e.first_name
                                  ? `${e.first_name} ${e.last_name}`
                                  : e.phone_number}
                              </ContactName>
                              {e.role ? (
                                <ContactRole>{e.role.name}</ContactRole>
                              ) : null}
                            </ContactInfo>
                          </BoxInnerItem>
                        </TouchableOpacity>
                      ))}
                  </BoxInner>
                </Collapsible>
              </Box>
            )
          }
        />
      )
    }
  }

  collapseDepartment = i => {
    const { collapsed } = this.state
    const newDCollapsed = [...collapsed]
    newDCollapsed[i] = false
    this.setState({ collapsed: newDCollapsed })
  }

  newGroup = () => {
    const { navigate } = this.props
    navigate('NewGroup')
  }

  showDepartment = i => {
    const { collapsed } = this.state
    const newDCollapsed = [...collapsed]
    newDCollapsed[i] = true
    this.setState({ collapsed: newDCollapsed })
  }

  componentDidMount() {
    const { collapsed } = this.state
    const newDCollapsed = [...collapsed]
    this.changeInputValue()
    sendRequest({
      r_path: p_users_from_role_or_position,
      method: 'post',
      attr: {
        access_field: 'view_contacts',
      },
      success: res => {
        const allContacts = _.orderBy(
          res.users,
          [
            user => {
              if (user.first_name) {
                return user.first_name.toLowerCase()
              } else return
            },
          ],
          ['desc'],
        ).reverse()
        this.setState({ userContactsAll: allContacts })

        const formatedUsers = [...res.company.subdivisions]
        this.updatedDepartaments = formatedUsers

        this.subdivisonsThree(formatedUsers)

        this.updatedDepartaments.forEach(d => {
          d.users_this = d.users_this.filter(u => u._id !== this.props.user._id)
        })
        this.setState({ departments: this.updatedDepartaments })
        for (let i = 0; i < formatedUsers.length; i += 1) {
          newDCollapsed.push(true)
        }
        this.setState({ collapsed: newDCollapsed })
      },
      failFunc: () => {},
    })
  }

  changeInputValue = () => {
    this.props.valueChange.callback = val => {
      const { user } = this.props
      user.settings.partition_contacts
        ? filterWithDepartaments(val, this.state, this)
        : filterAllContacts(val, this.state, this.props, this)
    }
  }

  updatedDepartaments = []

  subdivisonsThree = dep => {
    dep.forEach(d => {
      this.updatedDepartaments = [
        ...this.updatedDepartaments,
        ...d.subdivisions,
      ]
      if (d.subdivisions.length) {
        this.subdivisonsThree(d.subdivisions)
      }
    })
  }

  toChat = e => {
    const {
      setRoom,
      setCurrentChat,
      navigate,
      user,
      setCurrentDialogs,
      setCurrentRoomId,
      dialogs,
      setProfile,
    } = this.props
    const recipientId = !e.isGroup ? e._id : null
    const currentRoom = dialogs.find(
      dialog =>
        !dialog.isGroup &&
        ((dialog.creator._id && dialog.creator._id === e._id) ||
          (dialog.participants[0] && dialog.participants[0]._id === e._id)),
    )
    if (currentRoom) {
      const { isGroup, participants, creator, room, _id } = currentRoom
      const currentDialog = isGroup
        ? { ...e }
        : user._id === creator._id
        ? { ...participants[0] }
        : { ...creator }
      this.props.setDialog(currentRoom)
      setRoom(recipientId)
      setCurrentRoomId(_id)
      setCurrentChat(room)
      setCurrentDialogs(currentDialog)
      socket.emit('view', { room, viewer: user._id })
    } else {
      const { room, _id } = e
      setRoom(_id)
      setCurrentChat(room)
      setCurrentDialogs(e)
    }
    setProfile(e)
    navigate('Chat')
  }
}

const mapStateToProps = state => ({
  messages: state.messageReducer,
  dialogs: state.dialogsReducer.dialogs,
  currentRoom: state.messageReducer.currentRoom,
  currentChat: state.messageReducer.currentChat,
  user: state.userReducer.user,
  users: state.userReducer,
})
const mapDispatchToProps = dispatch => ({
  getMessages: _ => dispatch(getMessages(_)),
  setRoom: _ => dispatch(setRoom(_)),
  setDialogs: _ => dispatch(setDialogs(_)),
  setDialog: _ => dispatch(setDialog(_)),
  addMessage: _ => dispatch(addMessage(_)),
  setAllUsers: _ => dispatch(setAllUsers(_)),
  setContacts: _ => dispatch(setContacts(_)),
  setCurrentChat: _ => dispatch(setCurrentChat(_)),
  setCurrentDialogs: _ => dispatch(setCurrentDialogs(_)),
  setProfile: _ => dispatch(setProfile(_)),
  setCurrentRoomId: _ => dispatch(setCurrentRoomId(_)),
})
export default connect(mapStateToProps, mapDispatchToProps)(Content)
