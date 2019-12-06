import React, { Component } from 'react'
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native'
import styled from 'styled-components'
import { connect } from 'react-redux'
import helper from '../../utils/helpers'
import { setUser } from '../../actions/userActions'
import { setNews, setFeed } from '../../actions/newsActions'
import Button from '../../common/Button'
import ImageComponent from '../../common/Image'
import DefaultAvatar from '../../common/DefaultAvatar'
import { GroupIcon, CloseIcon } from '../../assets'
import { setFeedReceivers } from '../../actions/participantsActions'
import sendRequest from '../../utils/request'
import { p_news } from '../../constants/api'

const { Colors, sidePadding } = helper
const { lightGrey1, black, yellow, red } = Colors
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
const Recievers = styled(View)``
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
const DialogsLabel = styled(View)`
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: flex-start;
  margin-top: 20px;
  margin-bottom: 10px;
`
const AddReciever = styled(Text)`
  color: ${yellow};
`
const DeleteFeed = styled(AddReciever)`
  color: ${red};
`
const RecieverComponent = props => {
  const { children, last = false, onDelete } = props
  const { image, first_name, last_name, phone_number } = children
  return (
    <Reciever last={last}>
      <View
        style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
      >
        {image === '/images/default_avatar.jpg' ? (
          <DefaultAvatar />
        ) : (
          <ImageComponent
            source={{ uri: `https://seruniverse.asmo.media${image}` }}
          />
        )}
        <View style={{ flex: 1, marginLeft: 10 }}>
          <RecieverInfo>
            <Text numberOfLines={1}>
              {first_name ? `${first_name} ${last_name}` : phone_number}
            </Text>
            {/* {!!department ? <Department numberOfLines={1}>{'без департамента'}</Department> : null} */}
          </RecieverInfo>
        </View>
        <CloseIcon onPress={onDelete} />
      </View>
    </Reciever>
  )
}
class Content extends Component {
  render() {
    const { text } = this.state
    const { receivers } = this.props
    return (
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <Wrapper>
          <StyledInput
            password
            onChangeText={this.handleChange}
            value={text}
            placeholder="Текст новости"
            multiline
            style={{
              margin: 0,
              textAlign: 'left',
              paddingLeft: 10,
              maxHeight: 130,
            }}
          />
          <Recievers>
            <DialogsLabel style={{ justifyContent: 'space-between' }}>
              <TouchableOpacity
                onPress={this.deleteFeed}
                style={{ justifyContent: 'flex-start' }}
              >
                <DeleteFeed>Удалить</DeleteFeed>
              </TouchableOpacity>
              <Button onPress={this.proceed} background={yellow} color={black}>
                Сохранить
              </Button>
            </DialogsLabel>
          </Recievers>
          <DialogsLabel>
            <TouchableOpacity
              onPress={this.addParticipant}
              style={{ justifyContent: 'flex-start', flexDirection: 'row' }}
            >
              <GroupIcon right noPaddingAll />
              <AddReciever>Добавить получателей</AddReciever>
            </TouchableOpacity>
          </DialogsLabel>

          <ScrollView>
            {receivers.map((e, i) => (
              <RecieverComponent
                key={i}
                onDelete={() => this.deleteReceiver(e)}
                last={i === receivers.length}
              >
                {e}
              </RecieverComponent>
            ))}
          </ScrollView>
        </Wrapper>
      </ScrollView>
    )
  }

  state = {
    receivers: [],
    text: '',
  }

  componentDidMount() {
    const { feed, setFeedReceivers } = this.props
    const { text, receivers } = feed
    this.setState({ text, receivers })
    setFeedReceivers(receivers)
  }

  deleteFeed = () => {
    Alert.alert('Удалить новость?', null, [
      {
        text: 'Отменить',
        style: 'cancel',
      },
      {
        text: 'Удалить',
        onPress: this.confirmDelete,
      },
    ])
  }

  confirmDelete = () => {
    const { forward, setNews, feed, news } = this.props
    const newNews = [...news].filter(e => e._id !== feed._id)
    setNews(newNews)
    sendRequest({
      r_path: p_news,
      method: 'delete',
      attr: {
        _id: feed._id,
      },
      success: res => {},
      failFunc: err => {},
    })
    forward()
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

  proceed = () => {
    const { receivers, setNews, setFeed, feed, news } = this.props
    const { text } = this.state
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
      this.editFeed(newFeed)
    }
  }

  editFeed = newFeed => {
    const { back } = this.props
    const { _id, text, receivers } = newFeed
    const reqBody = {
      news_id: _id,
      receivers,
      text,
    }
    sendRequest({
      r_path: p_news,
      method: 'patch',
      attr: reqBody,
      success: res => {
        back()
      },
      failFunc: err => {},
    })
  }

  handleCountry = e => {
    this.setState({ country: e })
  }

  handleChange = e => {
    this.setState({ text: e })
  }
}
const mapStateToProps = state => ({
  user: state.userReducer.user,
  receivers: state.participantsReducer.news.receivers,
  feed: state.newsReducer.feed,
  news: state.newsReducer.news,
})
const mapDispatchToProps = dispatch => ({
  setUser: _ => dispatch(setUser(_)),
  setFeed: _ => dispatch(setFeed(_)),
  setNews: _ => dispatch(setNews(_)),
  setFeedReceivers: _ => dispatch(setFeedReceivers(_)),
})
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Content)
