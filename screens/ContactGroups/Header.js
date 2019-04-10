import React, { Component } from 'react'
import { View, Text, SafeAreaView, Image, Platform, ActionSheetIOS } from 'react-native'
import { BackIcon, AddIcon, SearchIcon } from '../../assets/index'
import styled from 'styled-components'
import helper from '../../utils/helpers'
import { connect } from 'react-redux'
import { ImageComponent } from '../../common'
const { HeaderHeight, sidePadding, sidePaddingNumber } = helper;
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
    background: red;
    margin-left:${sidePaddingNumber};
`
const MarginRight = styled(View)`
margin-right: ${sidePaddingNumber};
`

class HeaderComponent extends Component {
    render() {
        const { user } = this.props;
        console.log(user.image)
        return (
            <Header>
                <Left>
                    <MarginRight>
                        <BackIcon onPress={this.props.back} />
                    </MarginRight>
                    <Text>
                        Контакты
                    </Text>
                </Left>
                <Right>
                    <SearchIcon />
                    {/* <AddIcon /> */}
                    <ImageComponent source={{ uri: user.image }} style={{marginLeft: 10}}/>
                </Right>
            </Header>
        )
    }
}
const mapStateToProps = state => {
    return {
        user: state.userReducer.user
    };
};
const mapDispatchToProps = dispatch => ({
    setDialogs: _ => dispatch(setDialogs(_))
})
export default connect(mapStateToProps, mapDispatchToProps)(HeaderComponent)