import React, { Component } from 'react';
import { View, Text } from 'react-native';
import FloatingLabel from 'react-native-floating-labels';
import styled from 'styled-components';
import { connect } from 'react-redux';
import helper from '../../utils/helpers';
import { p_restore_password, p_login } from '../../constants/api';
import Button from '../../common/Button';
import sendRequest from '../../utils/request';
import { connectToSocket } from '../../utils/socket';
import { setUser, setAuth, setRegisterUserNumber } from '../../actions/userActions';

const { Colors, fontSize, minPassLength } = helper;
const { blue, red } = Colors;
const Wrapper = styled(View)
`
	padding: 0 20%;
	padding-bottom: 10%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	
`;
const Title = styled(Text)
`
	width: 100%;
	font-size: 15px;
	text-align: center;
	margin-bottom: 20px;
`;
const ControlBar = styled(View)
`
	display: flex;
	justify-content: center;
	width: 100%;
	align-items: center;
`;
const PhoneNumber = styled(View)
`
	display: flex;
	flex-direction: column;
	margin-bottom: 30px;
`;
const Error = styled(Text)
`
	color: ${red};	
	font-size: ${fontSize.sm};
	align-self: center;
`;
const Input = (props) => {
	const {
		autoFocus = false, keyboardType = 'default', children, password = false, value, style, editable, onChangeText
	} = props;
	return (
		<FloatingLabel
			labelStyle={{ fontSize: 11 }}
			inputStyle={{
				fontSize: 11,
				borderWidth: 0,
				borderBottomWidth: 1,
				display: 'flex',
				paddingLeft: 0,
			}}
			keyboardType={keyboardType}
			password={password}
			value={value}
			style={{
				...style,
			}}
			editable={editable}
			onChangeText={onChangeText}
			autoFocus={autoFocus}
		>
			{children}
		</FloatingLabel>
	);
};
class Content extends Component {
	render() {
		const { pass, repass } = this.props;
		const { err } = this.state;
		return (
			<Wrapper>
				<Title>
					Восстановить пароль
				</Title>
				<PhoneNumber>
					<Input
						autoFocus
						style={{ minWidth: '100%' }}
						value={pass}
						onChangeText={this.handleChangePass}
						password
					>
						Новый пароль
					</Input>
					{
						err.type === 'length' || err.type === 'nopass' ? <Error>{err.msg}</Error> : null
					}
					<Input
						style={{ minWidth: '100%' }}
						value={repass}
						onChangeText={this.handleChangeRepass}
						password
					>
						Повторите пароль
					</Input>
					{
						err.type === 'repass' ? <Error>{err.msg}</Error> : <Error />
					}
				</PhoneNumber>
				<ControlBar>
					<Button onPress={this.proceed} background={blue} color="#fff">Сохранить и войти</Button>
				</ControlBar>
			</Wrapper>
		);
	}

	state = {
		pass: '',
		repass: '',
		err: {},
	}

	componentDidMount() {
		// const { register } = this.props;
	}

	handleChangePass = (e) => {
		this.setState({ pass: e });
	}

	handleChangeRepass = (e) => {
		this.setState({ repass: e });
	}

	proceed = () => {
		const { pass, repass } = this.state;
		if (pass === repass && pass.length >= minPassLength) {
			this.checkCode();
		} else {
			const errLength = {
				type: pass.length ? 'length' : 'nopass',
				msg: pass.length ? `пароль должен содержать не меньше ${minPassLength} символов` : 'введите пароль'
			};
			const errRepass = {
				type: 'repass',
				msg: 'пароли не совпадают'
			};
			const err = pass.length < minPassLength ? errLength : errRepass;
			this.setState({ err });
		}
	}

	checkCode = () => {
		const { register } = this.props;
		const { pass, repass } = this.state;
		const { phone, sms } = register;
		sendRequest({
			r_path: p_restore_password,
			method: 'post',
			attr: {
				phone_number: phone,
				new_password: pass,
				repeat_password: repass,
				one_time_password: sms,
			},
			success: () => {
				this.login();
			},
			failFunc: (err) => {
				console.log({ err });
				// const { phone_number, password } = err;
			}
		});
	}

	login = () => {
		const { register, setAuth, setUser, navigate } = this.props;
		const { pass } = this.state;
		const { phone } = register;
		sendRequest({
			r_path: p_login,
			method: 'post',
			attr: {
				phone_number: '+79194274215',
				password: '1111',
			},
			success: (res) => {
				const { access_token, data } = res;
				setAuth(access_token);
				setUser(data);
				this.storeUserData({ ...data, password: pass, access_token, lastLogin: new Date() });
				setTimeout(() => {
					connectToSocket(access_token);
					navigate('Dialogs');
				}, 0);
			},
			failFunc: (err) => {
				console.log({ err });
				navigate('Login');
				// const phone = err.length ? err.filter(e => e.param === 'phone_number')[0] : err.phone_number;
				// const pass = err.length ? err.filter(e => e.param === 'password')[0] : err.password;
			}
		});
	}
}
const mapStateToProps = state => ({
	register: state.userReducer.register,
});
const mapDispatchToProps = dispatch => ({
	setAuth: _ => dispatch(setAuth(_)),
	setUser: _ => dispatch(setUser(_)),
	setRegisterUserNumber: _ => dispatch(setRegisterUserNumber(_)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Content);
