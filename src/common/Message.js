import React, { Component } from 'react'
import { Text, View, ActivityIndicator, StyleSheet } from 'react-native'
import styled from 'styled-components'
import {
  TriangleLeftIcon,
  TriangleRightIcon,
  CheckIcon,
  CheckAllIcon,
  ImageIcon,
  ImageIconBlue,
} from '../assets/index'
import { connect } from 'react-redux'
import ImageComponent from './Image'
import MapView from 'react-native-maps'
import FastImage from 'react-native-fast-image'
// import { FileSystem } from 'expo';
// import RNFS from 'react-native-fs'
import helper, { getHamsterDate } from '../utils/helpers'
import { SingleImage } from 'react-native-zoom-lightbox'
import LinearGradient from 'react-native-linear-gradient'

const { Colors, fontSize, borderRadius } = helper
const { myMessage, interlocatorMessage, pink } = Colors

const UploadProgressContainer = styled(View)`
  width: 100%;
  height: 250px;
  position: absolute;
  top: 0;
  background: #0008;
  align-items: center;
  justify-content: center;
  border-radius: ${borderRadius};
`

const UploadProgressText = styled(Text)`
  color: ${Colors.white};
  font-family: 'OpenSans';
  font-size: 14px;
  padding: 8px;
`

const MyMessage = styled(View)`
  display: flex;
  justify-content: center;
  text-align: right;
  margin: 5px 10px;
  background: ${({ background }) => background || myMessage};
  border-radius: ${borderRadius};
  border-bottom-right-radius: 0;
  max-width: 80%;
  margin-left: 20%;
  position: relative;
  flex-grow: 1;
  z-index: 1;
  overflow: hidden;
`

const MyMessageText = styled(Text)`
  display: flex;
  justify-content: flex-end;
  text-align: left;
  padding: ${({ noPadding }) => (noPadding ? 0 : 10)}px;
  padding-bottom: 0;
  font-size: ${fontSize.textSize};
  font-family: 'OpenSans';
  color: ${Colors.black};
  textShadowColor: ${Colors.black};
  textShadowOffset: {width: 0, height: 0};
  textShadowRadius: 0.01;
`

const InterlocutorsMessage = styled(MyMessage)`
  justify-content: center;
  flex-direction: column;
  text-align: left;
  align-items: flex-start;
  background: ${({ background }) => background || interlocatorMessage};
  margin-left: 5px;
  position: relative;
  left: -10px;
  border-bottom-right-radius: ${borderRadius};
  border-bottom-left-radius: 0;
  max-width: 80%;
  overflow: hidden;
`

const InterlocutorsMessageText = styled(MyMessageText)`
  justify-content: flex-start;
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  text-align: left;
  color: ${({ isGroupName }) =>
    isGroupName ? helper.Colors.blue : Colors.black};
  border-radius: 3;
  overflow: hidden;
  padding-bottom: 0;
  flex-wrap: wrap;
  font-family: 'OpenSans';
`
const MessageInfo = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding: 0 10px 5px;
  width: 100%;
`
const MessageDate = styled(Text)`
  color: ${({ color }) => color || Colors.jumbo};
  font-family: 'OpenSans';
  font-size: 12px;
  textShadowColor: ${Colors.white};
  textShadowOffset: {width: 0, height: 0};
  textShadowRadius: 0.01;
`
const MyMessageImage = styled(SingleImage)`
  min-width: 100%;
  height: 250px;
`

const MyMessageCachedImage = styled(FastImage)`
  min-width: 100%;
  height: 250px;
`
const InterlocutorsName = styled(InterlocutorsMessageText)`
  margin-bottom: 0;
`
const MapViewStreet = styled(View)`
  background: rgba(0, 0, 0, 0.3);
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding: 5px 10px;
  font-size: ${fontSize.sm};
`
const MapViewStreetInfo = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`
const MapViewStreetTime = styled(Text)`
  color: white;
`
const FileInfoWrapper = styled(View)`
  display: flex;
  flex-direction: row;
  padding: 10px;
  padding-bottom: 0;
  align-items: center;
`
const FileIcon = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background: ${({ background }) => background || 'white'};
  width: 50px;
  height: 50px;
  border-radius: 25px;
  margin-right: 10px;
  overflow: hidden;
`
const FileInfo = styled(View)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`
const FileSize = styled(Text)`
  color: ${({ color }) => color || 'white'};
`
const Indicator = ({ read = false, color }) =>
  read ? (
    <CheckAllIcon color={color} noPaddingAll />
  ) : (
    <CheckIcon color={color} noPaddingAll />
  )

