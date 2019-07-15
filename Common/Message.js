import React, { Component } from 'react';
import { Text, View, Dimensions } from 'react-native';
import styled from 'styled-components';
import { TriangleLeftIcon, TriangleRightIcon, CheckIcon, CheckAllIcon, ImageIcon, ImageIconBlue } from '../assets/index';
import { connect } from 'react-redux';
import ImageComponent from './Image';
import MapView from 'react-native-maps';
import { FileSystem } from 'expo';
import helper from '../utils/helpers';
import { SingleImage } from 'react-native-zoom-lightbox';

const { Colors, fontSize, borderRadius } = helper;
const { myMessage, interlocatorMessage, pink } = Colors;

const MyMessage = styled(View)
`
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
`;

const MyMessageText = styled(Text)
`
    display: flex;
    justify-content: flex-end;
    text-align: left;
    padding: ${({ noPadding }) => noPadding ? 0 : 10}px;
    padding-bottom: 0;
    color: white;
    font-size: ${fontSize.textSize};
`;

const InterlocutorsMessage = styled(MyMessage)
`
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
`;

const InterlocutorsMessageText = styled(MyMessageText)
`
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
`;
const MessageInfo = styled(View)
`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    padding: 0 10px 5px;
    width: 100%;
`;
const MessageDate = styled(Text)
`
    color: ${({ color }) => color || '#ABABAB'};
`;
const MyMessageImage = styled(SingleImage)
`
    min-width: 100%;
    height: 250px;
`;
const InterlocutorsName = styled(InterlocutorsMessageText)
`
    margin-bottom: 0;
`;
const MapViewStreet = styled(View)
`
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
`;
const MapViewStreetText = styled(Text)
`
    color: white;
`;
const MapViewStreetInfo = styled(View)
`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
`;
const MapViewStreetTime = styled(Text)
`
    color: white;
`;
const FileInfoWrapper = styled(View)
`
    display: flex;
    flex-direction: row;
    padding: 10px;
    padding-bottom: 0;
    align-items: center;
`;
const FileIcon = styled(View)
`
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
`;
const FileInfo = styled(View)
`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
`;
const FileSize = styled(Text)
`
    color: ${({ color }) => color || 'white'};
`;
const Indicator = ({ read = false, color }) => read ?
    <CheckAllIcon color={color} noPaddingAll /> :
    <CheckIcon color={color} noPaddingAll />;

