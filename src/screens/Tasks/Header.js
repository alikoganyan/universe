import React, { Component } from 'react'
import { View, Text, Dimensions, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { BackIcon, SearchIcon } from '../../assets/index'
import helper from '../../utils/helpers'
import { startSearch } from '../../actions/messageActions'
import ImageComponent from '../../common/Image'
import DefaultAvatar from '../../common/DefaultAvatar'
import { setIsMyProfile, setProfile } from '../../actions/profileAction'

const { sidePadding, HeaderHeight, fontSize } = helper
const Header = styled(View)`
  width: ${Dimensions.get('window').width - sidePadding * 2}px;
  align-self: center;
  background: white;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: ${HeaderHeight}px;
`

const Info = styled(View)`
  display: flex;
  margin-left: 10px;
`
const InfoChatName = styled(Text)`
  color: black;
  font-size: ${fontSize.text};
`
const InfoParticipants = styled(Text)`
  color: #5f7991;
  font-size: ${fontSize.sm};
`
const Left = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
`
const Right = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: flex-end;
  margin-left: ${sidePadding}px;
`
const ToProfile = styled(TouchableOpacity)`
  display: flex;
  flex-direction: row;
  margin-right: 20px;
`
class HeaderComponent extends Component {
  render() {
    const { back, currentTask } = this.props
    const { first_name, last_name, phone_number, tasks, image } = currentTask
    return (
      <Header>
        <Left>
          <BackIcon onPress={back} />
          <ToProfile onPress={() => this.toSenderProfile(currentTask)}>
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
            <Info>
              <InfoChatName>
                {first_name ? `${first_name} ${last_name}` : phone_number}
              </InfoChatName>
              <InfoParticipants>
                {tasks && tasks.length ? tasks.length : ''} задач
              </InfoParticipants>
            </Info>
          </ToProfile>
        </Left>
        <Right>
          <SearchIcon onPress={startSearch} />
        </Right>
      </Header>
    )
  }

  toSenderProfile = e => {
    const { navigate, setProfile } = this.props
    this.props.setIsMyProfile(false)
    setProfile(e)
    navigate('Profile')
  }
}

const mapStateToProps = state => ({
  currentTask: state.tasksReducer.currentTask,
})
const mapDispatchToProps = dispatch => ({
  setProfile: _ => dispatch(setProfile(_)),
  setIsMyProfile: _ => dispatch(setIsMyProfile(_)),
})
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HeaderComponent)
