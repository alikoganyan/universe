import React, { Component } from 'react';
import {
    View,
    Text,
    Dimensions,
    TextInput
} from 'react-native';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { BackIcon, SearchIcon, CloseIcon } from '../../assets/index';
import helper from '../../utils/helpers';
import { p_tasks_search, g_users } from '../../constants/api';
import sendRequest from '../../utils/request';

const { sidePadding, HeaderHeight, fontSize } = helper;

const Header = styled(View)
`
    width: 100%;
    background: white;
    height: ${HeaderHeight}; 
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding-right: ${sidePadding}px;
    padding-left: ${sidePadding}px;
`;
const Left = styled(View)
`
    display: flex;
    flex-direction: row;
    align-items: center;
`;
const Input = styled(TextInput)
`
    margin-left: ${Dimensions.get('window').width * 0.085};
`;
const Right = styled(Left)
`
    justify-content: flex-end;
`;
// const UserImage = styled(Image)`
//     background: red;
//     width: 30px;
//     height: 30px;
//     border-radius: 15px;
//     margin-left:${sidePadding}px;
// `

const HeaderText = styled(Text)
`
    font-size: ${fontSize.header};
    position: relative;
    left: -10px;
`;
class HeaderComponent extends Component {
    render() {
        const { back } = this.props;
        const { search, find } = this.state;
        return (
          <Header>
            <Left>
              {!search
                ? (
                  <>
                    <BackIcon onPress={back} right marginLeft />
                    <HeaderText>Все исходящие задачи</HeaderText>
                  </>
                )
                : (
                  <>
                    <SearchIcon marginLeft />
                    <Input placeholder="поиск" value={find} onChangeText={this.find} />
                  </>
                )
                        }
            </Left>
            <Right>
              {!search
                ? <SearchIcon onPress={this.startSearch} marginRight />
                : <CloseIcon onPress={this.stopSearch} marginLeft={false} />
                        }
            </Right>
          </Header>
        );
    }

    state = {
        search: false,
        find: ''
    }

    find = (e) => {
        this.setState({ find: e });
        const { setTasks } = this.props;
        e ? sendRequest({
            r_path: p_tasks_search,
            method: 'post',
            attr: {
                text: e,
                withUser: true,
            },
            success: ({ users }) => {
                const tasksList = [];
                users.map((user) => {
                    const { tasks } = user;
                    tasks && tasks.map((e, i) => {
                        if (i === 0 && (e.creator === user._id || e.performers.includes(user._id))) {
                            tasksList.push(user);
                        }
                    });
                });
                setTimeout(() => {
                    setTasks(tasksList);
                }, 0);
            },
            failFunc: (err) => {
                console.log(err);
            }
        }) : sendRequest({
            r_path: g_users,
            method: 'get',
            success: ({ users }) => {
                const tasksList = [];
                users.map((user) => {
                    const { tasks } = user;
                    tasks && tasks.map((e, i) => {
                        if (i === 0 && (e.creator === user._id || e.performers.includes(user._id))) {
                            tasksList.push(user);
                        }
                    });
                });
            },
            failFunc: (err) => {
                console.log({ err });
            }
        });
    }

    startSearch = () => {
        this.setState({ search: true });
    }

    stopSearch = () => {
        this.setState({ search: false });
    }

    addTask = () => {
        const { navigate } = this.props;
        navigate('NewTask');
    }
}

const mapStateToProps = state => ({
    user: state.userReducer.user,
    tasks: state.tasksReducer.tasks,
});
const mapDispatchToProps = dispatch => ({
    setTasks: _ => dispatch(setTasks(_))
});
export default connect(mapStateToProps, mapDispatchToProps)(HeaderComponent);
