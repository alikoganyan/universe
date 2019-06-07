import React, { Component } from 'react'
import { View, Text, Image, Dimensions, TouchableOpacity, TextInput } from 'react-native'
import { TaskIcon, GroupIcon, FilesRedIcon } from '../../assets/index'
import Button from '../../common/Button';
import { setRoom } from '../../actions/messageActions'
import { alterUser, setUser } from '../../actions/userActions'
import styled from 'styled-components'
import FloatingLabel from 'react-native-floating-labels'
import helper from '../../utils/helpers'
import { connect } from 'react-redux'
import { ImagePicker, Permissions } from 'expo';
import { socket } from '../../utils/socket'
import { p_profile, p_profile_avatar } from '../../constants/api'
import sendRequest from '../../utils/request'
import DefaultAvatar from '../../common/DefaultAvatar'
const { Colors, HeaderHeight, fontSize } = helper;
const { grey2, blue, lightGrey1 } = Colors;
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
    height: 40px;
    margin-bottom: ${({ err }) => err ? 0 : 28};
`
const InputLabel = styled(Text)`
    flex: 1;
    text-align: right;
    color: ${grey2};
    z-index: 20;
    margin-bottom: 10px;
    font-size: ${fontSize.sl};
    margin-right: 15px;
`
const Bottom = styled(View)`
    margin-top: 30px;
    margin-bottom: ${HeaderHeight}px;
    width: 60%;
    display: flex;
    align-self: center;
    justify-content: center;
    background: white;
`
const ButtonText = styled(Text)`
    font-size: ${fontSize.text};
    text-align: center;
    display: flex;
    align-self: center;
    justify-content: center;
`
const StyledInput = styled(TextInput)`
    flex: 2;
    width: 50%;
    border: 0.3px solid ${lightGrey1};
    border-width: 0;
    border-bottom-width: 0.3px;
    padding-bottom: 10px;
    font-size: ${fontSize.sl};
`
const Error = styled(View)`
    width: 100%;
    display: flex;
    align-items: center;
    margin-top: 8px;
    margin-bottom: 8px;
`
const ErrorText = styled(Text)`
    font-size: ${fontSize.sm};
    text-align: center;
