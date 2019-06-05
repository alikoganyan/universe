import React, { Component } from 'react'
import { View, Text, SafeAreaView, Image, Platform, ActionSheetIOS, TouchableOpacity } from 'react-native'
import { BackIcon, AddIcon, SearchIcon } from '../../assets/index'
import styled from 'styled-components'
import helper from '../../utils/helpers'
import { connect } from 'react-redux'
import ImageComponent from '../../common/Image'
const { HeaderHeight, sidePadding, fontSize, Colors } = helper;
const { green, grey3 } = Colors
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
const Right = styled(View)`
    display: flex;
    flex-direction: row;
    align-items: center;
`
const Center = styled(View)`
`
const UserImage = styled(Image)`
    width: 30px;
    height: 30px;
    border-radius: 15px;
    margin-left:${sidePadding}px;
`
const MarginRight = styled(View)`
    margin-right: ${sidePadding}px;
`
const HeaderText = styled(Text)`
    font-size: ${fontSize.header};
    position: relative;
    left: -10px;
    color: ${grey3};
`

class HeaderComponent extends Component {
    render() {
        const { user } = this.props;
        return (
            <Header>
                <Left>
                    <BackIcon onPress={this.props.back} right />
                    <HeaderText>
                        Контакты
                    </HeaderText>
                </Left>
                <Right>
                    <SearchIcon right />
                    {/* <AddIcon onPress={this.addContact} right /> */}
                    <TouchableOpacity onPress={this.toProfile}>
                        <ImageComponent source={{ uri: `http://ser.univ.team${user.image}` }} size={'header'} style={{ marginLeft: 10 }} />
                    </TouchableOpacity>
                </Right>
            </Header>
        )
    }
    addContact = e => {
        const { navigate } = this.props;
        navigate('NewContact')
    }
    toProfile = () => {
        const { navigate } = this.props;
        navigate('Profile')
    }
}
const mapStateToProps = state => ({
    user: state.userReducer.user
});
const mapDispatchToProps = dispatch => ({
    setDialogs: _ => dispatch(setDialogs(_))
})
export default connect(mapStateToProps, mapDispatchToProps)(HeaderComponent)