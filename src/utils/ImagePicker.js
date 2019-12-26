import { Platform, Alert } from 'react-native'
import RNImagePicker from 'react-native-image-picker'
import RNPermissions from 'react-native-permissions'

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

const parseImageResponse = (response = {}, mediaType = 'mixed') => {
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

const getImageFromCamera = (success, reject, mediaType) => {
  const options = {
    mediaType: mediaType,
    noData: true, // disable base64
    maxWidth: 1920,
    maxHeight: 1920,
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

const getImageFromPicker = (success, reject) => {
  const pickerOptions = {
    title: null,
    takePhotoButtonTitle: 'Камера...',
    chooseFromLibraryButtonTitle: 'Выбрать из галереи...',
    cancelButtonTitle: 'Отмена',
    mediaType: 'photo',
    noData: true, // disable base64
    maxWidth: 300,
    maxHeight: 300,
    quality: 0.8,
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
  RNImagePicker.showImagePicker(pickerOptions, response => {
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
      success && success(parseImageResponse(response, pickerOptions.mediaType))
    }
  })
}

const getImageFromGallery = (success, reject, mediaType = 'mixed') => {
  const options = {
    mediaType: mediaType,
    noData: true, // disable base64
    maxWidth: 1920,
    maxHeight: 1920,
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

export { getImageFromCamera, getImageFromGallery, getImageFromPicker }
