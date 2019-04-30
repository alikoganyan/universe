import React, { Component } from 'react'
import { View, Text, FlatList, Dimensions, ScrollView } from 'react-native'
import styled from 'styled-components'
import { Header, Task, TaskPack } from './'
import { SafeAreaView } from '../../common'
import helper from '../../utils/helpers'
import sendRequest from '../../utils/request'
import { g_tasks, g_users } from '../../constants/api'
import { setAllUsers } from '../../actions/userActions'
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
    return (
      <Wrapper>
        <StyledScrollView>
          <TaskPack title={'Все исходящие задачи'}>task</TaskPack>
          <TaskPack title={'Все исходящие задачи'} last>task</TaskPack>
          {
            FlatListData.map((e, i) => {
              return <Task key={i} title={e.name}>{e.description}</Task>
            })
          }
          <View style={{height: 20, width: '100%'}}/>
        </StyledScrollView>
      </Wrapper>
    )
  }
  state = {
    FlatListData: []
  }
  componentDidMount() {
    const { user, setAllUsers } = this.props
    // this.setState({FlatListData: user.tasks})
    sendRequest({
      r_path: g_users,
      method: 'get',
      success: ({ users }) => {
        const tasksList = []
        users.map(({ tasks }) => {
          tasks && tasks.map((e) => {
            if (e.creator === user._id || e.performers.includes(user._id)) {
              tasksList.push(e)
            }
          })
        })
        setTimeout(() => this.setState({ FlatListData: tasksList }), 0)
        // console.log(tasksList)
      },
      failFunc: (err) => {
        console.log({ err })
      }
    })
  }
  toChat = () => {
    this.props.navigation.navigate('Chat')
  }
  toGroup = () => {
    this.props.navigation.navigate('Group')
  }
}

const mapStateToProps = state => {
  return {
    user: state.userReducer.user,
  };
};
const mapDispatchToProps = dispatch => ({
  setUser: _ => dispatch(setUser(_)),
  addReceiver: _ => dispatch(addReceiver(_)),
  setReceivers: _ => dispatch(setReceivers(_)),
  setContacts: _ => dispatch(setContacts(_))
})
export default connect(mapStateToProps, mapDispatchToProps)(Content)