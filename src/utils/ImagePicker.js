import { Platform, Alert } from 'react-native'
import RNImagePicker from 'react-native-image-picker'
import RNPermissions from 'react-native-permissions'

const pickerOptions = {
  title: null,
  takePhotoButtonTitle: 'Камера...',
  chooseFromLibraryButtonTitle: 'Выбрать из галереи...',
  cancelButtonTitle: 'Отмена',
  mediaType: 'photo',
  noData: true, // disable base64
  // maxWidth: 1300,
  // maxHeight: 1300,
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
  permissionDenied: {
    // Android
    title: 'Доступ запрещен',
    text:
      'Для выбора фото из галереи или снимка камеры необходимо разрешить приложению доступ к соответствующим разделам',
    reTryTitle: 'Настройки',
    okTitle: 'ОК',
  },
}

const parseImageResponse = (response = {}) => {
  const { fileName = '', uri = '', type = '' } = response
  const resultFileName =
    fileName || (uri ? uri.substring(uri.lastIndexOf('/') + 1) : 'image.jpg')
  const fileNameType = fileName ? /(?:\.([^.]+))?$/.exec(fileName)[0] : ''
  const fileUriType = uri ? /(?:\.([^.]+))?$/.exec(uri)[0] : ''
  const resultType = type || fileNameType || fileUriType || 'image/jpeg'
  return {
    ...response,
    imageFormData: {
      uri,
      name: resultFileName,
      type: resultType,
    },
  }
}

const getImageFromPicker = (success, reject) => {
  RNImagePicker.showImagePicker(pickerOptions, response => {
    // console.log('Response = ', response)
    if (response.didCancel) {
      // console.log('User cancelled image picker')
      reject && reject()
      return null
    } else if (response.error) {
      // console.log('ImagePicker Error: ', response.error)
      if (Platform.OS === 'ios') {
        if (RNPermissions.canOpenSettings()) {
          Alert.alert(
            'Ошибка',
            'Для выбора фото из галереи или снимка камеры необходимо разрешить приложению доступ к соответствующим разделам в настройках',
            [
              { text: 'ОК', onPress: () => {} },
              {
                text: 'Настройки',
                onPress: () => {
                  // console.log('Cancel Pressed')
                  RNPermissions.openSettings()
                },
              },
            ],
          )
        } else {
          Alert.alert(
            'Ошибка',
            'Для выбора фото из галереи или снимка камеры необходимо разрешить приложению доступ к соответствующим разделам',
          )
        }
      } else {
        Alert.alert(
          'Ошибка',
          'Для выбора фото из галереи или снимка камеры необходимо разрешить приложению доступ к соответствующим разделам',
        )
      }
      reject && reject()
      return null
    } else if (response.customButton) {
      reject && reject()
      // console.log('User tapped custom button: ', response.customButton)
      return null
    } else {
      // console.log('response: ', response)
      success && success(parseImageResponse(response))
    }
  })
}

export default getImageFromPicker
