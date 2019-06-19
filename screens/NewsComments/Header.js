import React, { Component } from 'react'
import { View, Text, Dimensions, TouchableOpacity, TextInput } from 'react-native'
import { BackIcon, SearchIcon, EditIcon, CloseIcon } from '../../assets/index'
import styled from 'styled-components'
import helper from '../../utils/helpers'
import { connect } from 'react-redux'
import { p_news_search } from '../../constants/api'
import ImageComponent from '../../common/Image'
import DefaultAvatar from '../../common/DefaultAvatar'
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
                            <EditIcon right onPress={this.editFeed}/>
                            <SearchIcon right onPress={this.startSearch} />
                            <TouchableOpacity onPress={this.toProfile}>
                                {image === '/images/default_group.png' || image === '/images/default_avatar.jpg' ?
                                    <DefaultAvatar size={'header'} style={{ marginLeft: 10 }} /> :
                                    <ImageComponent source={{ uri: `http://ser.univ.team${image}` }} size={'header'} />
                                }
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
    toProfile = () => {
        const { navigate } = this.props;
        navigate('Profile')
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
    addTask = () => {
        const { navigate } = this.props;
        navigate('NewFeed')
    }
    editFeed = () => {
        const { navigate } = this.props;
        navigate('FeedEdit')
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

