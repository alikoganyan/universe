import React, { Component } from 'react'
import { ActivityIndicator, SafeAreaView, Text, View } from 'react-native'
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
const Loading = styled(ActivityIndicator)`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
`

export default class VideoViewScreen extends Component {
  state = {
    loading: true,
  }
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
        <View
          style={{
            flexGrow: 1,
            backgroundColor: Colors.black,
            justifyContent: 'flex-end',
          }}
        >
          <Video
            endWithThumbnail
            source={{ uri }}
            ref={r => (this.player = r)}
            style={{
              height: '100%',
            }}
            paused={false}
            fullscreen
            fullscreenAutorotate
            resizeMode="contain"
            controls
            onLoad={() => this.setState({ loading: false })}
          />
          <Loading animating={this.state.loading} size="small" />
        </View>
      </SafeAreaView>
    )
  }
}
