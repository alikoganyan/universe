import React, { Component } from 'react'
import { View, Text, SafeAreaView, FlatList, Image, TouchableOpacity, Dimensions, ScrollView } from 'react-native'
import { BackIcon, TaskIcon, GroupIcon, FilesRedIcon, GroupIconGrey } from '../../assets/index'
import Button from '../../common/Button';
import { setRoom } from '../../actions/messageActions'
import styled from 'styled-components'
import FloatingLabel from 'react-native-floating-labels'
import helper from '../../utils/helpers'
import { connect } from 'react-redux'
import { socket } from '../../utils/socket'
import DefaultAvatar from '../../common/DefaultAvatar'
const { sidePadding, Colors, HeaderHeight, fontSize } = helper;
const { border, grey3, pink } = Colors;
const Wrapper = styled(View)`
    padding-top: 0px;
    background: white;
    height: ${Dimensions.get('window').height - HeaderHeight - 20}px;
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
    align-items: center;
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
const StyledScrollView = styled(ScrollView)`
`
const Participants = styled(View)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    padding-right: 10px;
    flex-direction: row;
`
const ParticipantsItem = styled(Participants)`
    padding: 0;
`
const ParticipantsText = styled(Text)`
    color: ${grey3};
`
const LeaveGroup = styled(Text)`
    font-size: ${fontSize.sm};
    color: ${pink};
`
const BoxInnerItem = styled(View)`
    padding: 10px;
    padding-bottom: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
`
const ContactImage = styled(Image)`
    width: 36px;
    height: 36px;
    border-radius: 18;
    margin-right: 10px;
`
const ContactInfo = styled(View)`
    margin-left: 10px;
`

const ContactName = styled(Text)``
const ContactRole = styled(Text)`
    color: #A7B0BA;
    display: flex;
    align-items: flex-start;
    justify-content: center;
`
class Content extends Component {
    render() {
        const { UserData, userName, status } = this.state;
        const { user, currentRoom, currentChat, myProfile, currentDialog } = this.props;

        const { _id, image, last_name, first_name, phone_number, isGroup, participants, name } = myProfile ? user : currentDialog;
        const chatName = first_name ? `${first_name} ${last_name}` : (phone_number || name);
        return (
            <Wrapper>
                <StyledScrollView>
                    <User >
                        {
                            image === '/images/default_group.png' || image === '/images/default_avatar.jpg' ?
                                <DefaultAvatar isGroup={isGroup} id={_id} size={80} /> :
                                <UserImage source={{ uri: `http://ser.univ.team${image}` }} />
                        }
                        <UserInfo>
                            <UserName>
                                <Name>{chatName}</Name>
                            </UserName>
                            {(!myProfile && !isGroup) && <UserStatus>{status}</UserStatus>}
                            {(!myProfile && !isGroup) && <SendMessage onPress={this.toChat}>Написать сообщение</SendMessage>}
                        </UserInfo>
                    </User>
                    {isGroup ?
                        <>
                            <PersonalData>
                                {UserData.map((item, index) => {
                                    return item && item.isGroup && (!myProfile || !item.icon) && <Info key={index}>
                                        <Data>
                                            <Type>{item.type}</Type>
                                            <Value>{item.value}</Value>
                                            {item.icon && item.icon}
                                        </Data>
                                    </Info>
                                })}
                            </PersonalData>
                            <Participants>
                                <ParticipantsItem>
                                    <GroupIconGrey noPaddingAll />
                                    <ParticipantsText>Участники</ParticipantsText>
                                </ParticipantsItem>
                                <ParticipantsItem>
                                    <TouchableOpacity onPress={this.LeaveGroup}>
                                        <LeaveGroup>ВЫЙТИ ИЗ ГРУППЫ</LeaveGroup>
                                    </TouchableOpacity>
                                </ParticipantsItem>
                            </Participants>
                            <FlatList
                                style={{ paddingRight: 5, paddingLeft: 5, }}
                                data={participants}
                                renderItem={({ item, index }) => {
                                    const { _id, first_name, last_name, post, role, image, phone_number } = item
                                    return (
                                        <BoxInnerItem>
                                            {image === '/images/default_avatar.jpg' ?
                                                <DefaultAvatar size={36}/> :
                                                <ContactImage source={{ uri: `http://ser.univ.team${image}` }} />
                                            }

                                            <ContactInfo>
                                                <ContactName>{first_name ? `${first_name} ${last_name}` : phone_number}</ContactName>
                                                {role && role.name && <ContactRole>{role.name}</ContactRole>}
                                            </ContactInfo>
                                        </BoxInnerItem>
                                    )
                                }}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </> :
                        <PersonalData>
                            {UserData.map((item, index) => {
                                return item && !item.isGroup && (!myProfile || !item.icon) && <Info key={index}>
                                    <Data>
                                        <Type>{item.type}</Type>
                                        <Value>{item.value}</Value>
                                        {item.icon && item.icon}
                                    </Data>
                                </Info>
                            })}
                        </PersonalData>
                    }
                    <View style={{ height: 10 }} />
                </StyledScrollView>
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
            { type: 'Подразделение', value: department || 'без подразделения', isGroup: false },
            { type: 'Должность', value: role ? role.length ? role.name : 'без должности' : 'без должности', isGroup: false },
            { type: 'Личный', value: phone_number || 'без номера', isGroup: false },
            !myProfile ? { type: 'Задачи', value: '4', icon: <TaskIcon />, isGroup: false } : undefined,
            !myProfile ? { type: 'Общих групп', value: '32', icon: <GroupIcon />, isGroup: false } : undefined,
            !myProfile ? { type: 'Пользователей', value: '4', icon: <GroupIcon />, isGroup: true } : undefined,
            !myProfile ? { type: 'Задачи', value: '32', icon: <TaskIcon />, isGroup: true } : undefined,
            !myProfile ? { type: 'Общих файлов', value: '10', icon: <FilesRedIcon />, isGroup: false } : undefined,
            !myProfile ? { type: 'Общих файлов', value: '10', icon: <FilesRedIcon />, isGroup: true } : undefined,
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
    LeaveGroup = () => {
        const { currentRoom } = this.props
        console.log(`leave group ${currentRoom}`)
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
