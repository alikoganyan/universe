import React, { Component } from 'react'
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  InteractionManager,
  ScrollView,
} from 'react-native'
import styled from 'styled-components'
import { connect } from 'react-redux'
import {
  CommentIcon,
  HeartIcon,
  HeartIconFilled,
  TriangleLeftIcon,
  TriangleRightIcon,
  ArrowRightIcon,
} from '../../assets/index'
import helper, { getHamsterDate } from '../../utils/helpers'
import ImageComponent from '../../common/Image'
import DefaultAvatar from '../../common/DefaultAvatar'
import { setFeed } from '../../actions/newsActions'
import { socket } from '../../utils/socket'
import { SafeAreaView } from 'react-navigation'

const { sidePadding, borderRadius, Colors, fontSize } = helper
const { yellow, black, darkBlue2, grey2 } = Colors
const Wrapper = styled(View)`
    background: white;
    /* padding: 0 ${sidePadding}px; */
    display: flex;
    flex: 1;
`
const NewsItem = styled(View)`
  background: white;
  padding: 20px;
  padding-bottom: 50px;
  border: 0.5px solid ${yellow};
  border-radius: ${borderRadius};
  margin: 0 ${sidePadding}px;
`
const Sender = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 15px;
`
const Sendermage = styled(Image)`
  width: 30;
  height: 30;
  border-radius: 15;
  margin-right: 10px;
`
const SenderName = styled(Text)`
  font-size: 13px;
  font-weight: 500;
`
const SenderInfo = styled(View)`
  display: flex;
  justify-content: space-between;
  height: 35px;
`
const TimeSent = styled(Text)`
  color: #848484;
  font-size: 11;
`
const NewsItemInfo = styled(View)`
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
`
const ShowAll = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`
const Reactions = styled(View)`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
`
const ReactionsText = styled(Text)`
  font-size: ${fontSize.sm};
  color: ${grey2};
`
const MyMessage = styled(View)`
  display: flex;
  justify-content: flex-end;
  text-align: right;
  margin: 5px 10px;
  align-self: stretch;
  background: ${yellow};
  border-radius: 3;
  max-width: 80%;
  margin-left: 20%;
`

const MyMessageText = styled(Text)`
  display: flex;
  justify-content: flex-end;
  text-align: left;
  padding: 10px 15px;
  font-size: 13;
  color: ${black};
`

const InterlocutorsMessage = styled(MyMessage)`
  justify-content: flex-start;
  flex-direction: column;
  text-align: left;
  align-items: flex-start;
  background: #fff1dd;
  margin-left: 10px;
  position: relative;
  left: -10px;
`

const InterlocutorsMessageText = styled(MyMessageText)`
  justify-content: flex-start;
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  text-align: left;
  color: ${darkBlue2};
  overflow: hidden;
  padding-top: 0;
  flex-wrap: wrap;
`
const InterlocutorsMessageName = styled(MyMessageText)`
  justify-content: flex-start;
  display: flex;
  justify-content: flex-end;
  text-align: left;
  color: ${black};
  padding-bottom: 5px;
  overflow: hidden;
`
const MessageInfo = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding: 0 10px 5px;
  width: 100%;
`

const MessageDate = styled(Text)`
  color: ${({ color }) => color || grey2};
  margin-left: 15px;
  font-size: ${fontSize.sm};
`
const FeedText = styled(ScrollView)`
  max-height: 100px;
`

const NewsText = styled(Text)`
  color: ${darkBlue2};
  font-size: 14;
  margin-left: 5px;
`
const LikeText = styled(Text)`
  font-size: ${fontSize.sm};
  color: ${({ color }) => color || grey2};
  margin-left: 5px;
`
const SeeReceivers = styled(TouchableOpacity)`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-direction: row;
  padding-right: ${sidePadding}px;
  padding: 10px;
  padding-bottom: 0;
`
const SeeReceiversText = styled(Text)`
  color: ${yellow};
