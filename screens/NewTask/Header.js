import React, { Component } from 'react'
import { View, Text, SafeAreaView, Image, Dimensions, TouchableOpacity, TextInput } from 'react-native'
import { BackIcon, AddIcon, SearchIcon, BurgerIcon, EditIcon, FunnelIcon, CloseIcon } from '../../assets/index'
import styled from 'styled-components'
import helper from '../../utils/helpers'
import { connect } from 'react-redux'
import { p_tasks_search, g_users } from '../../constants/api'
import { ImageComponent } from '../../common'
import sendRequest from '../../utils/request'
const { sidePadding, HeaderHeight, fontSize } = helper;

const Header = styled(View)`
    width: 100%;
    background: white;
    height: ${HeaderHeight}; 
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding-right: ${sidePadding}px;
    padding-left: ${sidePadding}px;
`
const Left = styled(View)`
    display: flex;
    flex-direction: row;
    align-items: center;
`
const Center = styled(View)``
const Input = styled(TextInput)`
    margin-left: ${Dimensions.get('window').width * 0.085};
`
const Right = styled(Left)`
    justify-content: flex-end;
`
// const UserImage = styled(Image)`
//     background: red;
//     width: 30px;
//     height: 30px;
//     border-radius: 15px;
//     margin-left:${sidePadding}px;
// `
const MarginRight = styled(View)`
    margin-right: ${Dimensions.get('window').width * 0.085};
    display: flex;
    flex-direction: row;
    align-items: center;
`
const HeaderText = styled(Text)`
    font-size: ${fontSize.header};
`
class HeaderComponent extends Component {
    render() {
        const { user, toProfile } = this.props;
        const { search, find } = this.state
        const { image } = user;
        return (
            <Header>
                <Left>
                    <CloseIcon onPress={this.back} right />
                    <HeaderText>Создание Задачи</HeaderText>
                </Left>
            </Header>
        )
    }
    state = {
        search: false,
        find: ''
    }
    find = (e) => {

    }
    startSearch = () => {
        this.setState({ search: true })
    }
    stopSearch = () => {
        this.setState({ search: false })
    }
    addTask = (e) => {
        const { navigate } = this.props;
        navigate('NewTask')
    }
    back = () => {
        const { back } = this.props;
        back()
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

