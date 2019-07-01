import React, { Component } from 'react';
import {
	View,
	Text,
	FlatList,
	Dimensions,
	ImageBackground,
	TouchableOpacity,
	ActionSheetIOS,
	Platform,
	InteractionManager
} from 'react-native';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { BottomSheet } from 'react-native-btr';
import { chatBg } from '../../assets/images';
import helper from '../../utils/helpers';
import Message from '../../common/Message';
import { getMessages } from '../../actions/messageActions';
import { setDialogs } from '../../actions/dialogsActions';
import { setTaskReceivers } from '../../actions/participantsActions';

const { HeaderHeight, borderRadius } = helper;
const Wrapper = styled(View)`
	background: white;
	margin-bottom: ${({ search }) => (search ? HeaderHeight * 2 : HeaderHeight)};
	z-index: 1;
	position: relative;
`;
const Shadow = styled(TouchableOpacity)`
	position: absolute;
	width: ${Dimensions.get('window').width};
	height: ${Dimensions.get('window').height};
	background: rgba(5,5,5,.3);
	top: -${HeaderHeight - 3}px;
	z-index: 4;
`;
const MessageOptions = styled(View)`
	background: white;
	width: 94%;
	position: absolute;
	margin: 0 3%;
	padding: 30px 7% 0;
	bottom: 10px;
	border-radius: ${borderRadius};
	display: flex;
	justify-content: space-around;
	align-items: flex-start;
	z-index: 9999;
`;
const MessageOption = styled(TouchableOpacity)`
	padding-bottom: 30px;
	width: 100%;
`;
const StyledFlatList = styled(FlatList)`
	padding-right: 5; 
	padding-left: 5; 
	z-index: 2;
`;
const FlatListHeader = styled(View)`
	margin: 35px;
`;
const StyledImageBackground = styled(ImageBackground)`
	width: 100%;
	height: 100%; 
`;
class Content extends Component {
	render() {
		const { selectedMessage, animationCompleted } = this.state;
		const {
			search, user, dialogs, currentChat
		} = this.props;
		const dialog = [...dialogs].filter(e => e.room === currentChat)[0];
		const messages = dialog ? dialog.messages : [];
		const reversedMessages = [...messages].sort((x, y) => x.timeSent < y.timeSent);
		return (
			<>
				<Wrapper search={search}>
					<StyledImageBackground source={chatBg}>
						{animationCompleted ? (
							<StyledFlatList
								ListHeaderComponent={<FlatListHeader />}
								inverted
								data={reversedMessages}
								initialNumToRender={15}
								keyboardDismissMode="on-drag"
								animated
								renderItem={({ item, index }) => (
									<TouchableOpacity
										key={index}
										onLongPress={() => this.handleHold(item)}
									>
										<Message>{item}</Message>
									</TouchableOpacity>
								)}
								keyExtractor={(item, index) => index.toString()}
							/>
						) : null}
					</StyledImageBackground>
				</Wrapper>
				<BottomSheet
					visible={selectedMessage._id}
					onBackButtonPress={this.unselect}
					onBackdropPress={this.unselect}
				>
					<MessageOptions>
					{selectedMessage._id && selectedMessage.sender._id === user._id && (
								<MessageOption onPress={this.turnToTask}>
									<Text>Сделать задачей</Text>
								</MessageOption>
					)}
					<MessageOption><Text>Переслать</Text></MessageOption>
					{
						selectedMessage._id && selectedMessage.sender._id === user._id && (
						<>
							<MessageOption onPress={this.turnToTask}>
								<Text>Сделать задачей</Text>
							</MessageOption>
							<MessageOption><Text>Редактировать</Text></MessageOption>
							{/* <MessageOption onPress={this.deleteMessage}><Text>Удалить</Text></MessageOption> */}
						</>
						)
					}
					<MessageOption onPress={this.unselect}><Text>Отменить</Text></MessageOption>
					</MessageOptions>
				</BottomSheet>
			</>
		);
	}

	state = {
		selectedMessage: {},
		animationCompleted: false,
	}

	componentDidMount() {
		const { dialogs, currentDialog, setDialogs, user } = this.props;
		InteractionManager.runAfterInteractions(() => {
			this.setState({
				animationCompleted: true,
			});
		});
		const dialog = dialogs.filter(dialog => dialog.participants[0]._id === currentDialog._id || dialog.creator._id === currentDialog._id)[0];
		const dialogIndex = dialogs.findIndex(dialog => dialog.participants[0]._id === currentDialog._id || dialog.creator._id === currentDialog._id);
		const messages = [...dialog.messages].map(message => ({ ...message, viewers: [...message.viewers, user._id] }));
		const newDialogs = [...dialogs];
		newDialogs[dialogIndex].messages = messages;
		setDialogs(newDialogs);
	}

	turnToTask = () => {
		const { navigate, setTaskReceivers, currentDialog } = this.props;
		const { selectedMessage } = this.state;
		setTaskReceivers([currentDialog]);
		const { text } = selectedMessage;
		const task = {
			text
		};
		navigate({ routeName: 'NewTask', params: task });
		this.unselect();
	}

	deleteMessage = () => {
		const { dialogs, setDialogs, currentChat } = this.props;
		const { selectedMessage } = this.state;
		const dialog = dialogs.filter(dialog => dialog.room === currentChat)[0];
		const dialogIndex = dialogs.findIndex(dialog => dialog.room === currentChat);
		dialog.messages = dialog.messages.filter(message => message._id !== selectedMessage._id);
		const newDialogs = [...dialogs];
		newDialogs[dialogIndex] = dialog;
		setDialogs(newDialogs);
		this.unselect();
	}

	unselect = () => {
		this.setState({ selectedMessage: {} });
	}

	handleHold = (e) => {
		this.setState({ selectedMessage: e });
		Platform.os === 'ios' && ActionSheetIOS.showActionSheetWithOptions(
		{
			options: ['Отменить', 'Ответить', 'Копировать', 'Изменить', 'Удалить'],
			cancelButtonIndex: 0,
		},
		(buttonIndex) => {
			if (buttonIndex === 1) {
			/* destructive action */
			}
		},
		);
	}
}

const mapStateToProps = state => ({
	search: state.messageReducer.search,
	currentChat: state.messageReducer.currentChat,
	user: state.userReducer.user,
	dialogs: state.dialogsReducer.dialogs,
	currentDialog: state.dialogsReducer.currentDialog,
});
const mapDispatchToProps = dispatch => ({
	setDialogs: _ => dispatch(setDialogs(_)),
	setTaskReceivers: _ => dispatch(setTaskReceivers(_))
});
export default connect(mapStateToProps, mapDispatchToProps)(Content);
