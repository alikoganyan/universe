import React, { Component, Fragment } from 'react'
import { View, Text, TextInput, Image, Platform, Dimensions, Keyboard } from 'react-native'
import { SearchIcon, BurgerIcon, CloseIcon } from '../../assets/index'
import { openDrawer } from '../../actions/drawerActions'
import { setDialogs } from '../../actions/dialogsActions'
import { connect } from 'react-redux'
import styled from 'styled-components'
import helper from '../../Helper/helper'
const { Colors, sidePadding, sidePaddingNumber, fontSize, HeaderHeight, socket } = helper;
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
    margin-right: 10px;
`
const Input = styled(TextInput)`
    flex: 1;
    height: ${HeaderHeight};
`
class HeaderComponent extends Component {
    render() {
        const { user } = this.props
        const { input } = this.state;
        return (
            <Header>
                <BurgerIcon onPress={this.props.toggleDrawer} />
                <Input value={input} onChangeText={this.handleInputChange}
                    onFocus={this.handleFocus}
                    // onBlur={this.handleBlur}
                    placeholder={'Поиск'} />
                {this.state.focused ?
                    <CloseIcon onPress={this.onBlur}/>
                    : <UserImage source={{ uri: user.image }} />}
            </Header>
        )
    }
    state = {
        input: '',
        focused: false
    }
    componentDidMount() {
        const { setDialogs } = this.props;
        socket.on('find', ({ result }) => {
            setDialogs(result)
        })
    }
    handleInputChange = (e) => {
        this.setState({ input: e })
        e && socket.emit('find', { text: e })

    }
    handleFocus = () => {
        socket.emit('find')
        this.setState({ focused: true });
    }
    onBlur = () => {
        const { user } = this.props
        this.setState({ focused: false });
        socket.emit('dialogs', { userId: user.id });
        Keyboard.dismiss()
    }
}

const mapStateToProps = state => {
    return {
        dialogs: state.dialogsReducer.dialogs,
        messages: state.messageReducer.messages,
        search: state.messageReducer.search,
        drawer: state.drawerReducer.open,
        user: state.userReducer.user.user
    };
};
const mapDispatchToProps = dispatch => ({
    setDialogs: _ => dispatch(setDialogs(_))
})
export default connect(mapStateToProps, mapDispatchToProps)(HeaderComponent)
