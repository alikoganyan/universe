import React, { Component } from 'react'
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  InteractionManager,
  Animated as AnimatedNative,
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
import { setContacts, setAllUsers } from '../../actions/userActions'
import { getMessages, setRoom, addMessage } from '../../actions/messageActions'
import {
  addFeedReceiver,
  setFeedReceivers,
} from '../../actions/participantsActions'
import { setDialogs } from '../../actions/dialogsActions'

const { Colors, HeaderHeight } = helper
const { green, black, yellow } = Colors
const AnimatedScrollView = posed.View({
  left: {
    x: 0,
    transition: { duration: 300, ease: 'easeOut' },
  },
  center: {
    x: -Dimensions.get('window').width,
    transition: { duration: 300, ease: 'easeOut' },
  },

  right: {
    x: -Dimensions.get('window').width * 2,
    transition: { duration: 300, ease: 'easeOut' },
  },
})
const Animated = styled(AnimatedScrollView)`
  display: flex;
  flex-direction: row;
  width: ${Dimensions.get('window').width * 3};
`
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
  height: ${Dimensions.get('window').height - HeaderHeight - 20};
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
  align-items: center;
  padding-bottom: 20px;
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
  display: flex;
  align-items: flex-start;
  justify-content: center;
  margin-left: 10px;
`
const ContactName = styled(Text)``
const ContactRole = styled(Text)`
  color: #a7b0ba;
`
const ArrowWrapper = styled(AnimatedArrowWrapper)``
const OptionsWrap = styled(AnimatedNative.View)`
  padding-top: 13px;
  background-color: #ffffff;
`
const Options = styled(AnimatedNative.View)`
  display: flex;
  align-self: center;
  background: ${green};
  flex-direction: row;
  justify-content: space-between;
  border-radius: 16;
  padding: 1px;
  overflow: hidden;
  width: ${Dimensions.get('window').width - helper.sidePadding * 2}px;
`
const Option = styled(Text)`
  color: ${({ active }) => (active ? black : 'white')};
  background: ${({ active }) => (active ? 'white' : 'transparent')};
  border: ${({ active }) => (active ? '1px rgba(0, 0, 0, 0.1) solid' : '0')};
  border-color: ${({ active }) =>
    active ? 'rgba(0, 0, 0, 0.1)' : 'transparent'};
  border-style: solid;
  min-width: 27%;
  border-radius: 15;
  padding: 8px 10px 7px;
  overflow: hidden;
  text-align: center;
