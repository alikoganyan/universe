import React, { Component } from 'react'
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TouchableWithoutFeedback,
  InteractionManager,
} from 'react-native'
import styled from 'styled-components'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import RoundCheckbox from 'rn-round-checkbox'
import posed from 'react-native-pose'
import Collapsible from 'react-native-collapsible'
import { connect } from 'react-redux'
import { ArrowDownIcon } from '../../assets/index'
import helper from '../../utils/helpers'
import DefaultAvatar from '../../common/DefaultAvatar'
import ImageComponent from '../../common/Image'
import sendRequest from '../../utils/request'
import { p_users_from_role_or_position } from '../../constants/api'
import {
  addDialogParticipant,
  setDialogParticipants,
} from '../../actions/participantsActions'

const { Colors } = helper
const { green } = Colors
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
  margin-bottom: 110px;
`
const ContactList = styled(ScrollView)`
  padding: 30px;
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
  padding-bottom: 20px;
  align-items: center;
`
const BoxInner = styled(AnimatedBox)`
  padding: 20px 0;
  padding-top: 20px;
  border: 1px solid #e8ebee;
  border-width: 0;
  border-top-width: 1px;
  border-bottom-width: ${({ last }) => (last ? 1 : 0)}px;
`
const BoxItem = styled(Text)`
  color: #a7b0ba;
  width: 80%;
`
const BoxInnerItem = styled(View)`
  padding: 10px;
  padding-bottom: ${({ title }) => (title ? 20 : 0)}px;
  display: flex;
  flex-direction: row;
  align-items: center;
`
const ContactInfo = styled(View)`
  margin-left: 10px;
`
const ContactName = styled(Text)``
const ContactRole = styled(Text)`
  color: #a7b0ba;
  display: flex;
  align-items: flex-start;
  justify-content: center;
