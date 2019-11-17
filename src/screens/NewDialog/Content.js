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
import helper, { getUsersByDepartments } from '../../utils/helpers'
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
} from '../../actions/messageActions'
import { setDialogs, setCurrentDialogs } from '../../actions/dialogsActions'

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
  width: 184px;
  height: 38px;
  border-radius: 50000px;
  margin-top: 10px;
`
const CreateDialogText = styled(Text)`
  margin-left: 10px;
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
            <this.Contacts />
          </KeyboardAwareScrollView>
        </Wrapper>
        {/* </ScrollView> */}
      </SafeAreaView>
    )
  }

  state = {
    collapsed: [],
    users: {
      department: [],
    },
  }

  Contacts = () => {
    if (this.props.user.company._id === 0) {
      return (
        <ContactList
          bounces={false}
          contentContainerStyle={{ paddingBottom: 170 }}
          data={this.state.allUsers}
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
                        ? `https://testser.univ.team${item.image}`
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
          data={this.state.users.department}
          ref={ref => (this.usersRef = ref)}
          renderItem={({ item, index }) => (
            <Box last={index === this.state.users.department.length - 1}>
              <BoxTitle
                onPress={() =>
                  this.state.collapsed[index]
                    ? this.collapseDepartment(index)
                    : this.showDepartment(index)
                }
              >
                <BoxItem title>{item.title}</BoxItem>
                <ArrowWrapper
                  pose={this.state.collapsed[index] ? 'right' : 'down'}
                >
                  <ArrowDownIcon />
                </ArrowWrapper>
              </BoxTitle>
              <Collapsible collapsed={this.state.collapsed[index] || false}>
                <BoxInner>
                  {item.workers &&
                    item.workers.length &&
                    item.workers.map((e, i) => (
                      <TouchableOpacity key={i} onPress={() => this.toChat(e)}>
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
                                uri: `https://testser.univ.team${e.image}`,
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
          )}
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

    sendRequest({
      r_path: p_users_from_role_or_position,
      method: 'post',
      attr: {
        access_field: 'view_contacts',
      },
      success: res => {
        this.setState({ allUsers: res.users })
        const formatedUsers = getUsersByDepartments(
          res.users || [],
          this.props.user.company._id,
        )
        this.setState({ users: { department: formatedUsers } })
        for (let i = 0; i < formatedUsers.length; i += 1) {
          newDCollapsed.push(true)
        }
        this.setState({ collapsed: newDCollapsed })
      },
      failFunc: () => {},
    })
  }

  selectOption = e => {
    const { options } = this.state
    const newState = { ...options }
    newState.active = e
    this.setState({ options: newState })
  }

  toChat = event => {
    const {
      setCurrentDialogs,
      navigate,
      getMessages,
      setRoom,
      dialog,
    } = this.props
    const dialogIncludes = dialog.filter(
      e => e.creator._id === event._id || e.participants[0]._id === event._id,
    )[0]
    setCurrentDialogs(event)
    setRoom(event._id)
    getMessages(dialogIncludes ? dialogIncludes.messages : [])
    navigate('Chat')
  }
}

const mapStateToProps = state => ({
  messages: state.messageReducer,
  dialog: state.dialogsReducer.dialogs,
  currentRoom: state.messageReducer.currentRoom,
  currentChat: state.messageReducer.currentChat,
  user: state.userReducer.user,
  users: state.userReducer,
})
const mapDispatchToProps = dispatch => ({
  getMessages: _ => dispatch(getMessages(_)),
  setRoom: _ => dispatch(setRoom(_)),
  setDialogs: _ => dispatch(setDialogs(_)),
  addMessage: _ => dispatch(addMessage(_)),
  setAllUsers: _ => dispatch(setAllUsers(_)),
  setContacts: _ => dispatch(setContacts(_)),
  setCurrentChat: _ => dispatch(setCurrentChat(_)),
  setCurrentDialogs: _ => dispatch(setCurrentDialogs(_)),
})
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Content)
