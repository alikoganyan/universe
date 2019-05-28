import React, { Component } from 'react'
import { Text, View, Image, ImageBackground } from 'react-native'
import styled from 'styled-components'
import { TriangleLeftIcon, TriangleRightIcon, CheckIcon, CheckAllIcon, CommentIcon, HeartIcon, ImageIcon, ImageIconBlue } from '../assets/index'
import { connect } from 'react-redux'
import { ImageComponent } from './'
import MapView from 'react-native-maps';

const { HeaderHeight, Colors, fontSize } = helper;
const { myMessage, interlocatorMessage, pink } = Colors
const MyMessage = styled(View)`
    display: flex;
    justify-content: center;
    text-align: right;
    margin: 5px 10px;
    align-self: stretch;
    background: ${({ background }) => background || myMessage};
    border-radius: 3;
    max-width: 80%;
    margin-left: 20%;
    position: relative;
    z-index: 1;
`

const MyMessageText = styled(Text)`
    display: flex;
    justify-content: flex-end;
    text-align: left;
    padding: ${({ noPadding }) => noPadding ? 0 : 10}px;
    padding-bottom: 0;
    color: white;
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
    
`

const InterlocutorsMessageText = styled(MyMessageText)`
    justify-content: flex-start;
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    text-align: left;
    color: #54585D;    
    border-radius: 3;
    overflow: hidden;
    padding-bottom: 0;
    flex-wrap: wrap;
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
    color: ${({ color }) => color || '#ABABAB'};
`

