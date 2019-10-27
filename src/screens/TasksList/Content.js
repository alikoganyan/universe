/* eslint-disable array-callback-return */
import React, { Component } from 'react'
import { View, Text, Dimensions, Animated } from 'react-native'
import styled from 'styled-components'
import { connect } from 'react-redux'
import Task from './Task'
import TaskPack from './TaskPack'
import Loader from '../../common/Loader'
import helper from '../../utils/helpers'
import sendRequest from '../../utils/request'
import { g_users, g_tasks } from '../../constants/api'
import { setTasks, setTaskList } from '../../actions/tasksActions'
import Header from './Header'
import TabPreHeader from '../../common/TabPreHeader'
import Company from '../../common/Company'

const { HeaderHeight, Colors } = helper
const { grey2 } = Colors
const Wrapper = styled(View)`
  max-height: ${Dimensions.get('window').height - HeaderHeight}px;
  display: flex;
  align-self: center;
`
const StyledScrollView = styled(Animated.ScrollView)`
  height: ${Dimensions.get('window').height - HeaderHeight - 20}px;
`
const Title = styled(Text)`
  font-family: 'OpenSans-Bold';
  font-size: 30px;
  color: ${Colors.black};
  padding: 0 16px 8px;
  background-color: ${Colors.white};
  z-index: 2;
`

const HeaderContainer = styled(Animated.View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  z-index: 2;
  background-color: #ffffff;
`

class Content extends Component {
  render() {
    const { tasksWithUsers, navigate, tasksInc, tasksOut } = this.props
    const opacity = this.scrollY.interpolate({
      inputRange: [0, 90, 91],
      outputRange: [0, 0, 1],
    })
    const translateY = this.scrollY.interpolate({
      inputRange: [0, 50, 51],
      outputRange: [0, 50, 50],
    })

    return tasksWithUsers ? (
      <Wrapper>
        <TabPreHeader
          onWritePress={() => navigate('NewTask')}
          title="Задачи"
          opacity={opacity}
        />
        <StyledScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 49 }}
          keyboardShouldPersistTaps="handled"
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [
              {
                nativeEvent: { contentOffset: { y: this.scrollY } },
              },
            ],
            {
              useNativeDriver: true,
            },
          )}
        >
          <HeaderContainer style={{ transform: [{ translateY }] }}>
            <Title>Задачи</Title>
            <Company navigate={this.props.navigate} />
          </HeaderContainer>
          <Header />
          <TaskPack
            title="inc"
            tasksPack={tasksInc}
            onPress={() => navigate('TasksInc')}
            first
          />
          <TaskPack
            title="out"
            tasksPack={tasksOut}
            onPress={() => navigate('TasksOut')}
            last
          />
          {tasksWithUsers.length ? (
            tasksWithUsers.map((e, i) => (
              <Task
                onPress={this.toTasks}
                key={i}
                navigate={this.props.navigate}
              >
                {e}
              </Task>
            ))
          ) : (
            <View style={{ flex: 1 }}>
              <Loader hint="Пока нет задач">
                <Text style={{ color: grey2, textAlign: 'center' }}>
                  Поставьте вашу первую задачу, нажав на иконку &quot;плюс&quot;
                </Text>
              </Loader>
            </View>
          )}
          <View style={{ height: 20, width: '100%' }} />
        </StyledScrollView>
      </Wrapper>
    ) : (
      <View />
    )
  }

  state = {
    users: [],
  }
  scrollY = new Animated.Value(0)

  componentDidMount = async () => {
    const { user } = this.props
    const tasksWithUsers = await this._getUsers()
    sendRequest({
      r_path: g_tasks,
      method: 'get',
      success: res => {
        const tasksInc = res.tasks.filter(item => item.creator._id !== user._id)
        const tasksOut = res.tasks.filter(item => item.creator._id === user._id)

        this.props.setTaskList({ tasksInc, tasksOut, tasksWithUsers })
      },
      failFunc: err => {
        // console.log(err);
      },
    })
  }

  componentWillUnmount() {
    const { setTasks: setTasksProp } = this.props
    setTasksProp([])
  }

  toTasks = () => {
    const { navigate } = this.props
    navigate('Tasks')
  }

  _getUsers = () => {
    return new Promise((resolve, reject) => {
      sendRequest({
        r_path: g_users,
        method: 'get',
        success: res => {
          this.setState({ users: [...res.users] }, () => resolve(res.users))
        },
        failFunc: err => {
          reject()
        },
      })
    })
  }
}

const mapStateToProps = state => ({
  user: state.userReducer.user,
  tasks: state.tasksReducer.tasks,
  tasksOut: state.tasksReducer.tasksOut,
  tasksInc: state.tasksReducer.tasksInc,
  tasksWithUsers: state.tasksReducer.tasksWithUsers,
})
const mapDispatchToProps = dispatch => ({
  setTasks: _ => dispatch(setTasks(_)),
  setTaskList: _ => dispatch(setTaskList(_)),
})
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Content)
