import React, { Component } from 'react'
import { connect } from 'react-redux'
import { StyleSheet, Text, View } from 'react-native'
import { TasksMenuIcon } from '../assets'

class TasksTabIcon extends Component {
  render() {
    const { unviewed_tasks_count } = this.state
    return (
      <View>
        <TasksMenuIcon focused={this.props.focused} />
        {unviewed_tasks_count > 0 && (
          <View style={styles.textWrapper}>
            <Text style={styles.count}>
              {unviewed_tasks_count > 99 ? '99+' : unviewed_tasks_count}
            </Text>
          </View>
        )}
      </View>
    )
  }
  state = {
    unviewed_tasks_count: 0,
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.company && nextProps.companies_details) {
      if (nextProps.companies_details[nextProps.company._id]) {
        const { unviewed_tasks_count } = nextProps.companies_details[
          nextProps.company._id
        ]
        this.setState({ unviewed_tasks_count })
      }
    }
  }
}

const styles = StyleSheet.create({
  textWrapper: {
    backgroundColor: '#8b81c5',
    paddingTop: 1,
    paddingBottom: 1,
    paddingLeft: 2,
    paddingRight: 2,
    borderRadius: 50,
    position: 'absolute',
    top: -14,
    right: -15,
    minWidth: 15,
  },
  count: {
    color: '#ffffff',
    fontSize: 10,
    textAlign: 'center',
    width: '100%',
  },
})

const mapStateToProps = state => ({})
const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(TasksTabIcon)
