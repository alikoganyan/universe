import React, { Component } from 'react'
import { View, Text, SafeAreaView, FlatList, Image, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView } from 'react-native'
import { BackIcon, EllipsisVIcon, SearchIcon } from '../../assets/index'
import styled from 'styled-components'
import FloatingLabel from 'react-native-floating-labels'
import Icon from 'react-native-vector-icons/FontAwesome';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import helper from '../../Helper/helper'

const Wrapper = styled(View)`
    padding-top: 0px;
    background: white;
    margin-bottom: 110px;
    
`
const InputWrapper = styled(View)`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    border: 1px solid #DCDBDC;
    border-width: 0;
    border-bottom-width: 1px;
`
const Input = styled(TextInput)`
    height: 40px;
    padding: 0 10px;
    width: 90%;
    z-index: 999;
    text-align: left;
`
const StyledIcon = styled(Icon)`
    margin-left: 10px;
`
const ContactList = styled(ScrollView)`
    padding-bottom: 10px;
`
const ContactsListItem = styled(View)`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
`
const UserName = styled(Text)`

`
const ContactImage = styled(Image)`
    width: 50;
    height: 50;
    border-radius: 25;
    background-color: red;
    margin-right: 10px;
`
const Contact = styled(View)`
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    padding: 10px;
`
const Letter = styled(View)`
    min-width: 20px;
    margin-left: 10px;
    margin-right: 40px;
    font-size: 18px;
`

const ContactInfo = styled(View)`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 10px;
`
export default class Settings extends Component {
    state = {
        names: {
            a: [],
            b: [],
            c: [],
            d: [],
            e: [],
            f: [],
            g: [],
            h: [],
            i: [],
            j: [],
            l: [],
            m: [],
            n: [],
            o: [],
            p: [],
            q: [],
            r: [],
            s: [],
            u: [],
            v: [],
            w: [],
            x: [],
            y: [],
            z: [],
        },
        users: [
            { name: "Noah", uri: 'https://facebook.github.io/react/logo-og.png' },
            { name: "Liam", uri: 'https://facebook.github.io/react/logo-og.png' },
            { name: "William", uri: 'https://facebook.github.io/react/logo-og.png' },
            { name: "Mason", uri: 'https://facebook.github.io/react/logo-og.png' },
            { name: "James", uri: 'https://facebook.github.io/react/logo-og.png' },
            { name: "Benjamin", uri: 'https://facebook.github.io/react/logo-og.png' },
            { name: "Jacob", uri: 'https://facebook.github.io/react/logo-og.png' },

            { name: "Noah", uri: 'https://facebook.github.io/react/logo-og.png' },
            { name: "Liam", uri: 'https://facebook.github.io/react/logo-og.png' },
            { name: "William", uri: 'https://facebook.github.io/react/logo-og.png' },
            { name: "Mason", uri: 'https://facebook.github.io/react/logo-og.png' },
            { name: "James", uri: 'https://facebook.github.io/react/logo-og.png' },
            { name: "Benjamin", uri: 'https://facebook.github.io/react/logo-og.png' },
            { name: "Jacob", uri: 'https://facebook.github.io/react/logo-og.png' },

            { name: "Noah", uri: 'https://facebook.github.io/react/logo-og.png' },
            { name: "Liam", uri: 'https://facebook.github.io/react/logo-og.png' },
            { name: "William", uri: 'https://facebook.github.io/react/logo-og.png' },
            { name: "Mason", uri: 'https://facebook.github.io/react/logo-og.png' },
            { name: "James", uri: 'https://facebook.github.io/react/logo-og.png' },
            { name: "Benjamin", uri: 'https://facebook.github.io/react/logo-og.png' },
            { name: "Jacob", uri: 'https://facebook.github.io/react/logo-og.png' },
        ]
    }
    handleFocus = () => {
    }
    sortUsersByName = (users) => {
        const newNames = { ...this.state.names };
        let index = 0
        users.sort((a, b) => {
            return (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1;
        })
        users.map(e => {
            newNames[e.name[index].toLowerCase().toString()].push(e)
        })
        this.setState({
            names: newNames
        }, this.forceUpdate())
    }
    componentDidMount() {
        this.sortUsersByName(this.state.users)
    }
    render() {
        return (
            <SafeAreaView>
                <Wrapper>
                    <InputWrapper>
                        <StyledIcon name="search" />
                        <Input placeholder={'найти'} />
                    </InputWrapper>
                    <KeyboardAwareScrollView enableOnAndroid>
                        <ContactList>
                            {Object.keys(this.state.names).map((e, i) => {
                                const item = this.state.names[e];
                                if (item.length > 0) {
                                    return <ContactsListItem key={`letter_${i}`}>
                                        <Letter><Text style={{ fontSize: 18, color: '#6A6A6A' }}>{e}</Text></Letter>
                                        <Contact>{item.map((e, i) => <ContactInfo key={`contact_${i}`}>
                                            <ContactImage source={{ uri: 'https://visualpharm.com/assets/30/User-595b40b85ba036ed117da56f.svg' }} />
                                            <Text>{e.name}</Text>
                                        </ContactInfo>)}</Contact>
                                    </ContactsListItem>
                                }
                            })}
                        </ContactList>
                    </KeyboardAwareScrollView>
                </Wrapper>
            </SafeAreaView>
        )
    }
}