`
class Content extends Component {
  render() {
    const { animationCompleted } = this.state
    const { feed } = this.props
    const { comments, creator, receivers } = feed
    const { first_name, last_name, image } = creator
    const reversedCommnets = [...comments].reverse()
    const date = getHamsterDate(feed.created_at)
    return (
      <Wrapper>
        <NewsItem>
          <Sender>
            {image === '/images/default_avatar.jpg' ? (
              <DefaultAvatar size={30} style={{ marginRight: 10 }} />
            ) : (
              <Sendermage source={{ uri: `https://testser.univ.team${image}` }} />
            )}
            <SenderInfo>
              <SenderName>
                {first_name} {last_name}
              </SenderName>
              <TimeSent>{date}</TimeSent>
            </SenderInfo>
          </Sender>
          <FeedText>
            <NewsText>{feed.text}</NewsText>
          </FeedText>
          <NewsItemInfo>
            <ShowAll />
            <Reactions>
              <HeartIcon />
              <ReactionsText>{feed.likes_сount || 0}</ReactionsText>
              <CommentIcon left />
              <ReactionsText>{feed.comments.length}</ReactionsText>
            </Reactions>
          </NewsItemInfo>
        </NewsItem>
        <SeeReceivers onPress={this.seeParticipants}>
          <SeeReceiversText>{receivers.length} получатели</SeeReceiversText>
          <ArrowRightIcon left noPaddingAll />
        </SeeReceivers>
        {animationCompleted ? (
          <FlatList
            style={{ paddingRight: 5, paddingLeft: 5 }}
            ListHeaderComponent={<View style={{ margin: 5 }} />}
            ListFooterComponent={<View style={{ margin: 5 }} />}
            keyboardDismissMode="on-drag"
            data={reversedCommnets}
            renderItem={({ item }) => <this.Message>{item}</this.Message>}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ flexGrow: 1, paddingTop: 80 }}
            inverted
          />
        ) : null}
        <SafeAreaView />
      </Wrapper>
    )
  }

  state = {
    animationCompleted: false,
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        animationCompleted: true,
      })
    })
  }

  componentWillUnmount() {
    const { setFeed } = this.props
    setFeed({})
  }

  seeParticipants = () => {
    const { navigate } = this.props
    navigate('FeedReceivers')
  }

  hitLike = e => {
    const { feed, user, setFeed } = this.props
    const { _id, comments } = feed
    const newFeed = { ...feed }
    const reversedCommnets = [...comments].reverse()
    const newComment = reversedCommnets.filter(comment => comment._id === e)[0]
    if (!newComment.likes.includes(user._id)) {
      newComment.likes_сount += 1
      newComment.likes.push(user._id)
      const newComments = [...reversedCommnets]
      const index = newComments.findIndex(comment => comment._id === e)
      newComments[index] = newComment
      newFeed.comments = newComments
      socket.emit('like_news', { _id, e })
      setFeed(newFeed)
    }
    // else {
    // 	newComment.likes_сount -= 1;
    // 	newComment.likes = newComment.likes.filter(e => e != user._id);
    // 	const newComments = [...reversedCommnets]
    // 	const index = newComments.findIndex(comment => comment._id === e)
    // 	newComments[index] = newComment
    // 	newFeed.comments = newComments
    // 	setFeed(newFeed)
    // }
  }

  Message = props => {
    const { children } = props
    const { user, feed } = this.props
    const { creator, created_at, likes_сount, text, _id, likes } = children
    const { first_name, last_name, image } = creator
    const myId = user._id
    const date = getHamsterDate(created_at)
    return myId === creator._id ? (
      <View style={{ display: 'flex', flexDirection: 'row', flex: 1 }}>
        <MyMessage>
          <MyMessageText>{text}</MyMessageText>
          <MessageInfo>
            <HeartIcon style={{ paddingRight: 5 }} />
            <LikeText color={darkBlue2}>{likes_сount}</LikeText>
            <MessageDate color={darkBlue2}>{date}</MessageDate>
          </MessageInfo>
        </MyMessage>
        <TriangleLeftIcon color={yellow} />
      </View>
    ) : (
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-end',
        }}
      >
        {image === '/images/default_avatar.jpg' ? (
          <DefaultAvatar
            style={{ position: 'relative', left: 5, bottom: 5 }}
            id={creator._id}
          />
        ) : (
          <ImageComponent
            style={{ position: 'relative', left: 5, bottom: 5 }}
            source={{
              uri: `https://testser.univ.team${image}`,
            }}
          />
        )}
        <TriangleRightIcon color="#fff1dd" />
        <InterlocutorsMessage>
          <InterlocutorsMessageName>
            {first_name} {last_name}
          </InterlocutorsMessageName>
          <InterlocutorsMessageText>{text}</InterlocutorsMessageText>
          <MessageInfo>
            {likes.includes(user._id) ? (
              <HeartIconFilled
                style={{ paddingRight: 5 }}
                marginRight
                onPress={() => this.hitLike(feed._id, _id)}
              />
            ) : (
              <HeartIcon
                style={{ paddingRight: 5 }}
                marginRight
                onPress={() => this.hitLike(feed._id, _id)}
              />
            )}
            <LikeText>{likes_сount}</LikeText>
            <MessageDate>{date}</MessageDate>
          </MessageInfo>
        </InterlocutorsMessage>
      </View>
    )
  }
}
const mapStateToProps = state => ({
  feed: state.newsReducer.feed,
  user: state.userReducer.user,
})
const mapDispatchToProps = dispatch => ({
  setFeed: _ => dispatch(setFeed(_)),
})
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Content)
