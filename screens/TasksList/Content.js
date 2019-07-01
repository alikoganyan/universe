import React, { Component } from 'react';
import {
  View,
  Text,
  Dimensions,
  ScrollView
} from 'react-native';
import styled from 'styled-components';
import { connect } from 'react-redux';
import Task from './Task';
import TaskPack from './TaskPack';
import Loader from '../../common/Loader';
import helper from '../../utils/helpers';
import sendRequest from '../../utils/request';
import { g_users } from '../../constants/api';
import { setTasks } from '../../actions/tasksActions';

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
    const { incTasks, outTasks } = this.state;
    return tasks ? (
      <Wrapper>
        <StyledScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <TaskPack title="inc" tasksPack={incTasks} onPress={() => navigate('TasksInc')} />
          <TaskPack title="out" tasksPack={outTasks} onPress={() => navigate('TasksOut')} last />
          {
            tasks.length ? tasks.map((e, i) => <Task onPress={this.toTasks} key={i}>{e}</Task>)
              : (
                <View style={{ flex: 1 }}>
                  <Loader hint="Пока нет задач">
                    <Text style={{ color: grey2, textAlign: 'center' }}>
                      Поставьте вашу первую задачу, нажав на иконку &quot;плюс&quot;
                    </Text>
                  </Loader>
                </View>
              )
          }
          <View style={{ height: 20, width: '100%' }} />
        </StyledScrollView>
      </Wrapper>
    ) : <View />;
  }

  state = {
    users: [],
    incTasks: [],
    outTasks: []
  }

  componentDidMount = async () => {
    const { setTasks, user } = this.props;
    await this._getUsers();
    const tasks = this._getTasks();

    const flatten = list => list.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);
    setTasks(tasks);
    const outTasks = [...tasks].map(e => [...e.tasks, ...e.tasks_list, ...user.tasks].filter(task => task.creator._id === user._id));
    const incTasks = [...user.tasks];
    this.setState({
      outTasks: flatten(outTasks),
      incTasks: flatten(incTasks)
    });
    // sendRequest({
    //   r_path: g_users,
    //   method: 'get',
    //   success: ({ users }) => {
    //     const tasksList = [];
    //     // const userId = user._id;
    //     users.map((user) => {
    //       const { tasks } = user;
    //       tasks && tasks.map((e, i) => {
    //         // const amIReceiver = e.performers.filter(e => e._id === userId)[0];
    //         // const amICreator = e.creator._id === userId;
    //         // console.log(amIReceiver, amICreator);
    //         if (i === 0) {
    //           tasksList.push(user);
    //         }
    //       });
    //     });
    //     setTimeout(() => {
    //       setTasks([...tasksList]);
    //     }, 0);
    //   },
    //   failFunc: (err) => {
    //     console.log({ err });
    //   }
    // });
  }

  componentWillUnmount() {
    const { setTasks } = this.props;
    setTasks([]);
  }

  toTasks = () => {
    const { navigate } = this.props;
    navigate('Tasks');
  }

  _getUsers = () => {
    const { user } = this.props;
    return new Promise((resolve, reject) => {
      sendRequest({
        r_path: g_users,
        method: 'get',
        success: (res) => {
          this.setState({ users: [...res.users] }, () => resolve(res.users));
        },
        failFunc: (err) => {
          console.log({ err });
          reject();
        }
      });
    });
  }

  _getTasks = () => {
    const {
      user
    } = this.props;
    const { users } = this.state;
    const contacts = [...users];
    const my_tasks = [];
    contacts.map((u) => {
      let tasks_list = [];
      u.tasks.map((t) => {
        if (t.creator._id === user._id) {
          tasks_list.push(t);
        }
      });
      u.created_tasks.map((t) => {
        if (t.performers[0]._id === user._id) {
          tasks_list.push(t);
        }
      });
      if (tasks_list.length > 0) {
        tasks_list = tasks_list.sort((a, b) => {
          const dateDifference = new Date(a.created_at) - new Date(b.created_at);
          return dateDifference;
        });
        u.tasks_list = tasks_list;
        my_tasks.push(u);
      }
    });
    return my_tasks;
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