import React, { Component } from 'react'
import { View, Text, TouchableHighlight, Dimensions, ActionSheetIOS, Platform } from 'react-native'
import styled from 'styled-components'
import helper from '../../utils/helpers'
import { connect } from 'react-redux'
import { TasksIcon } from '../../assets/index'
import { setIncTasks, setOutTasks } from '../../actions/tasksActions'
const { fontSize, sidePadding, Colors } = helper;
const { purple, lightGrey1 } = Colors;
const Wrapper = styled(View)
`
  display: flex;
  flex-direction: row;
  align-self: center;
  align-items: center;
  padding: ${sidePadding}px 0;
  border: 0.3px solid ${lightGrey1};
  border-width: 0;
  width: ${Dimensions.get('window').width - sidePadding * 2};
  border-top-width: 0.3px;
  border-bottom-width: ${({ last }) => last ? 0.3 : 0}px;
`
const TaskText = styled(View)
`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex: 1;
`

const TaskTextInner = styled(View)
`
  display: flex;
  flex-direction: column;
  padding-left: ${sidePadding}px;
`
const TaskTitle = styled(Text)
`
  font-size: ${fontSize.header};
  flex: 1;  
  margin-bottom: 5px;
`
const LastMessageDate = styled(Text)
`
  color: ${lightGrey1};
  font-size: ${fontSize.text};
  text-align: center;
  display: flex;
  justify-content: center;
  align-self: center;
  text-align: left;
  margin-bottom: 5px;
`
const TaskLastMessage = styled(Text)
`
  font-size: ${fontSize.text};
  color: ${lightGrey1};
  margin-bottom: 5px;
  max-width: 90%;
`
const TaskDate = styled(View)
`
  right: ${sidePadding}px;
  color: ${lightGrey1};
  font-size: ${fontSize.text};
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  height: 50px;
`
const UnreadMessages = styled(View)
`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
`
const NewMessages = styled(Text)
`
  color: white;
  font-size: ${fontSize.text};
  background: ${purple};
  overflow: hidden;
  padding: 5px;
  padding-top: ${Platform.OS === 'ios' ? 4 : 2}px;
  text-align: center;;
  min-width: 25px;
  height: 25px;
  border-radius: 12.5;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  align-self: center;
`
const TaskStatusTextContainer = styled(View)
`
  border: 1px solid ${lightGrey1};
  border-radius: 15px; 
  padding: 2px 8px;
  margin-right: 5px;
  display: flex;
  flex-direction: row;
`
const TaskStatus = styled(View)
`
  display: flex;
  flex-direction: row;
  align-items: center;
`
const TaskStatusText = styled(Text)
`
  color: ${lightGrey1};
`
const TaskStatusAdditional = styled(Text)
`
  color: ${lightGrey1};
`
class TaskPack extends Component {
    render() {
        const { taskPack } = this.state;
        const { title, last, onPress } = this.props;
        let day = '';
        const daysOfTheWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
        if (taskPack.length) {
            switch (taskPack[taskPack.length - 1].status) {
                case 'set':
                    this.stat = 'В работе';
                    break;
                case 'accepted':
                    this.stat = 'В работе';
                    break;
                case 'done':
                    this.stat = 'В работе';
                    break;
                case 'completed':
                    this.stat = 'В работе';
                    break;
                case 'cancelled':
                    this.stat = 'В работе';
                    break;
            }
            day = new Date(taskPack[taskPack.length - 1].created_at).getDay()
        }
        return (
            <TouchableHighlight underlayColor='#2B7DE2' onPress={onPress} onLongPress={this.handleHold}>
		        <Wrapper last={last}>
		          <TaskText>
		            <TaskTextInner>
		              <TaskTitle>{title === 'inc' ? 'Все входящие задачи' : 'Все исходящие задачи'}</TaskTitle>
		              {taskPack.length ? <TaskLastMessage numberOfLines={1}>{taskPack[taskPack.length - 1].description}</TaskLastMessage> : null}
		              <TaskStatus>
		                <TaskStatusTextContainer>
		                  <TasksIcon noPaddingAll />
		                  <TaskStatusText>{this.stat}</TaskStatusText>
		                </TaskStatusTextContainer>
		                {
		                	taskPack.length > 1 ? 
		                		<TaskStatusAdditional>
		                			+{taskPack.length - 1} задач
		                		</TaskStatusAdditional> : 
		                	null
		                }
		              </TaskStatus>
		            </TaskTextInner>
			            <TaskDate>
			                <LastMessageDate>{daysOfTheWeek[day]}</LastMessageDate>
			                {taskPack.length ? <UnreadMessages onLayout={(e) => this.getUnreadMessageHeight(e)}>
			                  <NewMessages onLayout={(e) => this.getUnreadMessageWidth(e)}>{taskPack.length}</NewMessages>
			                </UnreadMessages> : null}
			            </TaskDate>
		        	</TaskText>

		        </Wrapper>
		    </TouchableHighlight>
        );
    }
    state = {
        size: null,
        taskPack: []
    }
    componentDidMount() {
        const { title, tasks, user } = this.props;
        const flatten = list => list.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);
        const tl = [...tasks].filter(e => title == 'inc' ? e._id === user._id : e._id !== user._id).map(e => e.tasks);
        const outTasks = [...flatten(tl)].filter(e => e.creator._id === user._id);
        const incTasks = [...flatten(tl)].filter(e => true);
        const tasksList = title == 'inc' ? incTasks : outTasks;
        console.log({title}, {tasksList})
        this.setState({ taskPack: tasksList });
    }
    handleHold = () => {
        ActionSheetIOS.showActionSheetWithOptions({
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
    handleClick = () => {}
    getUnreadMessageHeight = (e) => {
        this.setState({ height: e.nativeEvent.layout.height })
    }
    getUnreadMessageWidth = (e) => {
        this.setState({ width: e.nativeEvent.layout.width })
    }
}
const mapStateToProps = state => ({
    user: state.userReducer.user,
    tasks: state.tasksReducer.tasks,
});
const mapDispatchToProps = dispatch => ({
    setIncTasks: _ => dispatch(setIncTasks(_)),
    setOutTasks: _ => dispatch(setOutTasks(_)),
})
export default connect(mapStateToProps, mapDispatchToProps)(TaskPack)