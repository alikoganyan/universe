import React, { Component } from 'react'
import { View, Text, Image, Dimensions, TouchableOpacity } from 'react-native'
import { TaskIcon, GroupIcon, FilesRedIcon } from '../../assets/index'
import { Button } from '../../common';
import { setRoom } from '../../actions/messageActions'
import styled from 'styled-components'
import FloatingLabel from 'react-native-floating-labels'
import helper from '../../utils/helpers'
import { connect } from 'react-redux'
import { ImagePicker } from 'expo';
const { Colors, HeaderHeightNumber, fontSize } = helper;
const { grey2, blue } = Colors;
const Wrapper = styled(View)`
    padding-top: 30px;
    background: white;
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
    margin: 0 10px 0px;

`
const UserInfo = styled(View)`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 90%;
    
`
const InputBox = styled(View)`
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: center;
    height: 60px;
`
const InputLabel = styled(Text)`
    flex: 1;
    text-align: right;
    color: ${grey2};
    z-index: 20;
    margin-bottom: 15px;
    font-size: ${fontSize.sm};
    margin-right: 15px;
`
const Bottom = styled(View)`
    margin-top: 30px;
    margin-bottom: ${HeaderHeightNumber}px;
    width: 60%;
    display: flex;
    align-self: center;
    justify-content: center;
    background: white;
`
const ButtonText = styled(Text)`
    font-size: ${fontSize.text};
`
const Input = (props) => {
    const { style, value, children, onChange } = props;
    return <FloatingLabel
        labelStyle={{ fontSize: 13 }}
        inputStyle={{
            fontSize: 15,
            borderWidth: 0,
            borderBottomWidth: 1,
            display: 'flex',
            flex: 1,
        }}
        value={value}
        style={{ flex: 2, width: "50%", ...style }}
        multiline={false}
        onChange={onChange}
    >{children}</FloatingLabel>
}
class Content extends Component {

    render() {
        const { user } = this.state;
        const { firstName, lastName, patronymic, email } = user || {};
        return (
            <Wrapper>
                <User >
                    <TouchableOpacity onPress={(this.selectImage)}>
                        <UserImage source={{ uri: 'https://facebook.github.io/react/logo-og.png' }} />
                    </TouchableOpacity>
                    <UserInfo>
                        <InputBox key={0}>
                            <InputLabel numberOfLines={1} >Фамилия</InputLabel>
                            <Input value={lastName} onChange={(e) => this.handleChange(e, "lastName")}>Фамилия</Input>
                        </InputBox>
                        <InputBox key={1}>
                            <InputLabel numberOfLines={1}>Имя</InputLabel>
                            <Input value={firstName} onChange={(e) => this.handleChange(e, "firstName")}>Имя</Input>
                        </InputBox>
                        <InputBox key={2}>
                            <InputLabel numberOfLines={1}>Отчество</InputLabel>
                            <Input value={patronymic} onChange={(e) => this.handleChange(e, "patronymic")}>Отчество</Input>
                        </InputBox>
                        <InputBox key={3}>
                            <InputLabel numberOfLines={1}>Email</InputLabel>
                            <Input value={email} onChange={(e) => this.handleChange(e, "email")}>Email</Input>
                        </InputBox>
                        <InputBox key={4}>
                            <InputLabel numberOfLines={1}>Пароль</InputLabel>
                            <Input onChange={(e) => this.handleChange(e, "password")}>Пароль</Input>
                        </InputBox>
                        <InputBox key={5}>
                            <InputLabel numberOfLines={1}>Повторите пароль</InputLabel>
                            <Input onChange={(e) => this.handleChange(e, "repassword")}>Повторите пароль</Input>
                        </InputBox>
                    </UserInfo>
                </User>
                <Bottom>
                    <Button style={{ backgroundColor: blue }} color={'#fff'} onPress={this.apply}>
                        <ButtonText>Сохранить изменения</ButtonText>
                    </Button>
                </Bottom>
            </Wrapper >

        )
    }
    state = {
        user: {
            password: '',
            repassword: '',
        },
        status: 'В сети',
        UserData: [
            { type: 'Подразделение', value: 'Стандартный' },
            { type: 'Должность', value: 'Главный инженер' },
            { type: 'Личный', value: '+7(395)282-48-57' },
            { type: 'Задачи', value: '4', icon: <TaskIcon /> },
            { type: 'Общих групп', value: '32', icon: <GroupIcon /> },
            { type: 'Общих файлов', value: '10', icon: <FilesRedIcon /> },
        ]
    }
    componentDidMount() {
        const { user } = this.props;
        this.setState({ user: { ...this.state.user, ...user } })
    }
    selectImage = async (e) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: false,
        });
        console.log({result})
    }
    handleChange = (e, unit) => {
        const { user } = this.state;
        const newUser = { ...user };
        newUser[unit] = e.nativeEvent.text
        this.setState({ user: newUser })
    }
    toChat = () => {
        const { toChat, setRoom, user } = this.props
        const { id } = user
        // socket.emit('select chat', { chatId: id, userId: id })
        setRoom(id)
        toChat()
    }
    apply = () => {
        const { user } = this.state
        // socket.emit('edit user', { ...this.props.user, user })
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
    getMessages: _ => dispatch(getMessages(_)),
    setRoom: _ => dispatch(setRoom(_)),
    setDialogs: _ => dispatch(setDialogs(_)),
    addMessage: _ => dispatch(addMessage(_))
})
export default connect(mapStateToProps, mapDispatchToProps)(Content)
