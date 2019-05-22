import React, { Component } from 'react'
import { View, Text, SafeAreaView, FlatList, Image, TouchableOpacity, ScrollView, Dimensions, KeyboardAvoidingView } from 'react-native'
import { BackIcon, EllipsisVIcon, ArrowDownIcon } from '../../assets/index'
import styled from 'styled-components'
import FloatingLabel from 'react-native-floating-labels'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import helper from '../../utils/helpers'
import { ImageComponent } from '../../common'
import posed, { Transition } from 'react-native-pose';
import Collapsible from 'react-native-collapsible';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import { connect } from 'react-redux'
import { socket } from '../../utils/socket'
import sendRequest from '../../utils/request'
import { g_users } from '../../constants/api'
import { setContacts, setAllUsers } from '../../actions/userActions'
import { getMessages, setRoom, addMessage, setCurrentChat } from '../../actions/messageActions'
import { setDialogs, setCurrentDialogs } from '../../actions/dialogsActions'
const { Colors, sidePadding, sidePaddingNumber } = helper;
const { green, black } = Colors;
const AnimatedScrollView = posed.View({
    left: {
        x: 0,
        transition: { duration: 300, ease: 'easeOut' }
    },
    center: {
        x: -Dimensions.get('window').width,
        transition: { duration: 300, ease: 'easeOut' },
    },


    right: {
        x: -Dimensions.get('window').width * 2,
        transition: { duration: 300, ease: 'easeOut' }
    },

})
const Animated = styled(AnimatedScrollView)`
    display: flex;
    flex-direction: row;
    width: ${Dimensions.get('window').width * 3};
`
const AnimatedBox = posed.View({
    visible: { flex: 1 },
    hidden: { flex: 0 }
});
const AnimatedArrowWrapper = posed.View({
    down: { rotate: "0deg", },
    right: { rotate: "-90deg", }
});
const Wrapper = styled(View)`
    padding: 0 ${sidePadding};
    background: white;
    margin-bottom: 40px;
    
`
const ContactList = styled(ScrollView)`
    padding: 20px;
    padding-bottom: 10px;
    max-width: ${Dimensions.get('window').width - sidePaddingNumber * 2}px;
    overflow: hidden;
    margin-left: ${sidePaddingNumber}px;
    flex: 1;
`
const Box = styled(View)`
    padding-top: 20px;
    border: 1px solid #E8EBEE;
    border-width: 0;
    border-top-width: 1px;
    border-bottom-width: ${({ last }) => last ? 1 : 0}px;
`
const BoxTitle = styled(TouchableOpacity)`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
`
const BoxInner = styled(AnimatedBox)`
    padding-bottom: 20px;
    border: 1px solid #E8EBEE;
    border-width: 0;
    border-top-width: 1px;
    border-bottom-width: ${({ last }) => last ? 1 : 0}px;
`
const BoxItem = styled(Text)`
    padding-bottom: ${({ title }) => title ? 20 : 0}px;
    color: #A7B0BA;
    flex: 1;
`
const BoxInnerItem = styled(TouchableOpacity)`
    padding: 20px 5px;
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
const ContactInfo = styled(View)``
const ContactName = styled(Text)``
const ContactRole = styled(Text)`
    color: #A7B0BA;

`
const ArrowWrapper = styled(AnimatedArrowWrapper)`
    
`
const Options = styled(View)`
    display: flex;
    align-self: center;
    background: ${green};
    flex-direction: row;
    justify-content: space-between;
    border-radius: 14;
    padding: 1px;
    overflow: hidden;
    width: 90%;
`
const Option = styled(Text)`
    color: ${({ active }) => active ? black : 'white'};
    background: ${({ active }) => active ? 'white' : 'transparent'};
    border: ${({ active }) => active ? '1px rgba(0, 0, 0, 0.1) solid' : '0'};
    border-color: ${({ active }) => active ? 'rgba(0, 0, 0, 0.1)' : 'transparent'};
    border-style: solid;
    min-width: 27%;
    border-radius: 13;
    padding: 4px 10px 3px;
    overflow: hidden;
    text-align: center;
