import React, { Component } from 'react'
import { View, Text, SafeAreaView, FlatList, Image, TouchableOpacity } from 'react-native'
import { CommentIcon, HeartIcon } from '../../assets/index'
import styled from 'styled-components'
import { setFeed } from '../../actions/newsActions'
import helper from '../../utils/helpers'
import { connect } from 'react-redux'
import { ImageComponent } from '../../common'
const { borderRadius, Colors, fontSize, sidePadding } = helper;
const { yellow, darkBlue2, grey2 } = Colors;
const Wrapper = styled(View)`
    padding-bottom: 20px;   
    background: white;
`
const NewsList = styled(FlatList)`
    padding: ${sidePadding};
    display: flex;
    flex-grow: 1;
    padding-bottom: 20px;
`
const NewsItem = styled(TouchableOpacity)`
    background: white;
    padding: 20px;
    padding-bottom: 10px;
    margin-bottom: 10px;
    border: 0.5px solid ${yellow};
    border-radius: ${borderRadius};
`
const Sender = styled(View)`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 15px;
`
const SenderName = styled(Text)`
    font-size: 13;
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
    font-size: 13px;
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
`

class Content extends Component {
    render() {
        const { news } = this.props;
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec',];
        return (
            <SafeAreaView>
                <Wrapper>
                    <NewsList
                        data={news}
                        ListFooterComponent={<View style={{ margin: 10, }} />}
                        renderItem={({ item }) => {
                            console.log('\n\n\n\n', item)
                        const date = new Date(item.created_at)
                        return <NewsItem onPress={() => this.proceed(item)}>
                            <Sender>
                                <ImageComponent source={{ uri: item.creator.image ? `http://ser.univ.team${item.creator.image}` : 'https://facebook.github.io/react/logo-og.png' }} size={"xs"} style={{
                                    marginRight: 10
                                }} />
                                <SenderInfo>
                                    <SenderName numberOfLines={1}>{item.creator.first_name} {item.creator.last_name}</SenderName>
                                    <TimeSent>
                                        {date.getDate()}{' '}
                                        {months[date.getMonth()]}{' '}
                                        {date.getFullYear()}{' '}
                                        {date.getHours()}:{date.getMinutes()} 
                                    </TimeSent>
                                </SenderInfo>
                            </Sender>
                            <NewsText numberOfLines={2}>{item.text}</NewsText>
                            <NewsItemInfo>
                                <ShowAll>
                                    <HashTag>ЧИТАТЬ ДАЛЕЕ</HashTag>
                                </ShowAll>

                                <Reactions>
                                    <HeartIcon /><Reactionsext>{item.likes_сount}</Reactionsext>
                                    <CommentIcon left /><Reactionsext>{item.comments.length}</Reactionsext>
                                </Reactions>
                            </NewsItemInfo>
                        </NewsItem>}
                        }
                        keyExtractor={(item, index) => index.toString()}
                    />
                </Wrapper>
            </SafeAreaView>
        )
    }
    state = {
    }
    componentDidMount(){
    }
    proceed = (e) => {
        const {proceed, setFeed} = this.props
        setFeed(e)
        proceed()
    }
}

const mapStateToProps = state => ({
    news: state.newsReducer.news,
})
const mapDispatchToProps = dispatch => ({
    setFeed: _ => dispatch(setFeed(_)),
})
export default connect(mapStateToProps, mapDispatchToProps)(Content)
