import React, { Component } from 'react'
import { SafeAreaView, Text, View, StyleSheet } from 'react-native'
import MapView from 'react-native-maps'
import styled from 'styled-components'
import helper from '../../utils/helpers'
import { BackIcon } from '../../assets'

const { sidePadding, HeaderHeight, fontSize } = helper
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

export default class WebViewScreen extends Component {
  render() {
    const {
      navigation: {
        goBack,
        state: { params: { title, latitude = 0, longitude = 0 } = {} } = {},
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
          <MapView
            scrollEnabled
            rotateEnabled
            pitchEnabled
            zoomEnabled
            showsScale
            showsCompass
            zoomControlEnabled
            showsUserLocation
            showsMyLocationButton
            style={StyleSheet.absoluteFillObject}
            provider="google"
            region={{
              latitude,
              longitude,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}
          >
            <MapView.Marker
              coordinate={{ latitude, longitude }}
              tracksViewChanges={false}
            />
          </MapView>
        </View>
      </SafeAreaView>
    )
  }
}
