import React, { Component } from 'react'
import { View, TouchableOpacity } from 'react-native'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { BackIcon, EditIcon } from '../../assets/index'
import helper from '../../utils/helpers'
import { p_news_search } from '../../constants/api'
import ImageComponent from '../../common/Image'
import DefaultAvatar from '../../common/DefaultAvatar'
import { setNews } from '../../actions/newsActions'
import sendRequest from '../../utils/request'
import { setIsMyProfile } from '../../actions/profileAction'

const { sidePadding, HeaderHeight } = helper

const Header = styled(View)`
  width: 100%;
  background: white;
  height: ${HeaderHeight};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-right: ${sidePadding}px;
  padding-left: ${sidePadding}px;
`
const Left = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Right = styled(Left)`
  justify-content: flex-end;
`

class HeaderComponent extends Component {
  render() {
    const { back, user, feed } = this.props
    const { image } = user

    if (!feed.creator) {
      return null
    }
    return (
      <Header>
        <Left>
          <BackIcon onPress={back} right />
        </Left>
        <Right>
          {user._id === feed.creator._id && (
            <EditIcon right onPress={this.editFeed} />
          )}
          <TouchableOpacity onPress={this.toProfile}>
            {!image ||
            image === '/images/default_group.png' ||
            image === '/images/default_avatar.jpg' ? (
              <DefaultAvatar size="header" style={{ marginLeft: 10 }} />
            ) : (
              <ImageComponent
                source={{ uri: `https://seruniverse.asmo.media${image}` }}
                size="header"
              />
            )}
          </TouchableOpacity>
        </Right>
      </Header>
    )
  }

  state = {
    search: false,
    find: '',
  }

  toProfile = () => {
    const { navigate } = this.props
    this.props.setIsMyProfile(true)
    navigate('Profile')
  }

  find = e => {
    this.setState({ find: e })
    e
      ? sendRequest({
          r_path: p_news_search,
          method: 'post',
          attr: {
            text: e,
            withUser: true,
          },
          success: res => {},
          failFunc: err => {},
        })
      : sendRequest({
          r_path: p_news_search,
          method: 'post',
          attr: {
            text: e,
            withUser: true,
          },
          success: res => {
            setNews(res.news)
          },
          failFunc: err => {},
        })
  }

  startSearch = () => {
    this.setState({ search: true })
  }

  stopSearch = () => {
    this.setState({ search: false })
  }

  addTask = () => {
    const { navigate } = this.props
    navigate('NewFeed')
  }

  editFeed = () => {
    const { navigate } = this.props
    navigate('FeedEdit')
  }
}

const mapStateToProps = state => ({
  user: state.userReducer.user,
  tasks: state.tasksReducer.tasks,
  feed: state.newsReducer.feed,
})
const mapDispatchToProps = dispatch => ({
  setNews: _ => dispatch(setNews(_)),
  setIsMyProfile: _ => dispatch(setIsMyProfile(_)),
})
export default connect(mapStateToProps, mapDispatchToProps)(HeaderComponent)
