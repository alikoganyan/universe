import React, { Component } from "react";
import {
	View,
	Text,
	TouchableHighlight,
	Dimensions,
	ActionSheetIOS,
	Platform
} from "react-native";
import styled from "styled-components";
import helper from "../../utils/helpers";
import { TasksIcon } from "../../assets/index";
import { setTask } from "../../actions/tasksActions";
import ImageComponent from "../../common/Image";
import { connect } from "react-redux";
const { fontSize, sidePadding, Colors } = helper;
const { purple, lightGrey1 } = Colors;

const Wrapper = styled(View)`
	display: flex;
	flex-direction: row;
	align-items: center;
	display: flex;
	align-items: center;
	padding: ${sidePadding}px 0 ${sidePadding * 2}px;
	width: ${Dimensions.get("window").width - sidePadding * 2};
`;
const TaskText = styled(View)`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	flex: 1;
`;

const TaskTextInner = styled(View)`
	display: flex;
	flex-direction: column;
`;
const TaskTitle = styled(Text)`
	font-size: ${fontSize.header};
	margin-bottom: 1px;
`;
const LastMessageDate = styled(Text)`
	color: ${lightGrey1};
	font-size: ${fontSize.text};
	text-align: left;
	margin-bottom: 5px;
`;
const TaskLastMessage = styled(Text)`
	margin-bottom: 2px;
	font-size: ${fontSize.text};
	color: ${lightGrey1};
	max-width: 90%;
`;
const TaskDate = styled(View)`
	right: ${sidePadding}px;
	color: ${lightGrey1};
	font-size: ${fontSize.text};
	display: flex;
	justify-content: flex-start;
	align-items: center;
`;
const UnreadMessages = styled(View)`
	display: flex;
	justify-content: center;
	align-items: center;
	padding-bottom: 2px;
	background: ${purple};
	width: 25px;
	height: 25px;
	border-radius: 12.5;
`;
const NewMessages = styled(Text)`
	color: white;
	font-size: ${fontSize.text};
	text-align: center;
	padding-top: ${Platform.OS === "ios" ? 2 : 0}px;
`;

const TaskStatus = styled(View)`
	display: flex;
	flex-direction: row;
	align-items: center;
	margin-top: 1px;
`;
const TaskStatusTextContainer = styled(View)`
	border: 1px solid ${lightGrey1};
	border-radius: 15px;
	padding: 2px 8px;
	margin-right: 5px;
	display: flex;
	flex-direction: row;
`;
const TaskStatusText = styled(Text)`
	color: ${lightGrey1};
`;
const TaskStatusAdditional = styled(Text)`
	color: ${lightGrey1};
`;
class Tasks extends Component {
	render() {
		const { children } = this.props;
		const { first_name, last_name, phone_number, image, tasks } = children;
		let stat = "";
		switch (tasks[tasks.length - 1].status) {
			case "set":
				stat = "В работе";
				break;
			case "done":
				stat = "Выполнена";
				break;
			default: 
				stat = "";
				break;
		}
		const day = new Date(tasks[tasks.length - 1].created_at).getDay();
		const daysOfTheWeek = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
		return (
			<TouchableHighlight
				underlayColor="#2B7DE2"
				onPress={() => this.handleClick(children)}
				onLongPress={this.handleHold}
				style={{
					width: "100%",
					paddingLeft: sidePadding,
					paddingRight: sidePadding,
					display: "flex",
					alignItems: "center"
				}}
			>
				<Wrapper>
					<ImageComponent
						size={50}
						source={{ uri: `http://ser.univ.team${image}` }}
						style={{ marginRight: sidePadding }}
					/>
					<TaskText>
						<TaskTextInner>
							<TaskTitle>
								{first_name
									? `${first_name} ${last_name}`
									: phone_number}
							</TaskTitle>
							<TaskLastMessage numberOfLines={1}>
								{tasks[tasks.length - 1].name}
							</TaskLastMessage>
							<TaskStatus>
								<TaskStatusTextContainer>
									<TasksIcon noPaddingAll />
									<TaskStatusText>{stat}</TaskStatusText>
								</TaskStatusTextContainer>
								{tasks.length - 1 > 0 && (
									<TaskStatusAdditional>
										+{tasks.length - 1} задачи
									</TaskStatusAdditional>
								)}
							</TaskStatus>
						</TaskTextInner>
						<TaskDate>
							<LastMessageDate>
								{daysOfTheWeek[day]}
							</LastMessageDate>
							{tasks.length > 0 && (
								<UnreadMessages
									onLayout={e =>
										this.getUnreadMessageHeight(e)
									}
								>
									<NewMessages>{tasks.length}</NewMessages>
								</UnreadMessages>
							)}
						</TaskDate>
					</TaskText>
				</Wrapper>
			</TouchableHighlight>
		);
	}
	state = {
		size: null
	};
	handleHold = () => {
		ActionSheetIOS.showActionSheetWithOptions(
			{
				options: ["Cancel", "Remove"],
				destructiveButtonIndex: 1,
				cancelButtonIndex: 0
			},
			buttonIndex => {}
		);
	};
	handleClick = tasks => {
		const { setTask, onPress } = this.props;
		setTask(tasks);
		onPress();
	};
	getUnreadMessageHeight = e => {
		this.setState({ height: e.nativeEvent.layout.height });
	};
	getUnreadMessageWidth = e => {
		this.setState({ width: e.nativeEvent.layout.width });
	};
}

const mapStateToProps = state => ({
	
});
const mapDispatchToProps = dispatch => ({
	setTask: _ => dispatch(setTask(_))
});
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Tasks);