`

class Content extends Component {
  MiddleContacts = () => {
    if (this.props.user.company._id === 0) {
      return (
        <ContactList>
          {this.state.allContacts.map(e => (
            <TouchableOpacity key={e._id} onPress={() => this.addReceiver(e)}>
              <BoxInnerItem>
                {this.includes(e) ? (
                  <RoundCheckbox
                    size={36}
                    backgroundColor={yellow}
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
            </TouchableOpacity>
          ))}
        </ContactList>
      )
    } else {
      if (this.state.users.department.length && this.state.checkedList.length) {
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
                        backgroundColor={yellow}
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
                                  backgroundColor={yellow}
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

  AllContacts = () => {
    const allUsers = []
    this.state.allContacts.forEach(item => {
      allUsers.push(item)
    })

    return (
      <ContactList>
        {allUsers.map(e => (
          <TouchableOpacity key={e._id} onPress={() => this.addReceiver(e)}>
            <BoxInnerItem>
              {this.includes(e) ? (
                <RoundCheckbox
                  size={36}
                  backgroundColor={yellow}
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
          </TouchableOpacity>
        ))}
      </ContactList>
    )
  }

  render() {
    const { groups, collapsedGroups, options } = this.state
    const { active } = options

    return (
      <SafeAreaView>
        <Wrapper>
          <KeyboardAwareScrollView enableOnAndroid>
            <OptionsWrap>
              <Options>
                {options.options.map((e, i) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => this.selectOption(i)}
                  >
                    <Option active={active === i}>{e}</Option>
                  </TouchableOpacity>
                ))}
              </Options>
            </OptionsWrap>
            <Animated
              pose={active === 0 ? 'left' : active === 1 ? 'center' : 'right'}
            >
              <this.AllContacts />
              <this.MiddleContacts />
              <ContactList>
                {groups.map((e, i) => (
                  <Box key={i} last={i === groups.length - 1}>
                    <BoxTitle
                      onPress={() =>
                        collapsedGroups[i]
                          ? this.collapseGroups(i)
                          : this.showGroup(i)
                      }
                    >
                      <>
                        <RoundCheckbox
                          size={24}
                          backgroundColor={yellow}
                          checked={this.state.checkedList
                            .filter(u => u.groups.some(id => id === e._id))
                            .every(u => u.checked)}
                          onValueChange={() => this.addGroupReceivers(e)}
                        />
                        <BoxItem title>{e.name}</BoxItem>
                      </>
                      <ArrowWrapper
                        pose={collapsedGroups[i] ? 'right' : 'down'}
                      >
                        <ArrowDownIcon />
                      </ArrowWrapper>
                    </BoxTitle>
                    <Collapsible collapsed={collapsedGroups[i] || false}>
                      {this.state.animationCompleted ? (
                        <BoxInner>
                          {e.participants.map(user => (
                            <TouchableOpacity
                              key={user._id}
                              onPress={() => {
                                this.addReceiver(user)
                              }}
                            >
                              <BoxInnerItem>
                                {this.state.checkedList.some(
                                  e => e.id === user._id && e.checked,
                                ) ? (
                                  <RoundCheckbox
                                    size={36}
                                    backgroundColor={yellow}
                                    checked
                                    onValueChange={() => this.addReceiver(user)}
                                  />
                                ) : !user.image ||
                                  user.image === '/images/default_group.png' ||
                                  user.image ===
                                    '/images/default_avatar.jpg' ? (
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
            </Animated>
          </KeyboardAwareScrollView>
        </Wrapper>
      </SafeAreaView>
    )
  }

  state = {
    collapsed: [],
    collapsedGroups: [],
    allContacts: [],
    checkedList: [],
    users: {
      department: [],
    },
    options: {
      active: 0,
      options: ['Все', 'Пользователи', 'Группы'],
    },
    groups: [],
    animationCompleted: false,
    selectedGroup: '',
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        animationCompleted: true,
      })
    })
    const { users } = this.state
    const { setContacts, receivers } = this.props

    const newDCollapsed = []
    const newGCollapsed = []
    for (let i = 0; i <= users.department.length; i += 1) {
      newDCollapsed.push(true)
    }
    const groups = this.props.dialogs
      .filter(d => d.isGroup)
      .map(g => {
        g.participants = [g.creator, ...g.participants].filter(
          u => u._id !== this.props.user._id,
        )
        g.participants = g.participants.filter(
          (u, i) => g.participants.findIndex(user => user._id === u._id) === i,
        )
        return g
      })
    newGCollapsed.push(...groups.map(() => true))
    this.setState({
      ...this.state,
      collapsed: newDCollapsed,
      groups,
      collapsedGroups: newGCollapsed,
    })
    sendRequest({
      r_path: p_users_from_role_or_position,
      method: 'post',
      attr: {
        access_field: 'create_news',
      },
      success: res => {
        this.setState({ allContacts: res.users })
        setContacts(res.users)
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
          checked: receivers.some(e => e._id === user._id),
          department_id: null,
          groups: [],
        }))
        formatedUsers.forEach(({ users_this, _id }) =>
          users_this.forEach(user => {
            const index = checkedList.findIndex(u => u.id === user._id)
            if (index !== -1) {
              checkedList[index].department_id = _id
            }
          }),
        )

        groups.forEach(g =>
          g.participants.forEach(user => {
            const index = checkedList.findIndex(u => u.id === user._id)
            if (index !== -1) {
              checkedList[index].groups.push(g._id)
            }
          }),
        )

        this.setState({ checkedList })
      },
      failFunc: err => {},
    })
  }

  addReceiver = user => {
    const { addReceiver, setReceivers, receivers } = this.props

    const { checkedList } = this.state
    const c = checkedList.find(e => e.id === user._id)
    if (c) {
      c.checked = !c.checked
    }
    this.setState({ ...this.state, checkedList })

    if (c.checked && !receivers.some(r => r._id === user._id)) {
      addReceiver(user)
    }

    if (!c.checked && receivers.some(r => r._id === user._id)) {
      const newReceivers = receivers.filter(e => !!e && user._id !== e._id)
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
    const newReceivers = this.state.allContacts.filter(
      e => checkedList.find(o => o.id === e._id)?.checked,
    )
    setReceivers(newReceivers)
  }

  addGroupReceivers = e => {
    const { setReceivers } = this.props
    const { checkedList } = this.state
    const users = checkedList.filter(u => u.groups.some(id => id === e._id))
    const is = users.every(u => u.checked)
    users.forEach(u => (u.checked = !is))
    this.setState({ ...this.state, checkedList })
    const newReceivers = this.state.allContacts.filter(
      e => checkedList.find(o => o.id === e._id)?.checked,
    )
    setReceivers(newReceivers)
  }

  includes = e => {
    return this.state.checkedList.find(o => o.id === e._id)?.checked
  }

  collapseDepartment = i => {
    const { collapsed } = this.state
    const newDCollapsed = [...collapsed]
    newDCollapsed[i] = false
    this.setState({ collapsed: newDCollapsed })
  }

  collapseGroups = i => {
    const { collapsedGroups } = this.state
    collapsedGroups[i] = false
    this.setState({ ...this.state, collapsedGroups })
  }

  showDepartment = i => {
    const { collapsed } = this.state
    const newDCollapsed = [...collapsed]
    newDCollapsed[i] = true
    this.setState({ collapsed: newDCollapsed })
  }

  showGroup = i => {
    const { collapsedGroups } = this.state
    collapsedGroups[i] = true
    this.setState({ ...this.state, collapsedGroups })
  }

  selectOption = e => {
    const { options } = this.state
    const newState = { ...options }
    newState.active = e
    this.setState({ options: newState })
  }
}

const mapStateToProps = state => ({
  messages: state.messageReducer,
  dialog: state.dialogsReducer.dialogs,
  currentRoom: state.messageReducer.currentRoom,
  currentChat: state.messageReducer.currentChat,
  user: state.userReducer.user,
  users: state.userReducer,
  receivers: state.participantsReducer.news.receivers,
  dialogs: state.dialogsReducer.dialogs,
})
const mapDispatchToProps = dispatch => ({
  getMessages: _ => dispatch(getMessages(_)),
  setRoom: _ => dispatch(setRoom(_)),
  setDialogs: _ => dispatch(setDialogs(_)),
  addMessage: _ => dispatch(addMessage(_)),
  setAllUsers: _ => dispatch(setAllUsers(_)),
  setContacts: _ => dispatch(setContacts(_)),
  addReceiver: _ => dispatch(addFeedReceiver(_)),
  setReceivers: _ => dispatch(setFeedReceivers(_)),
})
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Content)
