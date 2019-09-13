import React, { Component } from 'react'
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { CommentIcon, HeartIcon } from '../../assets/index'
import { setFeed } from '../../actions/newsActions'
import helper, { getHamsterDate } from '../../utils/helpers'
import ImageComponent from '../../common/Image'
import DefaultAvatar from '../../common/DefaultAvatar'
import Loader from '../../common/Loader'
import Header from './Header'
import TabPreHeader from '../../common/TabPreHeader'

const { borderRadius, Colors, fontSize, sidePadding, HeaderHeight } = helper
const { yellow, darkBlue2, grey2 } = Colors
const Wrapper = styled(View)`
  background: white;
  height: ${Dimensions.get('window').height - HeaderHeight};
`
const NewsList = styled(Animated.FlatList)`
  display: flex;
  flex-grow: 1;
`
const NewsItem = styled(TouchableOpacity)`
  background: white;
  padding: 20px;
  padding-bottom: 10px;
  border: 0.5px solid ${yellow};
  border-radius: ${borderRadius};
  margin: 0 ${sidePadding}px 10px;
`
const Sender = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 15px;
`
const SenderName = styled(Text)`
  font-size: 13;
  font-weight: 500;
`
const SenderInfo = styled(View)`
  display: flex;
  justify-content: space-between;
  height: 35px;
  flex: 1;
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
const HashTag = styled(Text)`
  color: ${yellow};
  margin-right: 5px;
  font-weight: 500;
  font-size: 13px;
`
const NewsText = styled(Text)`
  color: ${darkBlue2};
  font-weight: 300;
  font-size: 14px;
`
const Reactions = styled(View)`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
`
const Reactionsext = styled(Text)`
  color: ${grey2};
  font-size: ${fontSize.sm};
  margin-left: 5px;
`

const Title = styled(Animated.Text)`
  font-family: 'OpenSans-Bold';
  font-size: 30px;
  color: ${Colors.black};
  padding: 0 16px 8px;
  background-color: ${Colors.white};
  z-index: 2;
`

class Content extends Component {
  render() {
    const { news, navigate } = this.props
    const opacity = this.scrollY.interpolate({
      inputRange: [0, 90, 91],
      outputRange: [0, 0, 1],
    })

    return (
      <SafeAreaView>
        <Wrapper>
          <TabPreHeader
            onWritePress={() => navigate('NewFeed')}
            title="Новости"
            opacity={opacity}
          />
          <NewsList
            data={news}
            ListHeaderComponent={this._renderListHeader}
            ListEmptyComponent={this._renderEmptyComponent}
            contentContainerStyle={{ paddingBottom: 30 }}
            renderItem={({ item }) => {
              const { created_at, creator, text, comments, likes_сount } = item
              const date = getHamsterDate(created_at)
              return (
                <NewsItem onPress={() => this.proceed(item)}>
                  <Sender>
                    {creator.image === '/images/default_avatar.jpg' ? (
                      <DefaultAvatar
                        size="xs"
                        style={{ marginRight: 10 }}
                        id={creator._id}
                      />
                    ) : (
                      <ImageComponent
                        source={{
                          uri: `https://ser.univ.team${creator.image}`,
                        }}
                        size="xs"
                        style={{ marginRight: 10 }}
                      />
                    )}
                    <SenderInfo>
                      <SenderName numberOfLines={1}>
                        {creator.first_name
                          ? `${creator.first_name} ${creator.last_name}`
                          : creator.phone_number}
                      </SenderName>
                      <TimeSent>{date}</TimeSent>
                    </SenderInfo>
                  </Sender>
                  <NewsText numberOfLines={2}>{text}</NewsText>
                  <NewsItemInfo>
                    <ShowAll>
                      <HashTag>ЧИТАТЬ ДАЛЕЕ</HashTag>
                    </ShowAll>

                    <Reactions>
                      <HeartIcon />
                      <Reactionsext>{likes_сount}</Reactionsext>
                      <CommentIcon left />
                      <Reactionsext>{comments.length}</Reactionsext>
                    </Reactions>
                  </NewsItemInfo>
                </NewsItem>
              )
            }}
            keyExtractor={(item, index) => index.toString()}
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [
                {
                  nativeEvent: { contentOffset: { y: this.scrollY } },
                },
              ],
              {
                useNativeDriver: true,
              },
            )}
          />
        </Wrapper>
      </SafeAreaView>
    )
  }

  state = {}
  scrollY = new Animated.Value(0)

  componentDidMount() {}

  proceed = e => {
    const { proceed, setFeed } = this.props
    setFeed(e)
    proceed()
  }

  _renderListHeader = () => {
    const translateY = this.scrollY.interpolate({
      inputRange: [0, 50, 51],
      outputRange: [0, 50, 50],
    })

    return (
      <>
        <Title style={{ transform: [{ translateY }] }}>Новости</Title>
        <Header />
      </>
    )
  }

  _renderEmptyComponent = () => (
    <Loader hint="Пока нет новостей" style={{ flex: 1 }} />
  )
}

const mapStateToProps = state => ({
  news: state.newsReducer.news,
})
const mapDispatchToProps = dispatch => ({
  setFeed: _ => dispatch(setFeed(_)),
})
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Content)
