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
const { lightGrey1, black, yellow } = Colors
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
        {image === '/images/default_avatar.jpg' ? (
          <DefaultAvatar />
        ) : (
          <ImageComponent source={{ uri: `https://testser.univ.team${image}` }} />
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
            <DialogsLabel>
              <GroupIcon right />
              <Text>Получатели</Text>
            </DialogsLabel>
            <DialogsLabel style={{ justifyContent: 'space-between' }}>
              <TouchableOpacity onPress={this.addParticipant}>
                <AddReciever>Добавить</AddReciever>
              </TouchableOpacity>
              <Button
                disabled={!text || !receivers.length}
                onPress={this.proceed}
                background={yellow}
                color={black}
              >
                Продолжить
              </Button>
            </DialogsLabel>
          </Recievers>
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
    text: '',
  }

  componentDidMount() {}

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
    const { receivers, forward, addFeed, user } = this.props
    const { text } = this.state
    let idList = []
    // eslint-disable-next-line array-callback-return
    receivers.map(e => {
      idList = [...idList, e._id]
    })
    const newFeed = {
      receivers,
      tags: [],
      likes_сount: 0,
      likes: [],
      text,
      comments: [],
      creator: { ...user },
      created_at: new Date(),
      updated_at: new Date(),
    }
    addFeed(newFeed)
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
          forward()
        },
        failFunc: err => {
          // console.log({ err })
        },
      })
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
})
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Content)
