import React, { Component } from 'react'
import { View, Text, SafeAreaView, FlatList, TouchableOpacity, Dimensions } from 'react-native'
import { BackIcon, EllipsisVIcon, MessageIndicatorIcon } from '../../assets/index'
import styled from 'styled-components'
import SwitchToggle from 'react-native-switch-toggle';
import helper from '../../utils/helpers'
import posed from 'react-native-pose'
import { connect } from 'react-redux'
import { socket } from '../../utils/socket'
import sendRequest from '../../utils/request'
import { p_settings } from '../../constants/api'
import { setSettings } from '../../actions/userActions'
const { Colors, sidePadding, fontSize, borderRadius, HeaderHeight } = helper;
const { lightGrey1, blue, lightBlue, grey2 } = Colors;
const LangPickerPosed = posed.View({
    visible: { bottom: 170 },
    hidden: { bottom: -Dimensions.get('window').height }
});
const Wrapper = styled(View)`
    padding-top: 0px;
    background: white;
    margin-bottom: 110px;
    padding: 0 ${sidePadding}px;
    height: 100%;
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
const Policy = styled(View)`
    margin-top: 5%;
`
const PolicyLink = styled(Link)`
    padding: 10px 0 20px;
`

const LangPicker = styled(LangPickerPosed)`
    background: white;
    width: 94%;
    bottom: 0;
    height: ${Dimensions.get('window').height * 0.3}px;
    position: absolute;
    margin: 0 3%;
    padding: 1% 7%;
    border-radius: ${borderRadius};
    display: flex;
    justify-content: space-around;
    align-items: flex-start;
    align-self: center;
    z-index: 4;
`
const Shadow = styled(TouchableOpacity)`
    position: absolute;
    width: ${Dimensions.get('window').width};
    height: ${Dimensions.get('window').height};
    background: rgba(5,5,5,.3);
    top: -${HeaderHeight};
    z-index: 2;
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
        const { settings, switchOn, pickerOpened, langs } = this.state;
        const { user } = this.props;
        const { sound, language, notifications, contacts } = user;
        return (
            <SafeAreaView>
                <Wrapper>
                    {pickerOpened && <Shadow activeOpacity={1} onPress={this.pickerClose}></Shadow>}
                    <FlatList
                        style={{ paddingRight: 5, paddingLeft: 5, marginBottom: 10 }}
                        ListHeaderComponent={<View style={{ margin: 10, }} />}
                        data={settings}
                        scrollEnabled={false}
                        renderItem={({ item, index }) => {
                            // console.log(index, item)
                            return <Box key={index} last={index === settings.length - 1}>
                                <Label>{item.label}</Label>
                                <Status>{item.status || item.language}</Status>
                                <Option>
                                    {item.option.type === 'toggle' && <Toggle
                                        onPress={() => this.handleToggle(item.label)}
                                        switchOn={!!item.option.value}
                                    />}
                                    {item.option.type === 'link' && <TouchableOpacity onPress={this.selectOption}>
                                        <Link>{item.option.value}</Link>
                                    </TouchableOpacity>}
                                </Option>
                            </Box>
                        }
                        }
                        keyExtractor={(item, index) => index.toString()}
                    />
                    <Policy>
                        <PolicyLink>Соглашение об использовании персональных данных</PolicyLink>
                        <PolicyLink>Политика соглашения</PolicyLink>
                        <PolicyLink>Условия использования</PolicyLink>
                    </Policy>
                    <LangPicker pose={pickerOpened ? 'visible' : 'hidden'}>
                        {Object.values(langs).map((e, i) => <TouchableOpacity key={i}><Text style={{ color: i === 0 ? blue : 'black' }}>{e}</Text></TouchableOpacity>)}
                        <TouchableOpacity onPress={this.pickerClose}><Text>Отменить</Text></TouchableOpacity>
                    </LangPicker>
                </Wrapper>
            </SafeAreaView>
        )
    }
    state = {
        switchOn: true,
        langs: {
            ru: 'Русский',
            en: 'English',
            'Русский': 'Русский',
            'English': 'English',
        },
        pickerOpened: false,
        settings: [
            { item: 'language', label: 'Язык', status: 'Русский', option: { type: 'link', value: 'изменить' } },
            { item: 'notifications', label: 'Уведомления', status: 'Включены', option: { type: 'toggle', value: 1 } },
            { item: 'sound', label: 'Звук', status: 'Включен', option: { type: 'toggle', value: 0 } },
            { item: 'partition_contacts', label: 'Контакты', status: 'По подразделениям', option: { type: 'toggle', value: 0 } },
        ]
    }
    componentDidMount() {
        const { settings, langs } = this.state
        const { user } = this.props
        const newSettings = [...settings]
        newSettings.map(e => {
            if (e.item === 'language') {
                e.option.value = 'Изменить'
                e.status = langs[user.settings[e.item]]
                console.log(user.settings[e.item])
            }
            else
                e.option.value = user.settings[e.item]
        })
        setTimeout(() => {

            this.setState({ settings: newSettings })
        }, 0)
    }
    pickerClose = (e) => {
        this.setState({ pickerOpened: false })
    }
    handleToggle = (e) => {
        const { settings } = this.state;
        const newSettings = [...settings]
        newSettings.filter(({ label }) => e === label)[0].option.value = !newSettings.filter(({ label }) => e === label)[0].option.value;
        this.setState({ settings: newSettings })
    }
    selectOption = (e) => {
        this.setState({ pickerOpened: true })
    }
    componentWillUnmount() {
        const { settings } = this.state;
        const { user } = this.props;
        const userSettings = user.settings
        const reqBody = {
            language: '',
            notifications: '',
            sound: '',
            partition_contacts: '',
        }
        settings.map(e => reqBody[e.item] = e.item === 'language' ? e.status : e.option.value)
        reqBody.language = 'ru'
        JSON.stringify(reqBody) !== JSON.stringify(userSettings) && sendRequest({
            r_path: p_settings,
            method: 'patch',
            attr: {
                settings: reqBody,
            },
            success: (res) => {
                console.log({ res })
                setSettings(reqBody)
            },
            failFunc: (err) => {
                console.log({ err })
            }
        })
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
    setDialogs: _ => dispatch(setDialogs(_)),
    addMessage: _ => dispatch(addMessage(_)),
    setSettings: _ => dispatch(setSettings(_))
})
export default connect(mapStateToProps, mapDispatchToProps)(Content)
