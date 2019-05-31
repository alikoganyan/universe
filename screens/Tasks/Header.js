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
import ImageComponent from '../../common/Image'
const { sidePadding, HeaderHeight, Colors, fontSize } = helper;
const { border } = Colors;
const Header = styled(View)`
    width: ${Dimensions.get('window').width - (sidePadding * 2)}px;
    align-self: center;
    background: white;
    display: flex;
    flex-direction: row;
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
    margin-left: ${sidePadding}px;
`
const Categories = styled(Header)`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
    width: ${Dimensions.get('window').width - (sidePadding * 2)}px;
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
    margin: 0 ${sidePadding}px;
    min-height: 0; 
    width: ${Dimensions.get('window').width - (sidePadding * 2)}px;
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
    margin-left: ${sidePadding}px;
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
        const { back, currentTask, toProfile } = this.props
        const { first_name, last_name, phone_number, tasks, image } = currentTask
        return (
            <Header>
                <Left>
                    <BackIcon onPress={back} right />
                        <ToProfile onPress={toProfile}>
                            <ImageComponent size={'header'} source={{ uri: `http://ser.univ.team${image}` }} />
                            <Info>
                                <InfoChatName>{first_name ? `${first_name} ${last_name}` : phone_number}</InfoChatName>
                                <InfoParticipants>{tasks && tasks.length ? tasks.length : ''} задач</InfoParticipants>
                            </Info>
                    </ToProfile>
                </Left>
                <Right>
                    <SearchIcon onPress={startSearch}/>
                </Right>
            </Header>
        )
    }
}
const mapStateToProps = state => ({
    currentTask: state.tasksReducer.currentTask,
})
const mapDispatchToProps = dispatch => ({
})
export default connect(mapStateToProps, mapDispatchToProps)(HeaderComponent)