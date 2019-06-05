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
import { getMessages, setRoom, addMessage, setCurrentChat } from '../../actions/messageActions'
import { setDialogs, setCurrentDialogs } from '../../actions/dialogsActions'
const { Colors, HeaderHeight, fontSize } = helper;
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
    height: ${Dimensions.get('window').height - HeaderHeight}px;
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
    padding: 0 0 20px;
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
    padding: 20px 0;
    padding-bottom: ${({ title }) => title ? 20 : 0}px;
    display: flex;
    flex-direction: row;
    align-items: center;
`
const ContactImage = styled(Image)`
    width: 33px;
    height: 33px;
    border-radius: 16.5;
    margin-right: 8px;
`
const ContactInfo = styled(View)`
    display: flex;
    align-items: flex-start;
    justify-content: center;
`
const ContactName = styled(Text)`
    font-size: ${fontSize.text};
    color: ${black};
`
const ContactRole = styled(Text)`
    font-size: ${fontSize.text - 1};
    color: ${grey2};
`
const ArrowWrapper = styled(AnimatedArrowWrapper)`
    
`
const Group = styled(BoxInnerItem)``
const GroupInfo = styled(ContactInfo)``
const GroupTitle = styled(ContactName)``
const GroupParticipants = styled(ContactRole)`

`
const GroupImage = styled(ContactImage)``
const CreateDialog = styled(TouchableOpacity)`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    align-self: flex-start;
    background: ${green};
    padding: 5px 10px;
    width: 184px;
    height: 38px;
    margin-left: 30px;
    border-radius: 50000px;
    margin-top: 10px;

`
const CreateDialogText = styled(Text)`
    margin-left: 10px;
    color: white;
    font-size: ${fontSize.text};
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
                <ScrollView keyboardShouldPersistTaps={'handled'}>
                    <Wrapper>
                        <KeyboardAwareScrollView enableOnAndroid>
                            <CreateDialog onPress={this.newGroup}>
                                <GroupIconWhite />
                                <CreateDialogText>Создать группу</CreateDialogText>
                            </CreateDialog>
                            {department.map((dep, i) => {
                                return (
                                    <View key={i}>
                                        <ContactList key={i}>
                                            <Box last={true}>
                                                <BoxTitle onPress={() => collapsed[0] ? this.collapseDepartment(0) : this.showDepartment(0)}>
                                                    <BoxItem title={true}>{dep.title}</BoxItem>
                                                    <ArrowWrapper pose={collapsed[0] ? 'right' : 'down'}>
                                                        <ArrowDownIcon />
                                                    </ArrowWrapper>
                                                </BoxTitle>
                                                <Collapsible collapsed={collapsed[0] || false}>
                                                    <BoxInner>
                                                        {dep.users.map((e, i) => <TouchableOpacity key={i} onPress={() => this.toChat(e)}>
                                                            <BoxInnerItem>
                                                                <ContactImage source={{ uri: e.image ? `http://ser.univ.team${e.image}` : `http://simpleicon.com/wp-content/uploads/user1.png` }} />
                                                                <ContactInfo>
                                                                    <ContactName>
                                                                        {e.first_name ? `${e.first_name} ${e.last_name}` : e.phone_number}
                                                                    </ContactName>
                                                                    {e.role ? <ContactRole>{e.role}</ContactRole> : null}
                                                                </ContactInfo>
                                                            </BoxInnerItem>
                                                        </TouchableOpacity>)}
                                                    </BoxInner>
                                                </Collapsible>
                                            </Box>
                                        </ContactList>
                                        {/* <ContactList>
                                        <FlatList
                                            style={{ paddingRight: 5, paddingLeft: 5, }}
                                            ListHeaderComponent={<View style={{ margin: 35, }} />}
                                            inverted={true}
                                            data={[]}
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
                                    </ContactList> */}
                                    </View>
                                )
                            })}
                        </KeyboardAwareScrollView>
                    </Wrapper>
                </ScrollView>
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
        ]
    }
    collapseDepartment = (i) => {
        const newDCollapsed = [...this.state.collapsed]
        newDCollapsed[i] = false;
        this.setState({ collapsed: newDCollapsed })
    }
    newGroup = () => {
        const { navigate } = this.props
        navigate('NewGroup')
    }
    showDepartment = (i) => {
        const newDCollapsed = [...this.state.collapsed]
        newDCollapsed[i] = true;
        this.setState({ collapsed: newDCollapsed })
    }
    componentDidMount() {
        const { setContacts } = this.props
        const newDCollapsed = [...this.state.collapsed]
        for (let i = 0; i <= this.state.users.department.length; i++) {
            newDCollapsed.push(false)
        }
        this.setState({ collapsed: newDCollapsed })
        sendRequest({
            r_path: g_users,
            method: 'get',
            success: (res) => {
                const { users } = this.state
                setContacts(res.users)
                const newUsers = { ...users }
                const newDepartment = [...users.department]
                res.users.map(user => {
                    const { users } = this.state
                    const department = users.department.filter(e => e.title === user.department || e.title === 'без департамента')[0]
                    if (department) {
                        const index = users.department.findIndex(e => {
                            return e.title === user.department || e.title === 'без департамента'
                        })
                        newDepartment[index].users.push(user)
                    } else {
                        newDepartment.push({ title: user.department || 'без департамента', users: [user] })
                    }
                    newUsers.department = newDepartment
                    this.setState({ users: newUsers })
                })
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
    toChat = event => {
        const { setCurrentDialogs, navigate, getMessages, setRoom, dialog, setCurrentChat } = this.props
        const dialogIncludes = dialog.filter(e => {
            return (e.creator._id === event._id || e.participants[0]._id === event._id)
        })[0]
        setCurrentDialogs(event)
        setRoom(event._id)
        getMessages(dialogIncludes ? dialogIncludes.messages : [])
        navigate('Chat')
    }
}

const mapStateToProps = state => ({
    messages: state.messageReducer,
    dialog: state.dialogsReducer.dialogs,
    currentRoom: state.messageReducer.currentRoom,
    currentChat: state.messageReducer.currentChat,
    user: state.userReducer.user,
    users: state.userReducer
})
const mapDispatchToProps = dispatch => ({
    getMessages: _ => dispatch(getMessages(_)),
    setRoom: _ => dispatch(setRoom(_)),
    setDialogs: _ => dispatch(setDialogs(_)),
    addMessage: _ => dispatch(addMessage(_)),
    setAllUsers: _ => dispatch(setAllUsers(_)),
    setContacts: _ => dispatch(setContacts(_)),
    setCurrentChat: _ => dispatch(setCurrentChat(_)),
    setCurrentDialogs: _ => dispatch(setCurrentDialogs(_))

})
export default connect(mapStateToProps, mapDispatchToProps)(Content)
