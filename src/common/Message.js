import React, { Component } from 'react'
import {
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
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
import helper from '../utils/helpers'
import { SingleImage } from 'react-native-zoom-lightbox'
import LinearGradient from 'react-native-linear-gradient'
import Forwarded from './Forwarded'
import DefaultAvatar from './DefaultAvatar'
import moment from 'moment'

const { Colors, fontSize, borderRadius } = helper
const {
  myMessage,
  interlocatorMessage,
  pink,
  forwardedMessage,
  replyedMessage,
  myReplyedMessage,
} = Colors

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
  text-align: right;
  margin: 5px 10px;
  background: ${({ background }) => background || myMessage};
  border-radius: ${borderRadius};
  border-bottom-right-radius: 0;
  max-width: 80%;
  min-width: 20%;
  margin-left: 20%;
  position: relative;
  flex-grow: 1;
  z-index: 1;
  overflow: hidden;
`

// Vahe to do

const MyMessages = styled(View)`
  background: ${({ background }) => background || myMessage};
  border-radius: ${borderRadius};
  border-bottom-right-radius: 0;
  padding: ${({ noPadding }) => (noPadding ? 0 : 10)}px;
  padding-top: ${({ noPadding }) => (noPadding ? 0 : 5)}px;
  padding-bottom: ${({ noPadding }) => (noPadding ? 0 : 5)}px;
  z-index: 1;
`

const RecivedMessage = styled(View)`
  background: ${({ background }) => background || interlocatorMessage};
  min-width: 35%;
  border-radius: ${borderRadius};
  border-bottom-right-radius: ${borderRadius};
  border-bottom-left-radius: 0;
  padding: ${({ noPadding }) => (noPadding ? 0 : 10)}px;
  padding-top: ${({ noPadding }) => (noPadding ? 0 : 5)}px;
  padding-bottom: ${({ noPadding }) => (noPadding ? 0 : 5)}px;
`
const MessageText = styled(Text)`
  font-size: ${fontSize.textSize};
  font-family: 'OpenSans';
  color: ${Colors.black};
  textshadowcolor: ${Colors.black};
`
const ReviverName = styled(Text)`
  font-family: 'OpenSans';
`

const MessageInfo = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  margin-right: ${({ paddings }) => (paddings ? 8 : 0)}px;
  padding-bottom: ${({ paddings }) => (paddings ? 5 : 0)}px;
`
// Vahe

const MessageDate = styled(Text)`
  color: ${({ color }) => color || Colors.jumbo};
  font-family: 'OpenSans';
  font-size: 12px;
  textShadowColor: ${Colors.white};
  textShadowOffset: {width: 0, height: 0};
  textShadowRadius: 0.01;
`

const MessageEdited = styled(MessageDate)``

const MyMessageImage = styled(SingleImage)`
  min-width: 100%;
  height: 250px;
`

const MyMessageCachedImage = styled(FastImage)`
  min-width: 100%;
  height: 250px;
`

const BottomLine = styled(LinearGradient)`
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
const ShadowTopContainer = styled(View)`
  width: 100%;
`
const WhiteTopText = styled(Text)`
  font-size: ${fontSize.md};
  color: ${Colors.white};
  padding: 5px 10px;
`
const BottomLineInfo = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`
const BottomLineTime = styled(Text)`
  color: white;
`
const VideoPinBorder = styled(View)`
  width: 70px;
  height: 70px;
  border-radius: 35px;
  border: 1px solid ${Colors.white};
  align-items: center;
  justify-content: center;
  align-self: center;
`

const VideoPinTriangle = styled(View)`
  width: 0;
  height: 0;
  margin-left: 5px;
  background: transparent;
  border-style: solid;
  border-top-width: 10px;
  border-top-color: transparent;
  border-bottom-width: 10px;
  border-bottom-color: transparent;
  border-left-width: 20px;
  border-left-color: ${Colors.white};
`

const FileInfoWrapper = styled(View)`
  display: flex;
  flex-direction: row;
  padding: 4px;
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
`
const FileInfo = styled(View)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding-left: 10px;
`
const FileSize = styled(Text)`
  color: ${({ color }) => color || 'black'};
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
      item,
      myId,
      background,
      isGroup = false,
      onLongPressMessage,
      onPressMessage,
      toSenderProfile,
      color,
    } = this.props
    const {
      viewers,
      text,
      sender,
      resend,
      reply,
      src,
      type,
      width,
      height,
      created_at,
      filename,
      size,
      data,
      isUploaded,
      isUploading,
      enableUploadProgress,
      uploadProgress,
      edited,
    } = item
    const finalTime = moment(created_at).format('HH:mm')
    const fileSize =
      size / 1024 > 1024
        ? `${(size / (1024 * 2)).toFixed(1)}МБ`
        : `${(size / 1024).toFixed(1)}КБ`
    const messageRead = !!viewers.filter(e => e !== myId).length
    if (type === 'file' && isUploading) {
      return (
        <View style={{ display: 'flex', flexDirection: 'row' }}>
          <MyMessage background={background} style={{ padding: 0 }}>
            <UploadProgressContainer
              style={{
                height: 100,
                backgroundColor: Colors.black,
                position: 'relative',
              }}
            >
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
    if (type === 'image' && !isUploaded) {
      this.readFile(
        src.split('file://')[1] ? src : `https://seruniverse.asmo.media${src}`,
        filename,
      )
      return myId === sender._id ? (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onPressMessage}
          onLongPress={onLongPressMessage}
        >
          <View
            style={{
              flexDirection: 'row',
              marginTop: 2,
              marginBottom: 2,
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
            }}
          >
            <View
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignSelf: 'flex-start',
                minWidth: '20%',
                maxWidth: '80%',
                zIndex: 5,
              }}
            >
              <MyMessages noPadding background={background}>
                {!!(resend && resend.sender) && (
                  <ShadowTopContainer>
                    <WhiteTopText style={{ color: forwardedMessage }}>
                      {`Переслано от ${resend.sender.first_name} ${resend.sender.last_name}`}
                    </WhiteTopText>
                  </ShadowTopContainer>
                )}
                <MyMessageCachedImage
                  style={{ width, flex: 1 }}
                  source={{
                    uri: `https://seruniverse.asmo.media${src}`,
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
                  <MessageInfo paddings>
                    <MessageDate color={Colors.white}>{finalTime}</MessageDate>
                    <Indicator color="black" read={messageRead} />
                  </MessageInfo>
                </LinearGradient>
              </MyMessages>
            </View>
            <View style={{ position: 'relative', right: -13 }}>
              <TriangleLeftIcon color={background || myMessage} />
            </View>
          </View>
        </TouchableOpacity>
      ) : (
        <View
          style={{
            flexDirection: 'row',
            marginTop: 2,
            marginBottom: 2,
            alignItems: 'flex-end',
          }}
        >
          <TouchableOpacity activeOpacity={0.8} onPress={toSenderProfile}>
            <View style={{ flexDirection: 'row' }}>
              {sender.image ? (
                <ImageComponent
                  size={30}
                  source={{
                    uri: `https://seruniverse.asmo.media${sender.image}`,
                  }}
                />
              ) : (
                <DefaultAvatar size={30} id={sender._id} />
              )}
              <TriangleRightIcon color={background || interlocatorMessage} />
            </View>
          </TouchableOpacity>

          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignSelf: 'flex-start',
              minWidth: '20%',
              maxWidth: '80%',
            }}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onPressMessage}
              onLongPress={onLongPressMessage}
            >
              <RecivedMessage
                noPadding
                background={background || interlocatorMessage}
              >
                {!!(resend && resend.sender) ? (
                  <ShadowTopContainer>
                    <WhiteTopText style={{ color: forwardedMessage }}>
                      {`Переслано от ${resend.sender.first_name} ${resend.sender.last_name}`}
                    </WhiteTopText>
                  </ShadowTopContainer>
                ) : (
                  isGroup && (
                    <ShadowTopContainer>
                      <WhiteTopText style={{ color: color }}>
                        {!!sender && `${sender.first_name} ${sender.last_name}`}
                      </WhiteTopText>
                    </ShadowTopContainer>
                  )
                )}
                <View style={{ flex: 1 }}>
                  <MyMessageCachedImage
                    style={{ width }}
                    source={{
                      uri: `https://seruniverse.asmo.media${src}`,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                </View>
                <LinearGradient
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1.0, y: 1.0 }}
                  colors={['transparent', 'rgba(0, 0, 0, 0.1)']}
                  style={{ position: 'absolute', right: 0, bottom: 0 }}
                >
                  <MessageInfo paddings>
                    <MessageDate color={Colors.white}>{finalTime}</MessageDate>
                  </MessageInfo>
                </LinearGradient>
              </RecivedMessage>
            </TouchableOpacity>
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
            <MessageInfo
              style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}
            >
              <MessageDate color={Colors.norway}>Загрузка...</MessageDate>
            </MessageInfo>
          </MyMessage>
          <TriangleLeftIcon color={myMessage} />
        </View>
      )
    }
    if (type === 'text' || !type) {
      return myId === sender._id ? (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onPressMessage}
          onLongPress={onLongPressMessage}
        >
          <View
            style={{
              flexDirection: 'row',
              marginTop: 2,
              marginBottom: 2,
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
            }}
          >
            <View
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignSelf: 'flex-start',
                minWidth: '20%',
                maxWidth: '80%',
                zIndex: 5,
              }}
            >
              <MyMessages background={background}>
                {!!(resend && resend.sender) && (
                  <Forwarded
                    color={forwardedMessage}
                    userName={`Переслано от ${resend.sender.first_name} ${resend.sender.last_name}`}
                    myMessage
                  />
                )}
                {!!(reply && reply.sender) && (
                  <Forwarded
                    color={myReplyedMessage}
                    type={reply.type}
                    fileName={reply.filename}
                    geoData={reply.data}
                    src={reply.src}
                    userName={`${reply.sender.first_name} ${reply.sender.last_name}`}
                    text={reply.text}
                    myMessage
                  />
                )}
                <MessageText>{text}</MessageText>
                <MessageInfo>
                  {edited ? <MessageEdited>edited </MessageEdited> : null}
                  <MessageDate color={Colors.norway}>{finalTime}</MessageDate>
                  <Indicator color="black" read={messageRead} />
                </MessageInfo>
              </MyMessages>
            </View>
            <View style={{ position: 'relative', right: -13 }}>
              <TriangleLeftIcon color={background || myMessage} />
            </View>
          </View>
        </TouchableOpacity>
      ) : (
        <View
          style={{
            flexDirection: 'row',
            marginTop: 2,
            marginBottom: 2,
            alignItems: 'flex-end',
          }}
        >
          <TouchableOpacity activeOpacity={0.8} onPress={toSenderProfile}>
            <View style={{ flexDirection: 'row' }}>
              {sender.image ? (
                <ImageComponent
                  size={30}
                  source={{
                    uri: `https://seruniverse.asmo.media${sender.image}`,
                  }}
                />
              ) : (
                <DefaultAvatar size={30} id={sender._id} />
              )}
              <TriangleRightIcon color={background || interlocatorMessage} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPressMessage}
            onLongPress={onLongPressMessage}
          >
            <View
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignSelf: 'flex-start',
                minWidth: '20%',
                maxWidth: '80%',
              }}
            >
              <RecivedMessage background={background || interlocatorMessage}>
                {!!(resend && resend.sender) && (
                  <Forwarded
                    color={forwardedMessage}
                    userName={`Переслано от ${resend.sender.first_name} ${resend.sender.last_name}`}
                  />
                )}
                {!!(reply && reply.sender) && (
                  <Forwarded
                    color={replyedMessage}
                    type={reply.type}
                    fileName={reply.filename}
                    geoData={reply.data}
                    src={reply.src}
                    userName={`${reply.sender.first_name} ${reply.sender.last_name}`}
                    text={reply.text}
                  />
                )}
                {sender.first_name && sender.last_name && isGroup && (
                  <ReviverName numberOfLines={1} style={{ color: color }}>
                    {!!sender && `${sender.first_name} ${sender.last_name}`}
                  </ReviverName>
                )}
                <MessageText>{text}</MessageText>
                <MessageInfo>
                  {edited ? <MessageEdited>edited </MessageEdited> : null}
                  <MessageDate>{finalTime}</MessageDate>
                </MessageInfo>
              </RecivedMessage>
            </View>
          </TouchableOpacity>
        </View>
      )
    }
    if (type === 'geo') {
      const { latitude = 0, longitude = 0 } = data ? data : {}
      return myId === sender._id ? (
        <View
          style={{
            flexDirection: 'row',
            marginTop: 2,
            marginBottom: 2,
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
          }}
        >
          <View style={{ maxWidth: '80%', width: '80%' }}>
            <MyMessages
              style={{ width: '100%', height: 230 }}
              noPadding
              background={background}
            >
              {!!(resend && resend.sender) && (
                <ShadowTopContainer>
                  <WhiteTopText style={{ color: forwardedMessage }}>
                    {`Переслано от ${resend.sender.first_name} ${resend.sender.last_name}`}
                  </WhiteTopText>
                </ShadowTopContainer>
              )}
              <View style={{ flex: 1 }}>
                <MapView
                  scrollEnabled={false}
                  rotateEnabled={false}
                  pitchEnabled={false}
                  zoomEnabled={false}
                  provider="google"
                  style={[StyleSheet.absoluteFillObject, { margin: 3 }]}
                  region={{
                    ...data,
                    latitudeDelta: 0.002,
                    longitudeDelta: 0.002,
                  }}
                  tracksViewChanges={false}
                  onPress={onPressMessage}
                  onLongPress={onLongPressMessage}
                >
                  <MapView.Marker
                    coordinate={{
                      latitude,
                      longitude,
                    }}
                    tracksViewChanges={false}
                  />
                </MapView>
              </View>

              <BottomLine
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1.0, y: 1.0 }}
                colors={['transparent', 'rgba(0, 0, 0, 0.1)']}
              >
                <BottomLineInfo>
                  <BottomLineTime style={{ color: Colors.black }}>
                    {finalTime}
                  </BottomLineTime>
                  <Indicator color="black" read={messageRead} />
                </BottomLineInfo>
              </BottomLine>
            </MyMessages>
          </View>
          <View style={{ position: 'relative', right: -13 }}>
            <TriangleLeftIcon color={background || myMessage} />
          </View>
        </View>
      ) : (
        <View
          style={{
            flexDirection: 'row',
            marginTop: 2,
            marginBottom: 2,
            alignItems: 'flex-end',
          }}
        >
          <TouchableOpacity activeOpacity={0.8} onPress={toSenderProfile}>
            <View style={{ flexDirection: 'row' }}>
              {sender.image ? (
                <ImageComponent
                  size={30}
                  source={{
                    uri: `https://seruniverse.asmo.media${sender.image}`,
                  }}
                />
              ) : (
                <DefaultAvatar size={30} id={sender._id} />
              )}
              <TriangleRightIcon color={background || interlocatorMessage} />
            </View>
          </TouchableOpacity>
          <View style={{ maxWidth: '80%', width: '80%' }}>
            <RecivedMessage
              style={{ width: '100%', height: 230 }}
              noPadding
              background={background || interlocatorMessage}
            >
              {!!(resend && resend.sender) ? (
                <ShadowTopContainer>
                  <WhiteTopText style={{ color: forwardedMessage }}>
                    {`Переслано от ${resend.sender.first_name} ${resend.sender.last_name}`}
                  </WhiteTopText>
                </ShadowTopContainer>
              ) : (
                isGroup && (
                  <ShadowTopContainer>
                    <WhiteTopText style={{ color: color }}>
                      {!!sender && `${sender.first_name} ${sender.last_name}`}
                    </WhiteTopText>
                  </ShadowTopContainer>
                )
              )}
              <View style={{ flex: 1 }}>
                <MapView
                  scrollEnabled={false}
                  rotateEnabled={false}
                  pitchEnabled={false}
                  zoomEnabled={false}
                  provider="google"
                  style={[StyleSheet.absoluteFillObject, { margin: 3 }]}
                  region={{
                    latitude,
                    longitude,
                    latitudeDelta: 0.002,
                    longitudeDelta: 0.002,
                  }}
                  onPress={onPressMessage}
                  onLongPress={onLongPressMessage}
                >
                  <MapView.Marker
                    coordinate={{
                      latitude,
                      longitude,
                    }}
                    tracksViewChanges={false}
                  />
                </MapView>
              </View>
              <BottomLine
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1.0, y: 1.0 }}
                colors={['transparent', 'rgba(0, 0, 0, 0.1)']}
              >
                <BottomLineTime style={{ color: Colors.black }}>
                  {finalTime}
                </BottomLineTime>
              </BottomLine>
            </RecivedMessage>
          </View>
        </View>
      )
    }
    if (type === 'video') {
      return myId === sender._id ? (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onPressMessage}
          onLongPress={onLongPressMessage}
        >
          <View
            style={{
              flexDirection: 'row',
              marginTop: 2,
              marginBottom: 2,
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
            }}
          >
            <View style={{ maxWidth: '80%', width: '80%' }}>
              <MyMessages
                style={{ width: '100%', height: 180, zIndex: 5 }}
                noPadding
                background={background}
              >
                {!!(resend && resend.sender) && (
                  <ShadowTopContainer>
                    <WhiteTopText style={{ color: forwardedMessage }}>
                      {`Переслано от ${resend.sender.first_name} ${resend.sender.last_name}`}
                    </WhiteTopText>
                  </ShadowTopContainer>
                )}
                <View
                  style={{
                    flex: 1,
                    backgroundColor: 'black',
                    justifyContent: 'center',
                  }}
                >
                  <VideoPinBorder>
                    <VideoPinTriangle />
                  </VideoPinBorder>
                </View>
                <BottomLine
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1.0, y: 1.0 }}
                  colors={['transparent', 'rgba(0, 0, 0, 0.1)']}
                >
                  <BottomLineInfo>
                    <BottomLineTime>{finalTime}</BottomLineTime>
                    <Indicator color="black" read={messageRead} />
                  </BottomLineInfo>
                </BottomLine>
              </MyMessages>
            </View>
            <View style={{ position: 'relative', right: -13 }}>
              <TriangleLeftIcon color={background || myMessage} />
            </View>
          </View>
        </TouchableOpacity>
      ) : (
        <View
          style={{
            flexDirection: 'row',
            marginTop: 2,
            marginBottom: 2,
            alignItems: 'flex-end',
          }}
        >
          <TouchableOpacity activeOpacity={0.8} onPress={toSenderProfile}>
            <View style={{ flexDirection: 'row' }}>
              {sender.image ? (
                <ImageComponent
                  size={30}
                  source={{
                    uri: `https://seruniverse.asmo.media${sender.image}`,
                  }}
                />
              ) : (
                <DefaultAvatar size={30} id={sender._id} />
              )}
              <TriangleRightIcon color={background || interlocatorMessage} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPressMessage}
            onLongPress={onLongPressMessage}
          >
            <View style={{ maxWidth: '80%', width: '80%' }}>
              <RecivedMessage
                style={{ height: 180 }}
                noPadding
                background={background || interlocatorMessage}
              >
                {!!(resend && resend.sender) ? (
                  <ShadowTopContainer>
                    <WhiteTopText style={{ color: forwardedMessage }}>
                      {`Переслано от ${resend.sender.first_name} ${resend.sender.last_name}`}
                    </WhiteTopText>
                  </ShadowTopContainer>
                ) : (
                  isGroup && (
                    <ShadowTopContainer>
                      <WhiteTopText style={{ color: color }}>
                        {!!sender && `${sender.first_name} ${sender.last_name}`}
                      </WhiteTopText>
                    </ShadowTopContainer>
                  )
                )}
                <View
                  style={{
                    flex: 1,
                    backgroundColor: 'black',
                    justifyContent: 'center',
                  }}
                >
                  <VideoPinBorder>
                    <VideoPinTriangle />
                  </VideoPinBorder>
                </View>
                <BottomLine
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1.0, y: 1.0 }}
                  colors={['transparent', 'rgba(0, 0, 0, 0.1)']}
                >
                  <BottomLineTime>{finalTime}</BottomLineTime>
                </BottomLine>
              </RecivedMessage>
            </View>
          </TouchableOpacity>
        </View>
      )
    }
    if (type === 'file' && !isUploaded) {
      return myId === sender._id ? (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onPressMessage}
          onLongPress={onLongPressMessage}
        >
          <View
            style={{
              flexDirection: 'row',
              marginTop: 2,
              marginBottom: 2,
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
            }}
          >
            <View
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignSelf: 'flex-start',
                minWidth: '20%',
                maxWidth: '80%',
                zIndex: 5,
              }}
            >
              <MyMessages background={background}>
                {!!(resend && resend.sender) && (
                  <Forwarded
                    color={forwardedMessage}
                    userName={`Переслано от ${resend.sender.first_name} ${resend.sender.last_name}`}
                    myMessage
                  />
                )}

                <FileInfoWrapper>
                  <FileIcon>
                    <ImageIconBlue />
                  </FileIcon>
                  <FileInfo>
                    <MessageText noPadding style={{ maxWidth: '92%' }}>
                      {filename}
                    </MessageText>
                    <FileSize>{fileSize}</FileSize>
                  </FileInfo>
                </FileInfoWrapper>

                <MessageText>{text}</MessageText>
                <MessageInfo>
                  <MessageDate color={Colors.norway}>{finalTime}</MessageDate>
                  <Indicator color="black" read={messageRead} />
                </MessageInfo>
              </MyMessages>
            </View>
            <View style={{ position: 'relative', right: -13 }}>
              <TriangleLeftIcon color={background || myMessage} />
            </View>
          </View>
        </TouchableOpacity>
      ) : (
        <View
          style={{
            flexDirection: 'row',
            marginTop: 2,
            marginBottom: 2,
            alignItems: 'flex-end',
          }}
        >
          <TouchableOpacity activeOpacity={0.8} onPress={toSenderProfile}>
            <View style={{ flexDirection: 'row' }}>
              {sender.image ? (
                <ImageComponent
                  size={30}
                  source={{
                    uri: `https://seruniverse.asmo.media${sender.image}`,
                  }}
                />
              ) : (
                <DefaultAvatar size={30} id={sender._id} />
              )}
              <TriangleRightIcon color={background || interlocatorMessage} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPressMessage}
            onLongPress={onLongPressMessage}
          >
            <View
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignSelf: 'flex-start',
                minWidth: '20%',
                maxWidth: '80%',
              }}
            >
              <RecivedMessage background={background || interlocatorMessage}>
                {!!(resend && resend.sender) && (
                  <Forwarded
                    color={forwardedMessage}
                    userName={`Переслано от ${resend.sender.first_name} ${resend.sender.last_name}`}
                  />
                )}
                {!!(reply && reply.sender) && (
                  <Forwarded
                    color={replyedMessage}
                    type={reply.type}
                    fileName={reply.filename}
                    geoData={reply.data}
                    src={reply.src}
                    userName={`${reply.sender.first_name} ${reply.sender.last_name}`}
                    text={reply.text}
                  />
                )}
                {sender.first_name && sender.last_name && isGroup && (
                  <ReviverName numberOfLines={1} style={{ color: color }}>
                    {!!sender && `${sender.first_name} ${sender.last_name}`}
                  </ReviverName>
                )}
                <FileInfoWrapper>
                  <FileIcon background={pink}>
                    <ImageIcon />
                  </FileIcon>
                  <FileInfo>
                    <MessageText style={{ maxWidth: '92%' }}>
                      {filename}
                    </MessageText>
                    <FileSize color={pink}>{fileSize}</FileSize>
                  </FileInfo>
                </FileInfoWrapper>
                <MessageInfo>
                  <MessageDate>{finalTime}</MessageDate>
                </MessageInfo>
              </RecivedMessage>
            </View>
          </TouchableOpacity>
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
