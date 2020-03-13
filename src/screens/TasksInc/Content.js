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
import _ from 'lodash'
import TaskComponent from '../../common/Task'
import { setActiveTask } from '../../actions/tasksActions'
import helper from '../../utils/helpers'
import Loader from '../../common/Loader'
import { socket } from '../../utils/socket'
import { setCompaniesDetails, setReset } from '../../actions/userActions'

const { Colors, HeaderHeight } = helper
const { purple } = Colors
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
// const Shadow = styled(TouchableOpacity)
// `
//     background: black;
//     opacity: 0.1;
//     z-index: 0;
//     height: ${Dimensions.get('window').height};
//     width: ${Dimensions.get('window').width};
//     position: absolute;
//     top: -${HeaderHeight};
//     left: 0;
// `;
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
    const { activeTask, tasksInc } = this.props

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
            {!_.isEmpty(tasksInc) && animationCompleted ? (
              <TaskList
                data={tasksInc
                  .filter(item => active.includes(statuses[item.status]))
                  .sort(
                    (a, b) => new Date(b.updated_at) - new Date(a.updated_at),
                  )}
                ListFooterComponent={<View />}
                ListEmptyComponent={
                  <View style={{ flex: 1 }}>
                    <Loader hint="Пока нет задач" />
                  </View>
                }
                renderItem={({ item }) => {
                  return (
                    <TaskWrapper>
                      <TouchableOpacity
                        style={{ flex: 1 }}
                        onLongPress={() => this.handleHold(item)}
                      >
                        <TaskComponent
                          triangleLeft
                          borderColor={purple}
                          withReceiver={item.creator || false}
                          style={{
                            zIndex: activeTask._id === item._id ? 5 : 1,
                            // marginRight: myTask ? 10 : 70,
                            // marginLeft: myTask ? 70 : 10,
                          }}
                          inc
                          navigate={this.props.navigate}
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
    const {
      tasksInc,
      user,
      companies_details,
      setCompaniesDetails,
      company,
    } = this.props
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        animationCompleted: true,
      })
    })

    const unreadedTasks = []
    if (tasksInc.length) {
      tasksInc.forEach(t => {
        if (!t.viewers.includes(user._id)) {
          unreadedTasks.push(t._id)
        }
      })
    }
    if (unreadedTasks.length) {
      socket.emit(
        'view_tasks',
        { tasks_ids: unreadedTasks },
        ({ success }) => {},
      )
      companies_details[company._id].unviewed_tasks_count = 0
      companies_details[company._id].all =
        companies_details[company._id].all - unreadedTasks.length
      setCompaniesDetails(companies_details)
      this.props.setReset(true)
    }
  }

  unselect = () => {
    this.props.setActiveTask({})
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
  tasksInc: state.tasksReducer.tasksInc,
  companies_details: state.userReducer.companies_details,
  company: state.userReducer.company,
})
const mapDispatchToProps = dispatch => ({
  setActiveTask: _ => dispatch(setActiveTask(_)),
  setCompaniesDetails: _ => dispatch(setCompaniesDetails(_)),
  setReset: _ => dispatch(setReset(_)),
})
export default connect(mapStateToProps, mapDispatchToProps)(Content)
