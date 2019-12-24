import { Platform, Alert } from 'react-native'
import RNImagePicker from 'react-native-image-picker'
import RNPermissions from 'react-native-permissions'

const pickerOptions = {
  /*
  title: null,
  takePhotoButtonTitle: 'Камера...',
  chooseFromLibraryButtonTitle: 'Выбрать из галереи...',
  cancelButtonTitle: 'Отмена',
 */
  mediaType: 'mixed',
  noData: true, // disable base64
  maxWidth: 1920,
  maxHeight: 1080,
  quality: 1,
  storageOptions: {
    skipBackup: true,
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

const getFormDataFromPath = (path, mediaType) => {
  let name
  let type
  name = path
    ? path.substring(path.lastIndexOf('/') + 1)
    : mediaType === 'photo'
    ? 'image.jpg'
    : 'video.mp4'
  type = name && String(/(?:\.([^.]+))?$/.exec(name)[0]).replace('.', '')
  type = mediaType === 'photo' ? `image/${type}` : `video/*`

  return {
    uri: path,
    name,
    type,
  }
}

const parseImageResponse = (response = {}, mediaType) => {
  const { uri = '', path = '', type = '' } = response
  let resultUri = '',
    resultFileName = '',
    resultType = ''
  if (uri) {
    const data = getFormDataFromPath(uri, mediaType)
    resultUri = data.uri
    resultFileName = data.name
    resultType = type || data.type
  } else if (path && /(?:\.([^.]+))?$/.exec(path)[0]) {
    const data = getFormDataFromPath(path, mediaType)
    resultUri = data.uri
    resultFileName = data.name
    resultType = type || data.type
  }
  return {
    ...response,
    imageFormData: {
      uri: resultUri,
      name: resultFileName,
      type: resultType,
    },
  }
}

const getImageFromCamera = (success, reject, mergeOptions = {}) => {
  const options = { ...pickerOptions, ...mergeOptions }
  RNImagePicker.launchCamera(options, response => {
    if (response.didCancel) {
      reject && reject()
      return null
    } else if (response.error) {
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
      return null
    } else {
      success && success(parseImageResponse(response, options.mediaType))
    }
  })
}

const getImageFromGallery = (success, reject, mergeOptions = {}) => {
  const options = { ...pickerOptions, ...mergeOptions }
  RNImagePicker.launchImageLibrary(options, response => {
    if (response.didCancel) {
      reject && reject()
      return null
    } else if (response.error) {
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
      return null
    } else {
      success && success(parseImageResponse(response, options.mediaType))
    }
  })
}

export { getImageFromCamera, getImageFromGallery }
