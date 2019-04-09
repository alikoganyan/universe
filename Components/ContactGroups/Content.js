import React, { Component } from 'react'
import { View, Text, SafeAreaView, FlatList, Image, TouchableOpacity, ScrollView, Dimensions, KeyboardAvoidingView } from 'react-native'
import { BackIcon, EllipsisVIcon, ArrowDownIcon } from '../../assets/index'
import styled from 'styled-components'
import FloatingLabel from 'react-native-floating-labels'
import Icon from 'react-native-vector-icons/FontAwesome';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import helper from '../../Helper/helper'
import { ImageComponent } from '../../Common'
import posed, { Transition } from 'react-native-pose';
import Collapsible from 'react-native-collapsible';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import { connect } from 'react-redux'
const { Colors, socket, sidePadding } = helper;
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
    padding-top: 0px;
    background: white;
    margin-bottom: 40px;
    
`
const ContactList = styled(ScrollView)`
    padding: 20px;
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
    align-items: flex-start;
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
    padding-bottom: ${({ title }) => title ? 20 : 0}px;
    color: #A7B0BA;
    flex: 1;
`
const BoxInnerItem = styled(View)`
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
    background: red;
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
                                        ListHeaderComponent={<View style={{ margin: 35, }} />}
                                        inverted={true}
                                        data={allUsers}
                                        renderItem={({ item }) => <Group>
                                            <ImageComponent size={"xs"} style={{marginRight: sidePadding}} source={{uri: item.uri}}/>
                                            <GroupInfo>
                                                <GroupTitle numberOfLines={1}>{item.name}</GroupTitle>
                                            </GroupInfo>
                                        </Group>
                                        }
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
                                                    {e.workers.map((e, i) => <BoxInnerItem key={i}>
                                                        <ContactImage />
                                                        <ContactInfo>
                                                            <ContactName>{e.name}</ContactName>
                                                            <ContactRole>{e.role}</ContactRole>
                                                        </ContactInfo>
                                                    </BoxInnerItem>)
                                                    }
                                                </BoxInner>
                                            </Collapsible>
                                        </Box>
                                    ))}
                                </ContactList>
                                <ContactList>
                                    <FlatList
                                        style={{ paddingRight: 5, paddingLeft: 5, }}
                                        ListHeaderComponent={<View style={{ margin: 35, }} />}
                                        inverted={true}
                                        data={groups}
                                        renderItem={({ item }) => <Group>
                                            <GroupImage />
                                            <GroupInfo>
                                                <GroupTitle numberOfLines={1}>{item.title}</GroupTitle>
                                                <GroupParticipants>{item.participants} участников</GroupParticipants>
                                            </GroupInfo>
                                        </Group>
                                        }
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
                        { name: "Noah", role: 'менеджер по продажам', uri: 'https://facebook.github.io/react/logo-og.png' },
                        { name: "Noah", role: 'менеджер по продажам', uri: 'https://facebook.github.io/react/logo-og.png' },
                    ],
                },
                {
                    title: 'Отдел коротких корпоративных названий',
                    workers: [
                        { name: "Noah", role: 'менеджер по продажам', uri: 'https://facebook.github.io/react/logo-og.png' },
                        { name: "Noah", role: 'менеджер по продажам', uri: 'https://facebook.github.io/react/logo-og.png' },
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
            { title: 'длинное корпоративное название группы', participants: 15 },
            { title: 'длинное корпоративное название группы', participants: 15 },
            { title: 'длинное корпоративное название группы', participants: 15 },
            { title: 'длинное корпоративное название группы', participants: 15 },
            { title: 'длинное корпоративное название группы', participants: 15 },
            { title: 'длинное корпоративное название группы', participants: 15 },
            { title: 'длинное корпоративное название группы', participants: 15 },
        ],
        allUsers: [
            { name: 'Константин Константинопольский', uri: 'https://facebook.github.io/react/logo-og.png' },
            { name: 'Константин Константинопольский', uri: 'https://facebook.github.io/react/logo-og.png' },
            { name: 'Константин Константинопольский', uri: 'https://facebook.github.io/react/logo-og.png' },
            { name: 'Константин Константинопольский', uri: 'https://facebook.github.io/react/logo-og.png' },
            { name: 'Константин Константинопольский', uri: 'https://facebook.github.io/react/logo-og.png' },
            { name: 'Константин Константинопольский', uri: 'https://facebook.github.io/react/logo-og.png' },
            { name: 'Константин Константинопольский', uri: 'https://facebook.github.io/react/logo-og.png' },
            { name: 'Константин Константинопольский', uri: 'https://facebook.github.io/react/logo-og.png' },
        ]
    }
    componentDidMount() {
        const { user, users } = this.props;

        socket.emit('get users', { id: user.id })

        const newDCollapsed = [...this.state.collapsed]
        for (let i = 0; i <= this.state.users.department.length; i++) {
            newDCollapsed.push(false)
        }
        this.setState({ collapsed: newDCollapsed })
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

const mapStateToProps = state => {
    return {
        messages: state.messageReducer,
        dialog: state.dialogsReducer.dialogs,
        currentRoom: state.messageReducer.currentRoom,
        user: state.userReducer.user.user,
        users: state.userReducer,
    };
};
const mapDispatchToProps = dispatch => ({
    getMessages: _ => dispatch(getMessages(_)),
    setRoom: _ => dispatch(setRoom(_)),
    setDialogs: _ => dispatch(setDialogs(_)),
    addMessage: _ => dispatch(addMessage(_)),
    setAllUsers: _ => dispatch(setAllUsers(_))
})
export default connect(mapStateToProps, mapDispatchToProps)(Content)
