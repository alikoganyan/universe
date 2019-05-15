import React, { Component } from 'react'
import { View, Text, TextInput, Image, Platform, Dimensions, TouchableOpacity } from 'react-native'
import { BackIcon, LocationIcon, SearchIcon, CloseIcon } from '../../assets/index'
import { connect } from 'react-redux'
import styled from 'styled-components'
import helper from '../../utils/helpers'
import sendRequest from '../../utils/request'
import { p_search_messages } from '../../constants/api'
import { addMessage, startSearch, stopSearch, getMessages } from '../../actions/messageActions'
import Icon from 'react-native-vector-icons/FontAwesome';
import { ImageComponent } from '../../common'
const { sidePadding, sidePaddingNumber, HeaderHeight, Colors, fontSize } = helper;
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
const Info = styled(View)`
    display: flex;
    margin-left: 10px;
`
const InfoChatName = styled(Text)`
    color: black;
    font-size: ${fontSize.text};
`
const InfoParticipants = styled(Text)`
    color: #5F7991;
    font-size: ${fontSize.sm};
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
    margin-left: ${sidePadding};
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
    margin-right: 20px;
`
const SearchIconContainer = styled(View)`
margin-right: 20px;
`
class HeaderComponent extends Component {
    render() {
        const { back, search, startSearch, stopSearch, currentChat, toProfile, currentDialog } = this.props
        console.log(currentDialog)
        const { first_name, last_name, phone_number, image } = currentDialog
        return (
            <Header>
                <Top>
                    <Left>
                        {!search ? (
                            <>
                                <BackIcon onPress={back} right />
                                <ToProfile onPress={toProfile}>
                                    <ImageComponent source={{ uri: `http://ser.univ.team${image}` }} />
                                    <Info>
                                        <InfoChatName>{first_name ? `${first_name} ${last_name}` : phone_number}</InfoChatName>
                                        <InfoParticipants>был последний раз вчера</InfoParticipants>
                                    </Info>
                                </ToProfile>
                            </>
                        ) : (
                                <>
                                    <IconLeft name="search" />
                                    <Input placeholder="поиск" onChangeText={this.find} />
                                </>
                            )}
                    </Left>
                    <Right>
                        {!search ? (
                            <>
                                <SearchIcon onPress={startSearch} right />
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
    find = (e) => {
        const { getMessages, dialogs, currentRoom } = this.props;
        e ? sendRequest({
            r_path: p_search_messages,
            method: 'post',
            attr: {
                text: e,
            },
            success: (res) => {
                getMessages(res)
            },
            failFunc: (err) => {
                console.log(err)
            }
        }) : getMessages(dialogs.filter(e => e.room.includes(currentRoom))[0].messages)
    }
}
const mapStateToProps = state => ({
    search: state.messageReducer.search,
    dialogs: state.dialogsReducer.dialogs,
    currentRoom: state.messageReducer.currentRoom,
    currentDialog: state.dialogsReducer.currentDialog
})
const mapDispatchToProps = dispatch => ({
    addMessage: _ => dispatch(addMessage(_)),
    startSearch: _ => dispatch(startSearch()),
    stopSearch: _ => dispatch(stopSearch()),
    getMessages: _ => dispatch(getMessages(_))
})
export default connect(mapStateToProps, mapDispatchToProps)(HeaderComponent)