`
const ArrowWrapper = styled(AnimatedArrowWrapper)``

class Content extends Component {
  Contacts = () => {
    if (this.props.user.company._id === 0) {
      if (this.state.allUsers && this.state.allUsers.length) {
        return (
          <ContactList>
            {this.state.allUsers.map(e => (
              <TouchableWithoutFeedback
                key={e._id}
                onPress={() => this.addReceiver(e)}
              >
                <BoxInnerItem>
                  {this.includes(e) ? (
                    <RoundCheckbox
                      size={36}
                      backgroundColor={green}
                      checked
                      onValueChange={() => this.addReceiver(e)}
                    />
                  ) : !e.image ||
                    e.image === '/images/default_group.png' ||
                    e.image === '/images/default_avatar.jpg' ? (
                    <DefaultAvatar size={36} id={e._id} />
                  ) : (
                    <ImageComponent
                      source={{
                        uri: `https://seruniverse.asmo.media${e.image}`,
                      }}
                      size={36}
                    />
                  )}
                  <ContactInfo>
                    <ContactName>
                      {e.first_name
                        ? `${e.first_name} ${e.last_name}`
                        : e.phone_number}
                    </ContactName>
                    {e.role ? (
                      <ContactRole>{e.role.name || 'no role'}</ContactRole>
                    ) : null}
                  </ContactInfo>
                </BoxInnerItem>
              </TouchableWithoutFeedback>
            ))}
          </ContactList>
        )
      } else {
        return null
      }
    } else {
      if (
        this.state.users.department &&
        this.state.users.department.length &&
        this.state.checkedList &&
        this.state.checkedList.length
      ) {
        return (
          <ContactList>
            {this.state.users.department
              .filter(e => e.users_this.length)
              .map((e, i) => (
                <Box
                  key={i}
                  last={i === this.state.users.department.length - 1}
                >
                  <BoxTitle
                    onPress={() =>
                      this.state.collapsed[i]
                        ? this.collapseDepartment(i)
                        : this.showDepartment(i)
                    }
                  >
                    <>
                      <RoundCheckbox
                        size={24}
                        backgroundColor={green}
                        checked={this.state.checkedList
                          .filter(item => item.department_id === e._id)
                          .every(({ checked }) => checked)}
                        onValueChange={() => this.addAllReceivers(e._id)}
                      />
                      <BoxItem title>{e.name}</BoxItem>
                    </>
                    <ArrowWrapper
                      pose={this.state.collapsed[i] ? 'right' : 'down'}
                    >
                      <ArrowDownIcon />
                    </ArrowWrapper>
                  </BoxTitle>
                  <Collapsible collapsed={this.state.collapsed[i] || false}>
                    {this.state.animationCompleted ? (
                      <BoxInner>
                        {e.users_this.map(user => (
                          <TouchableOpacity
                            key={user._id}
                            onPress={() => {
                              /*  if (this.state.checkedList) {
                                const list = [...this.state.checkedList]
                                list[i][j] = !receivers || !receivers.length ? false : receivers.some(elem => elem._id === user._id )
                                this.setState({checkedList: list})
                              }*/
                              this.addReceiver(user)
                            }}
                          >
                            <BoxInnerItem>
                              {this.state.checkedList.some(
                                e => e.id === user._id && e.checked,
                              ) ? (
                                <RoundCheckbox
                                  size={36}
                                  backgroundColor={green}
                                  checked
                                  onValueChange={() => this.addReceiver(user)}
                                />
                              ) : !user.image ||
                                user.image === '/images/default_group.png' ||
                                user.image === '/images/default_avatar.jpg' ? (
                                <DefaultAvatar size={36} id={user._id} />
                              ) : (
                                <ImageComponent
                                  source={{
                                    uri: `https://seruniverse.asmo.media${user.image}`,
                                  }}
                                  size={36}
                                />
                              )}
                              <ContactInfo>
                                <ContactName>
                                  {user.first_name
                                    ? `${user.first_name} ${user.last_name}`
                                    : user.phone_number}
                                </ContactName>
                                {user.role ? (
                                  <ContactRole>
                                    {user.role.name || 'no role'}
                                  </ContactRole>
                                ) : null}
                              </ContactInfo>
                            </BoxInnerItem>
                          </TouchableOpacity>
                        ))}
                      </BoxInner>
                    ) : null}
                  </Collapsible>
                </Box>
              ))}
          </ContactList>
        )
      } else {
        return null
      }
    }
  }

  render() {
    return (
      <SafeAreaView>
        <Wrapper>
          <KeyboardAwareScrollView enableOnAndroid>
            <this.Contacts />
          </KeyboardAwareScrollView>
        </Wrapper>
      </SafeAreaView>
    )
  }

  state = {
    usersToAdd: [],
    collapsed: [],
    allUsers: [],
    checkedList: [],
    users: {
      department: [],
    },
    options: {
      active: 1,
      options: ['Все', 'Пользователи', 'Группы'],
    },
    groups: [],
    animationCompleted: false,
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        animationCompleted: true,
      })
    })
    const { collapsed, users } = this.state
    const { participants } = this.props

    const newDCollapsed = [...collapsed]
    for (let i = 0; i <= users.department.length; i++) {
      newDCollapsed.push(false)
    }
    this.setState({ collapsed: newDCollapsed })
    sendRequest({
      r_path: p_users_from_role_or_position,
      method: 'post',
      attr: {
        access_field: 'create_groups',
      },
      success: res => {
        this.setState({ allUsers: res.users })
        const formatedUsers = res.company.subdivisions
        formatedUsers.forEach(
          d =>
            (d.users_this = d.users_this.filter(
              u => u._id !== this.props.user._id,
            )),
        )
        this.setState({ users: { department: formatedUsers } })
        const checkedList = res.users.map(user => ({
          id: user._id,
          checked: participants.some(e => e._id === user._id),
          department_id: null,
        }))

        formatedUsers.forEach(({ users_this, _id }) =>
          users_this.forEach(user => {
            const index = checkedList.findIndex(u => u.id === user._id)
            if (index !== -1) {
              checkedList[index].department_id = _id
            }
          }),
        )

        this.setState({ checkedList })
      },
      failFunc: err => {},
    })
  }

  addReceiver = user => {
    const { addReceiver, setReceivers, participants } = this.props

    const { checkedList } = this.state
    const c = checkedList.find(e => e.id === user._id)
    if (c) {
      c.checked = !c.checked
    }
    this.setState({ ...this.state, checkedList })

    if (c.checked && !participants.some(r => r._id === user._id)) {
      addReceiver(user)
    }

    if (!c.checked && participants.some(r => r._id === user._id)) {
      const newReceivers = participants.filter(e => !!e && user._id !== e._id)
      setReceivers(newReceivers)
    }
  }

  addAllReceivers = id => {
    const { setReceivers } = this.props
    const { checkedList } = this.state
    const dep = checkedList.filter(e => id === e.department_id)
    const is = dep.every(e => e.checked)
    dep.forEach(e => (e.checked = !is))
    this.setState({ ...this.state, checkedList })
    const newReceivers = this.state.allUsers.filter(
      e => checkedList.find(o => o.id === e._id)?.checked,
    )
    setReceivers(newReceivers)
  }

  includes = e => {
    const { participants } = this.props
    return !!participants.filter(user => e._id === user._id)[0]
  }

  collapseDepartment = i => {
    const { collapsed } = this.state
    const newDCollapsed = [...collapsed]
    newDCollapsed[i] = false
    this.setState({ collapsed: newDCollapsed })
  }

  showDepartment = i => {
    const { collapsed } = this.state
    const newDCollapsed = [...collapsed]
    newDCollapsed[i] = true
    this.setState({ collapsed: newDCollapsed })
  }
}

const mapStateToProps = state => ({
  messages: state.messageReducer,
  dialog: state.dialogsReducer.dialogs,
  currentRoom: state.messageReducer.currentRoom,
  currentChat: state.messageReducer.currentChat,
  user: state.userReducer.user,
  users: state.userReducer,
  participants: state.participantsReducer.dialog.participants,
})
const mapDispatchToProps = dispatch => ({
  addReceiver: _ => dispatch(addDialogParticipant(_)),
  setReceivers: _ => dispatch(setDialogParticipants(_)),
})
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Content)
