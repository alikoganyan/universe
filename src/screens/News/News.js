import React, { Component } from 'react'
import { View } from 'react-native'
import styled from 'styled-components'
import { connect } from 'react-redux'
import SafeAreaView from '../../common/SafeAreaView'
import sendRequest from '../../utils/request'
import { p_news } from '../../constants/api'
import Content from './Content'
import { setNews } from '../../actions/newsActions'
import OfflineNotice from '../../common/OfflineNotice'

const Wrapper = styled(View)`
  height: 100%;
`

class News extends Component {
  render() {
    const { companyLoading } = this.props
    return (
      <SafeAreaView behavior="padding">
        {companyLoading && <OfflineNotice text="Обновляется" bgColor="green" />}
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
        let news = [...res.news]
        news = news.sort((a, b) => {
          // Turn your strings into dates, and then subtract them
          // to get a value that is either negative, positive, or zero.
          return new Date(b.created_at) - new Date(a.created_at)
        })
        setNews(news)
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
  companyLoading: state.dialogsReducer.companyLoading,
  news: state.newsReducer.news,
})
const mapDispatchToProps = dispatch => ({
  setNews: _ => dispatch(setNews(_)),
})
export default connect(mapStateToProps, mapDispatchToProps)(News)
