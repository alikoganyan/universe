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
import TaskComponent from '../../common/Task'
import { setActiveTask } from '../../actions/tasksActions'
import helper from '../../utils/helpers'

const { Colors, HeaderHeight } = helper
const { purple, black, pink } = Colors
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
const Options = styled(View)`
  display: flex;
  align-self: center;
  background: ${purple};
  flex-direction: row;
  border-radius: 14;
  padding: 1px;
  overflow: hidden;
  margin: 10px 0;
  max-width: 85%;
`
const Option = styled(Text)`
  color: ${({ active }) => (active ? black : 'white')};
  background: ${({ active }) => (active ? 'white' : 'transparent')};
  margin: 1px;
  border-radius: 10;
  padding: 2px 0;
  overflow: hidden;
  min-width: 30%;
  text-align: center;
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
        flatten([...tasksList, ...user.tasks]).filter(
          e => e.creator._id === user._id,
        ),
      ),
    ]
    return (
      <SafeAreaView>
        {/* {activeTask._id && <Shadow onPress={this.unselect}></Shadow>} */}
        <StyledScrollView keyboardShouldPersistTaps="handled">
          <Wrapper>
            <Options>
              {options.options.map((e, i) => (
                <TouchableOpacity key={i} onPress={() => this.selectOption(i)}>
                  <Option active={active === i}>{e}</Option>
                </TouchableOpacity>
              ))}
            </Options>
            {outTasks && animationCompleted ? (
              <TaskList
                data={outTasks}
                ListFooterComponent={<View />}
                renderItem={({ item }) => {
                  let condition = true
                  switch (active) {
                    case 0:
                      condition = true
                      break
                    case 1:
                      condition =
                        item.status === 'set' || item.status === 'accepted'
                      break
                    case 2:
                      condition =
                        item.status !== 'set' && item.status !== 'accepted'
                      break
                    default:
                      break
                  }
                  if (condition) {
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
                  }
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
      active: 1,
      options: ['Все', 'В работе', 'Не в работе'],
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
    newOptions.active = e
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
