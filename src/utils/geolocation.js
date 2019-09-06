import { Platform, Alert } from 'react-native'
import RNPermissions from 'react-native-permissions'

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
      } catch (error) {
        Alert.alert(error.message ? String(error.message) : String(error))
      }
      const geolocation = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 100,
        })
      })
      coords = geolocation.coords
    }
  })
  return coords
}

export default getGeoCoords
