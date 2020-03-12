import React, { Component } from 'react'
import { View, Dimensions } from 'react-native'
import styled from 'styled-components'
import Content from './Content'
import SafeAreaView from '../../common/SafeAreaView'
import helper from '../../utils/helpers'
import { connect } from 'react-redux'
import sendRequest from '../../utils/request'
import { g_tasks } from '../../constants/api'
import { setTaskList } from '../../actions/tasksActions'

const { sidePadding } = helper
const Wrapper = styled(View)`
  max-height: ${Dimensions.get('window').height - sidePadding}px;
`

class Tasks extends Component {
  render() {
    return (
      <SafeAreaView behavior="padding">
        <Wrapper>
          <Content navigate={this.navigate} />
        </Wrapper>
      </SafeAreaView>
    )
  }

  componentDidMount() {
    sendRequest({
      r_path: g_tasks,
      method: 'get',
      success: res => {
        const tasksInc = [...res.tasks]
        const tasksOut = [...res.created_tasks]
        const tasksWithUsers = [...tasksInc, ...tasksOut]
        this.props.setTaskList({ tasksInc, tasksOut, tasksWithUsers })
      },
    })
  }

  navigateBack = () => {
    this.props.navigation.goBack()
  }

  navigate = e => {
    this.props.navigation.navigate(e)
  }
}

const mapStateToProps = state => ({
  companyLoading: state.dialogsReducer.companyLoading,
})

const mapDispatchToProps = dispatch => ({
  setTaskList: _ => dispatch(setTaskList(_)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Tasks)
