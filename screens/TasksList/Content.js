import React, { Component } from 'react'
import { View, Text, FlatList, Dimensions, ScrollView } from 'react-native'
import styled from 'styled-components'
import { Header, Task, TaskPack } from './'
import { SafeAreaView } from '../../common'
import helper from '../../utils/helpers'
import sendRequest from '../../utils/request'
import { g_tasks, g_users } from '../../constants/api'
import { setTasks } from '../../actions/tasksActions'
import { connect } from 'react-redux'
const { sidePaddingNumber, HeaderHeightNumber } = helper;
const Wrapper = styled(View)`
  max-height: ${Dimensions.get('window').height - sidePaddingNumber}px;
  `
const StyledScrollView = styled(ScrollView)`
  height: ${Dimensions.get('window').height - HeaderHeightNumber - 20}px;
  padding: 0  ${sidePaddingNumber}px;
`

class Content extends Component {
  render() {
    const { FlatListData } = this.state;
    const { tasks } = this.props;
    return (tasks.length) ? (
      <Wrapper>
        <StyledScrollView>
          <TaskPack title={'Все исходящие задачи'} tasks={tasks} />
          <TaskPack title={'Все входящие задачи'} tasks={tasks} last />
          {
            tasks.map((e, i) => <Task onPress={this.toTasks} key={i}>{e}</Task>)
          }
          <View style={{ height: 20, width: '100%' }} />
        </StyledScrollView>
      </Wrapper>
    ) : <View />
  }
  state = {
    FlatListData: []
  }
  componentDidMount() {
    const { setTasks } = this.props
    sendRequest({
      r_path: g_users,
      method: 'get',
      success: ({ users }) => {
        const tasksList = []
        users.map(user => {
          const { tasks } = user
          tasks && tasks.map((e, i) => {
            if (i === 0 && (e.creator === user._id || e.performers.includes(user._id))) {
              tasksList.push(user)
            }
          })
        })
        setTimeout(() => {
          this.setState({ FlatListData: [...tasksList] })
          setTasks(tasksList)
        }, 0)
      },
      failFunc: (err) => {
        console.log({ err })
      }
    })
  }
  toTasks = () => {
    const { navigate } = this.props
    navigate('Tasks')
  }
}

const mapStateToProps = state => {
  return {
    user: state.userReducer.user,
    tasks: state.tasksReducer.tasks,
  };
};
const mapDispatchToProps = dispatch => ({
  setTasks: _ => dispatch(setTasks(_))
})
export default connect(mapStateToProps, mapDispatchToProps)(Content)