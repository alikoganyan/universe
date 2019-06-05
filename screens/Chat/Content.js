import React, { Component } from 'react'
import { View, Text, SafeAreaView, FlatList, Dimensions, ImageBackground, TouchableOpacity, TouchableWithoutFeedback, ActionSheetIOS, Platform, Animated, ScrollView } from 'react-native'
import { TriangleLeftIcon, TriangleRightIcon, CheckIcon, CommentIcon, HeartIcon } from '../../assets/index'
import { chatBg } from '../../assets/images/'
import styled from 'styled-components'
import helper from '../../utils/helpers'
import { connect } from 'react-redux'
import TaskComponent from '../../common/Task'
import Feed from '../../common/Feed'
import Message from '../../common/Message'
import posed from 'react-native-pose'
import { getMessages } from '../../actions/messageActions'
import { setDialogs } from '../../actions/dialogsActions'

const { Colors } = helper
const { myMessage, interlocatorMessage } = Colors
const MessageOptionsPosed = posed.View({
    visible: { bottom: 10 },
    hidden: { bottom: -250 }
});
const { HeaderHeight, borderRadius } = helper;
const Wrapper = styled(View)`
    background: white;
    margin-bottom: ${({ search }) => search ? HeaderHeight * 2 : HeaderHeight};
    z-index: 1;
`
const Shadow = styled(TouchableOpacity)`
    position: absolute;
    width: ${Dimensions.get('window').width};
    height: ${Dimensions.get('window').height};
    background: rgba(5,5,5,.3);
    top: -${HeaderHeight - 3}px;
    z-index: 4;
`
const MessageOptions = styled(MessageOptionsPosed)`
    background: white;
    width: 94%;
    position: absolute;
    margin: 0 3%;
    padding: 30px 7% 0;
    bottom: 10px;
    border-radius: ${borderRadius};
    display: flex;
    justify-content: space-around;
    align-items: flex-start;
    z-index: 9999;
`
const MessageOption = styled(TouchableOpacity)`
    padding-bottom: 30px;
`
class Content extends Component {
    render() {
        const { selectedMessage } = this.state
        const { messages, search, currentChat, user } = this.props
        const reversedMessages = [...messages].sort((x, y) => {
            return x.timeSent < y.timeSent
        });
        return (
            <>
                <Wrapper search={search} >
                    {selectedMessage._id && <Shadow onPress={this.unselect} activeOpacity={1} />}
                    <ImageBackground source={chatBg} style={{width: '100%', height: '100%'}}>
                        <Animated.FlatList
                            style={{ paddingRight: 5, paddingLeft: 5, zIndex: 2 }}
                            ListHeaderComponent={<View style={{ margin: 35, }} />}
                            inverted={true}
                            data={reversedMessages}
                            keyboardDismissMode={'on-drag'}
                            animated={true}
                            renderItem={({ item, index }) => {
                                return <TouchableOpacity key={index} onLongPress={() => this.handleHold(item)}>
                                    <Message>{item}</Message>
                                </TouchableOpacity>
                            }}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </ImageBackground>
                </Wrapper>
                <MessageOptions pose={selectedMessage._id ? 'visible' : 'hidden'}>
                    {
                        selectedMessage._id && selectedMessage.sender._id === user._id && <>
                            <MessageOption><Text>Сделать задачей</Text></MessageOption>
                            <MessageOption><Text>Редактировать</Text></MessageOption>
                        </>
                    }
                    <MessageOption><Text>Переслать</Text></MessageOption>
                    <MessageOption onPress={this.unselect}><Text>Отменить</Text></MessageOption>
                </MessageOptions>
            </>
        )
    }
    state = {
        selectedMessage: {},
    }
    componentDidMount() {
        const { dialogs, messages, setDialogs, getMessages, currentRoomId, user } = this.props;
        const newMessages = []
        messages.map((e, i) => {
            newMessages.push({ ...messages[i], viewers: e.sender._id !== user._id ? [...messages[i].viewers, user._id] : messages[i].viewers })
        });
        const newDialogs = [...dialogs]
        const newDialog = newDialogs.filter(e => e._id === currentRoomId)[0]
        const newDialogIndex = newDialogs.findIndex(e => e._id === currentRoomId)
        newDialogs[newDialogIndex] = newDialog
        if (newDialog) newDialog.messages = newMessages
        getMessages(newMessages)
        setDialogs(newDialogs)

    }
    unselect = (e) => {
        this.setState({ selectedMessage: {} })
    }
    handleHold = (e) => {
        const { user } = this.props
        this.setState({ selectedMessage: e })
        Platform.os === 'ios' && ActionSheetIOS.showActionSheetWithOptions(
            {
                options: e.sender._id === user._id ? ['Отменить', 'Ответить', 'Копировать', 'Изменить', 'Удалить'] : ['Отменить', 'Ответить', 'Копировать'],
                cancelButtonIndex: 0,
            },
            (buttonIndex) => {
                if (buttonIndex === 1) {
                    /* destructive action */
                }
            },
        );
    }
}

const mapStateToProps = state => ({
    messages: state.messageReducer.messages,
    search: state.messageReducer.search,
    currentRoom: state.messageReducer.currentRoom,
    currentRoomId: state.messageReducer.currentRoomId,
    user: state.userReducer.user,
    dialogs: state.dialogsReducer.dialogs,
})
const mapDispatchToProps = dispatch => ({
    getMessages: _ => dispatch(getMessages(_)),
    setDialogs: _ => dispatch(setDialogs(_)),
})
export default connect(mapStateToProps, mapDispatchToProps)(Content)
