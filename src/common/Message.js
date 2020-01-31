import React, { Component } from 'react'
import {
  ActivityIndicator,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import styled from 'styled-components'
import {
  CheckAllIcon,
  CheckIcon,
  ImageIcon,
  ImageIconBlue,
  TriangleLeftIcon,
  TriangleRightIcon,
  PendingIcon,
  FailedIcon,
} from '../assets/index'
import { connect } from 'react-redux'
import ImageComponent from './Image'
import MapView from 'react-native-maps'
import FastImage from 'react-native-fast-image'
// import { FileSystem } from 'expo';
// import RNFS from 'react-native-fs'
import helper from '../utils/helpers'
import Hyperlink from 'react-native-hyperlink'
// import { SingleImage } from 'react-native-zoom-lightbox'
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

/*const UploadProgressText = styled(Text)`
  color: ${Colors.white};
  font-family: 'OpenSans';
  font-size: 14px;
  padding: 8px;
`*/

// const MyMessage = styled(View)`
//   display: flex;
//   text-align: right;
//   margin: 5px 10px;
//   background: ${({ background }) => background || myMessage};
//   border-radius: ${borderRadius};
//   border-bottom-right-radius: 0;
//   max-width: 80%;
//   min-width: 20%;
//   margin-left: 20%;
//   position: relative;
//   flex-grow: 1;
//   z-index: 1;
//   overflow: hidden;
// `

const DateWrapper = styled(View)`
  width: 100%;
  align-items: center;
  margin-bottom: 5px;
  margin-top: 5px;
`

const DateText = styled(Text)`
  padding: 5px 10px;
  color: #fff;
`

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

const MessageDate = styled(Text)`
  color: ${({ color }) => color || Colors.jumbo};
  font-family: 'OpenSans';
  font-size: 12px;
  textShadowColor: ${Colors.white};
  textShadowOffset: {width: 0, height: 0};
  textShadowRadius: 0.01;
`

const MessageEdited = styled(MessageDate)``

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

const Indicator = ({ read = false, color, pending = false, failed }) => {
  return read ? (
    <CheckAllIcon color={color} noPaddingAll />
  ) : failed ? (
    <FailedIcon />
  ) : pending ? (
    <PendingIcon />
  ) : (
    <CheckIcon color={color} noPaddingAll />
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 2,
    marginBottom: 2,
    alignItems: 'flex-end',
  },
  selected: {
    backgroundColor: '#1d1dce38',
  },
  unSelected: {
    backgroundColor: 'transparent',
  },
  messageContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'flex-start',
    minWidth: '20%',
    maxWidth: '80%',
    zIndex: 5,
  },
})

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
      selected,
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
      // height,
      created_at,
      filename,
      size,
      data,
      edited,
      isUploading,
    } = item
    const finalTime = moment(created_at).format('HH:mm')
    const fileSize =
      size / 1024 > 1024
        ? `${(size / (1024 * 1024)).toFixed(1)}МБ`
        : `${(size / 1024).toFixed(1)}КБ`

    const messageRead =
      type !== 'date' ? !!viewers.filter(e => e !== myId).length : null
    if (isUploading) {
      return (
        <View style={[styles.container, { justifyContent: 'flex-end' }]}>
          <View style={styles.messageContainer}>
            <MyMessages noPadding background={background}>
              {src ? (
                <MyMessageCachedImage
                  source={{ uri: src }}
                  resizeMode={FastImage.resizeMode.cover}
                />
              ) : (
                <View style={{ width: 1000, height: 250 }} />
              )}
              <UploadProgressContainer>
                <ActivityIndicator
                  animating
                  color={Colors.white}
                  size="large"
                />
                {/*{!!enableUploadProgress && (*/}
                {/*  <UploadProgressText>{uploadProgress}%</UploadProgressText>*/}
                {/*)}*/}
              </UploadProgressContainer>
              <MessageInfo
                style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}
              >
                <MessageDate color={Colors.norway}>Загрузка...</MessageDate>
              </MessageInfo>
            </MyMessages>
          </View>
          <View style={{ position: 'relative', right: -13 }}>
            <TriangleLeftIcon color={background || myMessage} />
          </View>
        </View>
      )
    }
    if (type === 'date') {
      return (
        <DateWrapper>
          <View style={{ backgroundColor: '#0003', borderRadius: 50 }}>
            <DateText>{item.date}</DateText>
          </View>
        </DateWrapper>
      )
    }
    if (type === 'image') {
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
            style={[
              styles.container,
              selected ? styles.selected : styles.unSelected,
              { justifyContent: 'flex-end' },
            ]}
          >
            <View style={styles.messageContainer}>
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
          style={[
            styles.container,
            selected ? styles.selected : styles.unSelected,
          ]}
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

          <View style={styles.messageContainer}>
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
    if (type === 'text') {
      return myId === sender._id ? (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onPressMessage}
          onLongPress={onLongPressMessage}
        >
          <View
            style={[
              styles.container,
              selected ? styles.selected : styles.unSelected,
              { justifyContent: 'flex-end' },
            ]}
          >
            <View style={styles.messageContainer}>
              <MyMessages background={background} faildMessage={item.failed}>
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
                    padding
                  />
                )}

                <Hyperlink
                  linkStyle={{
                    color: '#2980b9',
                    textDecorationLine: 'underline',
                  }}
                  onPress={(url, text) => {
                    Linking.openURL(url).catch(err =>
                      alert('An error occurred', err),
                    )
                  }}
                >
                  <MessageText>{text}</MessageText>
                </Hyperlink>
                <MessageInfo>
                  {edited ? <MessageEdited>Изменено </MessageEdited> : null}
                  <MessageDate color={Colors.norway}>{finalTime}</MessageDate>
                  <Indicator
                    color="black"
                    read={messageRead}
                    pending={item.myMessage && !item.failed}
                    failed={item.failed}
                  />
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
          style={[
            styles.container,
            selected ? styles.selected : styles.unSelected,
          ]}
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
            style={styles.messageContainer}
            activeOpacity={0.8}
            onPress={onPressMessage}
            onLongPress={onLongPressMessage}
          >
            <RecivedMessage background={background || interlocatorMessage}>
              {!!(sender.first_name && sender.last_name && isGroup) && (
                <ReviverName numberOfLines={1} style={{ color: color }}>
                  {!!sender && `${sender.first_name} ${sender.last_name}`}
                </ReviverName>
              )}
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
                  padding
                />
              )}
              <Hyperlink
                linkStyle={{
                  color: '#2980b9',
                  textDecorationLine: 'underline',
                }}
                onPress={(url, text) => {
                  Linking.openURL(url).catch(err =>
                    alert('An error occurred', err),
                  )
                }}
              >
                <MessageText>{text}</MessageText>
              </Hyperlink>
              <MessageInfo>
                {edited ? <MessageEdited>Изменено </MessageEdited> : null}
                <MessageDate>{finalTime}</MessageDate>
              </MessageInfo>
            </RecivedMessage>
          </TouchableOpacity>
        </View>
      )
    }
    if (type === 'geo') {
      const { latitude = 0, longitude = 0 } = data ? data : {}
      return myId === sender._id ? (
        <View
          style={[
            styles.container,
            selected ? styles.selected : styles.unSelected,
            { justifyContent: 'flex-end' },
          ]}
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
          style={[
            styles.container,
            selected ? styles.selected : styles.unSelected,
          ]}
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
            style={[
              styles.container,
              selected ? styles.selected : styles.unSelected,
              { justifyContent: 'flex-end' },
            ]}
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
                  {!!(item && item.thumbnail) && (
                    <FastImage
                      style={{
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        position: 'absolute',
                      }}
                      source={{
                        uri: `https://seruniverse.asmo.media${item.thumbnail}`,
                      }}
                      resizeMode={FastImage.resizeMode.contain}
                    />
                  )}
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
          style={[
            styles.container,
            selected ? styles.selected : styles.unSelected,
          ]}
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
            style={{ maxWidth: '80%', width: '80%' }}
          >
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
                {!!(item && item.thumbnail) && (
                  <FastImage
                    style={{
                      top: 0,
                      bottom: 0,
                      left: 0,
                      right: 0,
                      position: 'absolute',
                    }}
                    source={{
                      uri: `https://seruniverse.asmo.media${item.thumbnail}`,
                    }}
                    resizeMode={FastImage.resizeMode.contain}
                  />
                )}
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
          </TouchableOpacity>
        </View>
      )
    }
    if (type === 'file') {
      return myId === sender._id ? (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onPressMessage}
          onLongPress={onLongPressMessage}
        >
          <View
            style={[
              styles.container,
              selected ? styles.selected : styles.unSelected,
              { justifyContent: 'flex-end' },
            ]}
          >
            <View style={styles.messageContainer}>
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
                    <MessageText noPadding style={{}}>
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
          style={[
            styles.container,
            selected ? styles.selected : styles.unSelected,
          ]}
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
            style={styles.messageContainer}
            activeOpacity={0.8}
            onPress={onPressMessage}
            onLongPress={onLongPressMessage}
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
                  <MessageText style={{}}>{filename}</MessageText>
                  <FileSize color={pink}>{fileSize}</FileSize>
                </FileInfo>
              </FileInfoWrapper>
              <MessageInfo>
                <MessageDate>{finalTime}</MessageDate>
              </MessageInfo>
            </RecivedMessage>
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
