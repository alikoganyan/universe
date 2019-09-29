import React, { Component } from 'react'
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Dimensions,
  FlatList,
  TouchableOpacity,
  InteractionManager,
} from 'react-native'
import styled from 'styled-components'
import { connect } from 'react-redux'
import CheckBox from 'react-native-check-box'
import TaskComponent from '../../common/Task'
import { setActiveTask } from '../../actions/tasksActions'
import { setTaskReceivers } from '../../actions/participantsActions'
import helper from '../../utils/helpers'
import Loader from '../../common/Loader'

const { Colors, HeaderHeight } = helper
const { purple, pink } = Colors
const Wrapper = styled(View)`
  margin-bottom: 50px;
`
const TaskList = styled(FlatList)`
  padding: 10px;
  display: flex;
  flex-grow: 1;
  padding-bottom: 20px;
  z-index: 5;
`
const OptionsWrapper = styled(View)`
  padding: 0 15px;
  width: 100%;
  display: flex;
  align-self: center;
  flex-direction: row;
  justify-content: space-between;
  overflow: hidden;
  margin: 10px 0;
`
const TaskWrapper = styled(View)`
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  flex-direction: row;
`
const CheckBoxWrapper = styled(TouchableOpacity)`
  display: flex;
  flex-direction: row;
  align-items: center;
`
const CheckLabel = styled(Text)`
  margin-left: 10px;
  margin-top: 3px;
`
const StyledScrollView = styled(ScrollView)`
  flex-grow: 1;
  z-index: 10;
  width: 100%;
  height: ${Dimensions.get('window').height - HeaderHeight - 20}px;
`
const TaskListFooter = styled(View)`
  margin: 0;
`
const statuses = {
  in_work: 0,
  set: 1,
  canceled: 1,
  accepted: 1,
  completed: 2,
  done: 2,
}

class Content extends Component {
  render() {
    const { options, animationCompleted } = this.state
    const { active } = options
    const { currentTask, user, activeTask } = this.props

    return (
      <SafeAreaView>
        {/* {activeTask._id && <Shadow onPress={this.unselect}></Shadow>} */}
        <StyledScrollView keyboardShouldPersistTaps="handled">
          <Wrapper>
            <OptionsWrapper>
              {options.options.map((e, i) => (
                <CheckBoxWrapper onPress={() => this.selectOption(i)} key={i}>
                  <CheckBox
                    isChecked={active.includes(i)}
                    onClick={() => this.selectOption(i)}
                    checkBoxColor="#8b81c5"
                  />
                  <CheckLabel>{e}</CheckLabel>
                </CheckBoxWrapper>
              ))}
            </OptionsWrapper>
            {currentTask.tasks && animationCompleted ? (
              <TaskList
                data={currentTask.tasks
                  .sort(
                    (a, b) => new Date(b.created_at) - new Date(a.created_at),
                  )
                  .filter(item => active.includes(statuses[item.status]))}
                ListFooterComponent={<TaskListFooter />}
                ListEmptyComponent={
                  <View style={{ flex: 1 }}>
                    <Loader hint="Пока нет задач" />
                  </View>
                }
                renderItem={({ item }) => {
                  const myTask = item.creator._id === user._id

                  return (
                    <TaskWrapper>
                      <TouchableOpacity
                        style={{ flex: 1 }}
                        onLongPress={() => this.handleHold(item)}
                      >
                        <TaskComponent
                          triangleLeft={!myTask}
                          triangleRight={myTask}
                          borderColor={myTask ? pink : purple}
                          editFeed={this.editFeed}
                          style={{
                            zIndex: activeTask._id === item._id ? 5 : 1,
                            // marginRight: myTask ? 10 : 70,
                            // marginLeft: myTask ? 70 : 10,
                          }}
                          userTask
                        >
                          {item}
                        </TaskComponent>
                      </TouchableOpacity>
                    </TaskWrapper>
                  )
                }}
                keyExtractor={(item, index) => index.toString()}
              />
            ) : null}
          </Wrapper>
        </StyledScrollView>
      </SafeAreaView>
    )
  }

  state = {
    options: {
      active: [1],
      options: ['В работе', 'Не в работе', 'Сдано'],
    },
    animationCompleted: false,
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        animationCompleted: true,
      })
    })
  }

  editFeed = () => {
    const { navigate, setTaskReceivers, activeTask } = this.props
    setTaskReceivers(activeTask.performers)
    navigate('TaskEdit')
  }

  unselect = () => {
    const { setActiveTask } = this.props
    setActiveTask({})
  }

  handleHold = e => {
    const { setActiveTask } = this.props
    setActiveTask(e)
  }

  selectOption = e => {
    const { options } = this.state
    const newOptions = { ...options }
    const index = newOptions.active.indexOf(e)
    if (index > -1) {
      newOptions.active.splice(index, 1)
    } else {
      newOptions.active.push(e)
    }
    this.setState({ options: newOptions })
  }

  componentWillUnmount() {
    this.unselect()
  }
}

const mapStateToProps = state => ({
  currentTask: state.tasksReducer.currentTask,
  activeTask: state.tasksReducer.activeTask,
  user: state.userReducer.user,
})
const mapDispatchToProps = dispatch => ({
  setActiveTask: _ => dispatch(setActiveTask(_)),
  setTaskReceivers: _ => dispatch(setTaskReceivers(_)),
})
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Content)
