import React, { Component } from 'react'
import { View, Text, SafeAreaView, ScrollView, Dimensions, FlatList, Image, TouchableOpacity } from 'react-native'
import { CommentIcon, HeartIcon } from '../../assets/index'
import TaskComponent from '../../common/Task'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { setActiveTask } from '../../actions/tasksActions'
import helper from '../../utils/helpers'
const { sidePadding, Colors, HeaderHeight } = helper;
const { yellow, green, purple, red, black, pink } = Colors;
const Wrapper = styled(View)
`
    margin-bottom: 50px;   
`
const TaskList = styled(FlatList)
`
    padding: 10px 0;
    display: flex;
    flex-grow: 1;
    padding-bottom: 20px;
    z-index: 5;
`
const Options = styled(View)
`
    display: flex;
    align-self: center;
    background: ${purple};
    flex-direction: row;
    border-radius: 14;
    padding: 1px;
    overflow: hidden;
    margin: 10px 0;
    max-width: 85%;
`
const Option = styled(Text)
`
    color: ${({ active }) => active ? black : 'white'};
    background: ${({ active }) => active ? 'white' : 'transparent'};
    margin: 1px;
    border-radius: 10;
    padding: 2px 0;
    overflow: hidden;
    min-width: 30%;
    text-align: center;
`
const TaskWrapper = styled(View)
`
    display: flex;
    align-items: flex-end;
    justify-content: flex-start;
    flex-direction: row;
`
const Shadow = styled(TouchableOpacity)
`
    background: black;
    opacity: 0.1;
    z-index: 0;
    height: ${Dimensions.get('window').height};
    width: ${Dimensions.get('window').width};
    position: absolute;
    top: -${HeaderHeight};
    left: 0;
`
const StyledScrollView = styled(ScrollView)
`
    flexGrow: 1;
    zIndex: 10;
    width: 100%;
    height: ${Dimensions.get('window').height - HeaderHeight - 20}px;
`
class Content extends Component {
    render() {
        const { taskList, options } = this.state;
        const { active } = options;
        const { currentTask, user, activeTask, tasks } = this.props
        const flatten = list => list.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), [])
        const tasksList = [...tasks].filter(e => {
            console.log({ e })
            return e._id === user._id;
        }).map(e => e.tasks)
        const incTasks = flatten(tasksList)
        return (
            <SafeAreaView>
                {/* {activeTask._id && <Shadow onPress={this.unselect}></Shadow>} */}
                <StyledScrollView keyboardShouldPersistTaps='handled'>
                    <Wrapper>
                        <Options>
                            {
                                options.options.map((e, i) => <TouchableOpacity key={i} onPress={() => this.selectOption(i)}>
                                    <Option active={active === i}>{e}</Option>
                                </TouchableOpacity>)
                            }
                        </Options>
                        {incTasks && <TaskList
                            data={incTasks}
                            ListFooterComponent={<View   />}
                            renderItem={({ item, index }) => {
                                const { creator } = item
                                return <TaskWrapper>
                                    <TouchableOpacity style={{ flex: 1 }} onLongPress={e => this.handleHold(item)}><TaskComponent
                                        triangleLeft={true}
                                        borderColor={purple}
                                        withImage={true}
                                        style={{
                                            zIndex: activeTask._id === item._id ? 5 : 1,
                                            // marginRight: myTask ? 10 : 70,
                                            // marginLeft: myTask ? 70 : 10,
                                        }}>{item}</TaskComponent></TouchableOpacity>
                                </TaskWrapper>
                            }}
                            keyExtractor={(item, index) => index.toString()}
                        />}
                    </Wrapper>
                </StyledScrollView>
            </SafeAreaView>
        )
    }
    state = {
        options: {
            active: 1,
            options: [
                'Все',
                'В работе',
                'Не в работе'
            ]
        },
        taskList: []
    }
    unselect = () => {
        const { setActiveTask } = this.props
        setActiveTask({})
    }
    handleHold = (e) => {
        const { setActiveTask } = this.props
        setActiveTask(e)
    }
    selectOption = (e) => {
        const options = { ...this.state.options };
        options.active = e;
        this.setState({ options })
    }
    componentWillUnmount() {
        this.unselect()
    }
}

const mapStateToProps = state => ({
    currentTask: state.tasksReducer.currentTask,
    activeTask: state.tasksReducer.activeTask,
    tasks: state.tasksReducer.tasks,
    user: state.userReducer.user
})
const mapDispatchToProps = dispatch => ({
    setActiveTask: _ => dispatch(setActiveTask(_))
})
export default connect(mapStateToProps, mapDispatchToProps)(Content)