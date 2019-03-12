import React, { Component } from 'react'
import { View, Text, SafeAreaView, FlatList, Image, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView } from 'react-native'
import { BackIcon, EllipsisVIcon, ArrowDownIcon } from '../../assets/index'
import styled from 'styled-components'
import FloatingLabel from 'react-native-floating-labels'
import Icon from 'react-native-vector-icons/FontAwesome';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import helper from '../../Helper/helper'
import posed from 'react-native-pose';
import Collapsible from 'react-native-collapsible';
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

export default class Settings extends Component {
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
    componentDidMount() {
        const newDCollapsed = [...this.state.collapsed]
        for (let i = 0; i <= this.state.users.department.length; i++) {
            newDCollapsed.push(false)
        }
        this.setState({ collapsed: newDCollapsed }, console.log(this.state.collapsed))
    }
    render() {
        const { users, collapsed } = this.state;
        const { department } = users;
        return (
            <SafeAreaView>
                <Wrapper>
                    <KeyboardAwareScrollView enableOnAndroid>
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
                                                    e.workers.map((e, i) => <BoxInnerItem key={i}>
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
                                ))
                            }
                        </ContactList>
                    </KeyboardAwareScrollView>
                </Wrapper>
            </SafeAreaView>
        )
    }
}
