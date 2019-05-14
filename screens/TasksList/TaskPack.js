import React, { Component } from 'react'
import { View, Text, Image, TouchableHighlight, Dimensions, StatusBar, ActionSheetIOS } from 'react-native'
import styled from 'styled-components'
import helper from '../../utils/helpers'
import { TasksIcon } from '../../assets/index'
const { fontSize, PressDelay, sidePadding, Colors, sidePaddingNumber } = helper;
const { purple, lightColor, lightGrey1, grey2 } = Colors;
const Wrapper = styled(View)`
	display: flex;
	flex-direction: row;
	align-items: center;
	padding: ${sidePaddingNumber}px 0;
	border: 0.3px solid ${lightGrey1};
	border-width: 0;
	border-top-width: 0.3px;
	border-bottom-width: ${({ last }) => last ? 0.3 : 0}px;
`
const TaskText = styled(View)`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	flex: 1;
`

const TaskTextInner = styled(View)`
	display: flex;
	flex-direction: column;
	padding-left: ${sidePadding*2};
`
const TaskTitle = styled(Text)`
	font-size: ${fontSize.header};
	font-weight: 500;
	flex: 1;  
	margin-bottom: 5px;
`
const LastMessageDate = styled(Text)`
	color: ${lightGrey1};
	font-size: ${fontSize.text};
	text-align: center;
	display: flex;
	justify-content: center;
	align-self: center;
	margin-bottom: 5px;
`
const TaskLastMessage = styled(Text)`
	font-size: ${fontSize.text};
	color: ${grey2};
	padding-right: 20px;
	margin-bottom: 5px;

`
const TaskDate = styled(View)`
	right: ${sidePadding};
	color: ${lightGrey1};
	font-size: ${fontSize.text};
	display: flex;
	justify-content: flex-start;
	align-items: flex-start;
`
const UnreadMessages = styled(View)`
	display: flex;
	justify-content: center;
	align-items: center;
	flex: 1;
`
const NewMessages = styled(Text)`
	color: white;
	font-size: ${fontSize.text};
	background: ${purple};
	overflow: hidden;
	padding: 5px;
	padding-top: 2px;
	text-align: center;;
	min-width: 25px;
	height: 25px;
	border-radius: 12.5;
	display: flex;
	justify-content: center;
	align-items: flex-end;
	align-self: center;
`
const TaskStatusTextContainer = styled(View)`
	border: 1px solid ${lightGrey1};
	border-radius: 15px; 
	padding: 2px 8px;
	margin-right: 5px;
	display: flex;
	flex-direction: row;
`
const TaskStatus = styled(View)`
	display: flex;
	flex-direction: row;
	align-items: center;
`
const TaskStatusText = styled(Text)`
	color: ${lightGrey1};
`
const TaskStatusAdditional = styled(Text)`
	color: ${lightGrey1};
`
export default class TaskPack extends Component {
	render() {
		const { children, title, onClick, last, tasks } = this.props;
		const { taskPack, stat } = this.state
		const user = { _id: 1 }
		let day = taskPack[0] ? new Date(taskPack[0].created_at).getDay() : ''
		const daysOfTheWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
		return taskPack.length ? (
			<TouchableHighlight underlayColor='#2B7DE2' onPress={this.handleClick} onLongPress={this.handleHold}>
				<Wrapper last={last}>
					<TaskText>
						<TaskTextInner>
							<TaskTitle>{title}</TaskTitle>
							<TaskLastMessage numberOfLines={1}>{taskPack[0].tasks[0].description}</TaskLastMessage>
							<TaskStatus>
								<TaskStatusTextContainer>
									<TasksIcon />
									<TaskStatusText>{stat}</TaskStatusText>
								</TaskStatusTextContainer>
								<TaskStatusAdditional>+{taskPack[0].tasks.length - 1} задач</TaskStatusAdditional>
							</TaskStatus>
						</TaskTextInner>
						<TaskDate>
							<LastMessageDate>{daysOfTheWeek[day]}</LastMessageDate>
							<UnreadMessages onLayout={(e) => this.getUnreadMessageHeight(e)}>
								<NewMessages onLayout={(e) => this.getUnreadMessageWidth(e)}>{taskPack.length}</NewMessages>
							</UnreadMessages>
						</TaskDate>
					</TaskText>
				</Wrapper >
			</TouchableHighlight >
		) : <View />;
	}
	state = {
		size: null,
		taskPack: [],
		stat: ''
	}
	componentDidMount() {
		const { children, title, onClick, last, tasks } = this.props;
		const { taskPack, stat } = this.state
		const user = { _id: 1 }
		const packItems = []
		let day = ''
		const daysOfTheWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
		if (tasks.length) {
			tasks.map(taskUser => {
				if (taskUser.tasks.length) {
					taskUser.tasks.map(task => {
						if (task.creator._id === user._id) {
							const packItemUser = { ...taskUser }
							packItemUser.tasks = packItemUser.tasks.filter(e => e.creator._id === user._id)
							packItems.push(packItemUser)
						}
					})
				}
			})
			setTimeout(() => {
				this.setState({ taskPack: packItems })
			}, 0)
			// day = new Date(packItems[0].tasks[0].created_at).getDay()
			switch (packItems[0].tasks[0].status) {
				case 'set':
					this.setState({ stat: 'В работе' });
					break;
				case 'done':
					this.setState({ stat: 'Выполнена' });
					break;
			}
		}
	}
	handleHold = () => {
		ActionSheetIOS.showActionSheetWithOptions(
			{
				options: ['Cancel', 'Remove'],
				destructiveButtonIndex: 1,
				cancelButtonIndex: 0,
			},
			(buttonIndex) => {
				if (buttonIndex === 1) {
					/* destructive action */
				}
			},
		);
	}
	handleClick = () => {
	}
	getUnreadMessageHeight = (e) => {
		this.setState({ height: e.nativeEvent.layout.height })
	}
	getUnreadMessageWidth = (e) => {
		this.setState({ width: e.nativeEvent.layout.width })
	}
}