`
const Group = styled(BoxInnerItem)`
    justify-content: flex-start;
    flex: 1;
    padding-left: 0;
    padding-right: 0;
`
const GroupInfo = styled(ContactInfo)`
    flex: 1;
`
const GroupTitle = styled(ContactName)``
const GroupParticipants = styled(ContactRole)``
const GroupImage = styled(ContactImage)``
class Content extends Component {
    render() {
        const { allUsers, users, collapsed, options, groups } = this.state;
        const { contacts, user, dialogs } = this.props;
        const { department } = users;
        const { active } = options;
        return (
            <SafeAreaView>
                <Wrapper>
                    <KeyboardAwareScrollView enableOnAndroid>
                        <GestureRecognizer
                            onSwipeLeft={this.optionLeft}
                            onSwipeRight={this.optionRight}
                        >
                            <Options>
                                {options.options.map((e, i) => <TouchableOpacity key={i} onPress={() => this.selectOption(i)}>
                                    <Option active={active % 3 === i}>{e}</Option>
                                </TouchableOpacity>)
                                }
                            </Options>
                            <Animated pose={active === 0 ? 'left' : (active === 1 ? 'center' : 'right')}>
                                <ContactList style={{ width: '100%' }}>
                                    <FlatList
                                        style={{ paddingRight: 5, paddingLeft: 5, }}
                                        data={dialogs}
                                        renderItem={({ item, index }) => {
                                            const { participants, creator, _id, name, isGroup } = item
                                            const chatItem = creator._id === user._id ? participants[0] : creator
                                            const { first_name, last_name, phone_number, role, image } = chatItem
                                            const chatName = isGroup ?
                                                name :
                                                first_name ? `${first_name} ${last_name}` : phone_number
                                            return item ? <BoxInnerItem key={index} onPress={() => this.toChat(_id)}>
                                                <ContactImage source={{ uri: `http://ser.univ.team${image || creator.image}` }} />
                                                <ContactInfo>
                                                    <ContactName>{chatName}</ContactName>
                                                    <ContactRole>{isGroup ? `${participants.length + 1} участника` : role && role[0] || 'без роли'}</ContactRole>
                                                </ContactInfo>
                                            </BoxInnerItem> : null
                                        }}
                                        keyExtractor={(item, index) => index.toString()}
                                    />
                                </ContactList>
                                <ContactList>
                                    {department.map((e, i) => (
                                        <Box key={i} last={i === department.length - 1}>
                                            <BoxTitle onPress={() => collapsed[i] ? this.collapseDepartment(i) : this.showDepartment(i)}>
                                                <BoxItem numberOfLines={1} title={true}>{e.title}</BoxItem>
                                                <ArrowWrapper pose={collapsed[i] ? 'right' : 'down'}>
                                                    <ArrowDownIcon />
                                                </ArrowWrapper>
                                            </BoxTitle>
                                            <Collapsible collapsed={collapsed[i] || false}>
                                                <BoxInner>
                                                    {dialogs.map((e, i) => {
                                                        const { creator, participants, isGroup } = e
                                                        let item = creator._id === user._id ? participants[0] : creator
                                                        const { image, first_name, last_name, phone_number, post } = item
                                                        const name = first_name ? `${first_name} ${last_name}` : phone_number
                                                        return !isGroup && <BoxInnerItem key={i} onPress={() => this.toChat(e)}>
                                                            <ContactImage source={{ uri: `http://ser.univ.team${image}` }} />
                                                            <ContactInfo>
                                                                <ContactName>{name}</ContactName>
                                                                <ContactRole>{'без роли'}</ContactRole>
                                                            </ContactInfo>
                                                        </BoxInnerItem>
                                                    })}
                                                </BoxInner>
                                            </Collapsible>
                                        </Box>
                                    ))}
                                </ContactList>
                                <ContactList style={{ width: '100%' }}>
                                    <FlatList
                                        style={{ paddingRight: 5, paddingLeft: 5, }}
                                        data={dialogs}
                                        renderItem={({ item, index }) => {
                                            const { participants, creator, _id, name, isGroup } = item
                                            const chatItem = creator._id === user._id ? participants[0] : creator
                                            const { first_name, last_name, phone_number, role, image } = chatItem
                                            return isGroup ? <BoxInnerItem key={index} onPress={() => this.toChat(_id)}>
                                                <ContactImage source={{ uri: `http://ser.univ.team${image || creator.image}` }} />
                                                <ContactInfo>
                                                    <ContactName>{name}</ContactName>
                                                    <ContactRole>{participants.length + 1} участника</ContactRole>
                                                </ContactInfo>
                                            </BoxInnerItem> : null
                                        }}
                                        keyExtractor={(item, index) => index.toString()}
                                    />
                                </ContactList>
                            </Animated>
                        </GestureRecognizer>
                    </KeyboardAwareScrollView>
                </Wrapper>
            </SafeAreaView>
        )
    }
    state = {
        collapsed: [],
        users: {
            department: [
                {
                    title: 'Отдел длинных корпоративных названий',
                    workers: [
                        { name: "Noah", role: 'менеджер по продажам', uri: 'https://facebook.github.io/react/logo-og.png' },
                    ],
                },
            ],
        },
        options: {
            active: 1,
            options: [
                'Все',
                'Пользователи',
                'Группы'
            ]
        },
        groups: [
            { title: 'длинное корпоративное название группы', participants: 15 },
        ],
        allUsers: [
            { name: 'Константин Константинопольский', uri: 'https://facebook.github.io/react/logo-og.png' },
        ]
    }
    componentDidMount() {
        const { user, users, setContacts, dialogs } = this.props;
        const newCollapsed = [...this.state.collapsed]
        for (let i = 0; i <= this.state.users.department.length; i++) {
            newCollapsed.push(false)
        }
        sendRequest({
            r_path: g_users,
            method: 'get',
            success: (res) => {
                setContacts(res.users)
            },
            failFunc: (err) => {
                console.log(err)
            }
        })
        this.setState({ collapsed: newCollapsed })
    }
    optionLeft = () => {
        const newState = { ...this.state.options }
        const length = this.state.options.options.length
        newState.active = this.state.options.active < length - 1 ? this.state.options.active + 1 : 0;
        this.setState({ options: newState })
    }
    optionRight = () => {
        const newState = { ...this.state.options }
        const length = this.state.options.options.length
        newState.active = this.state.options.active > 0 ? this.state.options.active - 1 : length - 1;
        this.setState({ options: newState })
    }
    collapseDepartment = (i) => {
        const newDCollapsed = [...this.state.collapsed]
        newDCollapsed[i] = false;
        this.setState({ collapsed: newDCollapsed })
    }
    showDepartment = (i) => {
        const newDCollapsed = [...this.state.collapsed]
        newDCollapsed[i] = true;
        this.setState({ collapsed: newDCollapsed })
    }
    selectOption = (e) => {
        const newState = { ...this.state.options }
        newState.active = e;
        this.setState({ options: newState })
    }
    toChat = e => {
        const { setCurrentDialogs, navigate, user, getMessages } = this.props
        const { creator, participants, isGroup } = e
        let item = creator._id === user._id ? participants[0] : creator
        const { image, first_name, last_name, phone_number, post } = item
        console.log(e)
        getMessages(e.messages)
        setCurrentDialogs({ ...e, ...item })
        navigate('Chat')
    }
}

const mapStateToProps = state => ({
    messages: state.messageReducer,
    dialogs: state.dialogsReducer.dialogs,
    currentRoom: state.messageReducer.currentRoom,
    user: state.userReducer.user,
    users: state.userReducer,
    contacts: state.userReducer.contacts,
})
const mapDispatchToProps = dispatch => ({
    getMessages: _ => dispatch(getMessages(_)),
    setRoom: _ => dispatch(setRoom(_)),
    setDialogs: _ => dispatch(setDialogs(_)),
    addMessage: _ => dispatch(addMessage(_)),
    setAllUsers: _ => dispatch(setAllUsers(_)),
    setContacts: _ => dispatch(setContacts(_)),
    setCurrentChat: _ => dispatch(setCurrentChat(_)),
    setCurrentDialogs: _ => dispatch(setCurrentDialogs(_)),

})
export default connect(mapStateToProps, mapDispatchToProps)(Content)
