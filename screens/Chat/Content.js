import React, { Component } from 'react';
import { View, Text, FlatList, Dimensions, ImageBackground, TouchableOpacity, ActionSheetIOS, Platform, InteractionManager } from 'react-native';
import { chatBg } from '../../assets/images/';
import styled from 'styled-components';
import helper from '../../utils/helpers';
import { connect } from 'react-redux';
import Message from '../../common/Message';
import { getMessages } from '../../actions/messageActions';
import { setDialogs } from '../../actions/dialogsActions';
import { BottomSheet } from 'react-native-btr';

const { HeaderHeight, borderRadius } = helper;
const Wrapper = styled(View)`
    background: white;
    margin-bottom: ${({ search }) => search ? HeaderHeight * 2 : HeaderHeight};
    z-index: 1;
    position: relative;
`;
const Shadow = styled(TouchableOpacity)`
    position: absolute;
    width: ${Dimensions.get('window').width};
    height: ${Dimensions.get('window').height};
    background: rgba(5,5,5,.3);
    top: -${HeaderHeight - 3}px;
    z-index: 4;
`;
const MessageOptions = styled(View)`
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
`;
const MessageOption = styled(TouchableOpacity)`
    padding-bottom: 30px;
    width: 100%;
`;
const StyledFlatList = styled(FlatList)`
    padding-right: 5; 
    padding-left: 5; 
    z-index: 2;
`;
const FlatListHeader = styled(View)`
    margin: 35px;
`;
const StyledImageBackground = styled(ImageBackground)`
    width: 100%;
    height: 100%; 
`;
class Content extends Component {
    render() {
        const { selectedMessage, animationCompleted } = this.state;
        const { search, user, dialogs, currentChat } = this.props;
        const dialog = [...dialogs].filter(e => e.room === currentChat)[0];
        const messages = dialog ? dialog.messages : [];
        const reversedMessages = [...messages].sort((x, y) => x.timeSent < y.timeSent);
        return (
            <>
                <Wrapper search={search} >
                    {selectedMessage._id && <Shadow onPress={this.unselect} activeOpacity={1} />}
                    <StyledImageBackground source={chatBg}>
                        {animationCompleted ?<StyledFlatList
                                                ListHeaderComponent={<FlatListHeader />}
                                                inverted={true}
                                                data={reversedMessages}
                                                initialNumToRender={15}
                                                keyboardDismissMode={'on-drag'}
                                                animated={true}
                                                renderItem={({ item, index }) => <TouchableOpacity key={index} onLongPress={() => this.handleHold(item)}>
                                                        <Message>{item}</Message>
                                                    </TouchableOpacity>}
                                                keyExtractor={(item, index) => index.toString()}
                                            /> : null}
                    </StyledImageBackground>
                </Wrapper>
                <BottomSheet
                    visible={selectedMessage._id}
                    onBackButtonPress={this.unselect}
                    onBackdropPress={this.unselect}>
                    <MessageOptions>
                    {
                        selectedMessage._id && selectedMessage.sender._id === user._id && <>
                            <MessageOption onPress={this.turnToTask}><Text>Сделать задачей</Text></MessageOption>
                            <MessageOption><Text>Редактировать</Text></MessageOption>
                        </>
                    }
                    <MessageOption><Text>Переслать</Text></MessageOption>
                    <MessageOption onPress={this.unselect}><Text>Отменить</Text></MessageOption>
                    </MessageOptions>
                </BottomSheet>
            </>
        );
    }
    state = {
        selectedMessage: {},
        animationCompleted: false,
    }
    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.setState({
                animationCompleted: true,
            });
        });
        // const { dialogs, messages, setDialogs, getMessages, currentRoomId, user } = this.props;
        // const newMessages = [];
        // messages.map((e, i) => {
        //     newMessages.push({ 
        //             ...messages[i], 
        //             viewers: e.sender._id !== user._id ? 
        //             [...messages[i].viewers, user._id] : 
        //             messages[i].viewers })
        // });
        // const newDialogs = [...dialogs];
        // const newDialog = newDialogs.filter(e => e._id === currentRoomId)[0];
        // if (newDialog) {
        //     const newDialogIndex = newDialogs.findIndex(e => e._id === currentRoomId);
        //     newDialogs[newDialogIndex] = newDialog;
        //     newDialog.messages = newMessages;
        //     // getMessages(newMessages);
        //     // setDialogs(newDialogs);
        // }

    }
    turnToTask = e => {
        const { user, navigate } = this.props;
        const { selectedMessage } = this.state;
        const { text, viewers } = selectedMessage;
        const participants = [...viewers].filter(e => e !== user._id);
        const task = {
            text,
            participants
        };
        navigate('NewTask', { task });
    }
    unselect = () => {
        this.setState({ selectedMessage: {} });
    }
    handleHold = (e) => {
        const { user } = this.props;
        this.setState({ selectedMessage: e });
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
    currentChat: state.messageReducer.currentChat,
    currentRoomId: state.messageReducer.currentRoomId,
    user: state.userReducer.user,
    dialogs: state.dialogsReducer.dialogs,
});
const mapDispatchToProps = dispatch => ({
    getMessages: _ => dispatch(getMessages(_)),
    setDialogs: _ => dispatch(setDialogs(_)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Content);
