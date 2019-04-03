import React, { Component } from 'react'
import { View, Text, SafeAreaView, FlatList, TouchableOpacity } from 'react-native'
import { BackIcon, EllipsisVIcon, MessageIndicatorIcon } from '../../assets/index'
import styled from 'styled-components'
import SwitchToggle from 'react-native-switch-toggle';
import helper from '../../Helper/helper'
import { connect } from 'react-redux'
const { Colors, sidePaddingNumber, fontSize, socket } = helper;
const { lightGrey1, blue, lightBlue, grey2 } = Colors;
const Wrapper = styled(View)`
    padding-top: 0px;
    background: white;
    margin-bottom: 110px;
    padding: 0 ${sidePaddingNumber}px;
    
`
const Box = styled(View)`
    display: flex;
    flex-direction: row;
    width: 100%;
    align-self: center;
    padding: 20px 0;
    border: 1px solid ${lightGrey1};
    border-width: 0;
    border-top-width: 1px;
    border-bottom-width: ${({ last }) => last ? '1px' : 0};
`
const Label = styled(Text)`
    flex: 2;
    color: ${grey2};
    font-size: ${fontSize.sm};
    margin-right: 5px;
`
const Status = styled(Text)`
    flex: 3;
    font-size: ${fontSize.text};
`
const Option = styled(View)`
    flex: 2;
    display: flex;
    align-items: flex-end;
    font-size: ${fontSize.text};
`
const Link = styled(Text)`
    font-size: ${fontSize.text};
    color: ${blue};
`
const Policy = styled(View)``
const PolicyLink = styled(Link)`
    padding: 10px 0 20px;
`
const Toggle = (props) => {
    const { switchOn, onPress } = props;
    return <SwitchToggle
        containerStyle={{
            width: 34,
            height: 14,
            borderRadius: 20,
            padding: 0.1
        }}
        circleStyle={{
            width: 20,
            height: 20,
            borderRadius: 12,
            elevation: 3,
            backgroundColor: '#fff', // rgb(102,134,205)
        }}
        circleColorOn={blue}
        circleColorOff='#fff'
        backgroundColorOn={lightBlue}
        backgroundColorOff={lightGrey1}
        switchOn={switchOn}
        onPress={onPress}
    />
}
class Content extends Component {
    render() {
        const { settings, switchOn } = this.state;
        const { user } = this.props;
        const { sound, language, notifications, contacts } = user;
        return (
            <SafeAreaView>
                <Wrapper>
                    <FlatList
                        style={{ paddingRight: 5, paddingLeft: 5, marginBottom: 10 }}
                        ListHeaderComponent={<View style={{ margin: 10, }} />}
                        data={settings}
                        scrollEnabled={false}
                        renderItem={({ item, index }) => <Box key={index} last={index === settings.length - 1}>
                            <Label>{item.label}</Label>
                            <Status>{item.status}</Status>
                            <Option>
                                {item.option.type === 'toggle' && <Toggle
                                    onPress={() => this.handleToggle(item.label)}
                                    switchOn={item.option.value}
                                />}
                                {item.option.type === 'link' && <TouchableOpacity>
                                    <Link>{item.option.value}</Link>
                                </TouchableOpacity>}
                            </Option>
                        </Box>
                        }
                        keyExtractor={(item, index) => index.toString()}
                    />
                    <Policy>
                        <PolicyLink>Соглашение об использовании персональных данных</PolicyLink>
                        <PolicyLink>Политика соглашения</PolicyLink>
                        <PolicyLink>Условия использования</PolicyLink>
                    </Policy>
                </Wrapper>
            </SafeAreaView>
        )
    }
    state = {
        switchOn: true,
        langs: [
            'Английский',
            'Русский'
        ],
        settings: [
            { item: 'language', label: 'язык', status: 'Русский', option: { type: 'link', value: 'изменить' } },
            { item: 'notifications', label: 'уведомления', status: 'Включены', option: { type: 'toggle', value: 1 } },
            { item: 'sound', label: 'звук', status: 'Включен', option: { type: 'toggle', value: 0 } },
            { item: 'contacts', label: 'контакты', status: 'По подразделениям', option: { type: 'toggle', value: 0 } },
        ]
    }
    componentDidMount() {
        const { settings, langs } = this.state
        const { user } = this.props
        console.log(user.language, user.notifications, user.sound, user.contacts)
        const newSettings = [...settings]
        newSettings.map(e => {
            if (e.item === 'language') {
                e.option.value = 'Изменить'
                e.status = langs[user[e.item]]
            }
            else
                e.option.value = user[e.item]
        })
        setTimeout(() => {

            this.setState({ settings: newSettings })
        }, 0)
    }
    handleToggle = (e) => {
        const { settings } = this.state;
        const newSettings = [...settings]
        newSettings.filter(({ label }) => e === label)[0].option.value = !newSettings.filter(({ label }) => e === label)[0].option.value;
        this.setState({ settings: newSettings })
    }
    componentWillUnmount() {
        const { settings } = this.state;
        const { user } = this.props;
        const setting = []
        settings.map(e => {
            setting.push({ item: e.item, value: !!e.option.value })
        })
        socket.emit('change settings', { setting, id: user.id })
        socket.emit('update user', { id: user.id })
    }
}

const mapStateToProps = state => {
    return {
        messages: state.messageReducer,
        dialog: state.dialogsReducer.dialogs,
        currentRoom: state.messageReducer.currentRoom,
        currentChat: state.messageReducer.currentChat,
        user: state.userReducer.user.user,
    };
};
const mapDispatchToProps = dispatch => ({
    getMessages: _ => dispatch(getMessages(_)),
    setRoom: _ => dispatch(setRoom(_)),
    setDialogs: _ => dispatch(setDialogs(_)),
    addMessage: _ => dispatch(addMessage(_))
})
export default connect(mapStateToProps, mapDispatchToProps)(Content)
