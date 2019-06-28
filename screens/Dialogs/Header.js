import React, { Component } from 'react';
import {
  View, TextInput, TouchableOpacity, Platform, Dimensions, Keyboard
} from 'react-native';
import { connect } from 'react-redux';
import styled from 'styled-components';
import {
  BurgerIcon, CloseIcon
} from '../../assets/index';
import { setDialogs } from '../../actions/dialogsActions';
import ImageComponent from '../../common/Image';
import DefaultAvatar from '../../common/DefaultAvatar';
import sendRequest from '../../utils/request';
import { p_search_dialogs } from '../../constants/api';
import helper from '../../utils/helpers';
import { socket } from '../../utils/socket';

const {
  Colors, sidePadding, fontSize, HeaderHeight, borderRadius
} = helper;
const { white, lightBlue2 } = Colors;
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
    padding: 10px 0;
    z-index: 1;
    left: ${sidePadding}px;
    margin-top: 10px;
`;
const Input = styled(TextInput)`
    flex: 1;
    height: ${HeaderHeight};
    position: relative;
    left: -4px;
    font-size: ${fontSize.sm};
`;
class HeaderComponent extends Component {
  render() {
    const { user, toggleDrawer } = this.props;
    const { input, focused } = this.state;
    return (
      <Header
        style={{
          shadowColor: Platform.OS === 'ios' ? lightBlue2 : white,
          shadowOffset: {
            width: 0,
            height: Platform.OS === 'ios' ? 1 : 25,
          },
          shadowOpacity: Platform.OS === 'ios' ? 0.1 : 1,
          shadowRadius: 4,

          elevation: Platform.OS === 'ios' ? 1 : 4,
        }}
      >
        <BurgerIcon onPress={toggleDrawer} right />
        <Input
          value={input}
          onChangeText={this.handleInputChange}
          onFocus={this.handleFocus}
          placeholder="Поиск"
        />
        {focused
          ? <CloseIcon onPress={this.onBlur} marginLeft={false} marginRight right />
          : (
            <TouchableOpacity onPress={this.toProfile} style={{ marginRight: sidePadding }}>
              {!user.image || user.image === '/images/default_group.png' || user.image === '/images/default_avatar.jpg'
                ? <DefaultAvatar size="header" />
                : <ImageComponent source={{ uri: `http://ser.univ.team${user.image}` }} size="header" />
                        }
            </TouchableOpacity>
          )}
      </Header>
    );
  }

    state = {
      input: '',
      focused: false
    }

    componentDidMount() {
      const { setDialogs } = this.props;
      socket.on('find', ({ result }) => {
        setDialogs(result);
      });
    }

    toProfile = (e) => {
      const { toProfile } = this.props;
      toProfile();
    }

    handleInputChange = (e) => {
      const { user, setDialogs } = this.props;
      this.setState({ input: e });
      if (e && e.length > 1) {
        sendRequest({
          r_path: p_search_dialogs,
          method: 'post',
          attr: {
            name: e,
          },
          success: (res) => {
            const { dialogs, groups } = res;
            const newDialogs = [...dialogs, ...groups];
            setDialogs(newDialogs);
          },
          failFunc: (err) => {
            console.log(err);
          }
        });
      } else {
        socket.emit('get_dialogs', { id: user._id });
      }
    }

    handleFocus = () => {
      this.setState({ focused: true });
    }

    onBlur = () => {
      const { user } = this.props;
      this.setState({ focused: false, input: '' });
      socket.emit('dialogs', { userId: user._id });
      socket.emit('get_dialogs', { id: user._id });
      Keyboard.dismiss();
    }
}

const mapStateToProps = state => ({
  dialogs: state.dialogsReducer.dialogs,
  messages: state.messageReducer.messages,
  search: state.messageReducer.search,
  drawer: state.drawerReducer.open,
  user: state.userReducer.user
});
const mapDispatchToProps = dispatch => ({
  setDialogs: _ => dispatch(setDialogs(_))
});
export default connect(mapStateToProps, mapDispatchToProps)(HeaderComponent);
