import React, { Component } from 'react'
import { Text, View, Image } from 'react-native'
import styled from 'styled-components'
import { TriangleLeftIcon, TriangleRightIcon, CheckIcon, CommentIcon, HeartIcon } from '../assets/index'
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
`

const MyMessageText = styled(Text)`
    display: flex;
    justify-content: flex-end;
    text-align: left;
    padding: 10px;
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
    padding: 10px;
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

const MyMessageImage = styled(Image)`
    height: 100px;
    min-width: 100%;
    resize-mode: contain;
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
const Indicator = ({ delievered = false, read = false, color }) => {
    return <CheckIcon color={color} />
}
function Message(props) {
    const { children, messages, myId, background, withImage } = props
    const { text, sender, src, type, width, height, latitude, latitudeDelta, longitude, longitudeDelta, created_at, filename } = children;
    const date = new Date(created_at);
    const daysOfTheWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const day = daysOfTheWeek[date.getDay()]
    const time = `${date.getHours() >= 10 ? date.getHours() : '0' + date.getHours()}:${date.getMinutes() >= 10 ? date.getMinutes() : '0' + date.getMinutes()}`
    const finalTime = Math.abs(date - new Date()) / (1000 * 60 * 60 * 24) > 1 ? day : time
    if (type === 'image') {
        return (myId == sender._id ? (
            <View style={{ display: 'flex', flexDirection: 'row' }}>
                <MyMessage background={background}>
                    <MyMessageImage source={{ uri: `http://ser.univ.team${src}` }} width={width} height={height} />
                    <MessageInfo>
                        <MessageDate color={'white'}>{finalTime}</MessageDate>
                        <Indicator color={'white'} />
                    </MessageInfo>
                </MyMessage >
                <TriangleLeftIcon color={myMessage} />
            </ View >
        ) : <View style={{ display: 'flex', flexDirection: 'row' }}>
                <TriangleRightIcon color={interlocatorMessage} />
                <InterlocutorsMessage background={background}>
                    <MyMessageImage source={{ uri: `http://ser.univ.team${src}` }} width={width} height={height} />
                    <MessageInfo>
                        <MessageDate>{finalTime}</MessageDate>
                    </MessageInfo>
                </InterlocutorsMessage>
            </ View>
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
                        <Indicator color={'white'} />
                    </MessageInfo>
                </MyMessage>
                <TriangleLeftIcon color={background || myMessage} />
            </View>
        ) : <View style={{ display: 'flex', flexDirection: 'row' }}>
                {withImage && <ImageComponent style={{ alignSelf: 'flex-end', position: 'relative', top: -5 }} size={30} source={{ uri: `http://simpleicon.com/wp-content/uploads/user1.png` }} />}
                <View style={{ display: 'flex', flexDirection: 'row', position: 'relative', left: withImage ? -10 : 0 }}>
                    <TriangleRightIcon color={background || interlocatorMessage} />
                    <InterlocutorsMessage background={background || interlocatorMessage}>
                        {withImage && <InterlocutorsName>
                            Lol kek
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
                        <Indicator />
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
                    <MyMessageText>
                        {text}
                    </MyMessageText>
                    <MessageInfo>
                        <MessageDate color={'white'}>{finalTime}</MessageDate>
                        <Indicator color={'white'} />
                    </MessageInfo>
                </MyMessage>
                <TriangleLeftIcon color={background || myMessage} />
            </View>
        ) : <View style={{ display: 'flex', flexDirection: 'row' }}>
                {withImage && <ImageComponent style={{ alignSelf: 'flex-end', position: 'relative', top: -5 }} size={30} source={{ uri: `http://simpleicon.com/wp-content/uploads/user1.png` }} />}
                <View style={{ display: 'flex', flexDirection: 'row', position: 'relative', left: withImage ? -10 : 0 }}>
                    <TriangleRightIcon color={background || interlocatorMessage} />
                    <InterlocutorsMessage background={background || interlocatorMessage}>
                        {withImage && <InterlocutorsName>
                            Lol Kek
                        </InterlocutorsName>}
                        <InterlocutorsMessageText>
                            {filename}
                        </InterlocutorsMessageText>
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