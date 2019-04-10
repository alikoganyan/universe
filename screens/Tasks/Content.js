import React, { Component } from 'react'
import { View, Text, SafeAreaView, FlatList, Image, TouchableOpacity } from 'react-native'
import { CommentIcon, HeartIcon } from '../../assets/index'
import { TaskComponent } from '../../common'
import styled from 'styled-components'
import helper from '../../utils/helpers'
const { sidePadding, Colors } = helper;
const { yellow, green, purple, red, black } = Colors;
const Wrapper = styled(View)`
    margin-bottom: 50px;   
    background: white;
`
const TaskList = styled(FlatList)`
    padding: 10px;
    display: flex;
    flex-grow: 1;
    padding-bottom: 20px;
`
const Options = styled(View)`
    display: flex;
    align-self: center;
    background: ${green};
    flex-direction: row;
    padding: 1px;
    border-radius: 13;
    overflow: hidden;
    margin-bottom: 10px;
`
const Option = styled(Text)`
    color: ${({ active }) => active ? black : 'white'};
    background: ${({ active }) => active ? 'white' : 'transparent'};
    margin: 1px;
    border-radius: 10;
    padding: 2px 0;
    overflow: hidden;
    min-width: 50px;
    text-align: center;
`
const TaskWrapper = styled(View)`
    display: flex;
    align-items: flex-end;
    flex-direction: row;
`
const UserImage = styled(Image)`
    background: red;
    width: 40px;
    height: 40px;
    border-radius: 20;
    margin-bottom: ${sidePadding};
    align-self: flex-end;
`
export default class Content extends Component {
    render() {
        const { taskList, options } = this.state;
        const { active } = options;
        return (
            <SafeAreaView>
                <Wrapper>
                    <Options>
                        {
                            options.options.map((e, i) => <TouchableOpacity key={i} onPress={() => this.selectOption(i)}>
                                <Option active={active === i}>{e}</Option>
                            </TouchableOpacity>)
                        }
                    </Options>
                    <TaskList
                        data={taskList}
                        ListFooterComponent={<View style={{ margin: 40, }} />}
                        renderItem={({ item, index }) => <TaskWrapper>
                            {index !== 1 && <UserImage />}
                            <TaskComponent
                                triangleLeft={index !== 1}
                                triangleRight={index === 1}
                                style={{
                                    marginRight: index === 1 ? 10 : 50,
                                    marginLeft: index === 1 ? 50 : 10,
                                }}>{item}</TaskComponent>
                        </TaskWrapper>}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </Wrapper>
            </SafeAreaView>
        )
    }
    state = {
        options: {
            active: 1,
            options: [
                'Создание',
                'Статус',
                'Дедлайн'
            ]
        },
        taskList: [
            {
                type: 'task',
                title: 'Title',
                author: 1,
                text: 'Elit cupidatat Lorem nisi dolore aute ullamco ipsum aute. Ipsum commodo pariatur sit eiusmod ex dolore adipisicing sunt tempor laborum proident nostrud anim. Est fugiat reprehenderit velit laboris eiusmod consequat sit reprehenderit magna minim.',
                created: 1552297002599,
                deadline: 1552297012599,
                performers: [1, 2, 3],
                stage: 1,
            },
            {
                type: 'task',
                title: 'Title',
                author: 1,
                text: 'Elit cupidatat Lorem nisi dolore aute ullamco ipsum aute. Ipsum commodo pariatur sit eiusmod ex dolore adipisicing sunt tempor laborum proident nostrud anim. Est fugiat reprehenderit velit laboris eiusmod consequat sit reprehenderit magna minim.',
                created: 1552297002599,
                deadline: 1552297012599,
                performers: [1, 2, 3],
                stage: 1,
            },
            {
                type: 'task',
                title: 'Title',
                author: 1,
                text: 'Elit cupidatat Lorem nisi dolore aute ullamco ipsum aute. Ipsum commodo pariatur sit eiusmod ex dolore adipisicing sunt tempor laborum proident nostrud anim. Est fugiat reprehenderit velit laboris eiusmod consequat sit reprehenderit magna minim.',
                created: 1552297002599,
                deadline: 1552297012599,
                performers: [1, 2, 3],
                stage: 1,
            },

        ]
    }
    selectOption = (e) => {
        const options = { ...this.state.options };
        options.active = e;
        this.setState({ options })
    }
}
