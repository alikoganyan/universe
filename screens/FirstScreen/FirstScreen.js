import React, { Component } from 'react';
import { View, AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
import { setUser, setAuth, setRegisterUserNumber } from '../../actions/userActions';
import { connectToSocket } from '../../utils/socket';
import Login from '../Login/Login';
import Dialogs from '../Dialogs/Dialogs';
import SplashScreen from '../SplashScreen/SplashScreen';

class FirstScreen extends Component {
	render() {
		const { logged, loaded } = this.state;
		const { navigation } = this.props;
		return loaded ? (
			<View>
			  	{
					logged
					  ? <Dialogs navigation={navigation} />
					  : <Login navigation={navigation} />
				}
			</View>
		) : <SplashScreen />;
	}

	state = {
		logged: false,
		loaded: false,
	}

	componentDidMount() {
		const { setUser, setAuth } = this.props;
		AsyncStorage.getItem('user')
			.then((res) => {
				const value = JSON.parse(res);
				const tokenActive = value;
				if (value) {
					setUser({ ...value });
					setAuth(value.access_token);
					connectToSocket(value.access_token);
					setTimeout(() => {
						this.setState({ logged: true });
					}, 0);
				}
				setTimeout(() => this.setState({ loaded: true }), 0);
			});
	}
}

const mapStateToProps = state => ({
	id: state.userReducer.id
});
const mapDispatchToProps = dispatch => ({
	setAuth: _ => dispatch(setAuth(_)),
	setUser: _ => dispatch(setUser(_)),
	setRegisterUserNumber: _ => dispatch(setRegisterUserNumber(_)),
});
export default connect(mapStateToProps, mapDispatchToProps)(FirstScreen);
