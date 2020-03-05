import { Alert, Platform, AsyncStorage } from 'react-native'
import RNPermissions from 'react-native-permissions'
import RNDeviceInfo from 'react-native-device-info'
import firebase from 'react-native-firebase'
import sendRequest from '../utils/request'
import { p_notifications } from '../constants/api'
import { store } from '../reducers/store'

export const GET_PERMISSION_STATUS = 'GET_PUSHES_PERMISSION_STATUS'
export const ASK_PERMISSION_STATUS = 'ASK_PUSHES_PERMISSION_STATUS'
export const PERMISSION_STATUS_FULFILLED = 'PUSHES_PERMISSION_STATUS_FULFILLED'
export const PERMISSION_STATUS_REJECTED = 'PUSHES_PERMISSION_STATUS_REJECTED'
export const GET_PUSH_TOKEN = 'GET_PUSH_TOKEN'
export const PUSH_TOKEN_FULFILLED = 'PUSH_TOKEN_FULFILLED'
export const PUSH_TOKEN_REJECTED = 'PUSH_TOKEN_REJECTED'
export const ENABLE_USER_PUSHES = 'ENABLE_USER_PUSHES'
export const DISABLE_USER_PUSHES = 'DISABLE_USER_PUSHES'
export const USER_PUSHES_REQUEST = 'USER_PUSHES_REQUEST'
export const USER_PUSHES_FULFILLED = 'USER_PUSHES_FULFILLED'
export const USER_PUSHES_REJECTED = 'USER_PUSHES_REJECTED'

export const getPushesPermissionStatusAndToken = dispatch => async () => {
  try {
    dispatch({ type: GET_PERMISSION_STATUS })
    const isEnabled = await firebase.messaging().hasPermission()
    dispatch({ type: PERMISSION_STATUS_FULFILLED, payload: isEnabled })
    if (isEnabled) {
      dispatch({ type: GET_PUSH_TOKEN })
      const newFcmToken = await firebase.messaging().getToken()
      const oldFcmToken = await AsyncStorage.getItem('fcmToken')
      if (newFcmToken) {
        AsyncStorage.getItem('user').then(res => {
          const user = JSON.parse(res)
          if (user && oldFcmToken) {
            if (newFcmToken !== oldFcmToken) {
              sendFcmToken(newFcmToken)
            }
            AsyncStorage.setItem('fcmToken', newFcmToken)
          }
        })
        dispatch({ type: PUSH_TOKEN_FULFILLED, payload: newFcmToken })
      }

      firebase.messaging().onTokenRefresh(newFcmToken => {
        AsyncStorage.getItem('fcmToken').then(oldFcmToken => {
          if (oldFcmToken) {
            AsyncStorage.getItem('user').then(res => {
              const user = JSON.parse(res)
              if (user) {
                if (newFcmToken !== oldFcmToken) {
                  sendFcmToken(newFcmToken)
                  AsyncStorage.setItem('fcmToken', newFcmToken)
                }
              }
            })
          }
        })
      })
    }
  } catch (error) {
    dispatch({ type: PERMISSION_STATUS_REJECTED })
  }
}

const sendFcmToken = fcmToken => {
  if (fcmToken) {
    store.dispatch({ type: PUSH_TOKEN_FULFILLED, payload: fcmToken })
    store.dispatch({ type: USER_PUSHES_REQUEST })
    sendRequest({
      r_path: p_notifications,
      method: 'patch',
      attr: {
        enable: true,
        push_token: fcmToken,
        deviceId: RNDeviceInfo.getDeviceId(),
        platform: Platform.OS,
      },
      success: () => {
        store.dispatch({ type: USER_PUSHES_FULFILLED })
        store.dispatch({ type: ENABLE_USER_PUSHES })
      },
      failFunc: () => {
        store.dispatch({ type: USER_PUSHES_REJECTED })
        store.dispatch({ type: DISABLE_USER_PUSHES })
      },
      full_res: true,
    })
  }
}

export const trySignToPushes = dispatch => async (firstTimeMode = false) => {
  try {
    dispatch({ type: GET_PERMISSION_STATUS })
    const isEnabled = await firebase.messaging().hasPermission()
    dispatch({ type: PERMISSION_STATUS_FULFILLED, payload: isEnabled })
    let fcmToken = ''
    if (isEnabled) {
      fcmToken = await firebase.messaging().getToken()
      AsyncStorage.setItem('fcmToken', fcmToken)
    } else {
      try {
        dispatch({ type: ASK_PERMISSION_STATUS })
        await firebase.messaging().requestPermission()
        fcmToken = await firebase.messaging().getToken()
      } catch (error) {
        if (firstTimeMode) {
          dispatch({ type: PUSH_TOKEN_REJECTED, payload: error })
        } else {
          if (Platform.OS === 'ios') {
            if (RNPermissions.canOpenSettings()) {
              Alert.alert(
                'Ошибка',
                'Для получения уведомлений необходимо включить их в настройках',
                [
                  { text: 'ОК', onPress: () => {} },
                  {
                    text: 'Настройки',
                    onPress: () => {
                      RNPermissions.openSettings()
                    },
                  },
                ],
              )
            } else {
              Alert.alert(
                'Ошибка',
                'Для получения уведомлений необходимо включить их в настройках',
              )
            }
          } else {
            Alert.alert(
              'Ошибка',
              'Для получения уведомлений необходимо включить их в настройках',
            )
          }
        }
      }
    }
    sendFcmToken(fcmToken)
  } catch (error) {
    dispatch({ type: PERMISSION_STATUS_REJECTED })
  }
}

export const requestDisablePushes = dispatch => async (token = '') => {
  try {
    dispatch({ type: USER_PUSHES_REQUEST })
    sendRequest({
      r_path: p_notifications,
      method: 'patch',
      attr: {
        enable: false,
        push_token: token,
        deviceId: RNDeviceInfo.getDeviceId(),
        platform: Platform.OS,
      },
      success: () => {
        dispatch({ type: USER_PUSHES_FULFILLED })
        dispatch({ type: DISABLE_USER_PUSHES })
      },
      failFunc: () => {
        dispatch({ type: USER_PUSHES_REJECTED })
      },
      full_res: true,
    })
  } catch (e) {
    dispatch({ type: USER_PUSHES_REJECTED })
  }
}
