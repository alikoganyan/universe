import React, { Component } from 'react';
import {
	View,
	Text,
	SafeAreaView,
	FlatList,
	Image,
	TouchableOpacity,
	ScrollView,
	Dimensions
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
	getMessages,
	setRoom,
	addMessage,
	setCurrentChat,
	setCurrentRoomId
} from '../../actions/messageActions';
import { setDialogs, setCurrentDialogs } from '../../actions/dialogsActions';
import { socket } from '../../utils/socket';

const { Colors, sidePadding, HeaderHeight } = helper;
const {
	green,
	black,
	grey2,
	blue
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
const Animated = styled(AnimatedScrollView)
`
	display: flex;
	flex-direction: row;
	width: ${Dimensions.get('window').width * 3};
	flex: 1;
`;
const AnimatedBox = posed.View({
	visible: { flex: 1 },
	hidden: { flex: 0 }
});
const AnimatedArrowWrapper = posed.View({
	down: { rotate: '0deg', },
	right: { rotate: '-90deg', }
});
const Wrapper = styled(View)
`
	background: white;
	margin-bottom: 40px;
	height: ${Dimensions.get('window').height - HeaderHeight - 20}px;
	overflow: hidden;
`;
const ContactList = styled(ScrollView)
`
	padding: 20px 40px 10px;
	max-width: 100%;
	overflow: hidden;
	flex: 1;
`;
const Box = styled(View)
`
	padding-top: 20px;
	border: 1px solid #E8EBEE;
	border-width: 0;
	border-top-width: 1px;
	border-bottom-width: ${({ last }) => (last ? 1 : 0)}px;
`;
const BoxTitle = styled(TouchableOpacity)
`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: flex-start;
`;
const BoxInner = styled(AnimatedBox)
`
	padding-bottom: 20px;
	border: 1px solid #E8EBEE;
	border-width: 0;
	border-top-width: 1px;
	border-bottom-width: ${({ last }) => (last ? 1 : 0)}px;
`;
const BoxItem = styled(Text)
`
	padding-bottom: ${({ title }) => (title ? 20 : 0)}px;
	color: #A7B0BA;
	flex: 1;
	width: 80%;
`;
const BoxInnerItem = styled(TouchableOpacity)
`
	padding: 20px 5px;
	padding-bottom: ${({ title }) => (title ? 20 : 0)}px;
	display: flex;
	flex-direction: row;
	align-items: center;

`;
const ContactImage = styled(Image)
`
	width: 36px;
	height: 36px;
	border-radius: 18;
`;
const ContactInfo = styled(View)
`
	display: flex;
	align-items: flex-start;
	justify-content: center;
	margin-left: 10px;
`;
const ContactName = styled(Text)
``;
const ContactRole = styled(Text)
`
	color: #A7B0BA;

`;
const ArrowWrapper = styled(AnimatedArrowWrapper)
`
	
`;
const Options = styled(View)
`
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
const Option = styled(Text)
`
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
		const { users, collapsed, options, allContacts } = this.state;
		const { department } = users;
		const { active } = options;
		console.log('UPDATE');
		return (
			<Wrapper>
				{allContacts.length ? (
					<>
						<Options>
							{options.options.map((e, i) => (
								<TouchableOpacity key={i} onPress={() => this.selectOption(i)}>
									<Option active={active % 3 === i}>{e}</Option>
								</TouchableOpacity>
							))}
						</Options>
						<Animated pose={active === 0 ? 'left' : (active === 1 ? 'center' : 'right')}>
							<ContactList style={{ width: '100%' }} >
								<this.AllContacts />
							</ContactList>
							<ContactList>
								<FlatList
									data={department}
									renderItem={({ item, index }) => (
										<Box key={item._id} last={index === department.length - 1}>
											<BoxTitle onPress={() => (collapsed[index] ?
												this.collapseDepartment(index) :
												this.showDepartment(index))}
											>
												<BoxItem numberOfLines={1} title>{item.title.name}</BoxItem>
												<ArrowWrapper pose={collapsed[index] ? 'right' : 'down'}>
													<ArrowDownIcon />
												</ArrowWrapper>
											</BoxTitle>
											<Collapsible collapsed={collapsed[index] || false}>
												<BoxInner>
													{item.users.map(e => (
														<BoxInnerItem
															key={e._id}
															onPress={() => this.toChat(e)}
														>
															{
															(!e.image || e.image === '/images/default_avatar.jpg') ?
																<DefaultAvatar isGroup={e.isGroup} id={e._id} size={36} /> : (
																	<ContactImage
																		source={{ uri: `http://ser.univ.team${e.image}` }}
																	/>
																)
															}
															<ContactInfo>
																<ContactName>
																{e.first_name ?
																	`${e.first_name} ${e.last_name}` :
																	e.phone_number
																}
																</ContactName>
																{e.role ?
																	<ContactRole>{e.role.name}</ContactRole> :
																	null
																}
															</ContactInfo>
														</BoxInnerItem>
													))}
												</BoxInner>
											</Collapsible>
										</Box>
									)}
								/>
							</ContactList>
							<ContactList style={{ width: '100%' }}>
								<this.GroupContacts />
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
			</Wrapper>
		);
	}

	state = {
		collapsed: [],
		allContacts: [],
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
	}

	AllContacts = () => {
		const { user } = this.props;
		const { allContacts } = this.state;
		return (
			<FlatList
				style={{ paddingRight: 5, paddingLeft: 5, flex: 1 }}
				data={allContacts}
				renderItem={({ item }) => {
					const {
						participants, creator, _id, name, isGroup
					} = item;
					const chatItem = creator._id === user._id ?
						participants[0] :
						creator;
					const {
						first_name, last_name, phone_number, role, image
					} = chatItem;
					const chatName = isGroup ?
						name :
						first_name ?
							`${first_name} ${last_name}` :
							phone_number;
					return item ? (
						<BoxInnerItem key={_id} onPress={() => this.toChat(item)}>
							{ !image || image === '/images/default_avatar.jpg' || image === '/images/default_group.png' ?
			                	<DefaultAvatar id={item._id} size={36} /> :
								<ContactImage source={{ uri: `http://ser.univ.team${image}` }} />
			                }
							<ContactInfo>
								<ContactName>{chatName}</ContactName>
								{isGroup && (
									<ContactRole>
										{`${participants.length + 1} участника`}
									</ContactRole>
								)}
								{(!isGroup && role) && (
									<ContactRole>
										{role.name}
									</ContactRole>
								)}
							</ContactInfo>
						</BoxInnerItem>
					) : null;
				}}
				keyExtractor={item => item._id.toString()}
			/>
		);
	}

	GroupContacts = () => {
		const { dialogs, user } = this.props;
		return (
			<FlatList
				style={{ paddingRight: 5, paddingLeft: 5, flex: 1 }}
				data={dialogs}
				renderItem={({ item }) => {
				const {
					participants, creator, _id, name, isGroup
				} = item;
				const chatItem = creator._id === user._id ? participants[0] : creator;
				const { image } = chatItem;
				return isGroup ? (
					<BoxInnerItem key={_id} onPress={() => this.toChat(item)}>
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
				keyExtractor={item => item._id.toString()}
			/>
		);
	}

	componentDidMount() {
		const { collapsed, users } = this.state;
		const { user, dialogs } = this.props;
		const { department } = users;
		const allContacts = [...dialogs].filter(e => e._id !== user._id);
		department.map((dep) => {
			dep.users.map((e) => {
				const exists = dialogs.findIndex(chat => chat._id === e._id) !== -1;
				const chat = dialogs.filter(chat => chat._id === e._id && chat._id === user._id)[0];
				const nonExisting = { ...e, creator: e, participants: e, room: `${e._id}_${user._id}` };
				const conditon = exists || e._id !== user._id;
				conditon && allContacts.push(chat || nonExisting);
			});
		});
		setTimeout(() => this.setState({ allContacts }), 0);
		const newCollapsed = [...collapsed];
		users.department.map(() => {
			newCollapsed.push(false);
		});
		sendRequest({
			r_path: g_users,
			method: 'get',
			success: (res) => {
				console.log('get users');
				const { users } = this.state;
				const newUsers = { ...users };
				const newDepartment = [...users.department];
				res.users.map((user) => {
					const department = newUsers.department
						.filter(e => e.title.name === user.department.name ||
							e.title.name === 'без департамента')[0];
					if (department) {
						const index = newUsers.department
							.findIndex(e => e.title.name === user.department.name ||
								e.title.name === 'без департамента');
						newDepartment[index].users.push(user);
					} else {
						newDepartment.push({
							title: user.department ||
								'без департамента',
							users: [user]
						});
					}
					newUsers.department = [...newDepartment];
				});
				this.setState({ users: newUsers });
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
		const { length } = options.options;
		newState.active = options.active < length - 1 ? options.active + 1 : 0;
		this.setState({ options: newState });
	}

	optionRight = () => {
		const { options } = this.state;
		const newState = { ...options };
		const { length } = options.options;
		newState.active = options.active > 0 ? options.active - 1 : length - 1;
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
			setRoom,
			setCurrentChat,
			navigate,
			user,
			setCurrentDialogs,
			setCurrentRoomId,
			dialogs,
		} = this.props;
		const currentRoom = dialogs
			.filter(dialog => dialog.room === `${e._id}_${user._id}` ||
				dialog.room === `${user._id}_${e._id}`)[0];
		if (currentRoom) {
			const {
				isGroup,
				participants,
				creator,
				room,
				_id,
			} = currentRoom;
			const roomId = room.split('_').filter(e => e !== user._id)[0];
			const currentDialog = isGroup ? { ...e } :
				user._id === creator._id ? { ...participants[0] } : { ...creator };
			setRoom(roomId);
			setCurrentRoomId(_id);
			setCurrentChat(room);
			setCurrentDialogs(currentDialog);
			socket.emit('view', { room, viewer: user._id });
		} else {
			const {
				room,
				_id,
			} = e;
			const roomId = _id;
			setRoom(roomId);
			setCurrentRoomId(_id);
			setCurrentChat(room);
			setCurrentDialogs(e);
		}
		navigate(e.isGroup ? 'Group' : 'Chat');
	}
}

const mapStateToProps = state => ({
	dialogs: state.dialogsReducer.dialogs,
	user: state.userReducer.user,
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
