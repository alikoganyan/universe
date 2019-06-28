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
import Message from '../../common/Message';
import helper from '../../utils/helpers';
import { chatBg } from '../../assets/images';
import { setTaskReceivers } from '../../actions/participantsActions';

const { HeaderHeight, borderRadius } = helper;
const Wrapper = styled(View)`
	background: white;
	margin-bottom: ${({ search }) => (search ? HeaderHeight * 2 : HeaderHeight)};
	z-index: 1;
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
`;
class Content extends Component {
	render() {
		const { selectedMessage, animationCompleted } = this.state;
		const {
			dialogs, currentChat, search, user
		} = this.props;
		const dialog = [...dialogs].filter(e => e.room === currentChat)[0];
		const messages = dialog ? dialog.messages : [];
		const reversedMessages = [...messages].sort((x, y) => x.timeSent < y.timeSent);
		return (
			<>
				<Wrapper search={search}>
					{selectedMessage._id && <Shadow onPress={this.unselect} activeOpacity={1} />}
					<ImageBackground source={chatBg} style={{ width: '100%', height: '100%' }}>
						{animationCompleted ? (
							<FlatList
								style={{ paddingRight: 5, paddingLeft: 5, zIndex: 2 }}
								ListHeaderComponent={<View style={{ margin: 35, }} />}
								inverted
								data={reversedMessages}
								keyboardDismissMode="on-drag"
								initialNumToRender={10}
								animated
								renderItem={({ item, index }) => (
									<TouchableOpacity
										key={index}
										onLongPress={() => this.handleHold(item)}
									>
										<Message withImage read={!!item.viewers.length}>{item}</Message>
									</TouchableOpacity>
								)}
								keyExtractor={(item, index) => index.toString()}
								/>
						) : null}
					</ImageBackground>
				</Wrapper>
				<BottomSheet
					visible={selectedMessage._id}
					onBackButtonPress={this.unselect}
					onBackdropPress={this.unselect}
				>
					<MessageOptions>
						{
							selectedMessage._id && selectedMessage.sender._id === user._id && (
							<>
								<MessageOption onPress={this.turnToTask}>
									<Text>Сделать задачей</Text>
								</MessageOption>
								<MessageOption><Text>Редактировать</Text></MessageOption>
							</>
							)
						}
					<MessageOption><Text>Переслать</Text></MessageOption>
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
		InteractionManager.runAfterInteractions(() => {
			this.setState({
				animationCompleted: true,
			});
		});
	}

	turnToTask = () => {
		const { navigate } = this.props;
		const { selectedMessage } = this.state;
		const { text } = selectedMessage;
		const task = {
			text,
		};
		navigate({ routeName: 'NewTask', params: task });
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
	dialogs: state.dialogsReducer.dialogs,
	search: state.messageReducer.search,
	currentRoom: state.messageReducer.currentRoom,
	currentChat: state.messageReducer.currentChat,
	user: state.userReducer.user,
});
const mapDispatchToProps = dispatch => ({
  setTaskReceivers: _ => dispatch(setTaskReceivers(_))
});
export default connect(mapStateToProps, mapDispatchToProps)(Content);