`
const Input = (props) => {
    const { style, value, children, onChange, pass, keyboardType } = props;
    return <StyledInput
        value={value}
        style={{ ...style }}
        multiline={false}
        onChange={onChange}
        placeholder={children}
        secureTextEntry={pass}
        placeholderTextColor={lightGrey1}
        keyboardType={keyboardType}
    />
}
class Content extends Component {

    render() {
        const { user, permissionError, lastNameError, firstNameError, middleNameError, emailError, passwordError, repasswordError } = this.state;
        const { first_name, last_name, middle_name, email, image } = user || {};
        console.log(image)
        return (
            <Wrapper>
                <User>
                    <TouchableOpacity onPress={(this.selectImage)}>
                        {
                            image === '/images/default_group.png' || image === '/images/default_avatar.jpg' ?
                                <DefaultAvatar size={80} /> :
                                <UserImage source={{ uri: `http://ser.univ.team${image}` }} />
                        }
                    </TouchableOpacity>
                    <UserInfo>
                        <InputBox key={0} err={!!lastNameError}>
                            <InputLabel numberOfLines={1} >Фамилия</InputLabel>
                            <Input value={last_name} onChange={(e) => this.handleChange(e, "last_name")} />
                        </InputBox>
                        {!!lastNameError && <Error>
                            <ErrorText>{lastNameError}</ErrorText>
                        </Error>}
                        <InputBox key={1} err={!!firstNameError}>
                            <InputLabel numberOfLines={1}>Имя</InputLabel>
                            <Input value={first_name} onChange={(e) => this.handleChange(e, "first_name")} />
                        </InputBox>
                        {!!firstNameError && <Error>
                            <ErrorText>{firstNameError}</ErrorText>
                        </Error>}
                        <InputBox key={2} err={!!middleNameError}>
                            <InputLabel numberOfLines={1}>Отчество</InputLabel>
                            <Input value={middle_name} onChange={(e) => this.handleChange(e, "middle_name")} />
                        </InputBox>
                        {!!middleNameError && <Error>
                            <ErrorText>{middleNameError}</ErrorText>
                        </Error>}
                        <InputBox key={3} err={!!emailError}>
                            <InputLabel numberOfLines={1}>Email</InputLabel>
                            <Input value={email} keyboardType={'email-address'} onChange={(e) => this.handleChange(e, "email")}>example@gmail.com</Input>
                        </InputBox>
                        {!!emailError && <Error>
                            <ErrorText>{emailError}</ErrorText>
                        </Error>}
                        <InputBox key={4} err={!!passwordError}>
                            <InputLabel numberOfLines={1}>Пароль</InputLabel>
                            <Input pass={true} onChange={(e) => this.handleChange(e, "password")} />
                        </InputBox>
                        {!!passwordError && <Error>
                            <ErrorText>{passwordError}</ErrorText>
                        </Error>}
                        <InputBox key={5} err={!!repasswordError}>
                            <InputLabel numberOfLines={2}>Повторите пароль</InputLabel>
                            <Input pass={true} onChange={(e) => this.handleChange(e, "repassword")} />
                        </InputBox>
                        {!!repasswordError && <Error>
                            <ErrorText>{repasswordError}</ErrorText>
                        </Error>}
                    </UserInfo>
                </User>
                <Bottom>
                    <Button style={{ backgroundColor: blue, flex: 1 }} color={'#fff'} onPress={this.apply}>
                        <ButtonText>Сохранить изменения</ButtonText>
                    </Button>
                </Bottom>
            </Wrapper >

        )
    }
    state = {
        lastNameError: false,
        firstNameError: false,
        middleNameError: false,
        emailError: false,
        passwordError: false,
        repasswordError: false,
        user: {
            email: '',
            first_name: '',
            middle_name: '',
            last_name: '',
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
        this.setState({ user: { ...this.state.user, ...user, password: '' } })
        // setInterval(() => this.setState({
        //     lastNameError: !this.state.lastNameError,
        //     firstNameError: !this.state.firstNameError,
        //     middleNameError: !this.state.middleNameError,
        //     emailError: !this.state.emailError,
        //     passwordError: !this.state.passwordError,
        //     repasswordError: !this.state.repasswordError
        // }), 2000)
    }
    selectImage = async (e) => {
        const { user, setUser } = this.props
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status !== 'granted') {
            alert('no camera roll permission')
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: false,
        });
        const { uri, type } = result
        const ext = uri.split('.')[uri.split('.').length - 1]
        const form = new FormData();
        const fileName = Math.random().toString(36).substring(7);
        form.append("file", {
            uri,
            name: `photo.${fileName}.${ext}`,
            type: `image/${type}`,
        })
        if (!result.cancelled) {
            sendRequest({
                r_path: p_profile_avatar,
                method: 'post',
                attr: form,
                // config: {
                //     headers: {
                //         'Content-Type': 'multipart/form-data'
                //     }
                // },
                success: (res) => {
                    const newUser = { ...user };
                    newUser.image = res.newImage
                    setUser(newUser)
                    this.setState({ user: newUser })
                },
                failFunc: (err) => {
                    console.log({ err })
                }
            })
        }
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
        socket.emit('select chat', { chatId: id, userId: id })
        setRoom(id)
        toChat()
    }
    apply = () => {
        const { user } = this.state
        const { back, alterUser } = this.props
        const userRedux = this.props.user
        const { first_name, last_name, middle_name, email, password, repassword } = user
        this.setState({
            lastNameError: !last_name ? 'Не менее 2х символов' : '',
            firstNameError: !first_name ? 'Не менее 2х символов' : '',
            middleNameError: !middle_name ? 'Не менее 2х символов' : '',
            emailError: !email ? 'Email не валиден' : '',
        })
        if (first_name && last_name && middle_name && email) {
            sendRequest({
                r_path: p_profile,
                method: 'patch',
                attr: {
                    user: {
                        email: email || userRedux.email,
                        first_name: first_name || userRedux.firstName,
                        middle_name: middle_name || userRedux.patronymic,
                        last_name: last_name || userRedux.lastName,
                        new_password: password || userRedux.password,
                        repeat_password: repassword || userRedux.repassword,
                    }
                },
                success: (res) => {
                    alterUser({
                        email: email || userRedux.email,
                        first_name: first_name || userRedux.firstName,
                        middle_name: middle_name || userRedux.patronymic,
                        last_name: last_name || userRedux.lastName,
                    })
                    back()
                },
                failFunc: (err) => {
                    console.log('pa_profile', { err })
                }
            })
        }

    }
}

const mapStateToProps = state => ({
    messages: state.messageReducer,
    dialog: state.dialogsReducer.dialogs,
    currentRoom: state.messageReducer.currentRoom,
    currentChat: state.messageReducer.currentChat,
    user: state.userReducer.user,
})
const mapDispatchToProps = dispatch => ({
    getMessages: _ => dispatch(getMessages(_)),
    setRoom: _ => dispatch(setRoom(_)),
    setUser: _ => dispatch(setUser(_)),
    setDialogs: _ => dispatch(setDialogs(_)),
    addMessage: _ => dispatch(addMessage(_)),
    alterUser: _ => dispatch(alterUser(_))
})
export default connect(mapStateToProps, mapDispatchToProps)(Content)
