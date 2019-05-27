import React, { Component } from 'react'
import { View, Text, FlatList, Dimensions, StatusBar, BackHandler } from 'react-native'
import styled from 'styled-components'
import { Header, Dialog } from './index'
import { SafeAreaView } from '../../common'
import { connect } from 'react-redux';
import { getMessages, setRoom, addMessage, setCurrentChat, setCurrentRoomId } from '../../actions/messageActions'
import { setDialogs, setCurrentDialogs } from '../../actions/dialogsActions'
import { setAllUsers } from '../../actions/userActions'
import helper from '../../utils/helpers'
import { socket } from '../../utils/socket'

const { sidePadding, HeaderHeight } = helper;
const Wrapper = styled(View)`
  height: 100%;
`
const StyledFlatList = styled(FlatList)`
  height: 100%;
`

class Dialogs extends Component {

	render() {
		const { dialogs, user } = this.props
		const { FlatListData } = this.state;
		return (
			<SafeAreaView behavior={'padding'}>
				<Wrapper>
					<Header toProfile={this.toProfile} toggleDrawer={this.props.navigation.openDrawer} />
					<StyledFlatList
						ListHeaderComponent={<View style={{ margin: 30, }} />}
						ref={(ref) => { this.flatList = ref; }}
						data={dialogs}
						keyboardShouldPersistTaps={'always'}
						renderItem={(dialog) => {
							const { item } = dialog
							const { creator, participants, messages, name, text, isGroup, room } = item
							const chatName = !isGroup ?
								user._id !== creator._id ?
									(creator.first_name ? `${creator.first_name} ${creator.last_name}` : creator.phone_number) :
									(participants[0] && participants[0].first_name ? `${participants[0].first_name} ${participants[0].last_name}` : participants[0].phone_number) :
								(name || room)
							const image = !isGroup ?
								(user._id === creator ? user.image : participants[0].image) : '';
							return <Dialog lastMessage={messages} onClick={() => this.toChat(item)} image={image} title={chatName} item={item}>{text}</Dialog>
						}}
						keyExtractor={(item, index) => index.toString()}
					/>
				</Wrapper>
			</SafeAreaView>
		)
	}
	state = {
		FlatListData: []
	}
	componentDidMount() {
		const { user, addMessage, setDialogs, navigation } = this.props;
		// navigation.navigate('NewGroup') // restore 
		BackHandler.addEventListener('hardwareBackPress', () => true)
		socket.removeListener('update_dialogs', this.setDialogsSocket);
		socket.removeListener('new_message', this.newMessageSocket);
		socket.emit('get_dialogs', { id: user._id })
		socket.on('update_dialogs', e => this.setDialogsSocket(e))
		socket.on('new_message', e => this.newMessageSocket(e))
		socket.on('new_dialogs', e => { })
		socket.on('need_update', e => {
			socket.emit('get_dialogs', { id: user._id })
		})
		socket.on('dialog_opened', e => { })
		socket.on('new_group', e => {
			// socket.emit('subscribe_to_group', {room: e.room})
		})
	}
	setDialogsSocket = (e) => {
		const { setDialogs } = this.props;
		setDialogs(e.dialogs)
	}
	newMessageSocket = (e) => {
		const { dialogs, currentRoom, user, addMessage, setDialogs, navigation } = this.props
		const message = {
			...e, text: e.message, type: 'text', created_at: new Date(), sender: {
				_id: e.sender._id
			}
		}
		const newDialogs = [...dialogs]
		const newDialog = newDialogs.filter(event => event.room === e.room)[0]
		newDialog.messages = [...newDialog.messages, message]
		newDialogs[newDialogs.findIndex(event => event.room === e.room)] = newDialog
		console.log('new message', e)
		setDialogs(newDialogs)
		addMessage(message)
	}
	componentWillUnmount() {
		socket.removeListener('new_dialog');
		socket.removeListener('new_group');
	}
	toProfile = e => {
		this.props.navigation.navigate('Profile')
	}
	news = e => {

	}
	getUsers = e => {
		const { setAllUsers } = this.props;
		setAllUsers(e);
	}
	find = e => {
		setDialogs(e.result)

	}
	selectChat = e => {
		const { getMessages } = this.props;
		getMessages(e)
	}
	chatMessage = e => {
		const { addMessage, dialogs } = this.props
		addMessage(e)
		const { FlatListData } = this.state
		const newFlatListData = [...dialogs]
		newFlatListData.sort((a, b) => {
			return new Date(a.lastMessage) - new Date(b.lastMessage)
		})
		// this.setState({ FlatListData: newFlatListData })?
	}
	newMessage = e => {
		const { senderId, chatId } = e
		const { user, currentChat, dialogs } = this.props
		const chat = chatId.split('room')[1].replace(/\_/, '').replace(senderId, '')
		const { FlatListData } = this.state
		const newFlatListData = [...dialogs]
		const index = newFlatListData.findIndex((event) => {
			return event.id === e.senderId
		})
		const myIndex = newFlatListData.findIndex((event) => {
			return event.id === user.id
		})
		if (newFlatListData[index] || newFlatListData[myIndex]) {
			if (chat == user.id) newFlatListData[index].text = e.text
			if (senderId == user.id) newFlatListData[myIndex].text = e.text
		}
		newFlatListData.sort((a, b) => {
			return new Date(b.lastMessage) - new Date(a.lastMessage)
		})
		if (chat == user.id || senderId == user.id) setDialogs(newFlatListData)
	}
	dialogs = e => {
		const { user } = this.props
		const { dialogs, messages, unread } = e;
		const newDialogs = [];
		dialogs.map(e => {
			const message = messages.filter(message => {
				const room = user.id >= e.id ? `room${user.id}_${e.id}` : `room${e.id}_${user.id}`
				return message ? room === message.chatId : false;
			})[0];
			const unreadMessage = unread.filter(unreadMessage => {
				return unreadMessage ? e.id === unreadMessage.chatId : false;
			})[0];
			newDialogs.push({ title: e.phone, text: message ? message.text : ' no messages yet', id: e.id, unreadMessage, lastMessage: message ? message.timeSent : null })
		})
		newDialogs.sort((x, y) => {
			return x.lastMessage < y.lastMessage
		});
		setDialogs(newDialogs)
	}
	toChat = e => {
		const { setRoom, setCurrentChat, navigation, getMessages, user, setCurrentDialogs, setCurrentRoomId } = this.props
		const { isGroup } = e
		const roomId = e.room.split('_').filter(e => e != user._id)[0]
		setRoom(roomId)
		setCurrentRoomId(e._id);
		setCurrentChat(e.room)
		setCurrentDialogs(isGroup ?
			e :
			user._id === e.creator._id ? e.participants[0] : e.creator)
		getMessages(e.messages);
		socket.emit('view', { room: e.room, viewer: user._id })
		navigation.navigate(e.isGroup ? 'Group' : 'Chat')
	}
	toGroup = e => {
		const { navigation } = this.props
		navigation.navigate('Group')
	}
}


const mapStateToProps = state => {
	return {
		messages: state.messageReducer.messages,
		dialogs: state.dialogsReducer.dialogs,
		currentRoom: state.messageReducer.currentRoom,
		currentChat: state.messageReducer.currentChat,
		user: state.userReducer.user,
		users: state.userReducer
	};
};
const mapDispatchToProps = dispatch => ({
	getMessages: _ => dispatch(getMessages(_)),
	setRoom: _ => dispatch(setRoom(_)),
	setCurrentChat: _ => dispatch(setCurrentChat(_)),
	setDialogs: _ => dispatch(setDialogs(_)),
	addMessage: _ => dispatch(addMessage(_)),
	setAllUsers: _ => dispatch(setAllUsers(_)),
	setCurrentDialogs: _ => dispatch(setCurrentDialogs(_)),
	setCurrentRoomId: _ => dispatch(setCurrentRoomId(_)),
})
export default connect(mapStateToProps, mapDispatchToProps)(Dialogs)
