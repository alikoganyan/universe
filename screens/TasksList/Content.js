import React, { Component } from 'react';
import { View, Text, FlatList, Dimensions, ScrollView } from 'react-native';
import styled from 'styled-components';
import Task from './Task';
import TaskPack from './TaskPack';
import Loader from '../../common/Loader';
import helper from '../../utils/helpers';
import sendRequest from '../../utils/request';
import { g_users } from '../../constants/api';
import { setTasks } from '../../actions/tasksActions';
import { connect } from 'react-redux';
const { HeaderHeight, Colors } = helper;
const { grey2 } = Colors;
const Wrapper = styled(View)
`
  max-height: ${Dimensions.get('window').height - HeaderHeight}px;
  display: flex;
  align-self: center;
  align-items: center;
  justify-content: center;
`;
const StyledScrollView = styled(ScrollView)
`
  height: ${Dimensions.get('window').height - HeaderHeight - 20}px;
`;

class Content extends Component {
    render() {
        const { tasks, navigate, user } = this.props;
        // const incTasks = [...tasks].filter(e => e._id !== user._id)
        // const outTasks = [...tasks].filter(e => e._id === user._id)
        return (tasks && tasks.length) ? (
            <Wrapper>
              <StyledScrollView contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps='handled'>
                <TaskPack title={'inc'} onPress={() => navigate('TasksInc')} />
                <TaskPack title={'out'} onPress={() => navigate('TasksOut')} last />
                {
                  tasks.length ? tasks.map((e, i) => <Task onPress={this.toTasks} key={i}>{e}</Task>) :
                    <View style={{ flex: 1 }}>
                      <Loader hint={'Пока нет задач'}>
                        <Text style={{ color: grey2, textAlign: 'center' }}>Поставьте вашу первую задачу, нажав на иконку &quot;плюс&quot;
                          </Text>
                      </Loader>
                    </View>
                }
                <View style={{ height: 20, width: '100%' }} />
              </StyledScrollView>
            </Wrapper>
        ) : <View />;
    }
    state = {
        FlatListData: []
    }
    componentDidMount() {
        const { setTasks } = this.props;
        sendRequest({
            r_path: g_users,
            method: 'get',
            success: ({ users }) => {
                const tasksList = [];
                const userId = this.props.user._id;
                users.map(user => {
                    const { tasks } = user;
                    tasks && tasks.map((e, i) => {
                        // const amIReceiver = e.performers.filter(e => e._id === userId)[0];
                        const amICreator = e.creator._id === userId;
                        // console.log(amIReceiver, amICreator);
                        if (i === 0) {
                            tasksList.push(user);
                        }
                    });
                });
                setTimeout(() => {
                    // console.log({ tasksList });
                    setTasks(tasksList);
                }, 0);
            },
            failFunc: (err) => {
                console.log({ err });
            }
        });
    }
    toTasks = () => {
        const { navigate } = this.props;
        navigate('Tasks');
    }
}

const mapStateToProps = state => ({
    user: state.userReducer.user,
    tasks: state.tasksReducer.tasks,
});
const mapDispatchToProps = dispatch => ({
    setTasks: _ => dispatch(setTasks(_))
});
export default connect(mapStateToProps, mapDispatchToProps)(Content);
