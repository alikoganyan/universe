import React, { Component } from 'react';
import {
	View,
	Text,
	Dimensions,
	Keyboard,
	TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { SearchIcon, BackIcon } from '../../assets/index';
import { setDialogs } from '../../actions/dialogsActions';
import ImageComponent from '../../common/Image';
import DefaultAvatar from '../../common/DefaultAvatar';
import helper from '../../utils/helpers';
import { socket } from '../../utils/socket';

const {
	Colors,
	sidePadding,
	fontSize,
	HeaderHeight
} = helper;
const { grey3 } = Colors;
const Header = styled(View)
`
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
	left: ${sidePadding}px;
`;
const Left = styled(View)
`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
`;
const HeaderText = styled(Text)
`
	font-size: ${fontSize.header};
	position: relative;
	left: -10px;
	color: ${grey3};
`;
const Right = styled(Left)
`
	justify-content: flex-end;
`;
class HeaderComponent extends Component {
	render() {
		const { user, toProfile, back } = this.props;
		return (
			<Header>
				<Left>
					<BackIcon right onPress={back} />
					<HeaderText>Новый диалог</HeaderText>
				</Left>
				<Right>
					<SearchIcon right />
					<TouchableOpacity onPress={toProfile}>
					{!user.image || user.image === '/images/default_group.png' || user.image === '/images/default_avatar.jpg'
						? <DefaultAvatar size="header" />
						: <ImageComponent source={{ uri: `https://ser.univ.team${user.image}` }} size="header" />
					}
					</TouchableOpacity>
				</Right>
		 	</Header>
		);
	}

	state = {}

	componentDidMount() {
		const { setDialogs } = this.props;
		socket.on('find', ({ result }) => {
			setDialogs(result);
		});
	}

	handleInputChange = (e) => {
		e && socket.emit('find', { text: e });
	}

	handleFocus = () => {
		socket.emit('find');
	}

	onBlur = () => {
		const { user } = this.props;
		socket.emit('dialogs', { userId: user.id });
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