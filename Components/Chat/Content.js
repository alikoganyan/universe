import React, { Component } from 'react'
import { View, Text, SafeAreaView, FlatList, Image, TouchableOpacity, ActionSheetIOS } from 'react-native'
import { TriangleLeftIcon, TriangleRightIcon, CheckIcon, CommentIcon, HeartIcon } from '../../assets/index'
import styled from 'styled-components'
import helper from '../../Helper/helper'
import { connect } from 'react-redux'
import { TaskComponent, Message, Feed } from '../../Common/'

const { HeaderHeightNumber } = helper;
const Wrapper = styled(View)`
    background: white;
    margin-bottom: ${({ search }) => search ? HeaderHeightNumber * 2 : HeaderHeightNumber};
`

class Content extends Component {
    render() {
        const { messages, search } = this.props
        const revesedMessages = [...messages].reverse();
        return (
            <SafeAreaView>
                <Wrapper search={search}>
                    <FlatList
                        style={{ paddingRight: 5, paddingLeft: 5, }}
                        ListHeaderComponent={<View style={{ margin: 35, }} />}
                        inverted={true}
                        data={revesedMessages}
                        renderItem={({ item }) => {
                            if (item.type === 'message') {
                                return <TouchableOpacity onLongPress={this.handleHold}>
                                    <Message>{item}</Message>
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
    componentDidMount() { }
    handleHold = () => {
        ActionSheetIOS.showActionSheetWithOptions(
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
        search: state.messageReducer.search
    };
};
const mapDispatchToProps = dispatch => ({

})
export default connect(mapStateToProps, mapDispatchToProps)(Content)
