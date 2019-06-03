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
    margin-bottom: 20px;
`
const Participants = styled(View)`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: row;
`
const ParticipantsText = styled(Text)``

const BoxInnerItem = styled(View)`
    padding: 10px;
    padding-bottom: ${({ title }) => title ? 20 : 0}px;
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

        const { _id, image, last_name, first_name, phone_number, isGroup, participants } = myProfile ? user : currentDialog;
        const name = first_name ? `${first_name} ${last_name}` : phone_number;
        console.log(participants)
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
                {isGroup ?
                    <StyledScrollView>
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
                            <GroupIconGrey />
                            <ParticipantsText>Участники</ParticipantsText>
                        </Participants>
                        <FlatList
                            style={{ paddingRight: 5, paddingLeft: 5, }}
                            data={participants}
                            renderItem={({ item, index }) => {
                                const { _id, first_name, last_name, post, role, image } = item
                                console.log({item})
                                return (
                                    <BoxInnerItem>
                                        <ContactImage source={{ uri: `http://ser.univ.team${image}` }} />
                                        <ContactInfo>
                                            <ContactName>{first_name ? `${first_name} ${last_name}` : phone_number}</ContactName>
                                            {role && role[0] && <ContactRole>{role[0]}</ContactRole>}
                                        </ContactInfo>
                                    </BoxInnerItem>
                                )
                            }}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </StyledScrollView> :
                    <StyledScrollView>
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
                    </StyledScrollView>}

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
            { type: 'Должность', value: role ? role.length ? role[0] : 'без должности' : 'без должности', isGroup: false },
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
