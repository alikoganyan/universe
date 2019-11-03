import React, { Component } from 'react'
import { BackHandler, StatusBar, AppState, NetInfo } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import GlobalFont from 'react-native-global-font'
import firebase from 'react-native-firebase'
// import { Font, Notifications } from 'expo';
import { store } from './reducers/store'
import { Provider } from 'react-redux'
import createRootNavigator from './screens/Navigator'
import { getPushesPermissionStatusAndToken } from './actions/pushesActions'
import { connectToSocket } from './utils/socket'
import { setUser, setAuth } from './actions/userActions'
import { setDialogsUserId } from './actions/dialogsActions'
import { createNotificationListeners } from './utils/fcm'

// const Roboto = require('./assets/fonts/Roboto-Regular.ttf')

// eslint-disable-next-line no-console
console.disableYellowBox = true

export default class AppComponent extends Component {
  render() {
    const { loaded, logged } = this.state
    const Navigator = createRootNavigator(loaded && logged)

    if (!loaded) {
      return null
    }
    // if (!connected && !logged) {
    //   return <OfflineScreen />
    // }
    return (
      <Provider store={store}>
        <StatusBar backgroundColor="white" barStyle="dark-content" />
        {/* {logged && !connected && <Offline />} */}
        <Navigator />
      </Provider>
    )
  }

  state = {
    loaded: false,
    logged: false,
    connected: true,
  }

  appState = AppState.currentState

  async componentDidMount() {
    NetInfo.addEventListener(
      'connectionChange',
      this.handleFirstConnectivityChange,
    )
    createNotificationListeners()
    firebase.notifications().setBadge(0)
    getPushesPermissionStatusAndToken(store.dispatch)()

    AsyncStorage.getItem('user')
      .then(res => {
        const value = JSON.parse(res)
        if (value) {
          AsyncStorage.setItem(
            'user',
            JSON.stringify({ ...value, lastLogin: new Date() }),
          )
          store.dispatch(setUser(value))
          store.dispatch(setDialogsUserId(value._id))
          store.dispatch(setAuth(value.access_token))
          connectToSocket(value.access_token)
          this.setState({ logged: true })
        }
      })
      .finally(() => {
        this.setState({ loaded: true })
      })
    // await Font.loadAsync({
    //     'Roboto-Regular': Roboto
    // });
    GlobalFont.applyGlobal('Roboto-Regular')
    BackHandler.addEventListener('hardwareBackPress', this._handleBackButton)
    AppState.addEventListener('change', this._handleAppStateChange)
    // this._notificationSubscription = Notifications.addListener(this._handleNotification);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this._handleBackButton)
    NetInfo.removeEventListener(
      'connectionChange',
      this.handleFirstConnectivityChange,
    )
  }

  handleFirstConnectivityChange = connectionInfo => {
    if (connectionInfo.type === 'none') {
      this.setState({
        connected: false,
      })
    } else {
      this.setState({
        connected: true,
      })
    }
  }

  _handleBackButton = () => {
    BackHandler.exitApp()
  }

  _handleAppStateChange = nextAppState => {
    this.appState = nextAppState
  }

  _handleNotification = notification => {
    // Notifications.setBadgeNumberAsync(notification.badge);
    // if (this.appState === 'active' && notification.origin === 'received') {
    //     Notifications.dismissNotificationAsync(notification.notificationId);
    // }
  }

  __handleNotificationClick = data => {}

  _loadResourcesAsync = async () =>
    Promise.all([
      // Asset.loadAsync([
      //   require('./assets/svg/Add.svg'),
      //   require('./assets/svg/Arrow_back.svg'),
      //   require('./assets/svg/Arrow_down_light.svg'),
      //   require('./assets/svg/Close.svg'),
      //   require('./assets/svg/Edit.svg'),
      //   require('./assets/svg/Like.svg'),
      //   require('./assets/svg/Likes.svg'),
      //   require('./assets/svg/Menu.svg'),
      //   require('./assets/svg/News.svg'),
      //   require('./assets/svg/Settings.svg'),
      //   require('./assets/svg/Tasks.svg'),
      // ]),
      // Font.loadAsync({
      //     Roboto
      // })
    ])
}
