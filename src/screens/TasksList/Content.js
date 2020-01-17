/* eslint-disable array-callback-return */
import React, { Component } from 'react'
import { View, Text, Dimensions, Animated } from 'react-native'
import styled from 'styled-components'
import { connect } from 'react-redux'
import Task from './Task'
import TaskPack from './TaskPack'
import Loader from '../../common/Loader'
import helper from '../../utils/helpers'
import { setTaskList } from '../../actions/tasksActions'
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
    const { navigate, tasksWithUsers, tasksInc, tasksOut } = this.props
    const opacity = this.scrollY.interpolate({
      inputRange: [0, 90, 91],
      outputRange: [0, 0, 1],
    })
    const translateY = this.scrollY.interpolate({
      inputRange: [0, 50, 51],
      outputRange: [0, 50, 50],
    })
    const allUserTasks = []
    tasksWithUsers.forEach(task => {
      const index = allUserTasks.findIndex(
        item => item._id === task.performers[0]._id,
      )
      if (index !== -1) {
        allUserTasks[index].tasks.push(task)
      } else {
        allUserTasks.push({
          _id: task.performers[0]._id,
          first_name: task.performers[0].first_name,
          last_name: task.performers[0].last_name,
          phone_number: task.performers[0].phone_number,
          image: task.performers[0].image,
          tasks: [task],
        })
      }
    })

    return allUserTasks ? (
      <Wrapper>
        <TabPreHeader
          onWritePress={() => navigate('NewTask')}
          title="Задачи"
          opacity={opacity}
        />
        <StyledScrollView
          contentContainerStyle={{ flexGrow: 1 }}
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
          {allUserTasks && allUserTasks.length ? (
            allUserTasks
              // .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
              .map((e, i) => {
                return (
                  <Task
                    onPress={() => navigate('Tasks')}
                    key={i}
                    navigate={this.props.navigate}
                  >
                    {e}
                  </Task>
                )
              })
          ) : (
            <View style={{ flex: 1 }}>
              <Loader hint="Пока нет задач" height={130} width={200}>
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

  scrollY = new Animated.Value(0)
}

const mapStateToProps = state => ({
  tasksOut: state.tasksReducer.tasksOut,
  tasksInc: state.tasksReducer.tasksInc,
  tasksWithUsers: state.tasksReducer.tasksWithUsers,
})
const mapDispatchToProps = dispatch => ({
  setTaskList: _ => dispatch(setTaskList(_)),
})
export default connect(mapStateToProps, mapDispatchToProps)(Content)
