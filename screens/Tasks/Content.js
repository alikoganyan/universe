import React, { Component } from 'react'
import { View, Text, SafeAreaView, FlatList, Image, TouchableOpacity } from 'react-native'
import { CommentIcon, HeartIcon } from '../../assets/index'
import { TaskComponent } from '../../common'
import styled from 'styled-components'
import { connect } from 'react-redux'
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
    border-radius: 14;
    padding: 1px;
    overflow: hidden;
    margin: 10px 0;
    max-width: 85%;
`
const Option = styled(Text)`
    color: ${({ active }) => active ? black : 'white'};
    background: ${({ active }) => active ? 'white' : 'transparent'};
    margin: 1px;
    border-radius: 10;
    padding: 2px 0;
    overflow: hidden;
    min-width: 30%;
    text-align: center;
`
const TaskWrapper = styled(View)`
    display: flex;
    align-items: flex-end;
    flex-direction: row;
`
class Content extends Component {
    render() {
        const { taskList, options } = this.state;
        const { active } = options;
        const { tasks } = this.props
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
                    {tasks.tasks && <TaskList
                        data={tasks.tasks}
                        ListFooterComponent={<View style={{ margin: 40, }} />}
                        renderItem={({ item, index }) => <TaskWrapper>
                            <TaskComponent
                                triangleLeft={index !== 1}
                                triangleRight={index === 1}
                                style={{
                                    marginRight: index === 1 ? 10 : 50,
                                    marginLeft: index === 1 ? 50 : 10,
                                }}>{item}</TaskComponent>
                        </TaskWrapper>}
                        keyExtractor={(item, index) => index.toString()}
                    />}
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
        taskList: []
    }
    selectOption = (e) => {
        const options = { ...this.state.options };
        options.active = e;
        this.setState({ options })
    }
}

const mapStateToProps = state => ({
        tasks: state.tasksReducer.tasks,
})
const mapDispatchToProps = dispatch => ({
})
export default connect(mapStateToProps, mapDispatchToProps)(Content)