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
import helper, { getHamsterDate } from '../utils/helpers'
import { SingleImage } from 'react-native-zoom-lightbox'
import LinearGradient from 'react-native-linear-gradient'
import Forwarded from './Forwarded'
import DefaultAvatar from './DefaultAvatar'

const { Colors, fontSize, borderRadius } = helper
const {
  myMessage,
  interlocatorMessage,
  pink,
  forwardedMessage,
  replyedMessage,
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
  display: flex;
  text-align: left;
  background: ${({ background }) => background || interlocatorMessage};
  margin: 5px 10px;
  margin-left: 40px;
  position: relative;
  left: -55px;
  border-bottom-right-radius: ${borderRadius};
  border-bottom-left-radius: 0;
  max-width: 80%;
  overflow: hidden;
  flex-grow: 1;
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
  padding-bottom: 0;
  flex-wrap: wrap;
  font-family: 'OpenSans';
  overflow: hidden;
`
const MessageInfo = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding: 0 10px 5px;
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
    } = item
    const finalTime = getHamsterDate(created_at)
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
        src.split('file://')[1] ? src : `https://testser.univ.team${src}`,
        filename,
      )
      return myId === sender._id ? (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onPressMessage}
          onLongPress={onLongPressMessage}
        >
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <MyMessage
              background={background}
              style={{ padding: 0, height: 230 }}
            >
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
                  uri: `https://testser.univ.team${src}`,
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
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onPressMessage}
          onLongPress={onLongPressMessage}
        >
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            {sender.image ? (
              <ImageComponent
                style={{ alignSelf: 'flex-end', position: 'relative', top: -5 }}
                size={30}
                source={{
                  uri: `https://testser.univ.team${sender.image}`,
                }}
              />
            ) : (
              <DefaultAvatar
                size={30}
                style={{ alignSelf: 'flex-end', position: 'relative', top: -5 }}
                id={sender._id}
              />
            )}
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                position: 'relative',
                left: sender.image ? -5 : 0,
              }}
            >
              <TriangleRightIcon color={interlocatorMessage} />
              <InterlocutorsMessage
                background={background}
                style={{ height: 230 }}
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
                      uri: `https://testser.univ.team${src}`,
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
                  <MessageInfo>
                    <MessageDate color={Colors.white}>{finalTime}</MessageDate>
                  </MessageInfo>
                </LinearGradient>
              </InterlocutorsMessage>
            </View>
          </View>
        </TouchableOpacity>
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
          <View style={{ display: 'flex', flexDirection: 'row-reverse' }}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                position: 'relative',
                right: 10,
              }}
            >
              <MyMessage background={background}>
                {!!(resend && resend.sender) && (
                  <Forwarded
                    color={forwardedMessage}
                    userName={`Переслано от ${resend.sender.first_name} ${resend.sender.last_name}`}
                    myMessage
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
                    myMessage
                  />
                )}
                <MyMessageText>{text}</MyMessageText>
                <MessageInfo>
                  <MessageDate color={Colors.norway}>{finalTime}</MessageDate>
                  <Indicator color="black" read={messageRead} />
                </MessageInfo>
              </MyMessage>
              <TriangleLeftIcon color={background || myMessage} />
            </View>
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onPressMessage}
          onLongPress={onLongPressMessage}
        >
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            {sender.image ? (
              <ImageComponent
                style={{
                  alignSelf: 'flex-end',
                  position: 'relative',
                  top: -5,
                  marginRight: 4,
                }}
                size={30}
                source={{
                  uri: `https://testser.univ.team${sender.image}`,
                }}
              />
            ) : (
              <DefaultAvatar
                size={30}
                style={{ alignSelf: 'flex-end', position: 'relative', top: -5 }}
                id={sender._id}
              />
            )}
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                position: 'relative',
                left: sender.image ? -5 : 0,
              }}
            >
              <TriangleRightIcon color={background || interlocatorMessage} />
              <InterlocutorsMessage
                background={background || interlocatorMessage}
              >
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
                    myMessage
                  />
                )}
                {sender.first_name && sender.last_name && isGroup && (
                  <InterlocutorsName
                    isGroupName={isGroup}
                    style={{ color: color }}
                  >
                    {!!sender && `${sender.first_name} ${sender.last_name}`}
                  </InterlocutorsName>
                )}
                <InterlocutorsMessageText>{text}</InterlocutorsMessageText>
                <MessageInfo>
                  <MessageDate>{finalTime}</MessageDate>
                </MessageInfo>
              </InterlocutorsMessage>
            </View>
          </View>
        </TouchableOpacity>
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
          <MyMessage style={{ height: 230, width: '100%' }}>
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
                <BottomLineTime>{finalTime}</BottomLineTime>
                <Indicator color="black" read={messageRead} />
              </BottomLineInfo>
            </BottomLine>
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
          {sender.image ? (
            <ImageComponent
              style={{ alignSelf: 'flex-end', position: 'relative', top: -5 }}
              size={30}
              source={{
                uri: `https://testser.univ.team${sender.image}`,
              }}
            />
          ) : (
            <DefaultAvatar
              size={30}
              style={{ alignSelf: 'flex-end', position: 'relative', top: -5 }}
              id={sender._id}
            />
          )}
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              position: 'relative',
              left: sender.image ? -5 : 0,
            }}
          >
            <TriangleRightIcon color={interlocatorMessage} />
            <InterlocutorsMessage
              style={{ height: 230, width: '100%' }}
              background={background || interlocatorMessage}
            >
              {!!(resend && resend.sender) && (
                <ShadowTopContainer>
                  <WhiteTopText style={{ color: forwardedMessage }}>
                    {`Переслано от ${resend.sender.first_name} ${resend.sender.last_name}`}
                  </WhiteTopText>
                </ShadowTopContainer>
              )}
              {!!(sender.first_name && sender.last_name && isGroup) && (
                <ShadowTopContainer>
                  <WhiteTopText style={{ color: color }}>
                    {!!sender && `${sender.first_name} ${sender.last_name}`}
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
                style={{ justifyContent: 'flex-start' }}
              >
                <BottomLineTime>{finalTime}</BottomLineTime>
              </BottomLine>
            </InterlocutorsMessage>
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
              alignItems: 'flex-end',
              marginRight: 10,
            }}
          >
            <MyMessage
              style={{
                height: 180,
                width: '100%',
              }}
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
            </MyMessage>
            <TriangleLeftIcon color={myMessage} />
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onPressMessage}
          onLongPress={onLongPressMessage}
        >
          <View
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              flexDirection: 'row',
            }}
          >
            {sender.image ? (
              <ImageComponent
                style={{ alignSelf: 'flex-end', position: 'relative', top: -5 }}
                size={30}
                source={{
                  uri: `https://testser.univ.team${sender.image}`,
                }}
              />
            ) : (
              <DefaultAvatar
                size={30}
                style={{ alignSelf: 'flex-end', position: 'relative', top: -5 }}
                id={sender._id}
              />
            )}
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                position: 'relative',
                left: sender.image ? -5 : 0,
              }}
            >
              <TriangleRightIcon color={interlocatorMessage} />
              <InterlocutorsMessage
                style={{
                  height: 180,
                  width: '100%',
                }}
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
                  style={{ justifyContent: 'flex-start' }}
                >
                  <BottomLineTime>{finalTime}</BottomLineTime>
                </BottomLine>
              </InterlocutorsMessage>
            </View>
          </View>
        </TouchableOpacity>
      )
    }
    if (type === 'file' && !isUploaded) {
      return myId === sender._id ? (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onPressMessage}
          onLongPress={onLongPressMessage}
        >
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <MyMessage background={background}>
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
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onPressMessage}
          onLongPress={onLongPressMessage}
        >
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            {sender.image ? (
              <ImageComponent
                style={{ alignSelf: 'flex-end', position: 'relative', top: -5 }}
                size={30}
                source={{
                  uri: `https://testser.univ.team${sender.image}`,
                }}
              />
            ) : (
              <DefaultAvatar
                size={30}
                style={{ alignSelf: 'flex-end', position: 'relative', top: -5 }}
                id={sender._id}
              />
            )}
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                position: 'relative',
                left: sender.image ? -10 : 0,
              }}
            >
              <TriangleRightIcon color={background || interlocatorMessage} />
              <InterlocutorsMessage
                background={background || interlocatorMessage}
              >
                {!!(resend && resend.sender) && (
                  <InterlocutorsName
                    style={{ color: forwardedMessage }}
                    isGroupName={isGroup}
                  >
                    {!!sender && `${sender.first_name} ${sender.last_name}`}
                  </InterlocutorsName>
                )}
                {!!sender.first_name && !!sender.last_name && isGroup && (
                  <InterlocutorsName
                    isGroupName={isGroup}
                    style={{ color: color }}
                  >
                    {!!sender && `${sender.first_name} ${sender.last_name}`}
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
        </TouchableOpacity>
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
