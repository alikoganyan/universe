import React, { Component } from 'react'
import { View, Text, SafeAreaView, Image, Dimensions, TouchableOpacity, TextInput } from 'react-native'
import { BackIcon, AddIcon, SearchIcon, BurgerIcon, EditIcon, FunnelIcon, CloseIcon } from '../../assets/index'
import styled from 'styled-components'
import helper from '../../utils/helpers'
import { connect } from 'react-redux'
import { p_news_search, g_users } from '../../constants/api'
import { ImageComponent } from '../../common'
import { setNews } from '../../actions/newsActions'
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
const HeaderText = styled(Text)`
    font-size: ${fontSize.header};
    position: relative;
    left: -10px;
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

class HeaderComponent extends Component {
    render() {
        const { back, user, toProfile } = this.props;
        const { search, find } = this.state
        const { image } = user;
        return (
            <Header>
                <Left>
                    {!search ?
                        <>
                            <BackIcon onPress={back} right />
                            <HeaderText>Новости</HeaderText>
                        </> :
                        <>
                            <SearchIcon />
                            <Input placeholder="поиск" value={find} onChangeText={this.find} />
                        </>
                    }
                </Left>
                <Right>
                    {!search ?
                        <>
                            <SearchIcon right onPress={this.startSearch} />
                            <TouchableOpacity onPress={toProfile}>
                                <ImageComponent source={{ uri: `http://ser.univ.team${image}` }} />
                            </TouchableOpacity>
                        </> :
                        <CloseIcon onPress={this.stopSearch} />
                    }
                </Right>
            </Header>
        )
    }
    state = {
        search: false,
        find: ''
    }
    find = (e) => {
        this.setState({ find: e })
        e ? sendRequest({
            r_path: p_news_search,
            method: 'post',
            attr: {
                text: e,
                withUser: true,
            },
            success: (res) => {
                console.log({ res })
            },
            failFunc: (err) => {
                console.log(err)
            }
        }) : sendRequest({
            r_path: news,
            method: 'get',
            success: (res) => {
                setNews(res.news)
            },
            failFunc: (err) => {
                console.log(err)
            }
        })
    }
    startSearch = () => {
        this.setState({ search: true })
    }
    stopSearch = () => {
        this.setState({ search: false })
    }
    addTask = (e) => {
        const { navigate } = this.props;
        navigate('NewFeed')
    }
}

const mapStateToProps = state => {
    return {
        user: state.userReducer.user,
        tasks: state.tasksReducer.tasks,
    };
};
const mapDispatchToProps = dispatch => ({
    setNews: _ => dispatch(setNews(_))
})
export default connect(mapStateToProps, mapDispatchToProps)(HeaderComponent)

