import React, { Component } from 'react'
import { View, Text, SafeAreaView, FlatList, Image, TouchableOpacity, Dimensions, ScrollView } from 'react-native'
import { BackIcon, TaskIcon, GroupIcon, FilesRedIcon } from '../../assets/index'
import { Button } from '../../common';
import { setRoom } from '../../actions/messageActions'
import styled from 'styled-components'
import FloatingLabel from 'react-native-floating-labels'
import helper from '../../utils/helpers'
import { connect } from 'react-redux'
import { socket } from '../../utils/socket'

const { sidePadding, Colors, HeaderHeight, fontSize } = helper;
const { border } = Colors;
const Wrapper = styled(View)`
    padding-top: 0px;
    background: white;
    height: ${Dimensions.get('window').height - HeaderHeight}px;
`
const User = styled(View)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding-bottom: 20px;
    margin-bottom: 10px;
`
const UserImage = styled(Image)`
    width: 80px;
    height: 80px;
    border-radius: 40;
    margin: 0 10px 16px;

`
const UserInfo = styled(View)`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 60px;
    width: 100%;
`
const UserName = styled(View)`
    display: flex;
    flex-direction: row;
    text-align: center;
    justify-content: center;
    margin-bottom: 10px;

`

const Name = styled(Text)`
    font-size: 15;
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    text-align: center;
`
const UserStatus = styled(Name)`
    font-size: 11;
    color: #B9B9B9;
    margin-bottom: 10px;

`

const Info = styled(View)`
    padding: 0 ${sidePadding}px;
    flex: 1;
`
const Data = styled(View)`
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: flex-start;
    border: 1px solid ${border};
    padding: ${sidePadding}px 0;
    border-width: 0;
    border-top-width: 1px; 
`
const Value = styled(Text)`
    font-size: 13px;
    min-width: 150px;
    text-align: left;
    flex: 1;
    display: flex;
    justify-content: flex-start;
`
const Type = styled(Value)`
    color: #BABABA;
    min-width: 110px;
    flex: 0;
    font-size: ${fontSize.sm};
`
const PersonalData = styled(View)`
    border: 1px solid #E6E6E6;
    border-width: 0;
`
const SendMessage = styled(Button)``

class Content extends Component {
    render() {
        const { UserData, userName, status } = this.state;
        const { user, currentRoom, currentChat, myProfile, currentDialog } = this.props;

        const { _id, image, last_name, first_name, phone_number } = myProfile ? user : currentDialog;
        const name = first_name ? `${first_name} ${last_name}` : phone_number;
        return (
            <Wrapper>
                <User >
                    <UserImage source={{ uri: `http://ser.univ.team${image}` }} />
                    <UserInfo>
                        <UserName>
                            <Name>{name}</Name>
                        </UserName>
                        {!myProfile && <UserStatus>{status}</UserStatus>}
                        {!myProfile && <SendMessage onPress={this.toChat}>Написать сообщение</SendMessage>}
                    </UserInfo>
                </User>
                <ScrollView>
                    <PersonalData>
                        {UserData.map((item, index) => {
                            return item && (!myProfile || !item.icon) && <Info key={index}>
                                <Data>
                                    <Type>{item.type}</Type>
                                    <Value>{item.value}</Value>
                                    {item.icon && item.icon}
                                </Data>
                            </Info>
                        })}
                    </PersonalData>
                </ScrollView>

            </Wrapper>

        )
    }
    state = {
        userName: 'Константин Константинопольский',
        status: 'В сети',
        UserData: []
    }
    componentDidMount() {
        const { myProfile, user, currentChat, currentDialog } = this.props
        const { role, phone_number, department } = myProfile ? user : currentDialog;
        const newUserData = [
            { type: 'Подразделение', value: department || 'без подразделения' },
            { type: 'Должность', value: role ? role.length ? role[0] : 'без должности' : 'без должности' },
            { type: 'Личный', value: phone_number || 'без номера' },
            !myProfile ? { type: 'Задачи', value: '4', icon: <TaskIcon /> } : undefined,
            !myProfile ? { type: 'Общих групп', value: '32', icon: <GroupIcon /> } : undefined,
            !myProfile ? { type: 'Общих файлов', value: '10', icon: <FilesRedIcon /> } : undefined,
        ]
        this.setState({ UserData: newUserData })
    }
    toChat = () => {
        const { toChat, setRoom, user } = this.props
        const { id } = user
        socket.emit('select chat', { chatId: id, userId: id })
        setRoom(id)
        toChat()
    }
}

const mapStateToProps = state => ({
    messages: state.messageReducer,
    dialog: state.dialogsReducer.dialogs,
    currentRoom: state.messageReducer.currentRoom,
    currentChat: state.messageReducer.currentChat,
    currentDialog: state.dialogsReducer.currentDialog,
    user: state.userReducer.user,
})
const mapDispatchToProps = dispatch => ({
    getMessages: _ => dispatch(getMessages(_)),
    setRoom: _ => dispatch(setRoom(_)),
    setDialogs: _ => dispatch(setDialogs(_)),
    addMessage: _ => dispatch(addMessage(_))
})
export default connect(mapStateToProps, mapDispatchToProps)(Content)
