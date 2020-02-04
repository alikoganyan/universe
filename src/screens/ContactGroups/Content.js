import React, { Component } from 'react'
import {
  View,
  Text,
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
import { setContacts, setReset } from '../../actions/userActions'
import {
  setRoom,
  setCurrentChat,
  setCurrentRoomId,
} from '../../actions/messageActions'
import { setCurrentDialogs, setDialog } from '../../actions/dialogsActions'
import { socket } from '../../utils/socket'
import Header from './Header'
import TabPreHeader from '../../common/TabPreHeader'
import Company from '../../common/Company'
import ImageComponent from '../../common/Image'
import { setProfile } from '../../actions/profileAction'
import _ from 'lodash'
import AnimatedEllipsis from 'react-native-animated-ellipsis'

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
  padding-top: 160px;
  max-width: 100%;
  overflow: hidden;
  flex: 1;
  height: auto;
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
    const { options } = this.state
    const { navigate, connection, companyLoading } = this.props
    const { active } = options

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
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Title style={{ paddingRight: 0 }}>
                {!connection
                  ? 'Соединение'
                  : !!companyLoading
                  ? 'Обновляется'
                  : 'Контакты'}{' '}
              </Title>
              {!!(!connection || companyLoading) && (
                <AnimatedEllipsis
                  style={{ color: 'black', top: -5, fontSize: 35, left: 0 }}
                />
              )}
            </View>
            <Company navigate={navigate} />
          </HeaderContainer>
          <Header
            ref="header"
            onValueChange={
              this.props.user.settings.partition_contacts && active === 1
                ? this.filterWithDepartaments
                : this.filterAllContacts
            }
          />
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
          <this.MiddleContacts />
          <this.GroupContacts />
        </AnimatedScroll>
      </Wrapper>
    )
  }

  state = {
    inputValue: '',
    collapsed: [],
    allContacts: [],
    filtredAllContacts: null,
    filteredUserContactsAll: null,
    filteredGroups: null,
    users: {
      department: [],
    },
    options: {
      active: 1,
      options: ['Все', 'Пользователи', 'Группы'],
    },
    userContacts: [],
    filteredUserContacts: null,
  }
  scrollY = new Animated.Value(0)

  _renderEmptyComponent = () => (
    <Loader marginTop={70} hint="Пока нет контактов." style={{ flex: 1 }}>
      <TouchableOpacity onPress={this.toContacts}>
        <Text style={{ color: grey2, textAlign: 'center' }}>
          Похоже произошла ошибка, обратитесь к администратору системы
        </Text>
      </TouchableOpacity>
    </Loader>
  )

  filterWithDepartaments = val => {
    const { userContacts } = this.state
    const filteredUserContacts = userContacts.map(d => {
      if (d.data && d.data.length) {
        const filtredDep = d.data.filter(
          e =>
            (e.first_name &&
              e.last_name &&
              (e.first_name.toLowerCase() + e.last_name.toLowerCase()).indexOf(
                val.replace(/\s/g, '').toLowerCase(),
              ) !== -1) ||
            (e.name &&
              e.name
                .toLowerCase()
                .replace(/\s/g, '')
                .indexOf(val.replace(/\s/g, '').toLowerCase()) !== -1) ||
            (e.phone_number &&
              e.phone_number
                .toLowerCase()
                .indexOf(val.replace(/\s/g, '').toLowerCase()) !== -1),
        )
        return { ...d, data: [...filtredDep] }
      }
      return d
    })
    this.setState({ filteredUserContacts })
  }

  filterAllContacts = val => {
    const { options, allContacts, userContactsAll } = this.state
    const { dialogs } = this.props
    const { active } = options
    if (active === 0 && allContacts && allContacts.length) {
      const filtredAllContacts = allContacts.filter(
        e =>
          (e.first_name &&
            e.last_name &&
            (e.first_name.toLowerCase() + e.last_name.toLowerCase()).indexOf(
              val.replace(/\s/g, '').toLowerCase(),
            ) !== -1) ||
          (e.name &&
            e.name
              .toLowerCase()
              .replace(/\s/g, '')
              .indexOf(val.replace(/\s/g, '').toLowerCase()) !== -1) ||
          (e.phone_number &&
            e.phone_number
              .toLowerCase()
              .indexOf(val.replace(/\s/g, '').toLowerCase()) !== -1),
      )
      this.setState({ filtredAllContacts: val ? filtredAllContacts : null })
    } else if (active === 1 && userContactsAll && userContactsAll.length) {
      const filtredAllContacts = userContactsAll.filter(
        e =>
          (e.first_name &&
            e.last_name &&
            (e.first_name.toLowerCase() + e.last_name.toLowerCase()).indexOf(
              val.replace(/\s/g, '').toLowerCase(),
            ) !== -1) ||
          (e.phone_number &&
            e.phone_number
              .toLowerCase()
              .indexOf(val.replace(/\s/g, '').toLowerCase()) !== -1),
      )
      this.setState({
        filteredUserContactsAll: val ? filtredAllContacts : null,
      })
    } else if (active === 2 && dialogs && dialogs.length) {
      const filtredGroups = dialogs.filter(
        e =>
          e.isGroup &&
          e.name &&
          e.name
            .replace(/\s/g, '')
            .toLowerCase()
            .indexOf(val.replace(/\s/g, '').toLowerCase()) !== -1,
      )
      this.setState({ filteredGroups: val ? filtredGroups : null })
    }
  }

  AllContacts = () => {
    const { allContacts, filtredAllContacts } = this.state
    return (
      <ContactList
        bounces={false}
        contentContainerStyle={{ paddingBottom: 170 }}
        data={filtredAllContacts || allContacts}
        ListEmptyComponent={this._renderEmptyComponent}
        ref={ref => (this.allRef = ref)}
        renderItem={({ item }) => {
          if (item.isGroup) {
            return (
              <BoxInnerItem key={item._id} onPress={() => this.toChat(item)}>
                {!item.image || item.image === '/images/default_avatar.jpg' ? (
                  <DefaultAvatar
                    isGroup={item.isGroup}
                    id={item._id}
                    size={36}
                  />
                ) : (
                  <ImageComponent
                    source={{
                      uri: `https://seruniverse.asmo.media${item.image}`,
                    }}
                    size={36}
                  />
                )}
                <ContactInfo>
                  <ContactName>{item.name}</ContactName>
                  <ContactRole>
                    {item.participants.length + 1} участника
                  </ContactRole>
                </ContactInfo>
              </BoxInnerItem>
            )
          }
          return item ? (
            <BoxInnerItem key={item._id} onPress={() => this.toChat(item)}>
              {!item.image || item.image === '/images/default_avatar.jpg' ? (
                <DefaultAvatar id={item._id} size={36} />
              ) : (
                <ImageComponent
                  source={{
                    uri: `https://seruniverse.asmo.media${item.image}`,
                  }}
                  size={36}
                />
              )}
              <ContactInfo>
                <ContactName>
                  {item.first_name
                    ? `${item.first_name} ${item.last_name}`
                    : item.phone_number}
                </ContactName>
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

  MiddleContacts = () => {
    const {
      userContactsAll,
      filteredUserContactsAll,
      userContacts,
      filteredUserContacts,
    } = this.state
    if (this.props.user && this.props.user.company) {
      if (this.props.user.company._id === 0) {
        return (
          <ContactList
            bounces={false}
            contentContainerStyle={{ paddingBottom: 170 }}
            data={filteredUserContactsAll || userContactsAll}
            ListEmptyComponent={this._renderEmptyComponent}
            ref={ref => (this.usersRef = ref)}
            renderItem={({ item }) => (
              <BoxInnerItem key={item._id} onPress={() => this.toChat(item)}>
                {!item.image || item.image === '/images/default_avatar.jpg' ? (
                  <DefaultAvatar id={item._id} size={36} />
                ) : (
                  <ImageComponent
                    source={{
                      uri: `https://seruniverse.asmo.media${item.image}`,
                    }}
                    size={36}
                  />
                )}
                <ContactInfo>
                  <ContactName>
                    {item.first_name
                      ? `${item.first_name} ${item.last_name}`
                      : item.phone_number}
                  </ContactName>
                </ContactInfo>
              </BoxInnerItem>
            )}
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
      } else {
        return (
          <ContactList
            bounces={false}
            contentContainerStyle={{ paddingBottom: 170 }}
            data={
              this.props.user.settings.partition_contacts
                ? filteredUserContacts || userContacts
                : filteredUserContactsAll || this.state.userContactsAll
            }
            ListEmptyComponent={this._renderEmptyComponent}
            ref={ref => (this.usersRef = ref)}
            renderItem={({ item, index }) => {
              if (this.props.user.settings.partition_contacts) {
                return item.data.length ? (
                  <Box
                    key={item._id}
                    first={!index}
                    last={index === this.state.userContacts.length - 1}
                  >
                    <BoxTitle
                      onPress={() =>
                        this.state.collapsed[index]
                          ? this.collapseDepartment(index)
                          : this.showDepartment(index)
                      }
                    >
                      <BoxItem numberOfLines={1} title>
                        {item.name}
                      </BoxItem>
                      <ArrowWrapper
                        pose={this.state.collapsed[index] ? 'right' : 'down'}
                      >
                        <ArrowDownIcon />
                      </ArrowWrapper>
                    </BoxTitle>
                    <Collapsible
                      collapsed={this.state.collapsed[index] || false}
                    >
                      <BoxInner>
                        {item.data.map(e => (
                          <BoxInnerItem
                            key={e._id}
                            onPress={() => this.toChat(e)}
                          >
                            {!e.image ||
                            e.image === '/images/default_avatar.jpg' ? (
                              <DefaultAvatar
                                isGroup={e.isGroup}
                                id={e._id}
                                size={36}
                              />
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
                                <ContactRole>{e.role.name}</ContactRole>
                              ) : null}
                            </ContactInfo>
                          </BoxInnerItem>
                        ))}
                      </BoxInner>
                    </Collapsible>
                  </Box>
                ) : null
              }

              return item ? (
                <BoxInnerItem key={item._id} onPress={() => this.toChat(item)}>
                  {!item.image ||
                  item.image === '/images/default_avatar.jpg' ? (
                    <DefaultAvatar id={item._id} size={36} />
                  ) : (
                    <ImageComponent
                      source={{
                        uri: `https://seruniverse.asmo.media${item.image}`,
                      }}
                      size={36}
                    />
                  )}
                  <ContactInfo>
                    <ContactName>
                      {item.first_name
                        ? `${item.first_name} ${item.last_name}`
                        : item.phone_number}
                    </ContactName>
                  </ContactInfo>
                </BoxInnerItem>
              ) : null
            }}
            keyExtractor={(item, i) => {
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
        )
      }
    } else {
      return null
    }
  }

  GroupContacts = () => {
    const { dialogs } = this.props
    const { filteredGroups } = this.state
    return (
      <ContactList
        bounces={false}
        contentContainerStyle={{ paddingBottom: 170 }}
        data={filteredGroups || dialogs}
        ListEmptyComponent={this._renderEmptyComponent}
        ref={ref => (this.groupRef = ref)}
        renderItem={({ item }) => {
          const { participants, _id, name, isGroup, image } = item
          return isGroup ? (
            <BoxInnerItem key={_id} onPress={() => this.toChat(item)}>
              {!image || image === '/images/default_avatar.jpg' ? (
                <DefaultAvatar isGroup={item.isGroup} id={item._id} size={36} />
              ) : (
                <ImageComponent
                  source={{
                    uri: `https://seruniverse.asmo.media${image}`,
                  }}
                  size={36}
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
    this.mount()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.reset) {
      this.props.setReset(false)
      this.mount()
    }
  }

  mount = () => {
    const { collapsed } = this.state
    const { user, dialogs, company } = this.props
    if (company && Object.keys(company).length) {
      const department = company.subdivisions.map(e => {
        e.users_this = e.users_this.filter(({ _id }) => _id !== user._id)
        return e
      })
      let allContacts = _.orderBy(
        company.users.filter(({ _id }) => _id !== user._id),
        [
          user => {
            if (user.first_name) {
              return user.first_name.toLowerCase()
            } else return
          },
        ],
        ['desc'],
      ).reverse()

      const userContactsAll = [...allContacts]
      this.updatedDepartaments = department

      this.subdivisonsThree(department)

      const newCollapsed = [...collapsed]
      department.forEach(() => {
        newCollapsed.push(false)
      })
      this.setState({
        allContacts: [...allContacts, ...dialogs.filter(e => e.isGroup)],
        userContactsAll: userContactsAll,
        collapsed: newCollapsed,
      })
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
    this.updatedDepartaments.forEach(d => {
      d.users_this = d.users_this.filter(u => u._id !== this.props.user._id)
    })

    const data = this.updatedDepartaments.map(e => ({
      id: e._id,
      name: e.name,
      data: e.users_this,
    }))

    this.setState({
      userContacts: data,
    })
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
    if (e !== active) {
      this.refs.header.onBlur()
    }
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

    if (e.isGroup) {
      setCurrentRoomId(e._id)

      this.props.setDialog(e)
    } else {
      this.props.setDialog(currentRoom)
    }
    if (currentRoom) {
      const { isGroup, participants, creator, room, _id } = currentRoom
      const currentDialog = isGroup
        ? { ...e }
        : user._id === creator._id
        ? { ...participants[0] }
        : { ...creator }
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
    navigate(e.isGroup ? 'Group' : 'Chat')
  }
}

const mapStateToProps = state => ({
  dialogs: state.dialogsReducer.dialogs,
  user: state.userReducer.user,
  reset: state.userReducer.reset,
  company: state.userReducer.company,
  connection: state.baseReducer.connection,
  companyLoading: state.dialogsReducer.companyLoading,
})
const mapDispatchToProps = dispatch => ({
  setRoom: _ => dispatch(setRoom(_)),
  setContacts: _ => dispatch(setContacts(_)),
  setCurrentChat: _ => dispatch(setCurrentChat(_)),
  setCurrentRoomId: _ => dispatch(setCurrentRoomId(_)),
  setCurrentDialogs: _ => dispatch(setCurrentDialogs(_)),
  setReset: _ => dispatch(setReset(_)),
  setDialog: _ => dispatch(setDialog(_)),
  setProfile: _ => dispatch(setProfile(_)),
})
export default connect(mapStateToProps, mapDispatchToProps)(Content)
