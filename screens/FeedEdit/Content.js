import React, { Component } from 'react'
import { View, Text, TextInput, Dimensions, ScrollView, TouchableOpacity } from 'react-native'
import FloatingLabel from 'react-native-floating-labels'
import styled from 'styled-components'
import helper from '../../utils/helpers'
import { connect } from 'react-redux'
import { setUser } from '../../actions/userActions'
import { addFeed, setNews, setFeed } from '../../actions/newsActions'
import Button from '../../common/Button'
import ImageComponent from '../../common/Image'
import DefaultAvatar from '../../common/DefaultAvatar'
import sendRequest from '../../utils/request'
import { p_news } from '../../constants/api'
import { GroupIcon, CloseIcon } from '../../assets/'
import { setFeedReceivers } from '../../actions/participantsActions'
const { Colors, HeaderHeight, sidePadding } = helper;
const { lightGrey1, black, yellow } = Colors;
const Wrapper = styled(View)`
    padding: 0 ${sidePadding * 2}px;
    justify-content: center;
    flex-grow: 1;
    height: 100%;
`

const StyledInput = styled(TextInput)`
    border: 1px solid ${lightGrey1};
    border-width: 0;
    border-bottom-width: 1px;
    padding-bottom: 10px;
    text-align: center;
    margin-bottom: 50px;
    ${({ style }) => style}
`
const ButtonBox = styled(View)`
    width: 170px;
    align-self: center;
`
const Recievers = styled(View)`lkljkljk
`
const Reciever = styled(View)`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-top: 20px;
    
`
const RecieverInfo = styled(View)`
    display: flex;
    justify-content: space-between;
`
const Department = styled(Text)`
    color: ${lightGrey1};
`
const DialogsLabel = styled(View)`
    display: flex;
    align-items: center;
    flex-direction:row;
    justify-content: flex-start;
    margin-top: 20px;
`
const AddReciever = styled(Text)`
    color: ${yellow};
`
const RecieverComponent = (props) => {
    const { children, last = false, onDelete } = props;
    const { image, first_name, last_name, phone_number, department } = children
    return <Reciever last={last}>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            {image === '/images/default_avatar.jpg' ?
                <DefaultAvatar /> :
                <ImageComponent source={{ uri: `http://ser.univ.team${image}` }} />
            }
            <View style={{ flex: 1, marginLeft: 10 }}>
                <RecieverInfo>
                    <Text numberOfLines={1}>{first_name ? `${first_name} ${last_name}` : phone_number}</Text>
                    {/* {!!department ? <Department numberOfLines={1}>{'без департамента'}</Department> : null} */}
                </RecieverInfo>
            </View>
            <CloseIcon onPress={onDelete} />
        </View>
    </Reciever>
}
class Content extends Component {
    render() {
        const { text } = this.state
        const { receivers } = this.props
        return (
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps='handled'>
                <Wrapper>
                    <StyledInput password={true}
                        onChangeText={this.handleChange}
                        value={text}
                        placeholder={'Текст новости'}
                        multiline={true}
                        style={{ margin: 0, textAlign: 'left', paddingLeft: 10, maxHeight: 130 }} />
                    <Recievers>
                        <DialogsLabel>
                            <GroupIcon right />
                            <Text>Получатели</Text>
                        </DialogsLabel>
                        <DialogsLabel style={{ justifyContent: 'space-between' }}>
                            <TouchableOpacity onPress={this.addParticipant}>
                                <AddReciever>Добавить</AddReciever>
                            </TouchableOpacity>
                            <Button
                                onPress={this.proceed}
                                style={{ background: yellow }}
                                color={black}>Сохранить изменения</Button>
                        </DialogsLabel>
                    </Recievers>
                    <ScrollView>
                        {receivers.map((e, i) => (
                            <RecieverComponent key={i} onDelete={() => this.deleteReceiver(e)} last={i === receivers.length}>{e}</RecieverComponent>
                        ))}
                    </ScrollView>
                </Wrapper>
            </ScrollView>)
    }
    state = {
        receivers: [],
        text: '',
        err: false
    }
    componentDidMount() {
        const { feed, setFeedReceivers } = this.props
        const { text, receivers } = feed
        this.setState({ text, receivers })
        setFeedReceivers(receivers)
    }
    componentWillUpdate() {

    }
    deleteReceiver = e => {
        const { _id } = e
        const { receivers } = this.state
        const { setFeedReceivers } = this.props
        const newReceivers = [...receivers].filter(e => e._id !== _id)
        setFeedReceivers(newReceivers)
    }
    addParticipant = () => {
        const { addParticipant } = this.props
        addParticipant()
    }
    proceed = (e) => {
        const { id, receivers, forward, setNews, setFeed, user, feed, news, back } = this.props;
        const { text } = this.state;
        const newFeed = {
            ...feed,
            receivers,
            text,
        }
        const newNews = [...news]
        const index = newNews.findIndex(e => e._id === feed._id)
        newNews[index] = newFeed
        if (text && receivers.length) {
            setNews(newNews)
            setFeed(newFeed)
            back()
        } else {
            this.setState({ err: true })
        }

    }
    handleCountry = (e) => {
        this.setState({ country: e })
    }
    handleChange = (e) => {
        this.setState({ text: e })
    }
}
const mapStateToProps = state => ({
    user: state.userReducer.user,
    receivers: state.participantsReducer.news.receivers,
    feed: state.newsReducer.feed,
    news: state.newsReducer.news
})
const mapDispatchToProps = dispatch => ({
    setUser: _ => dispatch(setUser(_)),
    setFeed: _ => dispatch(setFeed(_)),
    setNews: _ => dispatch(setNews(_)),
    setFeedReceivers: _ => dispatch(setFeedReceivers(_))
})
export default connect(mapStateToProps, mapDispatchToProps)(Content)