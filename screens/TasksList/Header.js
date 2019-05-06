import React, { Component } from 'react'
import { View, Text, SafeAreaView, Image, Dimensions, TouchableOpacity } from 'react-native'
import { BackIcon, AddIcon, SearchIcon, BurgerIcon, EditIcon, FunnelIcon } from '../../assets/index'
import styled from 'styled-components'
import helper from '../../utils/helpers'
import { connect } from 'react-redux'
import { ImageComponent } from '../../common'
const { sidePadding, HeaderHeight, sidePaddingNumber } = helper;

const Header = styled(View)`
    width: 100%;
    background: white;
    height: ${HeaderHeight}; 
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding-right: ${sidePadding};
    padding-left: ${sidePadding};
`
const Left = styled(View)`
    display: flex;
    flex-direction: row;
    align-items: center;
`
const Center = styled(View)``
const Right = styled(Left)`
    justify-content: flex-end;
`
// const UserImage = styled(Image)`
//     background: red;
//     width: 30px;
//     height: 30px;
//     border-radius: 15px;
//     margin-left:${sidePaddingNumber};
// `
const MarginRight = styled(View)`
    margin-right: ${Dimensions.get('window').width*0.085};
    display: flex;
    flex-direction: row;
    align-items: center;
`

class HeaderComponent extends Component {
    render() {
        const { back, user, toProfile } = this.props;
        const { image } = user;
        return (
            <Header>
                <Left>
                    <BackIcon onPress={back} right/>
                    <Text>Задачи</Text>
                </Left>
                <Right>
                    <SearchIcon right/>
                    <AddIcon onPress={this.addTask} right/>
                    <TouchableOpacity onPress={toProfile}>
                        <ImageComponent source={{ uri: image }} />
                    </TouchableOpacity>
                </Right>
            </Header>
        )
    }
    addTask = (e) => {
        const { navigate } = this.props;
        navigate('NewTask')
    }
}
const mapStateToProps = state => ({
        user: state.userReducer.user
})
const mapDispatchToProps = dispatch => ({
})
export default connect(mapStateToProps, mapDispatchToProps)(HeaderComponent)



