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
    } = this.props

    return (
      <View
        style={[
          styles.root,
          { backgroundColor: myMessage ? '#cfe9ba' : '#ececec' },
        ]}
      >
        <Text style={styles.userName}>{userName}</Text>

        {src && (type === 'video' || type === 'image') ? (
          <MyMessageCachedImage
            source={{
              uri: `https://testser.univ.team${src}`,
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
    padding: 8,
    margin: 8,
    borderRadius: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#034402',
  },
  userName: {
    color: '#034402',
    fontSize: 16,
    fontWeight: '700',
  },
  text: {
    fontSize: 14,
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
