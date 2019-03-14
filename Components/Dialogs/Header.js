import React, { Component, Fragment } from 'react'
import { View, Text, TextInput, Image, Platform, Dimensions } from 'react-native'
import { SearchIcon, BurgerIcon } from '../../assets/index'
import { openDrawer } from '../../actions/drawerActions'
import { connect } from 'react-redux'
import styled from 'styled-components'
import helper from '../../Helper/helper'
const { Colors, sidePadding, sidePaddingNumber, fontSize, HeaderHeight } = helper;
const Header = styled(View)`
    width: ${Dimensions.get('window').width - (sidePaddingNumber * 2)}px;
    background-color: ${Colors.background};
    border: 1px solid ${Colors.border};
    border-radius: 3;
    font-size: ${fontSize.header};
    height: ${HeaderHeight}; 
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    position: absolute;
    z-index: 2;
    top: ${sidePadding};
    left: ${sidePadding};
`
const UserImage = styled(Image)`
    width: 30px;
    height: 30px;
    border-radius: 15;
    background: red;
    margin-right: 10px;
`
const Input = styled(TextInput)`
    flex: 1;
    height: ${HeaderHeight};
`
class HeaderComponent extends Component {
    render() {
        return (
            <Header>
                <BurgerIcon onPress={this.props.toggleDrawer} />
                <Input placeholder={'Найти'} />
                <UserImage />
            </Header>
        )
    }
}
const mapStateToProps = state => {
    return {
        messages: state.messageReducer.messages,
        search: state.messageReducer.search,
        drawer: state.drawerReducer.open,
    };
};
const mapDispatchToProps = dispatch => ({
})
export default connect(mapStateToProps, mapDispatchToProps)(HeaderComponent)
