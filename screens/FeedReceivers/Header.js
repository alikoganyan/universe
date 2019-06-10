import React, { Component } from 'react'
import { View, Text, SafeAreaView, Image, Dimensions, TouchableOpacity, TextInput } from 'react-native'
import styled from 'styled-components'
import helper from '../../utils/helpers'
import { connect } from 'react-redux'
import { p_tasks_search, g_users } from '../../constants/api'
import ImageComponent from '../../common/Image'
import { BackIcon } from '../../assets/'
import DefaultAvatar from '../../common/DefaultAvatar'
import sendRequest from '../../utils/request'
const { sidePadding, HeaderHeight, fontSize, Colors } = helper;
const { grey3 } = Colors
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
`
const Left = styled(View)`
    display: flex;
    flex-direction: row;
    align-items: center;
`
const Center = styled(View)``
const Input = styled(TextInput)`
    margin-left: ${Dimensions.get('window').width * 0.085};
`
const Right = styled(Left)`
    justify-content: flex-end;
`
// const UserImage = styled(Image)`
//     background: red;
//     width: 30px;
//     height: 30px;
//     border-radius: 15px;
//     margin-left:${sidePadding}px;
// `
const MarginRight = styled(View)`
    margin-right: ${Dimensions.get('window').width * 0.085};
    display: flex;
    flex-direction: row;
    align-items: center;
`
const HeaderText = styled(Text)`
    font-size: ${fontSize.header};
    position: relative;
    left: -10px;
    color: ${grey3};
`
class HeaderComponent extends Component {
    render() {
        const { back, user, toProfile, receivers } = this.props;
        const { image } = user;
        return (
            <Header>
                <Left>

                    <BackIcon onPress={back} right />
                    <HeaderText>Получатели</HeaderText>
                </Left>
                <Right>
                    {
                        !receivers.length ?
                            <TouchableOpacity onPress={toProfile}>
                                <ImageComponent source={{ uri: `http://ser.univ.team${image}` }} size={'header'} />
                            </TouchableOpacity> : <CheckGreyIcon size={22} noPaddingAll={true} left={true} onPress={this.addParticipants} />
                    }
                </Right>
            </Header>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.userReducer.user,
        tasks: state.tasksReducer.tasks,
        receivers: state.participantsReducer.news.receivers,
    };
};
const mapDispatchToProps = dispatch => ({
    setTasks: _ => dispatch(setTasks(_))
})
export default connect(mapStateToProps, mapDispatchToProps)(HeaderComponent)

