import React, { Component } from 'react';
import {
  View, Text, SafeAreaView, FlatList, Image, TouchableOpacity, ScrollView, Dimensions
} from 'react-native';
import styled from 'styled-components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import posed from 'react-native-pose';
import Collapsible from 'react-native-collapsible';
import { connect } from 'react-redux';
import helper from '../../utils/helpers';
import DefaultAvatar from '../../common/DefaultAvatar';
import Loader from '../../common/Loader';
import { ArrowDownIcon } from '../../assets/index';
import sendRequest from '../../utils/request';
import { g_users } from '../../constants/api';
import { setContacts, setAllUsers } from '../../actions/userActions';
import {
  getMessages, setRoom, addMessage, setCurrentChat, setCurrentRoomId
} from '../../actions/messageActions';
import { setDialogs, setCurrentDialogs } from '../../actions/dialogsActions';

const { Colors, sidePadding } = helper;
const {
  green, black, grey2, blue
} = Colors;
const AnimatedScrollView = posed.View({
  left: {
    x: 0,
    transition: { duration: 300, ease: 'easeOut' }
  },
  center: {
    x: -Dimensions.get('window').width,
    transition: { duration: 300, ease: 'easeOut' },
  },


  right: {
    x: -Dimensions.get('window').width * 2,
    transition: { duration: 300, ease: 'easeOut' }
  },

});
const Animated = styled(AnimatedScrollView)`
    display: flex;
    flex-direction: row;
    width: ${Dimensions.get('window').width * 3};
`;
const AnimatedBox = posed.View({
  visible: { flex: 1 },
  hidden: { flex: 0 }
});
const AnimatedArrowWrapper = posed.View({
  down: { rotate: '0deg', },
  right: { rotate: '-90deg', }
});
const Wrapper = styled(View)`
    padding: 0 ${sidePadding}px;
    background: white;
    margin-bottom: 40px;
    
`;
const ContactList = styled(ScrollView)`
    padding: 20px;
    padding-bottom: 10px;
    max-width: ${Dimensions.get('window').width - sidePadding * 2}px;
    overflow: hidden;
    margin-left: ${sidePadding}px;
    flex: 1;
`;
const Box = styled(View)`
    padding-top: 20px;
    border: 1px solid #E8EBEE;
    border-width: 0;
    border-top-width: 1px;
    border-bottom-width: ${({ last }) => (last ? 1 : 0)}px;
`;
const BoxTitle = styled(TouchableOpacity)`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
`;
const BoxInner = styled(AnimatedBox)`
    padding-bottom: 20px;
    border: 1px solid #E8EBEE;
    border-width: 0;
    border-top-width: 1px;
    border-bottom-width: ${({ last }) => (last ? 1 : 0)}px;
`;
const BoxItem = styled(Text)`
    padding-bottom: ${({ title }) => (title ? 20 : 0)}px;
    color: #A7B0BA;
    flex: 1;
    width: 80%;
`;
const BoxInnerItem = styled(TouchableOpacity)`
    padding: 20px 5px;
    padding-bottom: ${({ title }) => (title ? 20 : 0)}px;
    display: flex;
    flex-direction: row;
    align-items: center;

`;
const ContactImage = styled(Image)`
    width: 36px;
    height: 36px;
    border-radius: 18;
`;
const ContactInfo = styled(View)`
    display: flex;
    align-items: flex-start;
    justify-content: center;
    margin-left: 10px;
`;
const ContactName = styled(Text)``;
const ContactRole = styled(Text)`
    color: #A7B0BA;

`;
const ArrowWrapper = styled(AnimatedArrowWrapper)`
    
`;
const Options = styled(View)`
    display: flex;
    align-self: center;
    background: ${green};
    flex-direction: row;
    justify-content: space-between;
    border-radius: 14;
    padding: 1px;
    overflow: hidden;
    width: 90%;
`;
const Option = styled(Text)`
    color: ${({ active }) => (active ? black : 'white')};
    background: ${({ active }) => (active ? 'white' : 'transparent')};
    border: ${({ active }) => (active ? '1px rgba(0, 0, 0, 0.1) solid' : '0')};
    border-color: ${({ active }) => (active ? 'rgba(0, 0, 0, 0.1)' : 'transparent')};
    border-style: solid;
    min-width: 27%;
    border-radius: 13;
    padding: 4px 10px 3px;
    overflow: hidden;
    text-align: center;
`;
class Content extends Component {
  render() {
    const { users, collapsed, options } = this.state;
    const { user, dialogs } = this.props;
    const { department } = users;
    const { active } = options;
    return (
      <SafeAreaView>
        <Wrapper>
          <KeyboardAwareScrollView enableOnAndroid style={{ height: '100%' }}>
            {dialogs.length
              ? (
                <>
                  <Options>
                    {options.options.map((e, i) => (
                      <TouchableOpacity key={i} onPress={() => this.selectOption(i)}>
                        <Option active={active % 3 === i}>{e}</Option>
                      </TouchableOpacity>
                    ))
                                    }
                  </Options>
                  <Animated pose={active === 0 ? 'left' : (active === 1 ? 'center' : 'right')}>
                    <ContactList style={{ width: '100%' }}>
                      <FlatList
                        style={{ paddingRight: 5, paddingLeft: 5, }}
                        data={dialogs}
                        renderItem={({ item, index }) => {
                          const {
                            participants, creator, _id, name, isGroup
                          } = item;
                          const chatItem = creator._id === user._id ? participants[0] : creator;
                          const {
                            first_name, last_name, phone_number, role, image
                          } = chatItem;
                          const chatName = isGroup
                            ? name
                            : first_name ? `${first_name} ${last_name}` : phone_number;
                          return item ? (
                            <BoxInnerItem key={index} onPress={() => this.toChat(item)}>
                              {
                                                        image === '/images/default_avatar.jpg'
                                                          ? <DefaultAvatar isGroup={isGroup} id={_id} size={36} />
                                                          : <ContactImage source={{ uri: `http://ser.univ.team${image}` }} />
                                                    }
                              <ContactInfo>
                                <ContactName>{chatName}</ContactName>
                                {isGroup && <ContactRole>{`${participants.length + 1} участника`}</ContactRole>}
                                {(!isGroup && role) && <ContactRole>{role.name}</ContactRole>}
                              </ContactInfo>
                            </BoxInnerItem>
                          ) : null;
                        }}
                        keyExtractor={(item, index) => index.toString()}
                      />
                    </ContactList>
                    <ContactList>
                      {department.map((e, i) => (
                        <Box key={i} last={i === department.length - 1}>
                          <BoxTitle onPress={() => (collapsed[i] ? this.collapseDepartment(i) : this.showDepartment(i))}>
                            <BoxItem numberOfLines={1} title>{e.title.name}</BoxItem>
                            <ArrowWrapper pose={collapsed[i] ? 'right' : 'down'}>
                              <ArrowDownIcon />
                            </ArrowWrapper>
                          </BoxTitle>
                          <Collapsible collapsed={collapsed[i] || false}>
                            <BoxInner>
                              {dialogs.map((e, i) => {
                                const { creator, participants, isGroup } = e;
                                const item = creator._id === user._id ? participants[0] : creator;
                                const {
                                  image, first_name, last_name, phone_number, post, role
                                } = item;
                                const name = first_name ? `${first_name} ${last_name}` : phone_number;
                                return !isGroup && (
                                <BoxInnerItem key={i} onPress={() => this.toChat(e)}>
                                  {
                                                                    image === '/images/default_avatar.jpg'
                                                                      ? <DefaultAvatar isGroup={isGroup} id={item._id} size={36} />
                                                                      : <ContactImage source={{ uri: `http://ser.univ.team${image}` }} />
                                                                }
                                  <ContactInfo>
                                    <ContactName>{name}</ContactName>
                                    {post ? <ContactRole>{post}</ContactRole> : null}
                                  </ContactInfo>
                                </BoxInnerItem>
                                );
                              })}
                            </BoxInner>
                          </Collapsible>
                        </Box>
                      ))}
                    </ContactList>
                    <ContactList style={{ width: '100%' }}>
                      <FlatList
                        style={{ paddingRight: 5, paddingLeft: 5, }}
                        data={dialogs}
                        renderItem={({ item, index }) => {
                          const {
                            participants, creator, _id, name, isGroup
                          } = item;
                          const chatItem = creator._id === user._id ? participants[0] : creator;
                          const {
                            first_name, last_name, phone_number, role, image
                          } = chatItem;
                          return isGroup ? (
                            <BoxInnerItem key={index} onPress={() => this.toChat(item)}>
                              {
                                                        image === '/images/default_avatar.jpg'
                                                          ? <DefaultAvatar isGroup={isGroup} id={_id} size={36} />
                                                          : <ContactImage source={{ uri: `http://ser.univ.team${image}` }} />
                                                    }
                              <ContactInfo>
                                <ContactName>{name}</ContactName>
                                <ContactRole>
                                  {participants.length + 1}
                                  {' '}
участника
                                </ContactRole>
                              </ContactInfo>
                            </BoxInnerItem>
                          ) : null;
                        }}
                        keyExtractor={(item, index) => index.toString()}
                      />
                    </ContactList>
                  </Animated>
                </>
              ) : (
                <Loader hint="Пока нет диалогов" style={{ flex: 1, height: '100%' }}>
                  <TouchableOpacity onPress={this.toContacts}>
                    <Text style={{ color: grey2, textAlign: 'center' }}>
Откройте первый диалог, выбрав пользователя
                      <Text style={{ color: blue }}> на странице контактов</Text>
                    </Text>
                  </TouchableOpacity>
                </Loader>
              )}
          </KeyboardAwareScrollView>
        </Wrapper>
      </SafeAreaView>
    );
  }

