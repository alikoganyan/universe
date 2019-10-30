import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native'
import styled from 'styled-components'
import posed from 'react-native-pose'
import Collapsible from 'react-native-collapsible'
import { connect } from 'react-redux'
import helper from '../../utils/helpers'
import DefaultAvatar from '../../common/DefaultAvatar'
import Loader from '../../common/Loader'
import { ArrowDownIcon } from '../../assets/index'
import sendRequest from '../../utils/request'
import { g_users } from '../../constants/api'
import { setContacts, setAllUsers } from '../../actions/userActions'
import {
  getMessages,
  setRoom,
  addMessage,
  setCurrentChat,
  setCurrentRoomId,
} from '../../actions/messageActions'
import { setDialogs, setCurrentDialogs } from '../../actions/dialogsActions'
import { socket } from '../../utils/socket'
import Header from './Header'
import TabPreHeader from '../../common/TabPreHeader'
import Company from '../../common/Company'

const { Colors, HeaderHeight, sidePadding } = helper
const { green, black, grey2 } = Colors
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
const AnimatedScroll = styled(AnimatedScrollView)`
  display: flex;
  flex-direction: row;
  width: ${Dimensions.get('window').width * 3};
  flex: 1;
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
  background: white;
  margin-bottom: 40px;
  height: ${Dimensions.get('window').height - HeaderHeight - 20}px;
  overflow: hidden;
`
const ContactList = styled(Animated.FlatList)`
  padding: 20px 16px 0;
  padding-top: 150px;
  max-width: 100%;
  overflow: hidden;
  flex: 1;
`
const Box = styled(View)`
  padding-top: 20px;
  border: 1px solid #e8ebee;
  border-width: 0;
  border-top-width: 1px;
  border-bottom-width: ${({ last }) => (last ? 1 : 0)}px;
  margin-top: ${({ first }) => (first ? 16 : 0)};
`
const BoxTitle = styled(TouchableOpacity)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
`
const BoxInner = styled(AnimatedBox)`
  padding-bottom: 20px;
  border: 1px solid #e8ebee;
  border-width: 0;
  border-top-width: 1px;
  border-bottom-width: ${({ last }) => (last ? 1 : 0)}px;
`
const BoxItem = styled(Text)`
  padding-bottom: ${({ title }) => (title ? 20 : 0)}px;
  font-weight: 500;
  font-size: 16px;
  flex: 1;
  width: 80%;
  color: #80868b;
`
const BoxInnerItem = styled(TouchableOpacity)`
  padding: 20px 5px;
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
const ContactName = styled(Text)`
  font-weight: 500;
  font-size: 16px;
`
const ContactRole = styled(Text)`
  font-weight: 500;
`
const ArrowWrapper = styled(AnimatedArrowWrapper)``
const OptionsWrap = styled(Animated.View)`
  padding-top: 13px;
  background-color: #ffffff;
`
const Options = styled(Animated.View)`
  display: flex;
  align-self: center;
  background: ${green};
  flex-direction: row;
  justify-content: space-between;
  border-radius: 16;
  padding: 1px;
  overflow: hidden;
  width: ${Dimensions.get('window').width - sidePadding * 2}px;
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

const Title = styled(Text)`
  font-family: 'OpenSans-Bold';
  font-size: 30px;
  color: ${Colors.black};
  padding: 0 16px 8px;
  background-color: ${Colors.white};
  z-index: 2;
`

const HeaderContainer = styled(Animated.View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  z-index: 2;
  background-color: #ffffff;
`

const Head = styled(Animated.View)`
  position: absolute;
  top: 49px;
  z-index: 1;
  width: ${Dimensions.get('window').width};
  background-color: #ffffff;
`

