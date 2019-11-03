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
import helper, { getUsersByDepartments } from '../../utils/helpers'
import DefaultAvatar from '../../common/DefaultAvatar'
import ImageComponent from '../../common/Image'
import sendRequest from '../../utils/request'
import { g_users } from '../../constants/api'
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
  render() {
    const { receivers, dialogs } = this.props
    const {
      users,
      collapsed,
      options,
      animationCompleted,
      selectedGroup,
    } = this.state
    const { department } = users
    const { active } = options

    const allUsers = []
    department.forEach(item => {
      allUsers.push(...item.workers)
    })

    return (
      <SafeAreaView>
        {/* <GestureRecognizer
			onSwipeLeft={this.optionLeft}
			onSwipeRight={this.optionRight}
		> */}
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
              <ContactList>
                {allUsers.map(e => (
                  <TouchableOpacity
                    key={e._id}
                    onPress={() => this.addReceiver(e)}
                  >
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
                            uri: `https://testser.univ.team${e.image}`,
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
              <ContactList>
                {department.map((e, i) => (
                  <Box key={i} last={i === department.length - 1}>
                    <BoxTitle
                      onPress={() =>
                        collapsed[i]
                          ? this.collapseDepartment(i)
                          : this.showDepartment(i)
                      }
                    >
                      <>
                        <RoundCheckbox
                          size={24}
                          backgroundColor={yellow}
                          checked={receivers.length === e.workers.length}
                          onValueChange={() => this.addAllReceivers(e.workers)}
                        />
                        <BoxItem title>{e.title}</BoxItem>
                      </>
                      <ArrowWrapper pose={collapsed[i] ? 'right' : 'down'}>
                        <ArrowDownIcon />
                      </ArrowWrapper>
                    </BoxTitle>
                    <Collapsible collapsed={collapsed[i] || false}>
                      {animationCompleted ? (
                        <BoxInner>
                          {e.workers.map(e => (
                            <TouchableOpacity
                              key={e._id}
                              onPress={() => this.addReceiver(e)}
                            >
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
                                      uri: `https://testser.univ.team${e.image}`,
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
                                    <ContactRole>
                                      {e.role.name || 'no role'}
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
              <ContactList>
                {dialogs
                  .filter(item => item.isGroup)
                  .map((e, i) => (
                    <Box key={i} last={i === dialogs.length - 1}>
                      <BoxTitle
                        onPress={() =>
                          collapsed[i]
                            ? this.collapseDepartment(i)
                            : this.showDepartment(i)
                        }
                      >
                        <>
                          <RoundCheckbox
                            size={24}
                            backgroundColor={yellow}
                            checked={selectedGroup === e._id}
                            onValueChange={() => this.addGroupReceivers(e)}
                          />
                          <BoxItem title>{e.name}</BoxItem>
                        </>
                        <ArrowWrapper pose={collapsed[i] ? 'right' : 'down'}>
                          <ArrowDownIcon />
                        </ArrowWrapper>
                      </BoxTitle>
                    </Box>
                  ))}
              </ContactList>
            </Animated>
          </KeyboardAwareScrollView>
        </Wrapper>
        {/* </GestureRecognizer> */}
      </SafeAreaView>
    )
  }

  state = {
    collapsed: [],
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
    const { collapsed, users } = this.state
    const { setContacts } = this.props
    const newDCollapsed = [...collapsed]
    for (let i = 0; i <= users.department.length; i += 1) {
      newDCollapsed.push(false)
    }
    this.setState({ collapsed: newDCollapsed })
    sendRequest({
      r_path: g_users,
      method: 'get',
      success: res => {
        setContacts(res.users)
        // TODO: надо бы брать все из стора
        const formatedUsers = getUsersByDepartments(res.users || [])
        this.setState({ users: { department: formatedUsers } })
      },
      failFunc: err => {},
    })
  }

  optionLeft = () => {
    const { options } = this.state
    const newState = { ...options }
    const { length } = options.options
    newState.active = options.active < length - 1 ? options.active + 1 : 0
    this.setState({ options: newState })
  }

  optionRight = () => {
    const { options } = this.state
    const newState = { ...options }
    const { length } = options.options
    newState.active = options.active > 0 ? options.active - 1 : length - 1
    this.setState({ options: newState })
  }

  addReceiver = e => {
    const { addReceiver, setReceivers, receivers } = this.props
    const newReceivers = [...receivers].filter(user => user._id !== e._id)
    this.includes(e) ? setReceivers(newReceivers) : addReceiver(e)
  }

  addAllReceivers = e => {
    const { receivers, setReceivers } = this.props
    const newReceivers =
      JSON.stringify(e) === JSON.stringify(receivers) ? [] : e
    setReceivers(newReceivers)
  }

  addGroupReceivers = e => {
    const { selectedGroup } = this.state
    if (selectedGroup === e._id) {
      this.setState({ selectedGroup: '' })

      this.props.setReceivers([])
    } else {
      this.setState({ selectedGroup: e._id })

      this.props.setReceivers(e.participants)
    }
  }

  includes = e => {
    const { receivers } = this.props
    return !!receivers.filter(user => e._id === user._id)[0]
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
