import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import { BackIcon } from '../../assets/index';
import styled from 'styled-components';
import { connect } from 'react-redux';
import helper from '../../utils/helpers';
import ImageComponent from '../../common/Image';
const { sidePadding, HeaderHeight } = helper;
const Header = styled(View)`
    width: 100%;
    background: white;
    height: ${HeaderHeight}; 
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding-right: ${sidePadding}px;
    padding-left: ${sidePadding}px;
`;
const Left = styled(View)`
    display: flex;
    flex-direction: row;
    align-items: center;
`;
const Right = styled(View)`
    display: flex;
    flex-direction: row;
    align-items: flex-end;
`;
class HeaderComponent extends Component {
    render() {
        const { back } = this.props;
        // const { image } = user;
        return (
            <Header>
                <Left>
                    <BackIcon right onPress={back} />
                    <Text>
                        Настройки
                    </Text>
                </Left>
                <Right>
                    <ImageComponent source={{uri: "image"}}/>
                </Right>
            </Header>
        );
    }
}
const mapStateToProps = state => ({
        messages: state.messageReducer,
        dialog: state.dialogsReducer.dialogs,
        currentRoom: state.messageReducer.currentRoom,
        currentChat: state.messageReducer.currentChat,
        user: state.userReducer.user,
});
const mapDispatchToProps = dispatch => ({
    setCurrentChat: _ => dispatch(setCurrentChat(_)),
});
export default connect(mapStateToProps, mapDispatchToProps)(HeaderComponent);
