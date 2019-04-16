import React, { Component } from 'react'
import { View, Text, SafeAreaView, FlatList, Image, TouchableOpacity, ScrollView, Dimensions, KeyboardAvoidingView } from 'react-native'
import { BackIcon, GroupIconWhite, ArrowDownIcon } from '../../assets/index'
import styled from 'styled-components'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import helper from '../../utils/helpers'
import posed from 'react-native-pose';
import sendRequest from '../../utils/request'
import { g_users } from '../../constants/api'
import Collapsible from 'react-native-collapsible';
import { connect } from 'react-redux'
import { setContacts, setAllUsers } from '../../actions/userActions'

import { getMessages, setRoom, addMessage } from '../../actions/messageActions'
import { setDialogs } from '../../actions/dialogsActions'
const { Colors, HeaderHeightNumber, HeaderHeight, fontSize } = helper;
const { green, black, grey2 } = Colors;
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
    height: ${Dimensions.get('window').height - HeaderHeightNumber}px;
    margin-top: ${HeaderHeight};
`
const ContactList = styled(ScrollView)`
    padding: 30px;
    padding-top: 10px;
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
    padding-top: 10px;
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
    padding: 10px 0;
    padding-bottom: ${({ title }) => title ? 20 : 0}px;
    display: flex;
    flex-direction: row;
    align-items: center;

`
const ContactImage = styled(Image)`
    width: 24px;
    height: 24px;
    border-radius: 14;
    background: red;
    margin-right: 8px;
`
const ContactInfo = styled(View)``
const ContactName = styled(Text)`
    font-size: ${fontSize.text};
    color: ${black};
`
const ContactRole = styled(Text)`
    font-size: ${fontSize.sm};
    color: ${grey2}
`
const ArrowWrapper = styled(AnimatedArrowWrapper)`
    
`
const Group = styled(BoxInnerItem)``
const GroupInfo = styled(ContactInfo)``
const GroupTitle = styled(ContactName)``
const GroupParticipants = styled(ContactRole)``
const GroupImage = styled(ContactImage)``
const CreateDialog = styled(TouchableOpacity)`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    align-self: center;
    background: ${green};
    padding: 15px 30px;
    border-radius: 50000px;
    margin-top: 30px;

`
const CreateDialogText = styled(Text)`
    margin-left: 10px;
    color: white;
`
const Padding = styled(View)`
    height: 30px;
`
class Content extends Component {
    render() {
        const { users, collapsed, options, groups } = this.state;
        const { department } = users;
        return (
            <SafeAreaView>
                <Wrapper>
                    <KeyboardAwareScrollView enableOnAndroid>
                        <CreateDialog>
                            <GroupIconWhite />
                            <CreateDialogText>
                                Создать группу
                            </CreateDialogText>
                        </CreateDialog>
                        <ContactList>
                            {/* {department.map((e, i) => ( */}
                            <Box last={true}>
                                <BoxTitle onPress={() => collapsed[0] ? this.collapseDepartment(0) : this.showDepartment(0)}>
                                    <BoxItem title={true}>No role</BoxItem>
                                    <ArrowWrapper pose={collapsed[0] ? 'right' : 'down'}>
                                        <ArrowDownIcon />
                                    </ArrowWrapper>
                                </BoxTitle>
                                <Collapsible collapsed={collapsed[0] || false}>
                                    <BoxInner>
                                        {department.map((e, i) => <TouchableOpacity onPress={() => this.toChat(e._id)}>
                                            <BoxInnerItem key={i}>
                                            <ContactImage />
                                            <ContactInfo>
                                                <ContactName>{e.first_name || e.phone_number}</ContactName>
                                                <ContactRole>{e.role || 'no role'}</ContactRole>
                                            </ContactInfo>
                                        </BoxInnerItem>
                                        </TouchableOpacity>)}
                                    </BoxInner>
                                </Collapsible>
                            </Box>
                            {/* ))}  */}
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
                    </KeyboardAwareScrollView>
                </Wrapper>
            </SafeAreaView>
        )
    }
    state = {
        collapsed: [],
        users: {
            department: [

            ],
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
        this.setState({ collapsed: newDCollapsed })
        sendRequest({
            r_path: g_users,
            method: 'get',
            success: (res) => {
                this.props.setContacts(res)
                const newUsers = { ...this.state.users }
                newUsers.department = res
                this.setState({ users: newUsers }, () => console.log(this.state.users))
            },
            failFunc: (err) => {
                console.log({ err })
            }
        })

    }
    selectOption = (e) => {
        const newState = { ...this.state.options }
        newState.active = e;
        this.setState({ options: newState })
    }
    toChat = (e) => {
        const { setRoom, navigate, user } = this.props
        setRoom(e)
        navigate('Chat')
        setRoom(e)
        console.log(e)
    }
}

const mapStateToProps = state => {
    return {
      messages: state.messageReducer,
      dialog: state.dialogsReducer.dialogs,
      currentRoom: state.messageReducer.currentRoom,
      currentChat: state.messageReducer.currentChat,
      user: state.userReducer.user,
      users: state.userReducer
    };
  };
  const mapDispatchToProps = dispatch => ({
    getMessages: _ => dispatch(getMessages(_)),
    setRoom: _ => dispatch(setRoom(_)),
    setDialogs: _ => dispatch(setDialogs(_)),
    addMessage: _ => dispatch(addMessage(_)),
    setAllUsers: _ => dispatch(setAllUsers(_)),
    setContacts: _ => dispatch(setContacts(_))

  })
  export default connect(mapStateToProps, mapDispatchToProps)(Content)
  