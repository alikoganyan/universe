import React, { Component } from 'react'
import { View, Text, SafeAreaView, FlatList, Image, TouchableOpacity, ScrollView, Dimensions, KeyboardAvoidingView } from 'react-native'
import { BackIcon, EllipsisVIcon, ArrowDownIcon } from '../../assets/index'
import styled from 'styled-components'
import FloatingLabel from 'react-native-floating-labels'
import Icon from 'react-native-vector-icons/FontAwesome';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import helper from '../../utils/helpers'
import DefaultAvatar from '../../common/DefaultAvatar'
import RoundCheckbox from 'rn-round-checkbox'
import posed, { Transition } from 'react-native-pose';
import Collapsible from 'react-native-collapsible';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import sendRequest from '../../utils/request'
import { g_users } from '../../constants/api'
import { setContacts, setAllUsers } from '../../actions/userActions'
import { getMessages, setRoom, addMessage } from '../../actions/messageActions'
import { addFeedReceiver, setFeedReceivers } from '../../actions/participantsActions'
import { setDialogs } from '../../actions/dialogsActions'
import { connect } from 'react-redux'


const { Colors, HeaderHeight } = helper;
const { green, black, yellow } = Colors;
const AnimatedScrollView = posed.View({
    left: {
        x: Dimensions.get('window').width,
        transition: { duration: 300, ease: 'easeOut' }
    },
    center: {
        x: 0,
        transition: { duration: 300, ease: 'easeOut' },
    },


    right: {
        x: -Dimensions.get('window').width,
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
    padding-top: 0px;
    background: white;
    margin-bottom: 110px;
    height: ${Dimensions.get('window').height - HeaderHeight - 20};
`
const ContactList = styled(ScrollView)`
    padding: 30px;
    padding-bottom: 10px;
    max-width: ${Dimensions.get('window').width};
    overflow: hidden;
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
    align-items: center;
    padding-bottom: 20px;
`
const BoxInner = styled(AnimatedBox)`
    padding: 20px 0;
    padding-top: 20px;
    border: 1px solid #E8EBEE;
    border-width: 0;
    border-top-width: 1px;
    border-bottom-width: ${({ last }) => last ? 1 : 0}px;
`
const BoxItem = styled(Text)`
    color: #A7B0BA;
`
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
`
const ContactInfo = styled(View)`
    display: flex;
    align-items: flex-start;
    justify-content: center;
    margin-left: 10px;
`
const ContactName = styled(Text)``
const ContactRole = styled(Text)`
    color: #A7B0BA;

`
const ArrowWrapper = styled(AnimatedArrowWrapper)`
    
`
const Options = styled(View)`
    display: flex;
    align-self: center;
    background: ${yellow};
    flex-direction: row;
    justify-content: space-between;
    padding: 1px;
    border-radius: 13;
    overflow: hidden;
`
const Option = styled(Text)`
    color: ${({ active }) => active ? black : 'white'};
    background: ${({ active }) => active ? 'white' : 'transparent'};
    min-width: 20%;
    margin: 1px;
    border-radius: 10;
    padding: 2px 10px;
    overflow: hidden;
    text-align: center;
`
const Group = styled(BoxInnerItem)``
const GroupInfo = styled(ContactInfo)``
const GroupTitle = styled(ContactName)``
const GroupParticipants = styled(ContactRole)``
const GroupImage = styled(ContactImage)``
class Content extends Component {
    render() {
        const { feed } = this.props
        const { users, collapsed, options, groups } = this.state;
        const { department } = users;
        const { active } = options;
        return (
            <SafeAreaView>
                {/* <GestureRecognizer
                    onSwipeLeft={this.optionLeft}
                    onSwipeRight={this.optionRight}
                > */}

                <Wrapper>
                    <KeyboardAwareScrollView enableOnAndroid>
                        <Options>
                            {
                                options.options.map((e, i) => <TouchableOpacity key={i} onPress={() => this.selectOption(i)}>
                                    <Option active={active % 3 === i}>{e}</Option>
                                </TouchableOpacity>)
                            }
                        </Options>
                        <Animated pose={active === 0 ? 'left' : (active === 1 ? 'center' : 'right')}>
                            <ContactList>
                                {
                                    department.map((e, i) => (
                                        <Box key={i} last={i === department.length - 1}>
                                            <BoxTitle onPress={() => collapsed[i] ? this.collapseDepartment(i) : this.showDepartment(i)}>
                                                <BoxItem title={true}>{e.title}</BoxItem>
                                                <ArrowWrapper pose={collapsed[i] ? 'right' : 'down'}>
                                                    <ArrowDownIcon />
                                                </ArrowWrapper>
                                            </BoxTitle>
                                            <Collapsible collapsed={collapsed[i] || false}>
                                                <BoxInner>
                                                    {
                                                        e.workers.map((e, i) => <BoxInnerItem>
                                                            {
                                                                e.image === '/images/default_group.png' || e.image === '/images/default_avatar.jpg' ?
                                                                    <DefaultAvatar size={36} id={e._id} /> :
                                                                    <ContactImage source={{ uri: `http://ser.univ.team${e.image}` }} />
                                                            }
                                                            <ContactInfo>
                                                                <ContactName>{e.first_name ? `${e.first_name} ${e.last_name}` : e.phone_number}</ContactName>
                                                                {e.role ? <ContactRole>{e.role.name || 'no role'}</ContactRole> : null}
                                                            </ContactInfo>
                                                        </BoxInnerItem>)
                                                    }
                                                </BoxInner>
                                            </Collapsible>
                                        </Box>
                                    ))
                                }
                            </ContactList>
                            <ContactList>
                                <FlatList
                                    style={{ paddingRight: 5, paddingLeft: 5, }}
                                    ListHeaderComponent={<View style={{ margin: 35, }} />}
                                    inverted={true}
                                    data={groups}
                                    renderItem={({ item, index }) => <Group key={index}>
                                        <GroupImage />
                                        <GroupInfo>
                                            <GroupTitle>{item.title}</GroupTitle>
                                            <GroupParticipants>{item.participants} участников</GroupParticipants>
                                        </GroupInfo>
                                    </Group>
                                    }
                                    keyExtractor={(item, index) => index.toString()}
                                />
                            </ContactList>
                        </Animated>
                    </KeyboardAwareScrollView>
                </Wrapper>
                {/* </GestureRecognizer> */}
            </SafeAreaView>
        )
    }
    state = {
        collapsed: [],
        users: {
            department: [
                {
                    title: 'Отдел длинных корпоративных названий',
                    workers: [],
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
            { title: 'длинное корпоративное название группы', participants: 15 },
            { title: 'длинное корпоративное название группы', participants: 15 },
            { title: 'длинное корпоративное название группы', participants: 15 },
            { title: 'длинное корпоративное название группы', participants: 15 },
            { title: 'длинное корпоративное название группы', participants: 15 },
            { title: 'длинное корпоративное название группы', participants: 15 },
            { title: 'длинное корпоративное название группы', participants: 15 },
        ]
    }
    componentDidMount() {
        const { feed } = this.props
        const { receivers } = feed
        const newDCollapsed = [...this.state.collapsed]
        for (let i = 0; i <= this.state.users.department.length; i++) {
            newDCollapsed.push(false)
        }
        this.setState({ collapsed: newDCollapsed })

        this.props.setContacts(receivers)
        const newUsers = { ...this.state.users }
        newUsers.department[0].workers = receivers
        this.setState({ users: newUsers })
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
}

const mapStateToProps = state => ({
    messages: state.messageReducer,
    dialog: state.dialogsReducer.dialogs,
    currentRoom: state.messageReducer.currentRoom,
    currentChat: state.messageReducer.currentChat,
    user: state.userReducer.user,
    users: state.userReducer,
    feed: state.newsReducer.feed,
})
const mapDispatchToProps = dispatch => ({
    getMessages: _ => dispatch(getMessages(_)),
    setRoom: _ => dispatch(setRoom(_)),
    setDialogs: _ => dispatch(setDialogs(_)),
    addMessage: _ => dispatch(addMessage(_)),
    setAllUsers: _ => dispatch(setAllUsers(_)),
    setContacts: _ => dispatch(setContacts(_)),
    addReceiver: _ => dispatch(addFeedReceiver(_)),
    setReceivers: _ => dispatch(setFeedReceivers(_)),

})
export default connect(mapStateToProps, mapDispatchToProps)(Content)
