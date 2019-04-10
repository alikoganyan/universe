import React, { Component } from 'react'
import { View, Text, SafeAreaView, Image, Platform, ActionSheetIOS } from 'react-native'
import { BackIcon } from '../../assets/index'
import styled from 'styled-components'
import { connect } from 'react-redux'
import helper from '../../utils/helpers'
import { ImageComponent } from '../../common'
const { sidePadding, HeaderHeight, sidePaddingNumber } = helper;
const Header = styled(View)`
    width: 100%;
    background: white;
    height: ${HeaderHeight}; 
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding-right: ${sidePadding};
    padding-left: ${sidePadding};
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
    width: 30px;
    height: 30px;
    border-radius: 15px;
`
const MarginRight = styled(View)`
    margin-right: ${sidePaddingNumber};
`
class HeaderComponent extends Component {
    render() {
        const { user, back } = this.props;
        // const { image } = user;
        console.log({user})
        return (
            <Header>
                <Left>
                    <MarginRight>
                        <BackIcon noPadding onPress={back} />
                    </MarginRight>
                    <Text>
                        Настройки
                    </Text>
                </Left>
                <Right>
                    <ImageComponent source={{uri: "image"}}/>
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
        user: state.userReducer.user,
    };
};
const mapDispatchToProps = dispatch => ({
    setCurrentChat: _ => dispatch(setCurrentChat(_)),
})
export default connect(mapStateToProps, mapDispatchToProps)(HeaderComponent)
