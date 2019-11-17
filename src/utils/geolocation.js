import { Platform, Alert } from 'react-native'
import RNPermissions from 'react-native-permissions'
import Geolocation from 'react-native-geolocation-service'

const getGeoCoords = async () => {
  let status
  let coords = null
  await RNPermissions.check('location').then(async response => {
    status = response
    if (response !== 'authorized') {
      await RNPermissions.request('location').then(response => {
        status = response
      })
    }
    if (status !== 'authorized') {
      if (Platform.OS === 'ios') {
        if (RNPermissions.canOpenSettings()) {
          Alert.alert(
            'Ошибка',
            'Для отправки геолокации необходимо разрешить приложению доступ к соответствующим разделам в настройках',
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
            'Для отправки геолокации необходимо разрешить приложению доступ к соответствующим разделам',
          )
        }
      } else {
        Alert.alert(
          'Ошибка',
          'Для отправки геолокации необходимо разрешить приложению доступ к соответствующим разделам',
        )
      }
    } else {
      try {
        const geolocation = await new Promise((resolve, reject) => {
          Geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 1000,
          })
        })
        coords = geolocation.coords
      } catch (error) {
        Alert.alert(
          'Ошибка',
          error.message ? String(error.message) : String(error),
        )
      }
    }
  })
  return coords
}

export default getGeoCoords
