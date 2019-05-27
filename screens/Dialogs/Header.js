import React, { Component, Fragment } from 'react'
import { View, Text, TextInput, TouchableOpacity, Platform, Dimensions, Keyboard } from 'react-native'
import { SearchIcon, BurgerIcon, CloseIcon } from '../../assets/index'
import { openDrawer } from '../../actions/drawerActions'
import { setDialogs } from '../../actions/dialogsActions'
import { connect } from 'react-redux'
import { ImageComponent } from '../../common'
import sendRequest from '../../utils/request'
import { p_search_dialogs } from '../../constants/api'
import styled from 'styled-components'
import helper from '../../utils/helpers'
import { socket } from '../../utils/socket'
import { SearchShadow } from '../../assets/'
const { Colors, sidePadding, fontSize, HeaderHeight, borderRadius } = helper;
const Header = styled(View)`
    width: ${Dimensions.get('window').width - (sidePadding * 2)}px;
    background-color: ${Colors.background};
    border: 1px solid ${Colors.border};
    border-radius: ${borderRadius};
    font-size: ${fontSize.header};
    height: ${44}; 
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    position: absolute;
    padding: 10px ${sidePadding}px;
    z-index: 2;
    top: 1%;
    left: ${sidePadding}px;
`
const Input = styled(TextInput)`
    flex: 1;
    height: ${HeaderHeight};
    position: relative;
    left: -4px;
    font-size: ${fontSize.sm};
`
class HeaderComponent extends Component {
    render() {
        const { user } = this.props
        const { input } = this.state;
        return (
            <Header
                style={{
                    shadowColor: Platform.OS === 'ios' ? '#191e5aca' : 'white',
                    shadowOffset: {
                        width: 0,
                        height: Platform.OS === 'ios' ? 1 : 25,
                    },
                    shadowOpacity: Platform.OS === 'ios' ? 0.1 : 1,
                    shadowRadius: 4,

                    elevation: Platform.OS === 'ios' ? 1 : 4,
                }}>
                <BurgerIcon onPress={this.props.toggleDrawer} right />
                <Input value={input} onChangeText={this.handleInputChange}
                    onFocus={this.handleFocus}
                    placeholder={`Поиск`} />
                {this.state.focused ?
                    <CloseIcon onPress={this.onBlur} />
                    : <TouchableOpacity onPress={this.toProfile}>
                        <ImageComponent source={{ uri: `http://ser.univ.team${user.image}` }} size={34}/>
                    </TouchableOpacity>}
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
    toProfile = (e) => {
        const { toProfile } = this.props
        toProfile()
    }
    handleInputChange = (e) => {
        this.setState({ input: e })
        e && e.length > 1 && sendRequest({
            r_path: p_search_dialogs,
            method: 'post',
            attr: {
                name: e,
            },
            success: (res) => {
                console.log(res)
            },
            failFunc: (err) => {
                console.log(err)
            }
        })

    }
    handleFocus = () => {
        this.setState({ focused: true });
    }
    onBlur = () => {
        const { user } = this.props
        this.setState({ focused: false });
        socket.emit('dialogs', { userId: user.id });
        Keyboard.dismiss()
    }
}

const mapStateToProps = state => ({
    dialogs: state.dialogsReducer.dialogs,
    messages: state.messageReducer.messages,
    search: state.messageReducer.search,
    drawer: state.drawerReducer.open,
    user: state.userReducer.user
})
const mapDispatchToProps = dispatch => ({
    setDialogs: _ => dispatch(setDialogs(_))
})
export default connect(mapStateToProps, mapDispatchToProps)(HeaderComponent)
