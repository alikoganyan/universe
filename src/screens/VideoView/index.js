import React, { Component } from 'react'
import { SafeAreaView, Text, View } from 'react-native'
import Video from 'react-native-video'
import styled from 'styled-components'
import helper from '../../utils/helpers'
import { BackIcon } from '../../assets'

const { sidePadding, HeaderHeight, fontSize, Colors } = helper
const Header = styled(View)`
  width: 100%;
  background: white;
  height: ${HeaderHeight};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
`
const Info = styled(View)`
  display: flex;
  margin-left: 10px;
`
const InfoChatName = styled(Text)`
  color: black;
  font-size: ${fontSize.chatHeaderName};
  font-family: OpenSans;
`
const Right = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: flex-end;
  width: ${sidePadding * 2}px;
`

export default class VideoViewScreen extends Component {
  render() {
    const {
      navigation: {
        goBack,
        state: { params: { title, uri = '' } = {} } = {},
      } = {},
    } = this.props
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Header>
          <BackIcon
            marginLeft={false}
            noPaddingAll
            onPress={() => goBack()}
            size={23}
          />
          <Info>
            <InfoChatName numberOfLines={1}>{title}</InfoChatName>
          </Info>
          <Right />
        </Header>
        <View style={{ flex: 1 }}>
          <Video
            endWithThumbnail
            source={{ uri }}
            ref={r => (this.player = r)}
            style={{
              backgroundColor: Colors.black,
              flex: 1,
            }}
            paused={false}
            fullscreen
            fullscreenAutorotate
            controls
          />
        </View>
      </SafeAreaView>
    )
  }
}
