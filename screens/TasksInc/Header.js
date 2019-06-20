import React, { Component } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { BackIcon, SearchIcon } from '../../assets/index';
import { connect } from 'react-redux';
import styled from 'styled-components';
import helper from '../../utils/helpers';
import { startSearch } from '../../actions/messageActions';
const { sidePadding, HeaderHeight, fontSize } = helper;
const Header = styled(View)`
    width: ${Dimensions.get('window').width - (sidePadding * 2)}px;
    align-self: center;
    background: white;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    height: ${HeaderHeight}px;
`;
const InfoChatName = styled(Text)`
    color: black;
    font-size: ${fontSize.text};
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
    justify-content: flex-end;
    margin-left: ${sidePadding}px;
`;
class HeaderComponent extends Component {
    render() {
        const { back } = this.props;
        return (
            <Header>
                <Left>
                    <BackIcon onPress={back} />
                    <InfoChatName>Все входящие задачи</InfoChatName>
                </Left>
                <Right>
                    <SearchIcon onPress={startSearch} />
                </Right>
            </Header>
        );
    }
}
const mapStateToProps = state => ({
    currentTask: state.tasksReducer.currentTask,
});
const mapDispatchToProps = dispatch => ({
});
export default connect(mapStateToProps, mapDispatchToProps)(HeaderComponent);
