import React, { Component } from 'react'
import { Text, View, Image } from 'react-native'
import styled from 'styled-components'
import { TriangleLeftIcon, TriangleRightIcon, CheckIcon, CommentIcon, HeartIcon } from '../assets/index'
import { connect } from 'react-redux'
import { ImageComponent } from './'
const { HeaderHeightNumber, Colors } = helper;
const { myMessage, interlocatorMessage } = Colors
const MyMessage = styled(View)`
    display: flex;
    justify-content: flex-end;
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
    justify-content: flex-start;
    flex-direction: column;
    text-align: left;
    align-items: flex-start;
    background: ${({ background }) => background || interlocatorMessage};
    margin-left: 10px;
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
const Indicator = ({ delievered = false, read = false, color }) => {
    return <CheckIcon color={color} />
}
function Message(props) {
    const { children, messages, myId, background, withImage } = props
    const { text, sender, src, type, width, height } = children;
    if (type === 'image') {
        return (myId == sender._id ? (
            <View style={{ display: 'flex', flexDirection: 'row' }}>
                <MyMessage background={background}>
                    <MyMessageImage source={{ uri: `http://ser.univ.team${src}` }} width={width} height={height} />
                    <MessageInfo>
                        <MessageDate color={'white'}>1:40</MessageDate>
                        <Indicator color={'white'} />
                    </MessageInfo>
                </MyMessage>
                <TriangleLeftIcon color={myMessage} />
            </ View>
        ) : <View style={{ display: 'flex', flexDirection: 'row' }}>
                <TriangleRightIcon color={interlocatorMessage} />
                <InterlocutorsMessage background={background}>
                    <MyMessageImage source={{ uri: `http://ser.univ.team${src}` }} width={width} height={height}/>
                    <MessageInfo>
                        <MessageDate>1:40</MessageDate>
                    </MessageInfo>
                </InterlocutorsMessage>
            </ View>
        )
    } else {
        return (myId == sender ? (
            <View style={{ display: 'flex', flexDirection: 'row' }}>
                <MyMessage background={background}>
                    <MyMessageText>
                        {text}
                    </MyMessageText>
                    <MessageInfo>
                        <MessageDate color={'white'}>1:40</MessageDate>
                        <Indicator color={'white'} />
                    </MessageInfo>
                </MyMessage>
                <TriangleLeftIcon color={background || myMessage} />
            </ View>
        ) : <View style={{ display: 'flex', flexDirection: 'row' }}>
                {withImage && <ImageComponent style={{alignSelf: 'flex-end', position: 'relative', top: -5}} size={30} source={{ uri: `http://simpleicon.com/wp-content/uploads/user1.png` }} />}
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
                            <MessageDate>1:40</MessageDate>
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