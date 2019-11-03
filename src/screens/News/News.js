import React, { Component } from 'react'
import { View } from 'react-native'
import styled from 'styled-components'
import { connect } from 'react-redux'
import SafeAreaView from '../../common/SafeAreaView'
import sendRequest from '../../utils/request'
import { p_news } from '../../constants/api'
import Content from './Content'
import { setNews } from '../../actions/newsActions'

const Wrapper = styled(View)`
  height: 100%;
`

class News extends Component {
  render() {
    return (
      <SafeAreaView behavior="padding">
        <Wrapper>
          <Content
            proceed={this.proceed}
            navigate={this.props.navigation.navigate}
          />
        </Wrapper>
      </SafeAreaView>
    )
  }

  componentDidMount() {
    const { setNews } = this.props
    sendRequest({
      r_path: p_news,
      method: 'get',
      success: res => {
        setNews(res.news)
      },
      failFunc: err => {},
    })
  }

  componentWillUnmount() {
    const { setNews } = this.props
    setNews([])
  }

  navigateBack = () => {
    const { navigation } = this.props
    navigation.goBack()
  }

  navigate = e => {
    const { navigation } = this.props
    navigation.navigate(e)
  }

  proceed = () => {
    const { navigation } = this.props
    navigation.navigate('NewsComments')
  }
}
const mapStateToProps = state => ({
  news: state.newsReducer.news,
})
const mapDispatchToProps = dispatch => ({
  setNews: _ => dispatch(setNews(_)),
})
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(News)
