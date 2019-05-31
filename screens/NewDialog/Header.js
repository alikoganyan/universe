import React, { Component, Fragment } from 'react'
import { View, Text, TextInput, Image, Platform, Dimensions, Keyboard, TouchableOpacity } from 'react-native'
import { SearchIcon, BurgerIcon, CloseIcon, BackIcon } from '../../assets/index'
import { openDrawer } from '../../actions/drawerActions'
import { setDialogs } from '../../actions/dialogsActions'
import ImageComponent from '../../common/Image'
import { connect } from 'react-redux'
import styled from 'styled-components'
import helper from '../../utils/helpers'
import { socket } from '../../utils/socket'

const { Colors, sidePadding, fontSize, HeaderHeight } = helper;
const { blue } = Colors;
const Header = styled(View)`
    width: ${Dimensions.get('window').width - (sidePadding * 2)}px;
    background-color: ${Colors.background};
    border-radius: 3;
    font-size: ${fontSize.header};
    height: ${HeaderHeight}; 
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    position: absolute;
    
    z-index: 2;
    top: 1%;
    left: ${sidePadding}px;
`
const UserImage = styled(Image)`
    width: 30px;
    height: 30px;
    border-radius: 15;
    margin-left: 8%;
`
const Input = styled(TextInput)`
    flex: 1;
    height: ${HeaderHeight};
`
const Left = styled(View)`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
`
const HeaderText = styled(Text)`
    font-size: ${fontSize.header};
    position: relative;
    left: -10px;
`
const Right = styled(Left)`
    justify-content: flex-end;
`
const MarginRight = styled(View)`
margin-right: ${sidePadding}px;
`
class HeaderComponent extends Component {
    render() {
        const { user, toProfile, back } = this.props
        const { input } = this.state;
        return (
            <Header>
                <Left>
                    <BackIcon right onPress={back} />
                    <HeaderText>Новый диалог</HeaderText>
                </Left>
                <Right>
                    <SearchIcon right />
                    <TouchableOpacity onPress={toProfile}>
                        <ImageComponent source={{ uri: `http://ser.univ.team${user.image}` }} size={'header'}/>
                    </TouchableOpacity>
                </Right>
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
    componentWillUpdate() {
        socket.removeListener('find');
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
