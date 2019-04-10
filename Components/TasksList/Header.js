import React, { Component } from 'react'
import { View, Text, SafeAreaView, Image, Platform, TouchableOpacity } from 'react-native'
import { BackIcon, AddIcon, SearchIcon, BurgerIcon, EditIcon, FunnelIcon } from '../../assets/index'
import styled from 'styled-components'
import helper from '../../Helper/helper'
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
    margin-right:${sidePaddingNumber};
`

class HeaderComponent extends Component {
    render() {
        const { back, user, toProfile } = this.props;
        const { image } = user;
        return (
            <Header>
                <Left>
                    <MarginRight>
                        <BackIcon onPress={back} />
                    </MarginRight>
                    <Text>Задачи</Text>
                </Left>
                <Right>
                    <MarginRight>
                        <SearchIcon right />
                    </MarginRight>
                    <TouchableOpacity onPress={toProfile}>
                        <ImageComponent source={{ uri: image }} />
                    </TouchableOpacity>
                </Right>
            </Header>
        )
    }
}
const mapStateToProps = state => {
    return {
        user: state.userReducer.user.user
    };
};
const mapDispatchToProps = dispatch => ({
})
export default connect(mapStateToProps, mapDispatchToProps)(HeaderComponent)



