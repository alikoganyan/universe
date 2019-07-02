import { Permissions, Notifications, IntentLauncherAndroid, Constants } from 'expo';
import { Alert, Linking, Platform } from 'react-native';
import sendRequest from '../utils/request';
import { p_notifications } from '../constants/api';
export const GET_PERMISSION_STATUS = 'GET_PERMISSION_STATUS';
export const ASK_PERMISSION_STATUS = 'ASK_PERMISSION_STATUS';
export const PERMISSION_STATUS_FULFILLED = 'PERMISSION_STATUS_FULFILLED';
export const PERMISSION_STATUS_REJECTED = 'PERMISSION_STATUS_REJECTED';
export const GET_PUSH_TOKEN = 'GET_PUSH_TOKEN';
export const PUSH_TOKEN_FULFILLED = 'PUSH_TOKEN_FULFILLED';
export const PUSH_TOKEN_REJECTED = 'PUSH_TOKEN_REJECTED';
export const ENABLE_USER_PUSHES = 'ENABLE_USER_PUSHES';
export const DISABLE_USER_PUSHES = 'DISABLE_USER_PUSHES';
export const USER_PUSHES_REQUEST = 'USER_PUSHES_REQUEST';
export const USER_PUSHES_FULFILLED = 'USER_PUSHES_FULFILLED';
export const USER_PUSHES_REJECTED = 'USER_PUSHES_REJECTED';

export const getPushesPermissionStatusAndToken = dispatch => async () => {
  try {
    dispatch({ type: GET_PERMISSION_STATUS });
    const { status = '' } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    dispatch({ type: PERMISSION_STATUS_FULFILLED, payload: status });
    if (status === 'granted') {
      dispatch({type: GET_PUSH_TOKEN});
      const token = await Notifications.getExpoPushTokenAsync();
      dispatch({type: PUSH_TOKEN_FULFILLED, payload: token});
    }
  } catch (error) {
    dispatch({ type: PERMISSION_STATUS_REJECTED });
  }
};

export const trySignToPushes = dispatch => async (firstTimeMode = false) => {
  try {
    dispatch({ type: GET_PERMISSION_STATUS });
    const { status: existingStatus = '' } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    dispatch({ type: PERMISSION_STATUS_FULFILLED, payload: existingStatus });
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      dispatch({ type: ASK_PERMISSION_STATUS });
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
      dispatch({ type: PERMISSION_STATUS_FULFILLED, payload: finalStatus });
    }
    if (!firstTimeMode && finalStatus !== 'granted') {
      Alert.alert('Ошибка', 'Необходимо разрешить доступ к уведомлениям в настройках', [
        {text: 'ОК', onPress: () => {}},
        {
          text: 'Настройки', onPress: () => {
            if (Platform.OS === 'android') {
              IntentLauncherAndroid.startActivityAsync(
                IntentLauncherAndroid.ACTION_APPLICATION_DETAILS_SETTINGS,
                {},
                'package:' + Constants.manifest.android.package
              )
            } else {
              Linking.canOpenURL('app-settings:') && Linking.openURL('app-settings:');
            }
          }
        },
      ]);
    }
    if (finalStatus === 'granted') {
      try {
        dispatch({ type: GET_PUSH_TOKEN });
        const token = await Notifications.getExpoPushTokenAsync();
        dispatch({type: PUSH_TOKEN_FULFILLED, payload: token});
        dispatch({type: USER_PUSHES_REQUEST});
        sendRequest({
          r_path: p_notifications,
          method: 'patch',
          attr: {
            enable: true,
            push_token: token,
            deviceId: Constants.deviceId,
          },
          success: (data) => {
            dispatch({type: USER_PUSHES_FULFILLED});
            dispatch({type: ENABLE_USER_PUSHES});
          },
          failFunc: (e) => {
            dispatch({type: USER_PUSHES_REJECTED});
            dispatch({type: DISABLE_USER_PUSHES});
          },
          full_res: true
        });
      } catch (e) {
        dispatch({ type: PUSH_TOKEN_REJECTED });
      }
    }
  } catch (error) {
    dispatch({ type: PERMISSION_STATUS_REJECTED });
  }
};

export const requestDisablePushes = dispatch => async (token = '') => {
  try {
    dispatch({type: USER_PUSHES_REQUEST});
    sendRequest({
      r_path: p_notifications,
      method: 'patch',
      attr: {
        enable: false,
        push_token: token,
        deviceId: Constants.deviceId,
      },
      success: (data) => {
        dispatch({type: USER_PUSHES_FULFILLED});
        dispatch({type: DISABLE_USER_PUSHES});
      },
      failFunc: (e) => {
        dispatch({type: USER_PUSHES_REJECTED});
      },
      full_res: true
    });
  } catch (e) {
    dispatch({type: USER_PUSHES_REJECTED});
  }
};
