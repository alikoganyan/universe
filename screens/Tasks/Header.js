import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { BackIcon, SearchIcon } from '../../assets/index';
import { connect } from 'react-redux';
import styled from 'styled-components';
import helper from '../../utils/helpers';
import { startSearch } from '../../actions/messageActions';
import ImageComponent from '../../common/Image';
import DefaultAvatar from '../../common/DefaultAvatar';
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

const Info = styled(View)`
    display: flex;
    margin-left: 10px;
`;
const InfoChatName = styled(Text)`
    color: black;
    font-size: ${fontSize.text};
`;
const InfoParticipants = styled(Text)`
    color: #5F7991;
    font-size: ${fontSize.sm};
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
const ToProfile = styled(TouchableOpacity)`
    display: flex;
    flex-direction: row;
    margin-right: 20px;
`;
class HeaderComponent extends Component {
    render() {
        const { back, currentTask, toProfile } = this.props;
        const { first_name, last_name, phone_number, tasks, image } = currentTask;
        return (
            <Header>
                <Left>
                    <BackIcon onPress={back} />
                    <ToProfile onPress={toProfile}>
                        {image === '/images/default_group.png' || image === '/images/default_avatar.jpg' ?
                            <DefaultAvatar size={'header'} style={{ marginLeft: 10 }} /> :
                            <ImageComponent source={{ uri: `http://ser.univ.team${image}` }} size={'header'} />
                        }
                        <Info>
                            <InfoChatName>{first_name ? `${first_name} ${last_name}` : phone_number}</InfoChatName>
                            <InfoParticipants>{tasks && tasks.length ? tasks.length : ''} задач</InfoParticipants>
                        </Info>
                    </ToProfile>
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
