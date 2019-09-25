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
import helper from '../../utils/helpers'

const { Colors, HeaderHeight } = helper
const { pink } = Colors
const Wrapper = styled(View)`
  margin-bottom: 50px;
`
const TaskList = styled(FlatList)`
  padding: 10px 0;
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
const StyledScrollView = styled(ScrollView)`
  flex-grow: 1;
  z-index: 10;
  width: 100%;
  height: ${Dimensions.get('window').height - HeaderHeight - 20}px;
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
const statuses = { accepted: 0, set: 1, cancelled: 1, completed: 2, done: 2 }
class Content extends Component {
  render() {
    const { options, animationCompleted } = this.state
    const { active } = options
    const { user, activeTask, tasks } = this.props
    const flatten = list =>
      list.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), [])
    const tasksList = [...tasks].map(e => [...e.tasks, ...e.tasks_list])
    const outTasks = [
      ...new Set(
        flatten([...tasksList, ...user.tasks])
          .filter(e => e.creator._id === user._id)
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
      ),
    ]

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
            {outTasks && animationCompleted ? (
              <TaskList
                data={outTasks.filter(item =>
                  active.includes(statuses[item.status]),
                )}
                ListFooterComponent={<View />}
                renderItem={({ item }) => {
                  return (
                    <TaskWrapper>
                      <TouchableOpacity
                        style={{ flex: 1 }}
                        onLongPress={() => this.handleHold(item)}
                      >
                        <TaskComponent
                          triangleRight
                          borderColor={pink}
                          withReceiver
                          style={{
                            zIndex: activeTask._id === item._id ? 5 : 1,
                            // marginRight: myTask ? 10 : 70,
                            // marginLeft: myTask ? 70 : 10,
                          }}
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
  tasks: state.tasksReducer.tasks,
  user: state.userReducer.user,
})
const mapDispatchToProps = dispatch => ({
  setActiveTask: _ => dispatch(setActiveTask(_)),
})
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Content)