const MyMessageImage = styled(ImageBackground)`
    min-height: 300px; 
    min-width: 100%;
    /* resize-mode: contain; */
    /* top: 5px; */
    /* flex: 1; */
`
const InterlocutorsName = styled(InterlocutorsMessageText)`
    margin-bottom: 0;
`
const MapViewStreet = styled(View)`
    height: 30;
    width: 99%;
    align-self: center;
    background: rgba(0,0,0,0.3);
    position: absolute;
    top: 120;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 5px 10px;
    font-size: ${fontSize.sm};
`
const MapViewStreetText = styled(Text)`
    color: white;
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
const Indicator = ({ read = false, color }) => {
    return read ? <CheckAllIcon color={color} /> : <CheckIcon color={color} />
}
function Message(props) {
    const { children, messages, myId, background, withImage } = props
    const { viewers, text, sender, src, type, width, height, latitude, latitudeDelta, longitude, longitudeDelta, created_at, filename, size } = children;
    const date = new Date(created_at);
    const daysOfTheWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const day = daysOfTheWeek[date.getDay()]
    const time = `${date.getHours() >= 10 ? date.getHours() : '0' + date.getHours()}:${date.getMinutes() >= 10 ? date.getMinutes() : '0' + date.getMinutes()}`
    const finalTime = Math.abs(date - new Date()) / (1000 * 60 * 60 * 24) > 1 ? day : time
    const fileSize = size / 1024 > 1024 ? `${(size / (1024 * 2)).toFixed(1)}МБ` : `${(size / 1024).toFixed(1)}КБ`
    if (type === 'image') {
        return (myId == sender._id ? (
            <View style={{ display: 'flex', flexDirection: 'row' }}>
                <MyMessage background={background} style={{ padding: 0 }}>
                    <MyMessageImage source={{ uri: `http://ser.univ.team${src}` }} width={width} height={height} resizeMode={'stretch'} />
                    <MessageInfo>
                        <MessageDate color={'white'}>{finalTime}</MessageDate>
                        <Indicator color={'white'} read={!!viewers.length} />
                    </MessageInfo>
                </MyMessage >
                <TriangleLeftIcon color={myMessage} />
            </ View >
        ) : <View style={{ display: 'flex', flexDirection: 'row' }}>
                <TriangleRightIcon color={interlocatorMessage} />
                <InterlocutorsMessage background={background}>
                    <MyMessageImage source={{ uri: `http://ser.univ.team${src}` }} width={width} height={height} resizeMode={'stretch'} />
                    <MessageInfo>
                        <MessageDate>{finalTime}</MessageDate>
                    </MessageInfo>
                </InterlocutorsMessage>
            </View>
        )
    }
    if (type === 'text' || !type) {
        return (myId == sender._id ? (
            <View style={{ display: 'flex', flexDirection: 'row' }}>
                <MyMessage background={background}>
                    <MyMessageText>
                        {text}
                    </MyMessageText>
                    <MessageInfo>
                        <MessageDate color={'white'}>{finalTime}</MessageDate>
                        <Indicator color={'white'} read={!!viewers.length} />
                    </MessageInfo>
                </MyMessage>
                <TriangleLeftIcon color={background || myMessage} />
            </View>
        ) : <View style={{ display: 'flex', flexDirection: 'row' }}>
                {withImage && <ImageComponent style={{ alignSelf: 'flex-end', position: 'relative', top: -5 }} size={30} source={{ uri: `http://ser.univ.team${sender.image}` }} />}
                <View style={{ display: 'flex', flexDirection: 'row', position: 'relative', left: withImage ? -5 : 0 }}>
                    <TriangleRightIcon color={background || interlocatorMessage} />
                    <InterlocutorsMessage background={background || interlocatorMessage}>
                        {withImage && <InterlocutorsName>
                            {sender.first_name} {sender.last_name}
                        </InterlocutorsName>}
                        <InterlocutorsMessageText>
                            {text}
                        </InterlocutorsMessageText>
                        <MessageInfo>
                            <MessageDate>{finalTime}</MessageDate>
                        </MessageInfo>
                    </InterlocutorsMessage>
                </View>
            </ View>
        )
    }
    if (type === 'geo') {
        return (myId === sender._id ? (<View style={{
            display: 'flex',
            alignItems: 'flex-end'
        }}>
            <MyMessage style={{ height: 150 }}>
                <MapView
                    style={{ width: '99%', height: '98%', alignSelf: 'center' }}
                    region={{
                        latitude,
                        longitude,
                        latitudeDelta,
                        longitudeDelta,
                    }}
                    tracksViewChanges={false} >
                    <MapView.Marker
                        coordinate={{
                            latitude,
                            longitude,
                            latitudeDelta,
                            longitudeDelta,
                        }}
                        tracksViewChanges={false}
                    />
                </MapView>
                <MapViewStreet>
                    <MapViewStreetText>ул. Маши Порываевой, 34</MapViewStreetText>
                    <MapViewStreetInfo>
                        <MapViewStreetTime>4:10</MapViewStreetTime>
                        <Indicator read={!!viewers.length} />
                    </MapViewStreetInfo>
                </MapViewStreet>
            </MyMessage>
        </View>) : (<View style={{
            display: 'flex',
            alignItems: 'flex-end',
            flexDirection: 'column'
        }}>
            <InterlocutorsMessage style={{ height: 150, marginLeft: 20 }} background={pink}>
                <MapView
                    style={{ width: '99%', height: '98%', alignSelf: 'center' }}
                    region={{
                        latitude,
                        longitude,
                        latitudeDelta,
                        longitudeDelta,
                    }}
                    tracksViewChanges={false} >
                    <MapView.Marker
                        coordinate={{
                            latitude,
                            longitude,
                            latitudeDelta,
                            longitudeDelta,
                        }}
                        tracksViewChanges={false}
                    />
                </MapView>
                <MapViewStreet>
                    <MapViewStreetText>ул. Маши Порываевой, 34</MapViewStreetText>
                </MapViewStreet>
            </InterlocutorsMessage>

        </View>))
    }
    if (type === 'file') {
        return (myId == sender._id ? (
            <View style={{ display: 'flex', flexDirection: 'row' }}>
                <MyMessage background={background}>
                    <FileInfoWrapper>
                        <FileIcon>
                            <ImageIconBlue />
                        </FileIcon>
                        <FileInfo>
                            <MyMessageText noPadding>
                                {filename}
                            </MyMessageText>
                            <FileSize>{fileSize}</FileSize>
                        </FileInfo>
                    </FileInfoWrapper>
                    <MessageInfo>
                        <MessageDate color={'white'}>{finalTime}</MessageDate>
                        <Indicator color={'white'} read={!!viewers.length} />
                    </MessageInfo>
                </MyMessage>
                <TriangleLeftIcon color={background || myMessage} />
            </View>
        ) : <View style={{ display: 'flex', flexDirection: 'row' }}>
                {withImage && <ImageComponent style={{ alignSelf: 'flex-end', position: 'relative', top: -5 }} size={30} source={{ uri: `http://ser.univ.team${sender.image}` }} />}
                <View style={{ display: 'flex', flexDirection: 'row', position: 'relative', left: withImage ? -10 : 0 }}>
                    <TriangleRightIcon color={background || interlocatorMessage} />
                    <InterlocutorsMessage background={background || interlocatorMessage}>
                        {withImage && <InterlocutorsName>
                            {sender.first_name} {sender.last_name}
                        </InterlocutorsName>}
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
            </ View>
        )
    }
}

const mapStateToProps = state => {
    return {
        messages: state.messageReducer.messages,
        myId: state.userReducer.user._id
    };
};
export default connect(mapStateToProps)(Message)