class Message extends Component {
  render() {
    const {
      children,
      myId,
      background,
      isGroup = false,
      withImage,
      navigate,
    } = this.props
    const {
      viewers,
      text,
      sender,
      src,
      type,
      width,
      height,
      created_at,
      filename,
      size,
      data,
      isUploaded,
      enableUploadProgress,
      uploadProgress,
    } = children
    const finalTime = getHamsterDate(created_at)
    const fileSize =
      size / 1024 > 1024
        ? `${(size / (1024 * 2)).toFixed(1)}МБ`
        : `${(size / 1024).toFixed(1)}КБ`
    const messageRead = !!viewers.filter(e => e !== myId).length
    if (type === 'image' && !isUploaded) {
      this.readFile(
        src.split('file://')[1] ? src : `https://ser.univ.team${src}`,
        filename,
      )
      return myId === sender._id ? (
        <View style={{ display: 'flex', flexDirection: 'row' }}>
          <MyMessage background={background} style={{ padding: 0 }}>
            <MyMessageCachedImage
              style={{ width }}
              source={{
                uri: `https://ser.univ.team${src}`,
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
            <LinearGradient
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1.0, y: 1.0 }}
              colors={['transparent', 'rgba(0, 0, 0, 0.1)']}
              style={{
                position: 'absolute',
                right: 0,
                bottom: 0,
                borderBottomRightRadius: 10,
              }}
            >
              <MessageInfo>
                <MessageDate color={Colors.white}>{finalTime}</MessageDate>
                <Indicator color="black" read={messageRead} />
              </MessageInfo>
            </LinearGradient>
          </MyMessage>
          <TriangleLeftIcon color={myMessage} />
        </View>
      ) : (
        <View style={{ display: 'flex', flexDirection: 'row' }}>
          {withImage ? (
            <ImageComponent
              style={{ alignSelf: 'flex-end', position: 'relative', top: -5 }}
              size={30}
              source={{
                uri: `https://ser.univ.team${sender.image}`,
              }}
            />
          ) : null}
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              position: 'relative',
              left: withImage ? -5 : 0,
            }}
          >
            <TriangleRightIcon color={interlocatorMessage} />
            <InterlocutorsMessage background={background}>
              <MyMessageCachedImage
                style={{ width }}
                source={{
                  uri: `https://ser.univ.team${src}`,
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
              <LinearGradient
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1.0, y: 1.0 }}
                colors={['transparent', 'rgba(0, 0, 0, 0.1)']}
                style={{ position: 'absolute', right: 0, bottom: 0 }}
              >
                <MessageInfo>
                  <MessageDate color={Colors.white}>{finalTime}</MessageDate>
                </MessageInfo>
              </LinearGradient>
            </InterlocutorsMessage>
          </View>
        </View>
      )
    }
    if (type === 'image' && isUploaded) {
      return (
        <View style={{ display: 'flex', flexDirection: 'row' }}>
          <MyMessage background={background} style={{ padding: 0 }}>
            <MyMessageImage
              uri={src}
              width={width}
              height={height}
              resizeMode="contain"
            />
            <UploadProgressContainer>
              <ActivityIndicator animating color={Colors.white} size="large" />
              {!!enableUploadProgress && (
                <UploadProgressText>{uploadProgress}%</UploadProgressText>
              )}
            </UploadProgressContainer>
            <MessageInfo>
              <MessageDate color={Colors.norway}>Загрузка...</MessageDate>
            </MessageInfo>
          </MyMessage>
          <TriangleLeftIcon color={myMessage} />
        </View>
      )
    }
    if (type === 'text' || !type) {
      return myId === sender._id ? (
        <View style={{ display: 'flex', flexDirection: 'row' }}>
          <MyMessage background={background}>
            <MyMessageText>{text}</MyMessageText>
            <MessageInfo>
              <MessageDate color={Colors.norway}>{finalTime}</MessageDate>
              <Indicator color="black" read={messageRead} />
            </MessageInfo>
          </MyMessage>
          <TriangleLeftIcon color={background || myMessage} />
        </View>
      ) : (
        <View style={{ display: 'flex', flexDirection: 'row' }}>
          {withImage && (
            <ImageComponent
              style={{ alignSelf: 'flex-end', position: 'relative', top: -5 }}
              size={30}
              source={{
                uri: `https://ser.univ.team${sender.image}`,
              }}
            />
          )}
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              position: 'relative',
              left: withImage ? -5 : 0,
            }}
          >
            <TriangleRightIcon color={background || interlocatorMessage} />
            <InterlocutorsMessage
              background={background || interlocatorMessage}
            >
              {withImage && (
                <InterlocutorsName isGroupName={isGroup}>
                  {`${sender.first_name} ${sender.last_name}`}
                </InterlocutorsName>
              )}
              <InterlocutorsMessageText>{text}</InterlocutorsMessageText>
              <MessageInfo>
                <MessageDate>{finalTime}</MessageDate>
              </MessageInfo>
            </InterlocutorsMessage>
          </View>
        </View>
      )
    }
    if (type === 'geo') {
      const { latitude = 0, longitude = 0 } = data ? data : {}
      return myId === sender._id ? (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            marginRight: 10,
          }}
        >
          <MyMessage style={{ height: 150, width: '100%' }}>
            <MapView
              scrollEnabled={false}
              rotateEnabled={false}
              pitchEnabled={false}
              zoomEnabled={false}
              provider="google"
              style={StyleSheet.absoluteFillObject}
              region={{
                ...data,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
              }}
              tracksViewChanges={false}
              onPress={() => {
                navigate &&
                  navigate({
                    routeName: 'MapView',
                    params: {
                      title: 'Геолокация',
                      latitude,
                      longitude,
                    },
                  })
              }}
            >
              <MapView.Marker
                coordinate={{
                  latitude,
                  longitude,
                }}
                tracksViewChanges={false}
              />
            </MapView>
            <MapViewStreet>
              <MapViewStreetInfo>
                <MapViewStreetTime>{finalTime}</MapViewStreetTime>
                <Indicator color="black" read={messageRead} />
              </MapViewStreetInfo>
            </MapViewStreet>
          </MyMessage>
          <TriangleLeftIcon color={myMessage} />
        </View>
      ) : (
        <View
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            flexDirection: 'row',
          }}
        >
          {withImage ? (
            <ImageComponent
              style={{ alignSelf: 'flex-end', position: 'relative', top: -5 }}
              size={30}
              source={{
                uri: `https://ser.univ.team${sender.image}`,
              }}
            />
          ) : null}
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              position: 'relative',
              left: withImage ? -5 : 0,
            }}
          >
            <TriangleRightIcon color={interlocatorMessage} />
            <InterlocutorsMessage
              style={{ height: 150, width: '100%' }}
              background={background || interlocatorMessage}
            >
              <MapView
                scrollEnabled={false}
                rotateEnabled={false}
                pitchEnabled={false}
                zoomEnabled={false}
                provider="google"
                style={StyleSheet.absoluteFillObject}
                region={{
                  latitude,
                  longitude,
                  latitudeDelta: 0.02,
                  longitudeDelta: 0.02,
                }}
                onPress={() => {
                  navigate &&
                    navigate({
                      routeName: 'MapView',
                      params: {
                        title: 'Геолокация',
                        latitude,
                        longitude,
                      },
                    })
                }}
              >
                <MapView.Marker
                  coordinate={{
                    latitude,
                    longitude,
                  }}
                  tracksViewChanges={false}
                />
              </MapView>
              <MapViewStreet style={{ justifyContent: 'flex-start' }}>
                <MapViewStreetTime>{finalTime}</MapViewStreetTime>
              </MapViewStreet>
            </InterlocutorsMessage>
          </View>
        </View>
      )
    }
    if (type === 'file') {
      return myId === sender._id ? (
        <View style={{ display: 'flex', flexDirection: 'row' }}>
          <MyMessage background={background}>
            <FileInfoWrapper>
              <FileIcon>
                <ImageIconBlue />
              </FileIcon>
              <FileInfo>
                <MyMessageText noPadding>{filename}</MyMessageText>
                <FileSize>{fileSize}</FileSize>
              </FileInfo>
            </FileInfoWrapper>
            <MessageInfo>
              <MessageDate color={Colors.norway}>{finalTime}</MessageDate>
              <Indicator color="black" read={messageRead} />
            </MessageInfo>
          </MyMessage>
          <TriangleLeftIcon color={background || myMessage} />
        </View>
      ) : (
        <View style={{ display: 'flex', flexDirection: 'row' }}>
          {withImage && (
            <ImageComponent
              style={{ alignSelf: 'flex-end', position: 'relative', top: -5 }}
              size={30}
              source={{
                uri: `https://ser.univ.team${sender.image}`,
              }}
            />
          )}
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              position: 'relative',
              left: withImage ? -10 : 0,
            }}
          >
            <TriangleRightIcon color={background || interlocatorMessage} />
            <InterlocutorsMessage
              background={background || interlocatorMessage}
            >
              {withImage && (
                <InterlocutorsName isGroupName={isGroup}>
                  {`${sender.first_name} ${sender.last_name}`}
                </InterlocutorsName>
              )}
              <FileInfoWrapper>
                <FileIcon background={pink}>
                  <ImageIcon />
                </FileIcon>
                <FileInfo>
                  <InterlocutorsMessageText noPadding>
                    {filename}
                  </InterlocutorsMessageText>
                  <FileSize color={pink}>{fileSize}</FileSize>
                </FileInfo>
              </FileInfoWrapper>
              <MessageInfo>
                <MessageDate>{finalTime}</MessageDate>
              </MessageInfo>
            </InterlocutorsMessage>
          </View>
        </View>
      )
    }
    return null
  }

  state = {}

  componentDidMount() {}

  readFile = async (path, filename) => {
    // const uri = `${FileSystem.cacheDirectory}${filename}`;
    // FileSystem.getInfoAsync(uri)
    //     .then((image) => {
    //         if (image.exists) {
    //             this.image = uri;
    //             return;
    //         }
    //         this.image = path;
    //     }).catch(async () => {
    //         await FileSystem.downloadAsync(path, uri);
    //     });
  }
}

const mapStateToProps = state => ({
  messages: state.messageReducer.messages,
  myId: state.userReducer.user._id,
  currentDialog: state.dialogsReducer.currentDialog,
})
export default connect(mapStateToProps)(Message)
