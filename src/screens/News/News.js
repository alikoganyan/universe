import React, { Component } from 'react'
import { View, Text, Image } from 'react-native'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { BackIcon } from '../../assets/index'
import SafeAreaView from '../../common/SafeAreaView'
import sendRequest from '../../utils/request'
import { p_news } from '../../constants/api'
import Header from './Header'
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
          <Header back={this.navigateBack} navigate={this.navigate} />
          <Content proceed={this.proceed} />
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
      failFunc: err => {
        console.log(err)
      },
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