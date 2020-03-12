import React, { Component } from 'react'
import { connect } from 'react-redux'
import { StyleSheet, Text, View } from 'react-native'
import { NewsMenuIcon } from '../assets'
import { setReset } from '../actions/userActions'

class NewsTabIcon extends Component {
  render() {
    const { unreaded_news_count } = this.state

    return (
      <View>
        <NewsMenuIcon focused={this.props.focused} />
        {unreaded_news_count > 0 && (
          <View style={styles.textWrapper}>
            <Text style={styles.count}>
              {unreaded_news_count > 99 ? '99+' : unreaded_news_count}
            </Text>
          </View>
        )}
      </View>
    )
  }
  state = {
    unreaded_news_count: 0,
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.company && nextProps.companies_details) {
      if (nextProps.companies_details[nextProps.company._id]) {
        const { unreaded_news_count } = nextProps.companies_details[
          nextProps.company._id
        ]
        this.setState({ unreaded_news_count })
        this.props.setReset(false)
      }
    }
  }
}

const styles = StyleSheet.create({
  textWrapper: {
    backgroundColor: '#fdb557',
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

const mapStateToProps = state => ({
  companies_details: state.userReducer.companies_details,
  company: state.userReducer.company,
  reset: state.userReducer.reset,
})
const mapDispatchToProps = dispatch => ({
  setReset: _ => dispatch(setReset(_)),
})

export default connect(mapStateToProps, mapDispatchToProps)(NewsTabIcon)
