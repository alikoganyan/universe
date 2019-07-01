import React, { Component } from 'react';
import {
    BackHandler,
    AsyncStorage,
    StatusBar
} from 'react-native';
import GlobalFont from 'react-native-global-font';
import { Font } from 'expo';
import { store } from './reducers/store';
import createRootNavigator from './screens/Navigator';
import { SplashScreen } from './screens';
import { Provider } from 'react-redux';
import { setUser, setAuth } from './actions/userActions';
import { connectToSocket } from './utils/socket';

const Roboto = require('./assets/fonts/Roboto-Regular.ttf');

console.disableYellowBox = true;

export default class AppComponent extends Component {
    render() {
        const { loaded, logged } = this.state;
        const Navigator = createRootNavigator(loaded && logged);
        return (
            <Provider store={store}>
                <StatusBar backgroundColor="white" barStyle="dark-content" />
                {loaded ? <Navigator /> : <SplashScreen />}
            </Provider>
        );
    }

    state = {
        loaded: false,
        logged: false,
    };

    async componentDidMount() {
        AsyncStorage.getItem('user').then((res) => {
            const value = JSON.parse(res);
            if (value) {
                AsyncStorage.setItem('user', JSON.stringify({ ...value, lastLogin: new Date() }));
                store.dispatch(setUser(value));
                store.dispatch(setAuth(value.access_token));
                connectToSocket(value.access_token);
                setTimeout(() => {
                    this.setState({ logged: true });
                }, 0);
            }
        });
        await Font.loadAsync({
            'Roboto-Regular': Roboto
        });
        GlobalFont.applyGlobal('Roboto-Regular');
        this.setState({ loaded: true });

        BackHandler.addEventListener('hardwareBackPress', () => {});
    }
}