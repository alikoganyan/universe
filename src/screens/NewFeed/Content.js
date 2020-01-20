import React, { Component } from 'react'
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import styled from 'styled-components'
import { connect } from 'react-redux'
import helper from '../../utils/helpers'
import { setUser } from '../../actions/userActions'
import { addFeed } from '../../actions/newsActions'
import Button from '../../common/Button'
import ImageComponent from '../../common/Image'
import DefaultAvatar from '../../common/DefaultAvatar'
import sendRequest from '../../utils/request'
import { p_news } from '../../constants/api'
import { GroupIcon, CloseIcon } from '../../assets'
import { setFeedReceivers } from '../../actions/participantsActions'

const { Colors, sidePadding } = helper
const { lightGrey1, black, yellow, pink } = Colors
const Wrapper = styled(View)`
  padding: 0 ${sidePadding * 2}px;
  justify-content: center;
  flex-grow: 1;
  height: 100%;
`

const StyledInput = styled(TextInput)`
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
`
const AddReciever = styled(Text)`
  color: ${yellow};
`
const RecieverComponent = props => {
  const { children, last = false, onDelete } = props
  const { image, first_name, last_name, phone_number } = children
  return (
    <Reciever last={last}>
      <View
        style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
      >
        {!image || image === '/images/default_avatar.jpg' ? (
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
    const { text, touched } = this.state
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
              borderBottomWidth: 1,
              borderBottomColor: touched && !text ? pink : lightGrey1,
            }}
          />
          <Recievers>
            <DialogsLabel style={{ justifyContent: 'space-between' }}>
              <TouchableOpacity onPress={this.addParticipant}>
                <AddReciever>Добавить</AddReciever>
              </TouchableOpacity>
              <Button onPress={this.proceed} background={yellow} color={black}>
                Продолжить
              </Button>
            </DialogsLabel>
            <DialogsLabel>
              <GroupIcon right />
              <Text
                style={{ color: touched && !receivers.length ? pink : black }}
              >
                Получатели
              </Text>
            </DialogsLabel>
          </Recievers>
          <ScrollView>
            {receivers
              .filter(e => !!e)
              .map((e, i) => (
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
    text: '',
    touched: false,
  }

  componentDidMount() {}

  componentWillUnmount() {
    this.props.setReceivers([])
  }

  deleteReceiver = e => {
    const { _id } = e
    const { receivers, setFeedReceivers } = this.props
    const newReceivers = [...receivers].filter(e => e._id !== _id)
    setFeedReceivers(newReceivers)
  }

  addParticipant = () => {
    const { addParticipant } = this.props
    addParticipant()
  }

  proceed = () => {
    const { receivers, forward, addFeed } = this.props
    const { text } = this.state
    if (!text || !receivers.length) {
      this.setState({
        touched: true,
      })
    } else {
      const idList = []
      receivers.forEach(e => idList.push(e._id))
      if (text && receivers.length) {
        sendRequest({
          r_path: p_news,
          method: 'post',
          attr: {
            news: {
              text,
              receivers: idList,
            },
          },
          success: res => {
            addFeed(res.news)
            forward()
          },
          failFunc: err => {},
        })
      }
    }
  }

  handleCountry = e => {}

  handleChange = e => {
    this.setState({ text: e })
  }
}
const mapStateToProps = state => ({
  user: state.userReducer.user,
  receivers: state.participantsReducer.news.receivers,
})
const mapDispatchToProps = dispatch => ({
  setUser: _ => dispatch(setUser(_)),
  addFeed: _ => dispatch(addFeed(_)),
  setFeedReceivers: _ => dispatch(setFeedReceivers(_)),
  setReceivers: _ => dispatch(setFeedReceivers(_)),
})
export default connect(mapStateToProps, mapDispatchToProps)(Content)