    state = {
      collapsed: [],
      users: {
        department: [],
      },
      options: {
        active: 1,
        options: [
          'Все',
          'Пользователи',
          'Группы'
        ]
      },
      groups: [
        { title: 'длинное корпоративное название группы', participants: 15 },
      ],
      allUsers: [
        { name: 'Константин Константинопольский', uri: 'https://facebook.github.io/react/logo-og.png' },
      ]
    }

    componentDidMount() {
      const { collapsed } = this.state;
      const newCollapsed = [...collapsed];
      for (let i = 0; i <= this.state.users.department.length; i++) {
        newCollapsed.push(false);
      }
      sendRequest({
        r_path: g_users,
        method: 'get',
        success: (res) => {
          const { users } = this.state;
          const newUsers = { ...users };
          const newDepartment = [...users.department];
          res.users.map((user) => {
            const { users } = this.state;
            const department = users.department.filter(e => e.title.name === user.department.name || e.title.name === 'без департамента')[0];
            if (department) {
              const index = users.department.findIndex(e => e.title.name === user.department || e.title.name === 'без департамента');
              newDepartment[index].users.push(user);
            } else {
              newDepartment.push({ title: user.department || 'без департамента', users: [user] });
            }
            newUsers.department = [...newDepartment];
            this.setState({ users: newUsers });
          });
        },
        failFunc: (err) => {
          console.log({ err });
        }
      });
      this.setState({ collapsed: newCollapsed });
    }

