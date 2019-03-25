import React, { Component } from 'react'
import { View, Text, SafeAreaView, FlatList, Image, TouchableOpacity, ScrollView, Dimensions, KeyboardAvoidingView } from 'react-native'
import { BackIcon, EllipsisVIcon, ArrowDownIcon } from '../../assets/index'
import styled from 'styled-components'
import FloatingLabel from 'react-native-floating-labels'
import Icon from 'react-native-vector-icons/FontAwesome';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import helper from '../../Helper/helper'
import posed, { Transition } from 'react-native-pose';
import RoundCheckbox from 'rn-round-checkbox';
import Collapsible from 'react-native-collapsible';
const { Colors } = helper;
const { green, black } = Colors;
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
const Group = styled(BoxInnerItem)``
const GroupInfo = styled(ContactInfo)``
const GroupTitle = styled(ContactName)``
const GroupParticipants = styled(ContactRole)``
const GroupImage = styled(ContactImage)``
export default class Settings extends Component {
    render() {
        const { users, collapsed, options, groups } = this.state;
        const { department } = users;
        const { active } = options;
        return (
            <SafeAreaView>
                <Wrapper>
                    <KeyboardAwareScrollView enableOnAndroid>
                        <Options>
                            {
                                options.options.map((e, i) => <TouchableOpacity key={i} onPress={() => this.selectOption(i)}>
                                    <Option active={active === i}>{e}</Option>
                                </TouchableOpacity>)
                            }
                        </Options>
                        <Animated pose={active === 0 ? 'left' : (active === 1 ? 'center' : 'right')}>
                            <ContactList>
                                {
                                    department.map((e, i) => {
                                        for (let i = 0; i <= e.length; i++) {
                                            newCollapsed.push(false)
                                        }
                                        return (
                                            <Box key={i} last={i === department.length - 1}>
                                                <BoxTitle onPress={() => collapsed[i] ? this.collapseDepartment(i) : this.showDepartment(i)}>
                                                    <>
                                                        <RoundCheckbox
                                                            size={24}
                                                            checked={this.state.isSelected}
                                                            onValueChange={(newValue) => { console.log(newValue) }}
                                                        />
                                                        <BoxItem title={true}>{e.title}</BoxItem></>
                                                    <ArrowWrapper pose={collapsed[i] ? 'right' : 'down'}>
                                                        <ArrowDownIcon />
                                                    </ArrowWrapper>
                                                </BoxTitle>
                                                <Collapsible collapsed={collapsed[i] || false}>
                                                    <BoxInner>
                                                        {
                                                            e.workers.map((e, i) =>
                                                                <TouchableOpacity onPress={() => this.toggleParticipant(e)}>
                                                                    <BoxInnerItem key={i}>
                                                                        <ContactImage />
                                                                        <ContactInfo>
                                                                            <ContactName>{e.name}</ContactName>
                                                                            <ContactRole>{e.role}</ContactRole>
                                                                        </ContactInfo>
                                                                    </BoxInnerItem>
                                                                </TouchableOpacity>)
                                                        }
                                                    </BoxInner>
                                                </Collapsible>
                                            </Box>
                                        )
                                    })
                                }
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
            </SafeAreaView>
        )
    }
    state = {
        collapsed: [],
        selected: [],
        users: {
            department: [
                {
                    title: 'Отдел длинных корпоративных названий',
                    workers: [
                        { name: "Noah", id: 0, role: 'менеджер по продажам', uri: 'https://facebook.github.io/react/logo-og.png' },
                        { name: "Noah", id: 1, role: 'менеджер по продажам', uri: 'https://facebook.github.io/react/logo-og.png' },
                        { name: "Noah", id: 2, role: 'менеджер по продажам', uri: 'https://facebook.github.io/react/logo-og.png' },
                    ],
                },
                {
                    title: 'Отдел коротких корпоративных названий',
                    workers: [
                        { name: "Noah", id: 3, role: 'менеджер по продажам', uri: 'https://facebook.github.io/react/logo-og.png' },
                        { name: "Noah", id: 4, role: 'менеджер по продажам', uri: 'https://facebook.github.io/react/logo-og.png' },
                        { name: "Noah", id: 5, role: 'менеджер по продажам', uri: 'https://facebook.github.io/react/logo-og.png' },
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
        ]
    }
    collapseDepartment = (i) => {
        const newCollapsed = [...this.state.collapsed]
        newCollapsed[i] = false;
        this.setState({ collapsed: newCollapsed })
    }
    showDepartment = (i) => {
        const newCollapsed = [...this.state.collapsed]
        newCollapsed[i] = true;
        this.setState({ collapsed: newCollapsed })
    }
    toggleParticipant = (e) => {
        const { selected } = this.state;
        const { id } = e
        selected.includes(id) ?
            this.setState({ selected: [...selected].filter(e => e.id != id) }) :
            this.setState({ selected: [...selected, id] })
        setTimeout(() => {
            console.log(id, e.id != id , selected)
        }, 100)
    }
    componentDidMount() {
        const newCollapsed = [...this.state.collapsed]
        for (let i = 0; i <= this.state.users.department.length; i++) {
            newCollapsed.push(false)
        }
        this.setState({ collapsed: newCollapsed })
    }
    selectOption = (e) => {
        const newState = { ...this.state.options }
        newState.active = e;
        this.setState({ options: newState })
    }
}