class Message extends Component {
    render() {
        const { children, myId, background, withImage } = this.props;
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
            data
        } = children;
        const date = new Date(created_at);
        const daysOfTheWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
        const day = daysOfTheWeek[date.getDay()];
        const minutes = date.getMinutes() >= 10 ? date.getMinutes() : `0${date.getMinutes()}`;
        const hours = date.getHours() >= 10 ? date.getHours() : `0${date.getHours()}`;
        const time = `${hours}:${minutes}`;
        const finalTime = Math.abs(date - new Date()) / (1000 * 60 * 60 * 24) > 1 ? day : time;
        const fileSize = size / 1024 > 1024 ?
            `${(size / (1024 * 2)).toFixed(1)}МБ` :
            `${(size / 1024).toFixed(1)}КБ`;
        const messageRead = !!viewers.filter(e => e !== myId).length;
        if (type === 'image') {
            this.readFile(src.split('file://')[1] ? src : `https://ser.univ.team${src}`, filename);
            return (myId === sender._id ? (
                <View style={{ display: 'flex', flexDirection: 'row' }}>
                    <MyMessage background={background} style={{ padding: 0 }}>
                            <MyMessageImage
                                uri={`https://ser.univ.team${src}`}
                                width={width}
                                height={height}
                                resizeMode="contain"
                            />
                        <MessageInfo>
                            <MessageDate color="white">{finalTime}</MessageDate>
                            <Indicator color="white" read={messageRead} />
                        </MessageInfo>
                    </MyMessage>
                    <TriangleLeftIcon color={myMessage} />
                </View>
            ) : (
                <View style={{ display: 'flex', flexDirection: 'row' }}>
                    {withImage ? (
                        <ImageComponent
                            style={{ alignSelf: 'flex-end', position: 'relative', top: -5 }}
                            size={30}
                            source={{ uri: `https://ser.univ.team${sender.image}` }}
                        />
                    ) : null}
                    <View
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            position: 'relative',
                            left: withImage ? -5 : 0
                        }}
                    >
                        <TriangleRightIcon color={interlocatorMessage} />
                        <InterlocutorsMessage background={background}>
                            <MyMessageImage
                                uri={`https://ser.univ.team${src}`}
                                resizeMode="contain"
                            />
                            <MessageInfo>
                                <MessageDate>{finalTime}</MessageDate>
                            </MessageInfo>
                        </InterlocutorsMessage>
                    </View>
                </View>
            ));
        }
        if (type === 'text' || !type) {
            return (myId === sender._id ? (
                <View style={{ display: 'flex', flexDirection: 'row' }}>
                    <MyMessage background={background}>
                        <MyMessageText>
                            {text}
                        </MyMessageText>
                        <MessageInfo>
                            <MessageDate color="white">{finalTime}</MessageDate>
                            <Indicator color="white" read={messageRead} />
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
                            source={{ uri: `https://ser.univ.team${sender.image}` }}
                        />
                    )}
                    <View
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            position: 'relative',
                            left: withImage ? -5 : 0
                        }}
                    >
                        <TriangleRightIcon color={background || interlocatorMessage} />
                        <InterlocutorsMessage background={background || interlocatorMessage}>
                            {withImage && (
                                <InterlocutorsName>
                                    {sender.first_name}
                                    {sender.last_name}
                                </InterlocutorsName>
                            )}
                            <InterlocutorsMessageText>
                                {text}
                            </InterlocutorsMessageText>
                            <MessageInfo>
                                <MessageDate>{finalTime}</MessageDate>
                            </MessageInfo>
                        </InterlocutorsMessage>
                    </View>
                </View>
            ));
        }
        if (type === 'geo') {
            return (myId === sender._id ? (
                <View style={{
                display: 'flex',
                alignItems: 'flex-end'
            }}>
                <MyMessage
                    style={{ height: 150, width: 300, marginLeft: 20 }}
                >
                    <MapView
                        scrollEnabled={false}
                        rotateEnabled={false}
                        pitchEnabled={false}
                        zoomEnabled={false}
                        style={{ width: '99%', height: '98%', alignSelf: 'center' }}
                        region={{
                          ...data,
                          latitudeDelta: 0.0922,
                          longitudeDelta: 0.0421,
                        }}
                        tracksViewChanges={false}>
                        <MapView.Marker
                            coordinate={data}
                            tracksViewChanges={false}
                        />
                    </MapView>
                    <MapViewStreet>
                        <MapViewStreetText>ул. Маши Порываевой, 34</MapViewStreetText>
                        <MapViewStreetInfo>
                            <MapViewStreetTime>4:10</MapViewStreetTime>
                            <Indicator read={messageRead} />
                        </MapViewStreetInfo>
                    </MapViewStreet>
                </MyMessage>
            </View>
            ) : (
                <View style={{
                display: 'flex',
                alignItems: 'flex-start',
                flexDirection: 'row'
            }}>
                {withImage ? (
                    <ImageComponent
                        style={{ alignSelf: 'flex-end', position: 'relative', top: -5 }}
                        size={30}
                        source={{ uri: `https://ser.univ.team${sender.image}` }}
                    />) : null
                }
                <InterlocutorsMessage
                    style={{ height: 150, width: 300, marginLeft: 20 }}
                    background={pink}
                >
                    <MapView
                        scrollEnabled={false}
                        rotateEnabled={false}
                        pitchEnabled={false}
                        zoomEnabled={false}
                        style={{
                            flex: 1,
                            width: '100%',
                            height: Dimensions.get('window').height,
                            minHeight: 150,
                        }}
                        region={{
                          ...data,
                          latitudeDelta: 0.0922,
                          longitudeDelta: 0.0421,
                        }}
                        >
                        <MapView.Marker
                            coordinate={data}
                            tracksViewChanges={false}
                        />
                    </MapView>
                    <MapViewStreet>
                        <MapViewStreetText>ул. SМаши Порываевой, 34</MapViewStreetText>
                    </MapViewStreet>
                </InterlocutorsMessage>

            </View>
            ));
        }
        if (type === 'file') {
            return (
                myId === sender._id ? (
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
                            <MessageDate color="white">{finalTime}</MessageDate>
                            <Indicator color="white" read={messageRead} />
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
                                source={{ uri: `https://ser.univ.team${sender.image}` }}
                            />
                        )}
                        <View
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                position: 'relative',
                                left: withImage ? -10 : 0
                            }}
                        >
                            <TriangleRightIcon color={background || interlocatorMessage} />
                            <InterlocutorsMessage background={background || interlocatorMessage}>
                                {withImage && (
                                    <InterlocutorsName>
                                        {sender.first_name}
                                        {sender.last_name}
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
                ));
        }
    }

    state = {}

    componentDidMount() {}

    readFile = async (path, filename) => {
        const uri = `${FileSystem.cacheDirectory}${filename}`;
        FileSystem.getInfoAsync(uri)
            .then((image) => {
                if (image.exists) {
                    this.image = uri;
                    return;
                }
                this.image = path;
            }).catch(async () => {
                await FileSystem.downloadAsync(path, uri);
            });
    }
}

const mapStateToProps = state => ({
    messages: state.messageReducer.messages,
    myId: state.userReducer.user._id,
    currentDialog: state.dialogsReducer.currentDialog
});
export default connect(mapStateToProps)(Message);
