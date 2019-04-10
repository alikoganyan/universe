import React, { Component } from 'react'
import { View, Text, TextInput, Image, Platform, Dimensions, TouchableOpacity } from 'react-native'
import { BackIcon, LocationIcon, SearchIcon, CloseIcon } from '../../assets/index'
import { connect } from 'react-redux'
import styled from 'styled-components'
import helper from '../../utils/helpers'
import { addMessage, startSearch, stopSearch } from '../../actions/messageActions'
import Icon from 'react-native-vector-icons/FontAwesome';

const { sidePadding, sidePaddingNumber, HeaderHeight, Colors, fontSize } = helper;
const { border } = Colors;
const Header = styled(View)`
    width: 100%;
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
class HeaderComponent extends Component {
    render() {
        const { back, search, startSearch, stopSearch } = this.props
        return (
            <Header>
                <Top>
                    <Left>
                        {!search ? (
                            <>
                                <BackIcon onPress={back} />
                                <HeaderUserImage source={{ uri: 'https://facebook.github.io/react/logo-og.png' }} />
                                <Info>
                                    <InfoChatName>lol</InfoChatName>
                                    <InfoParticipants>5 участников</InfoParticipants>
                                </Info>
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
                        ) : <>
                                <CloseIcon onPress={stopSearch} />
                            </>}
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