import React, { Component, Fragment } from 'react'
import { View, Text, SafeAreaView, FlatList, Image, TouchableOpacity, ActionSheetIOS } from 'react-native'
import { TriangleLeftIcon, TriangleRightIcon, CheckIcon, CommentIcon, HeartIcon } from '../../assets/index'
import styled from 'styled-components'
import helper from '../../Helper/helper'
import { connect } from 'react-redux'
import { TaskComponent, Message } from '../../Common/'
const { HeaderHeightNumber, Colors, Feed } = helper;
const { lightColor } = Colors
const Wrapper = styled(View)`
    background: white;
    margin-bottom: ${({ search }) => search ? HeaderHeightNumber * 2 : HeaderHeightNumber}px;
`
class Content extends Component {
    render() {
        const { messages, search } = this.props
        const reversedMessages = [...messages].reverse();

        return (
            <SafeAreaView>
                <Wrapper search={search}>
                    <FlatList
                        style={{ paddingRight: 5, paddingLeft: 5, }}
                        ListHeaderComponent={<View style={{ margin: 35, }} />}
                        inverted={true}
                        data={reversedMessages}
                        renderItem={({ item }) => {
                            if (item.type === 'message') {
                                return <TouchableOpacity onLongPress={this.handleHold}>
                                    <Message getMessageHeight={this.getUnreadMessageHeight}>{item}</Message>
                                </TouchableOpacity>
                            }
                            if (item.type === 'task') {
                                return <TaskComponent>{item}</TaskComponent>
                            }
                            if (item.type === 'feed') {
                                return <Feed>{item}</Feed>
                            }
                        }}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </Wrapper>
            </SafeAreaView>
        )
    }
    getUnreadMessageHeight = (e) => {
        return e.nativeEvent.layout.height;
    }
    handleHold = () => {
    }
    taskAction = () => {
    }
}
const mapStateToProps = state => {
    return {
        messages: state.messageReducer.messages,
        search: state.messageReducer.search
    };
};
const mapDispatchToProps = dispatch => ({

})
export default connect(mapStateToProps, mapDispatchToProps)(Content)