class Content extends Component {
  render() {
    const { users, collapsed, options } = this.state
    const { department } = users
    const { active } = options
    const { navigate } = this.props

    const opacity = this.scrollY.interpolate({
      inputRange: [0, 90, 91],
      outputRange: [0, 0, 1],
    })
    const contentTranslateY = this.scrollY.interpolate({
      inputRange: [0, 122, 123],
      outputRange: [0, -122, -122],
    })
    const titleTranslateY = this.scrollY.interpolate({
      inputRange: [0, 50, 51],
      outputRange: [0, 50, 50],
    })

    return (
      <Wrapper>
        <TabPreHeader
          onWritePress={() => navigate('NewContact')}
          title="Контакты"
          opacity={opacity}
          hideButton
        />
        <Head style={{ transform: [{ translateY: contentTranslateY }] }}>
          <HeaderContainer
            style={{ transform: [{ translateY: titleTranslateY }] }}
          >
            <Title>Контакты</Title>
            <Company navigate={navigate} />
          </HeaderContainer>
          <Header />
          <OptionsWrap>
            <Options>
              {options.options.map((e, i) => (
                <TouchableOpacity key={i} onPress={() => this.selectOption(i)}>
                  <Option active={active % 3 === i}>{e}</Option>
                </TouchableOpacity>
              ))}
            </Options>
          </OptionsWrap>
        </Head>
        <AnimatedScroll
          pose={active === 0 ? 'left' : active === 1 ? 'center' : 'right'}
        >
          <this.AllContacts />
          <ContactList
            bounces={false}
            contentContainerStyle={{ paddingBottom: 140 }}
            data={department}
            ListEmptyComponent={this._renderEmptyComponent}
            ref={ref => (this.usersRef = ref)}
            renderItem={({ item, index }) => (
              <Box
                key={item._id}
                first={!index}
                last={index === department.length - 1}
              >
                <BoxTitle
                  onPress={() =>
                    collapsed[index]
                      ? this.collapseDepartment(index)
                      : this.showDepartment(index)
                  }
                >
                  <BoxItem numberOfLines={1} title>
                    {item.title}
                  </BoxItem>
                  <ArrowWrapper pose={collapsed[index] ? 'right' : 'down'}>
                    <ArrowDownIcon />
                  </ArrowWrapper>
                </BoxTitle>
                <Collapsible collapsed={collapsed[index] || false}>
                  <BoxInner>
                    {item.users.map(e => (
                      <BoxInnerItem key={e._id} onPress={() => this.toChat(e)}>
                        {!e.image ||
                        e.image === '/images/default_avatar.jpg' ? (
                          <DefaultAvatar
                            isGroup={e.isGroup}
                            id={e._id}
                            size={36}
                          />
                        ) : (
                          <ContactImage
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
                    ))}
                  </BoxInner>
                </Collapsible>
              </Box>
            )}
            keyExtractor={(item, i) => {
              if (item.title._id) {
                return item.title._id.toString()
              }
              return i.toString()
            }}
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [
                {
                  nativeEvent: { contentOffset: { y: this.scrollY } },
                },
              ],
              {
                useNativeDriver: true,
              },
            )}
          />
          <this.GroupContacts />
        </AnimatedScroll>
      </Wrapper>
    )
  }

  state = {
    collapsed: [],
    allContacts: [],
    users: {
      department: [],
    },
    options: {
      active: 1,
      options: ['Все', 'Пользователи', 'Группы'],
    },
  }
  scrollY = new Animated.Value(0)

  _renderEmptyComponent = () => (
    <Loader hint="Пока нет контактов." style={{ flex: 1 }}>
      <TouchableOpacity onPress={this.toContacts}>
        <Text style={{ color: grey2, textAlign: 'center' }}>
          Похоже произошла ошибка, обратитесь к администратору системы
        </Text>
      </TouchableOpacity>
    </Loader>
  )

