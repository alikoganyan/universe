import React, { PureComponent } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import FastImage from 'react-native-fast-image'
import styled from 'styled-components'
import MapView from 'react-native-maps'

class Forwarded extends PureComponent {
  render() {
    const {
      userName,
      text,
      myMessage,
      src,
      geoData,
      fileName,
      type,
      color,
      padding,
    } = this.props
    return (
      <View
        style={[
          styles.root,
          {
            backgroundColor: myMessage ? '#cfe9ba' : '#ececec',
            borderLeftColor: color,
          },
        ]}
      >
        <Text
          style={[
            styles.userName,
            {
              color: color ? color : '#034402',
              paddingBottom: padding ? 5 : 0,
            },
          ]}
        >
          {userName}
        </Text>

        {src && (type === 'video' || type === 'image') ? (
          <MyMessageCachedImage
            source={{
              uri: `https://seruniverse.asmo.media${src}`,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
        ) : null}

        {geoData && Object.keys(geoData).length ? (
          <ReplyGeo>
            <MapView
              scrollEnabled={false}
              rotateEnabled={false}
              pitchEnabled={false}
              zoomEnabled={false}
              provider="google"
              style={[StyleSheet.absoluteFillObject, { margin: 3 }]}
              region={{
                ...geoData,
                latitudeDelta: 0.002,
                longitudeDelta: 0.002,
              }}
              tracksViewChanges={false}
            >
              <MapView.Marker
                coordinate={{
                  latitude: geoData.latitude,
                  longitude: geoData.longitude,
                }}
                tracksViewChanges={false}
              />
            </MapView>
          </ReplyGeo>
        ) : null}

        {text ? (
          <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">
            {text}
          </Text>
        ) : null}

        {type === 'file' && fileName ? (
          <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">
            {fileName}
          </Text>
        ) : null}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  root: {
    padding: 5,
    marginBottom: 4,
    borderRadius: 5,
    borderLeftWidth: 4,
  },
  userName: {
    color: '#034402',
    fontSize: 13,
  },
  text: {
    fontSize: 11,
  },
})

const MyMessageCachedImage = styled(FastImage)`
  width: 50;
  height: 50;
`

const ReplyGeo = styled(View)`
  width: 50;
  height: 50;
`

export default Forwarded
