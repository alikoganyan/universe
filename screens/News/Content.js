import React, { Component } from 'react';
import {
  View, Text, SafeAreaView, FlatList, TouchableOpacity, Dimensions
} from 'react-native';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { CommentIcon, HeartIcon } from '../../assets/index';
import { setFeed } from '../../actions/newsActions';
import helper from '../../utils/helpers';
import ImageComponent from '../../common/Image';
import DefaultAvatar from '../../common/DefaultAvatar';
import Loader from '../../common/Loader';

const {
  borderRadius, Colors, fontSize, sidePadding, HeaderHeight
} = helper;
const { yellow, darkBlue2, grey2 } = Colors;
const Wrapper = styled(View)`
    padding-bottom: 20px;   
    background: white;
    height: ${Dimensions.get('window').height - HeaderHeight};
`;
const NewsList = styled(FlatList)`
    padding: ${sidePadding}px;
    display: flex;
    flex-grow: 1;
    padding-bottom: 20px;
`;
const NewsItem = styled(TouchableOpacity)`
    background: white;
    padding: 20px;
    padding-bottom: 10px;
    margin-bottom: 10px;
    border: 0.5px solid ${yellow};
    border-radius: ${borderRadius};
`;
const Sender = styled(View)`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 15px;
`;
const SenderName = styled(Text)`
    font-size: 13;
`;
const SenderInfo = styled(View)`
    display: flex;
    justify-content: space-between;
    height: 35px;
    flex: 1;
`;
const TimeSent = styled(Text)`
    color: #848484;
    font-size: 11;
`;
const NewsItemInfo = styled(View)`
    width: 100%;
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    align-items: center;
    margin-top: 10px;
`;
const ShowAll = styled(View)`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
`;
const HashTag = styled(Text)`
    color: ${yellow};
    margin-right: 5px;
    font-weight: 500;
    font-size: 13px;
`;
const NewsText = styled(Text)`
    color: ${darkBlue2};
    font-weight: 300;
    font-size: 13px;
`;
const Reactions = styled(View)`
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    align-items: center;
`;
const Reactionsext = styled(Text)`
    color: ${grey2};
    font-size: ${fontSize.sm};
    margin-left: 5px;
`;

class Content extends Component {
  render() {
    const { news } = this.props;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec',];
    return (
      <SafeAreaView>
        <Wrapper>
          {news.length ? (
            <NewsList
              data={news}
              ListFooterComponent={<View style={{ margin: 10, }} />}
              renderItem={({ item }) => {
                const {
                  created_at, creator, text, comments, likes_сount
                } = item;
                const date = new Date(created_at);
                return (
                  <NewsItem onPress={() => this.proceed(item)}>
                    <Sender>
                      {creator.image === '/images/default_avatar.jpg'
                        ? <DefaultAvatar size="xs" style={{ marginRight: 10 }} id={creator._id} />
                        : (
                          <ImageComponent
                            source={{ uri: `http://ser.univ.team${creator.image}` }}
                            size="xs"
                            style={{ marginRight: 10 }}
                          />
                        )
                                    }
                      <SenderInfo>
                        <SenderName numberOfLines={1}>
                          {creator.first_name
                            ? `${creator.first_name} ${creator.last_name}` : creator.phone_number}
                        </SenderName>
                        <TimeSent>
                          {date.getDate()}
                          {' '}
                          {months[date.getMonth()]}
                          {' '}
                          {date.getFullYear()}
                          {' '}
                          {date.getHours()}
:
                          {date.getMinutes()}
                        </TimeSent>
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
                );
              }
                        }
              keyExtractor={(item, index) => index.toString()}
            />
          )
            : <Loader hint="Пока нет новостей" style={{ flex: 1 }} />}
        </Wrapper>
      </SafeAreaView>
    );
  }

    state = {
    }

    componentDidMount() {}

    componentWillUnmount() {
      setFeed({});
    }

    proceed = (e) => {
      const { proceed, setFeed } = this.props;
      setFeed(e);
      proceed();
    }
}

const mapStateToProps = state => ({
  news: state.newsReducer.news,
});
const mapDispatchToProps = dispatch => ({
  setFeed: _ => dispatch(setFeed(_)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Content);
