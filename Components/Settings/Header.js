import React, { Component } from 'react'
import { View, Text, SafeAreaView, Image, Platform, ActionSheetIOS } from 'react-native'
import { BackIcon } from '../../assets/index'
import styled from 'styled-components'
import { connect } from 'react-redux'
import helper from '../../Helper/helper'
const { sidePadding, HeaderHeight } = helper;
const Header = styled(View)`
    width: 100%;
    background: white;
    height: ${HeaderHeight}; 
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding-right: ${sidePadding};
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
const UserImage = styled(Image)`
    width: 40px;
    height: 40px;
    border-radius: 20px;
`
class HeaderComponent extends Component {
    render() {
        const { user, back } = this.props;
        const { image } = user;
        return (
            <Header>
                <Left>
                    <BackIcon noPadding onPress={back} />
                    <Text>
                        Настройки
                    </Text>
                </Left>
                <Right>
                    <UserImage source={{uri: image}}/>
                </Right>
            </Header>
        )
    }
}
const mapStateToProps = state => {
    return {
        messages: state.messageReducer,
        dialog: state.dialogsReducer.dialogs,
        currentRoom: state.messageReducer.currentRoom,
        currentChat: state.messageReducer.currentChat,
        user: state.userReducer.user.user,
    };
};
const mapDispatchToProps = dispatch => ({
    setCurrentChat: _ => dispatch(setCurrentChat(_)),
})
export default connect(mapStateToProps, mapDispatchToProps)(HeaderComponent)