  AllContacts = () => {
    const { user } = this.props
    const { allContacts } = this.state
    return (
      <ContactList
        bounces={false}
        contentContainerStyle={{ paddingBottom: 140, paddingTop: 10 }}
        data={allContacts}
        ListEmptyComponent={this._renderEmptyComponent}
        ref={ref => (this.allRef = ref)}
        renderItem={({ item }) => {
          const { participants, creator, _id, name, isGroup } = item
          const chatItem = creator._id === user._id ? participants[0] : creator
          const { first_name, last_name, phone_number, role, image } = chatItem
          const chatName = isGroup
            ? name
            : first_name
            ? `${first_name} ${last_name}`
            : phone_number
          return item ? (
            <BoxInnerItem key={_id} onPress={() => this.toChat(item)}>
              {!image ||
              image === '/images/default_avatar.jpg' ||
              image === '/images/default_group.png' ? (
                <DefaultAvatar id={item._id} size={36} />
              ) : (
                <ContactImage
                  source={{ uri: `https://testser.univ.team${image}` }}
                />
              )}
              <ContactInfo>
                <ContactName>{chatName}</ContactName>
                {isGroup && (
                  <ContactRole>
                    {`${participants.length + 1} участника`}
                  </ContactRole>
                )}
                {!isGroup && role && <ContactRole>{role.name}</ContactRole>}
              </ContactInfo>
            </BoxInnerItem>
          ) : null
        }}
        keyExtractor={item => item._id.toString()}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [
            {
              nativeEvent: { contentOffset: { y: this.scrollY } },
            },
          ],
          {
            useNativeDriver: true,
          },
        )}
      />
    )
  }

  GroupContacts = () => {
    const { dialogs, user } = this.props
    return (
      <ContactList
        bounces={false}
        contentContainerStyle={{ paddingBottom: 140, paddingTop: 10 }}
        data={dialogs}
        ListEmptyComponent={this._renderEmptyComponent}
        ref={ref => (this.groupRef = ref)}
        renderItem={({ item }) => {
          const { participants, creator, _id, name, isGroup } = item
          const chatItem = creator._id === user._id ? participants[0] : creator
          const { image } = chatItem
          return isGroup ? (
            <BoxInnerItem key={_id} onPress={() => this.toChat(item)}>
              {image === '/images/default_avatar.jpg' ? (
                <DefaultAvatar isGroup={isGroup} id={_id} size={36} />
              ) : (
                <ContactImage
                  source={{ uri: `https://testser.univ.team${image}` }}
                />
              )}
              <ContactInfo>
                <ContactName>{name}</ContactName>
                <ContactRole>{participants.length + 1} участника</ContactRole>
              </ContactInfo>
            </BoxInnerItem>
          ) : null
        }}
        keyExtractor={item => item._id.toString()}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [
            {
              nativeEvent: { contentOffset: { y: this.scrollY } },
            },
          ],
          {
            useNativeDriver: true,
          },
        )}
      />
    )
  }

  componentDidMount() {
    const { collapsed, users } = this.state
    const { user, dialogs } = this.props
    const { department } = users
    const allContacts = [...dialogs].filter(e => e._id !== user._id)
    department.forEach(dep => {
      dep.users.forEach(e => {
        const exists = dialogs.findIndex(chat => chat._id === e._id) !== -1
        const chat = dialogs.filter(
          chat => chat._id === e._id && chat._id === user._id,
        )[0]
        const nonExisting = {
          ...e,
          creator: e,
          participants: e,
          room: `${e._id}_${user._id}`,
        }
        const conditon = exists || e._id !== user._id
        conditon && allContacts.push(chat || nonExisting)
      })
    })
    setTimeout(() => this.setState({ allContacts }), 0)
    const newCollapsed = [...collapsed]
    users.department.forEach(() => {
      newCollapsed.push(false)
    })
    sendRequest({
      r_path: g_users,
      method: 'get',
      success: res => {
        // console.log('get users')
        const { users } = this.state
        const newUsers = { ...users }
        const newDepartment = [...users.department]
        res.users.forEach(user => {
          const department = newUsers.department.filter(e => {
            if (e.title && user.department) {
              return (
                e.title === user.department ||
                e.title === 'без департамента'
              )
            }
            return false
          })[0]
          if (department) {
            const index = newUsers.department.findIndex(e => {
              return (
                e.title === user.department ||
                e.title === 'без департамента'
              )
            })
            newDepartment[index].users.push(user)
          } else {
            newDepartment.push({
              title: user.department || 'без департамента',
              users: [user],
            })
          }
          newUsers.department = [...newDepartment]
        })
        this.setState({ users: newUsers })
      },
      failFunc: err => {
        // console.log({ err })
      },
    })
    this.setState({ collapsed: newCollapsed })
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

  setAnimatedValue = e => {
    switch (e) {
      case 0:
        this.allRef.getNode().scrollToOffset({ offset: 0, animated: false })
        break
      case 1:
        this.usersRef.getNode().scrollToOffset({ offset: 0, animated: false })
        break
      case 2:
        this.groupRef.getNode().scrollToOffset({ offset: 0, animated: false })
        break
      default:
        this.scrollY = new Animated.Value(0)
    }
  }

  selectOption = e => {
    const {
      options,
      options: { active },
    } = this.state
    this.setAnimatedValue(active)
    this.setState({ options: { ...options, active: e } })
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
    } = this.props
    const currentRoom = dialogs.filter(
      dialog =>
        dialog.room === `${e._id}_${user._id}` ||
        dialog.room === `${user._id}_${e._id}`,
    )[0]
    if (currentRoom) {
      const { isGroup, participants, creator, room, _id } = currentRoom
      const roomId = room.split('_').filter(e => e !== user._id)[0]
      const currentDialog = isGroup
        ? { ...e }
        : user._id === creator._id
        ? { ...participants[0] }
        : { ...creator }
      setRoom(roomId)
      setCurrentRoomId(_id)
      setCurrentChat(room)
      setCurrentDialogs(currentDialog)
      socket.emit('view', { room, viewer: user._id })
    } else {
      const { room, _id } = e
      const roomId = _id
      setRoom(roomId)
      setCurrentRoomId(_id)
      setCurrentChat(room)
      setCurrentDialogs(e)
    }
    navigate(e.isGroup ? 'Group' : 'Chat')
  }
}

const mapStateToProps = state => ({
  dialogs: state.dialogsReducer.dialogs,
  user: state.userReducer.user,
})
const mapDispatchToProps = dispatch => ({
  getMessages: _ => dispatch(getMessages(_)),
  setRoom: _ => dispatch(setRoom(_)),
  setDialogs: _ => dispatch(setDialogs(_)),
  addMessage: _ => dispatch(addMessage(_)),
  setAllUsers: _ => dispatch(setAllUsers(_)),
  setContacts: _ => dispatch(setContacts(_)),
  setCurrentChat: _ => dispatch(setCurrentChat(_)),
  setCurrentRoomId: _ => dispatch(setCurrentRoomId(_)),
  setCurrentDialogs: _ => dispatch(setCurrentDialogs(_)),
})
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Content)
