import React, { Component } from 'react'
import { View, Text, SafeAreaView, FlatList, Dimensions, TouchableOpacity, TouchableWithoutFeedback, ActionSheetIOS, Platform, Animated } from 'react-native'
import { TriangleLeftIcon, TriangleRightIcon, CheckIcon, CommentIcon, HeartIcon } from '../../assets/index'
import styled from 'styled-components'
import helper from '../../utils/helpers'
import { connect } from 'react-redux'
import { TaskComponent, Message, Feed } from '../../common'
import posed from 'react-native-pose'
var Color = require('color');
const { Colors } = helper
const { myMessage, interlocatorMessage } = Colors
const MessageOptionsPosed = posed.View({
    visible: { bottom: 10 },
    hidden: { bottom: -250 }
});
const { HeaderHeightNumber, borderRadius } = helper;
const Wrapper = styled(View)`
    background: white;
    margin-bottom: ${({ search }) => search ? HeaderHeightNumber * 2 : HeaderHeightNumber};
    z-index: 1;
`
const Shadow = styled(TouchableOpacity)`
    position: absolute;
    width: ${Dimensions.get('window').width};
    height: ${Dimensions.get('window').height};
    background: rgba(5,5,5,.3);
    top: -${HeaderHeightNumber - 3}px;
    z-index: 4;
`
const MessageOptions = styled(MessageOptionsPosed)`
    background: white;
    width: 94%;
    height: ${Dimensions.get('window').height * 0.3}px;
    position: absolute;
    margin: 0 3%;
    padding: 2% 7%;
    bottom: 10px;
    border-radius: ${borderRadius};
    display: flex;
    justify-content: space-around;
    align-items: flex-start;
    z-index: 9999;
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
                    {selectedMessage && <Shadow onPress={this.unselect} activeOpacity={1} />}
                    <Animated.FlatList
                        style={{ paddingRight: 5, paddingLeft: 5, zIndex: 2 }}
                        ListHeaderComponent={<View style={{ margin: 35, }} />}
                        inverted={true}
                        data={reversedMessages}
                        animated={true}
                        renderItem={({ item, index }) => {
                            return <TouchableOpacity key={index} onLongPress={() => this.handleHold(item._id)}>
                                <Message withImage={true}>{item}</Message>
                            </TouchableOpacity>
                        }}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </Wrapper>
                <MessageOptions pose={selectedMessage ? 'visible' : 'hidden'}>
                    <TouchableOpacity><Text>Сделать задачей</Text></TouchableOpacity>
                    <TouchableOpacity><Text>Редактировать</Text></TouchableOpacity>
                    <TouchableOpacity><Text>Переслать</Text></TouchableOpacity>
                    <TouchableOpacity onPress={this.unselect}><Text>Отменить</Text></TouchableOpacity>
                </MessageOptions>
            </>
        )
    }
    state = {
        selectedMessage: null,
    }
    componentDidMount() { }
    unselect = (e) => {
        this.setState({ selectedMessage: null })
    }
    handleHold = (e) => {
        console.log(e)
        this.setState({ selectedMessage: e })
        Platform.os === 'ios' && ActionSheetIOS.showActionSheetWithOptions(
            {
                options: ['Отменить', 'Ответить', 'Копировать', 'Изменить', 'Удалить'],
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

const mapStateToProps = state => {
    return {
        messages: state.messageReducer.messages,
        search: state.messageReducer.search,
        currentRoom: state.messageReducer.currentRoom,
        user: state.userReducer.user,
    };
};
const mapDispatchToProps = dispatch => ({

})
export default connect(mapStateToProps, mapDispatchToProps)(Content)