    optionLeft = () => {
      const { options } = this.state;
      const newState = { ...options };
      const { length } = this.state.options.options;
      newState.active = this.state.options.active < length - 1 ? this.state.options.active + 1 : 0;
      this.setState({ options: newState });
    }

    optionRight = () => {
      const { options } = this.state;
      const newState = { ...options };
      const { length } = this.state.options.options;
      newState.active = this.state.options.active > 0 ? this.state.options.active - 1 : length - 1;
      this.setState({ options: newState });
    }

    collapseDepartment = (i) => {
      const { collapsed } = this.state;
      const newDCollapsed = [...collapsed];
      newDCollapsed[i] = false;
      this.setState({ collapsed: newDCollapsed });
    }

    showDepartment = (i) => {
      const { collapsed } = this.state;
      const newDCollapsed = [...collapsed];
      newDCollapsed[i] = true;
      this.setState({ collapsed: newDCollapsed });
    }

    selectOption = (e) => {
      const { options } = this.state;
      const newState = { ...options };
      newState.active = e;
      this.setState({ options: newState });
    }

    toChat = (e) => {
      const {
        setCurrentDialogs, setRoom, setCurrentRoomId, navigate, user, getMessages, setCurrentChat
      } = this.props;
      const {
        creator, participants, isGroup, _id, room
      } = e;
      const item = creator._id === user._id ? participants[0] : creator;
      const roomId = room.split('_').filter(e => e != user._id)[0];
      getMessages(e.messages);
      setCurrentDialogs({ ...e, ...item });
      setRoom(roomId);
      setCurrentRoomId(_id);
      setCurrentChat(_id);
      navigate(isGroup ? 'Group' : 'Chat');
    }
}

const mapStateToProps = state => ({
  messages: state.messageReducer,
  dialogs: state.dialogsReducer.dialogs,
  currentRoom: state.messageReducer.currentRoom,
  user: state.userReducer.user,
  users: state.userReducer,
  contacts: state.userReducer.contacts,
});
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

});
export default connect(mapStateToProps, mapDispatchToProps)(Content);
