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
import { setInternetConnection } from './actions/baseActions'
import { setSendingMessages } from './actions/messageActions'
// import OfflineNotice from './common/OfflineNotice'

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
    return (
      <Provider store={store}>
        <StatusBar backgroundColor="white" barStyle="dark-content" />
        {/* {logged && !connected && <Offline />} */}
        <Navigator />
        {/*{!connected && (*/}
        {/*  <OfflineNotice*/}
        {/*    text="Соединение..."*/}
        {/*    bgColor="#b52424"*/}
        {/*    conntecionError*/}
        {/*  />*/}
        {/*)}*/}
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
    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this.handleFirstConnectivityChange,
    )
    getPushesPermissionStatusAndToken(store.dispatch)()
    const notifications = firebase.notifications()
    notifications.setBadge(0)
    notifications.removeAllDeliveredNotifications()
    notifications.cancelAllNotifications()

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

    AsyncStorage.getItem('failedMessages').then(res => {
      const value = JSON.parse(res)
      if (value) {
        store.dispatch(setSendingMessages(value))
      }
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
    NetInfo.isConnected.removeEventListener(
      'connectionChange',
      this.handleFirstConnectivityChange,
    )
  }

  handleFirstConnectivityChange = connected => {
    // console.log(connected);
    store.dispatch(setInternetConnection(connected))
    this.setState({ connected })
  }

  _handleBackButton = () => {
    BackHandler.exitApp()
  }

  _handleAppStateChange = nextAppState => {
    if (nextAppState === 'active') {
      firebase.notifications().setBadge(0)
      firebase.notifications().removeAllDeliveredNotifications()
      firebase.notifications().cancelAllNotifications()
    }

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
