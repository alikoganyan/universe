import React, { Component } from 'react'
import { View, Text, Dimensions, TouchableOpacity, TextInput } from 'react-native'
import { BackIcon, AddIcon, SearchIcon, CloseIcon } from '../../assets/index'
import styled from 'styled-components'
import helper from '../../utils/helpers'
import { connect } from 'react-redux'
import { p_tasks_search, g_users } from '../../constants/api'
import ImageComponent from '../../common/Image'
import DefaultAvatar from '../../common/DefaultAvatar'
import sendRequest from '../../utils/request'
import { setTasks } from '../../actions/tasksActions'
const { sidePadding, HeaderHeight, fontSize, HeaderHeightInner } = helper;

const Header = styled(View)`
    width: 100%;
    background: white;
    height: ${HeaderHeight}; 
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding-top: ${(HeaderHeightInner - sidePadding) / 2}px;
    padding-bottom: ${(HeaderHeightInner - sidePadding) / 2}px;
    padding-right: ${sidePadding}px;
    padding-left: ${sidePadding}px;
`
const Left = styled(View)`
    display: flex;
    flex-direction: row;
    align-items: center;
    height: ${HeaderHeightInner};
    flex: 6;
`
const Input = styled(TextInput)`
    margin-left: ${Dimensions.get('window').width * 0.085};
    flex: 1;
`
const Right = styled(Left)`
    justify-content: flex-end;
    flex: 1;
`
// const UserImage = styled(Image)`
//     background: red;
//     width: 30px;
//     height: 30px;
//     border-radius: 15px;
//     margin-left:${sidePadding}px;
// `

const HeaderText = styled(Text)`
    font-size: ${fontSize.header};
    position: relative;
    left: -10px;
`
class HeaderComponent extends Component {
    render() {
        const { back, user } = this.props;
        const { search, find } = this.state
        const { image } = user;
        return (
            <Header>
                <Left>
                    {!search ?
                        <>
                            <BackIcon onPress={back} right />
                            <HeaderText>Задачи</HeaderText>
                        </> :
                        <>
                            <SearchIcon />
                            <Input placeholder="поиск" value={find} onChangeText={this.find} autoFocus={true} />
                        </>
                    }
                </Left>
                <Right>
                    {!search ?
                        <>
                            <SearchIcon right onPress={this.startSearch} />
                            <AddIcon onPress={this.addTask} right />
                            <TouchableOpacity onPress={this.toProfile}>
                                {user.image === '/images/default_group.png' || user.image === '/images/default_avatar.jpg' ?
                                    <DefaultAvatar size={'header'} style={{ marginLeft: 10 }} /> :
                                    <ImageComponent source={{ uri: `http://ser.univ.team${user.image}` }} size={'header'} />
                                }
                            </TouchableOpacity>
                        </> :
                        <CloseIcon onPress={this.stopSearch} marginLeft={false} />
                    }
                </Right>
            </Header>
        )
    }
    state = {
        search: false,
        find: ''
    }
    componentWillUnmount() {
        this.stopSearch()
    }
    toProfile = () => {
        const { navigate } = this.props
        navigate('Profile')
    }

    find = (e) => {
        const { setTasks } = this.props
        this.setState({ find: e })
        e && e.length >= 2 ? sendRequest({
            r_path: p_tasks_search,
            method: 'post',
            attr: {
                text: e,
                withUser: true,
            },
            success: () => {
                // res.users.map(user => {
                //     // const { tasks } = user
                //     // tasks && tasks.map((e, i) => {
                //     //     if (i === 0 && (e.creator === user._id || e.performers.includes(user._id))) {
                //     //         tasksList.push(user)
                //     //     }
                //     // })
                // })
                // setTimeout(() => {
                //     // this.setState({ FlatListData: [...tasksList] })
                //     // setTasks(tasksList)
                //     console.log({tasksList})
                // }, 0)
            },
            failFunc: (err) => {
                console.log(err)
            }
        })
            : sendRequest({
                r_path: g_users,
                method: 'get',
                success: ({ users }) => {
                    const tasksList = []
                    users.map(user => {
                        const { tasks } = user
                        tasks && tasks.map((e, i) => {
                            if (i === 0 && (e.creator === user._id || e.performers.includes(user._id))) {
                                tasksList.push(user)
                            }
                        })
                    })
                    setTimeout(() => {
                        this.setState({ FlatListData: [...tasksList] })
                    }, 0)
                },
                failFunc: (err) => {
                    console.log({ err })
                }
            })
    }
    startSearch = () => {
        this.setState({ search: true })
    }
    stopSearch = () => {
        this.setState({ search: false, find: '' })
    }
    addTask = () => {
        const { navigate } = this.props;
        navigate('NewTask')
    }
}

const mapStateToProps = state => {
    return {
        user: state.userReducer.user,
        tasks: state.tasksReducer.tasks,
    };
};
const mapDispatchToProps = dispatch => ({
    setTasks: _ => dispatch(setTasks(_))
})
export default connect(mapStateToProps, mapDispatchToProps)(HeaderComponent)

