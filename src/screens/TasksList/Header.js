/* eslint-disable array-callback-return */
import React, { Component } from 'react'
import { View, Dimensions, TextInput } from 'react-native'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { CloseIcon, SearchIconGray } from '../../assets/index'
import helper from '../../utils/helpers'
import { p_tasks_search, g_users } from '../../constants/api'
import sendRequest from '../../utils/request'
import { setTasks } from '../../actions/tasksActions'

const { sidePadding, fontSize, HeaderHeight } = helper
const Wrapper = styled(View)`
  border-bottom-color: #e8ebee;
  border-bottom-width: 1px;
  padding-bottom: 12px;
  margin-bottom: 13px;
`
const Header = styled(View)`
  width: ${Dimensions.get('window').width - sidePadding * 2}px;
  background-color: #f4f4f4;
  border-radius: 10px;
  font-size: ${fontSize.header};
  height: 37px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  z-index: 1;
  left: ${sidePadding}px;
  margin-top: 3px;
`
const Input = styled(TextInput)`
  flex: 1;
  height: ${HeaderHeight};
  position: relative;
  left: -4px;
  font-size: ${fontSize.input};
`
class HeaderComponent extends Component {
  render() {
    const { input, focused } = this.state
    return (
      <Wrapper>
        <Header>
          <SearchIconGray />
          <Input
            value={input}
            onChangeText={this.handleInputChange}
            onFocus={this.handleFocus}
            placeholder="Поиск"
          />
          {focused && (
            <CloseIcon
              onPress={this.onBlur}
              marginLeft={false}
              marginRight
              right
            />
          )}
        </Header>
      </Wrapper>
    )
  }

  state = {
    input: '',
    focused: false,
  }

  componentWillUnmount() {
    // this.stopSearch()
  }

  handleInputChange = e => {
    // const { setTasks } = this.props
    this.setState({ input: e })
    e && e.length >= 2
      ? sendRequest({
          r_path: p_tasks_search,
          method: 'post',
          attr: {
            text: e,
            withUser: true,
          },
          success: () => {
            // res.users.map(user => {
            //     // const { tasks } = user
            //     // tasks && tasks.map((e, i) => {
            //     //     if (i === 0 && (e.creator === user._id || e.performers.includes(user._id))) {
            //     //         tasksList.push(user)
            //     //     }
            //     // })
            // })
            // setTimeout(() => {
            //     // this.setState({ FlatListData: [...tasksList] })
            //     // setTasks(tasksList)
            //     console.log({tasksList})
            // }, 0)
          },
          failFunc: err => {
            // console.log(err)
          },
        })
      : sendRequest({
          r_path: g_users,
          method: 'get',
          success: ({ users }) => {
            const tasksList = []
            users.map(user => {
              const { tasks } = user
              tasks &&
                tasks.map((e, i) => {
                  if (
                    i === 0 &&
                    (e.creator === user._id || e.performers.includes(user._id))
                  ) {
                    tasksList.push(user)
                  }
                })
            })
            setTimeout(() => {
              this.setState({ FlatListData: [...tasksList] })
            }, 0)
          },
          failFunc: err => {
            // console.log({ err })
          },
        })
  }

  handleFocus = () => {
    this.setState({ focused: true })
  }

  onBlur = () => {
    this.setState({ focused: false, input: '' })
  }
}

const mapStateToProps = state => ({
  user: state.userReducer.user,
  tasks: state.tasksReducer.tasks,
})
const mapDispatchToProps = dispatch => ({
  setTasks: _ => dispatch(setTasks(_)),
})
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HeaderComponent)
