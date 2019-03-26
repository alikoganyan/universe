import React, { Component } from 'react'
import { View, Text, TextInput, Image, Platform, Dimensions, TouchableOpacity } from 'react-native'
import { BackIcon, LocationIcon, SearchIcon, CloseIcon } from '../../assets/index'
import { connect } from 'react-redux'
import styled from 'styled-components'
import helper from '../../Helper/helper'
import { addMessage, startSearch, stopSearch } from '../../actions/messageActions'
import Icon from 'react-native-vector-icons/FontAwesome';
import { ImageComponent } from '../../Common/'
const { sidePadding, sidePaddingNumber, HeaderHeight, Colors } = helper;
const { border } = Colors;
const Header = styled(View)`
    width: ${Dimensions.get('window').width - (sidePaddingNumber * 2)}px;
    align-self: center;
    background: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
`
const HeaderUserImage = styled(Image)`
    border-radius: 15;
    height: 30px;
    width: 30px;
    margin-right: 10px;
`
const Info = styled(View)`
    display: flex;
    margin-left: 10px;
`
const InfoChatName = styled(Text)`
    color: black;
    font-size: 12px;
`
const InfoParticipants = styled(Text)`
    color: #5F7991;
    font-size: 10px;
`
const Left = styled(View)`
    display: flex;
    flex-direction: row;
    align-items: center;
`
const Right = styled(View)`
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: flex-end;
`
const Categories = styled(Header)`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
    width: ${Dimensions.get('window').width - (sidePaddingNumber * 2)}px;
`
const Top = styled(View)`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    height: ${HeaderHeight}; 
    width: 100%;

`
const Bottom = styled(Top)`
    border: 1px solid ${border};
    border-width: 0;
    border-top-width: 1px;
    margin: 0 ${sidePadding};
    min-height: 0; 
    width: ${Dimensions.get('window').width - (sidePaddingNumber * 2)}px;
`
const Category = styled(Text)`
    display: flex;
    flex:1;
    justify-content: center;
    font-size: 11px;
    text-align: center;
    padding: 10px 0;
`
const Input = styled(TextInput)`
`
const IconLeft = styled(Icon)`
    margin-left: ${sidePadding};
`
const ToProfile = styled(TouchableOpacity)`
    display: flex;
    flex-direction: row;
`
class HeaderComponent extends Component {
    render() {
        const { back, search, startSearch, stopSearch, currentChat, toProfile } = this.props
        return (
            <Header>
                <Top>
                    <Left>
                        {!search ? (
                            <>
                                <BackIcon onPress={back} right />
                                <ToProfile onPress={toProfile}>
                                    <ImageComponent source={{ uri: 'https://www.paulekman.com/wp-content/uploads/2018/06/personicon-23.png' }} />
                                    <Info>
                                        <InfoChatName>{currentChat && currentChat.phone}</InfoChatName>
                                        <InfoParticipants>был последний раз вчера</InfoParticipants>
                                    </Info>
                                </ToProfile>
                            </>
                        ) : (
                                <>
                                    <IconLeft name="search" />
                                    <Input placeholder="123" />
                                </>
                            )}
                    </Left>
                    <Right>
                        {!search ? (
                            <>
                                <SearchIcon onPress={startSearch} />
                                <LocationIcon />
                            </>
                        ) : <CloseIcon onPress={stopSearch} />}
                    </Right>
                </Top>
                {search && (
                    <Bottom>
                        <Categories>
                            <Category>Задачи</Category>
                            <Category>Геолокация</Category>
                            <Category>Контакты</Category>
                            <Category>Файлы</Category>
                        </Categories>
                    </Bottom>
                )}
            </Header>
        )
    }
}
const mapStateToProps = state => {
    return {
        search: state.messageReducer.search
    };
};
const mapDispatchToProps = dispatch => ({
    addMessage: _ => dispatch(addMessage(_)),
    startSearch: _ => dispatch(startSearch()),
    stopSearch: _ => dispatch(stopSearch()),
})
export default connect(mapStateToProps, mapDispatchToProps)(HeaderComponent)