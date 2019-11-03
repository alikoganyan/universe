import { Alert, Platform } from 'react-native'
import firebase from 'react-native-firebase'

export const createNotificationListeners = async () => {
  /*
   * Triggered when a particular notification has been received in foreground
   * */
  this.notificationListener = firebase
    .notifications()
    .onNotification(notification => {
      if (Platform.OS === 'android') {
        notification.android.setChannelId(
          firebase.notifications.Android.Importance.Default,
        )
      }
      // const { title, body } = notification
      // this.showAlert(title, body);
      firebase.notifications().displayNotification(notification)
    })

  /*
   * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
   * */
  this.notificationOpenedListener = firebase
    .notifications()
    .onNotificationOpened(notificationOpen => {
      // const { title, body } = notificationOpen.notification
      // this.showAlert(title, body);
    })

  /*
   * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
   * */
  // const notificationOpen = await firebase
  //   .notifications()
  //   .getInitialNotification();
  // // if (notificationOpen) {
  // //   const { title, body } = notificationOpen.notification;
  // //   this.showAlert(title, body);
  // // }
  /*
   * Triggered for data only payload in foreground
   * */
  this.messageListener = firebase.messaging().onMessage(message => {})

  this.showAlert = (title, body) => {
    Alert.alert(title, body, [{ text: 'OK', onPress: () => {} }], {
      cancelable: false,
    })
  }
}
