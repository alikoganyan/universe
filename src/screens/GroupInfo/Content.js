import React, { Component } from 'react'
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native'
import styled from 'styled-components'
import {
  BackIcon,
  EllipsisVIcon,
  MessageIndicatorIcon,
} from '../../assets/index'
import helper from '../../utils/helpers'

const { fontSize } = helper
const Wrapper = styled(View)`
  padding-top: 0px;
  background: white;
  margin-bottom: 110px;
`
const Group = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 20px 0;
  border: 1px solid #e6e6e6;
  border-width: 0;
  border-bottom-width: 1px;
`
const GroupImage = styled(Image)`
  width: 60px;
  height: 60px;
  border-radius: 30;
  margin: 0 10px;
`
const GroupInfo = styled(View)`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-start;
  height: 50px;
`
const GroupName = styled(Text)`
  font-size: 18;
`
const GroupParticipants = styled(Text)`
  font-size: 15;
`

const User = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 10px 0;
`
const Participants = styled(View)`
  padding: 0 10px;
`
const ParticipantImage = styled(Image)`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  margin-right: 10px;
`
const ParticipantInfo = styled(View)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  height: 40px;
`
const ParticipantName = styled(Text)`
  font-size: 15px;
`
const ParticipantLastSeen = styled(Text)`
  font-size: ${fontSize.text};
  color: #a3a3a3;
`
const GoBack = styled(View)`
  position: absolute;
  right: 10px;
  margin-top: 10px;
  z-index: 5;
`
const GoBackText = styled(Text)`
  color: #395e7f;
`
const StyledFlatList = styled(FlatList)`
  height: 100%;
`
export default class Content extends Component {
  render() {
    const { groupsList } = this.state
    const Participant = props => {
      const { img, name, lastSeen } = props.children

      return (
        <User>
          <ParticipantImage source={{ uri: img }} />
          <ParticipantInfo>
            <ParticipantName>{name}</ParticipantName>
            <ParticipantLastSeen>{lastSeen}</ParticipantLastSeen>
          </ParticipantInfo>
        </User>
      )
    }
    return (
      <SafeAreaView>
        <Wrapper>
          <Group>
            <GroupImage
              source={{ uri: 'https://facebook.github.io/react/logo-og.png' }}
            />
            <GroupInfo>
              <GroupName>lol</GroupName>
              <GroupParticipants>12 participants</GroupParticipants>
            </GroupInfo>
          </Group>
          <Participants>
            <GoBack>
              <TouchableOpacity>
                <GoBackText>Выйти и закрыть</GoBackText>
              </TouchableOpacity>
            </GoBack>
            <StyledFlatList
              data={groupsList}
              renderItem={({ item }) => <Participant>{item}</Participant>}
              keyExtractor={(item, index) => index.toString()}
            />
          </Participants>
        </Wrapper>
      </SafeAreaView>
    )
  }

  state = {
    groupsList: [
      {
        img: 'https://facebook.github.io/react/logo-og.png',
        name: 'test',
        lastSeen: '2 дня назад',
      },
      {
        img: 'https://facebook.github.io/react/logo-og.png',
        name: 'test',
        lastSeen: '2 дня назад',
      },
      {
        img: 'https://facebook.github.io/react/logo-og.png',
        name: 'test',
        lastSeen: '2 дня назад',
      },
      {
        img: 'https://facebook.github.io/react/logo-og.png',
        name: 'test',
        lastSeen: '2 дня назад',
      },
      {
        img: 'https://facebook.github.io/react/logo-og.png',
        name: 'test',
        lastSeen: '2 дня назад',
      },
    ],
  }
}
