import React, { Component } from 'react'
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  InteractionManager,
} from 'react-native'
import styled from 'styled-components'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { connect } from 'react-redux'
import helper from '../../utils/helpers'
import DefaultAvatar from '../../common/DefaultAvatar'
import sendRequest from '../../utils/request'
import { p_users_from_role_or_position } from '../../constants/api'
import { setContacts, setAllUsers } from '../../actions/userActions'
import { getMessages, setRoom, addMessage } from '../../actions/messageActions'
import {
  addTaskReceiver,
  setTaskReceivers,
} from '../../actions/participantsActions'
import { setDialogs } from '../../actions/dialogsActions'

/*
const AnimatedScrollView = posed.View({
  left: {
    x: Dimensions.get('window').width,
    transition: { duration: 300, ease: 'easeOut' },
  },
  center: {
    x: 0,
    transition: { duration: 300, ease: 'easeOut' },
  },

  right: {
    x: -Dimensions.get('window').width,
    transition: { duration: 300, ease: 'easeOut' },
  },
})*/
const Wrapper = styled(View)`
  padding-top: 0px;
  background: white;
  margin-bottom: 110px;
  height: 100%;
`
const ContactList = styled(ScrollView)`
  display: flex;
  padding: 0px 30px;
  max-width: ${Dimensions.get('window').width};
  max-height: ${Dimensions.get('window').height - helper.HeaderHeight - 30};
  overflow: hidden;
`
const BoxInnerItem = styled(TouchableOpacity)`
  padding: 10px;
  padding-bottom: ${({ title }) => (title ? 20 : 0)}px;
  display: flex;
  flex-direction: row;
  align-items: center;
`
const ContactImage = styled(Image)`
  width: 36px;
  height: 36px;
  border-radius: 18;
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

class Content extends Component {
  render() {
    const { users } = this.state
    return (
      <SafeAreaView>
        <Wrapper>
          <KeyboardAwareScrollView enableOnAndroid>
            <ContactList>
              <FlatList
                data={users}
                renderItem={({ item }) => (
                  <BoxInnerItem onPress={() => this.addReceiver(item)}>
                    {!item.image ||
                    item.image === '/images/default_group.png' ||
                    item.image === '/images/default_avatar.jpg' ? (
                      <DefaultAvatar size={36} id={item._id} />
                    ) : (
                      <ContactImage
                        source={{
                          uri: `https://testser.univ.team${item.image}`,
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
                        <ContactRole>{item.role.name || 'no role'}</ContactRole>
                      ) : null}
                    </ContactInfo>
                  </BoxInnerItem>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
            </ContactList>
          </KeyboardAwareScrollView>
        </Wrapper>
      </SafeAreaView>
    )
  }

  state = {
    collapsed: [],
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
    const newDCollapsed = [...collapsed]
    for (let i = 0; i <= users.department.length; i++) {
      newDCollapsed.push(false)
    }
    this.setState({ collapsed: newDCollapsed })
    sendRequest({
      r_path: p_users_from_role_or_position,
      method: 'post',
      attr: {
        access_field: 'tasks_assignment',
      },
      success: res => {
        this.setState({ users: res.users })
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
    const { setReceivers, back } = this.props
    setReceivers([e])
    back()
  }

  addAllReceivers = e => {
    const { receivers, setReceivers } = this.props
    const newReceivers =
      JSON.stringify(e) === JSON.stringify(receivers) ? [] : e
    setReceivers(newReceivers)
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
  receivers: state.participantsReducer.tasks.receivers,
})
const mapDispatchToProps = dispatch => ({
  getMessages: _ => dispatch(getMessages(_)),
  setRoom: _ => dispatch(setRoom(_)),
  setDialogs: _ => dispatch(setDialogs(_)),
  addMessage: _ => dispatch(addMessage(_)),
  setAllUsers: _ => dispatch(setAllUsers(_)),
  setContacts: _ => dispatch(setContacts(_)),
  addReceiver: _ => dispatch(addTaskReceiver(_)),
  setReceivers: _ => dispatch(setTaskReceivers(_)),
})
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Content)
