import { StyleSheet, Platform, Dimensions, PixelRatio } from 'react-native'
import CryptoJS from 'crypto-js'

const { width, height } = Dimensions.get('window')

const encrypt = data => {
  const chipertext = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    'key',
  ).toString()
}
export default {
  minPassLength: 6,
  IconDarkColor: '#979897',
  IconLightColor: '#ABABAB',
  IconBlueColor: '#2B5275',
  IconSize: 17,
  IconSizeSmall: 11,
  IconSizeLarge: 20,
  borderRadius: 8,
  links: {
    termsOfUse: 'https://agreement.univ.center/terms-of-use/',
    agreement: 'https://agreement.univ.center/agreement/',
    confidentiality: 'https://agreement.univ.center/confidentiality/',
  },
  Colors: {
    white: '#fff',
    back: '#000',
    background: '#fff',
    border: '#F1F1F1',
    color: '#2A2A2A',
    lightColor: '#5F6468',
    purple: '#8b81c5',
    green: '#70d0af',
    yellow: '#fdb557',
    yellow2: '#fff1dd',
    orange: '#fdb557',
    pink: '#f96281',
    red: '#f96281',
    blue: '#4a83fa',
    blueDisabled: '#80a6f8',
    lightBlue: '#dbe5fd',
    lightBlue2: '#191e5aca',
    black: '#000000',
    barkBlue1: '#222222',
    darkBlue2: '#4d4d4d',
    darkGrey: '#4d4d4d',
    grey1: '#5f6368',
    grey2: '#80868b',
    grey3: '#5f6368',
    grey4: '#6A6A6A',
    lightGrey1: '#b1b9c2',
    lightGrey2: '#f7f7f7',
    lightGrey3: '#ccc',
    myMessage: '#4a83fa',
    interlocatorMessage: '#F6F6F6',
    avatars: [
      '#f9d38a',
      '#fdc22d',
      '#fd8d2f',
      '#fc583c',
      '#c55b3f',
      '#f86382',
      '#c50a3c',
      '#8e1040',
      '#ab5073',
      '#937c76',
      '#d48bf4',
      '#8a82c2',
      '#716993',
      '#501a48',
      '#4a83fa',
      '#4a31c4',
      '#3d3e6a',
      '#70d0af',
      '#1db9ac',
      '#2e7c99',
      '#15596a',
      '#546377',
      '#aed263',
      '#5cc687',
    ],
  },
  imageSize: {
    small: 20,
    medium: Dimensions.get('window').height >= 1080 ? 72 : 24,
    xs: 40,
    large: 48,
    header: 34,
    avatar: 50,
  },
  opacity: 0.3,
  sidePaddingNumber: (Dimensions.get('window').width / 100) * 4.5,
  sidePadding: Dimensions.get('window').height >= 1080 ? 48 : 16,
  topPaddingNumber: (Dimensions.get('window').height / 100) * 5.6,
  topPadding: `5.6%`,
  HeaderHeight: Dimensions.get('window').height >= 1080 ? 168 : 56,
  HeaderHeightInner: Dimensions.get('window').height >= 1080 ? 72 : 24,
  PressDelay: 700,
  fontSize: {
    xl: 30,
    xs: 24,
    large: 20,
    header: 18,
    text: 14,
    sl: 12,
    sm: 11,
    md: 14,
    input: 16,
    textSize: 16,
    chatHeaderName: 17,
    dialogName: 15,
    taskTitle: 16,
  },
  globalStyle: StyleSheet.create({
    droidSafeArea: {
      flex: 1,
      paddingTop: Platform.OS === 'android' ? 25 : 0,
    },
  }),
  encrypt,
}
export function widthPercentageToDP(widthPercent) {
  const elemWidth = parseFloat(widthPercent)
  return PixelRatio.roundToNearestPixel((width * elemWidth) / 100)
}

export function heightPercentageToDP(heightPercent) {
  const elemHeight = parseFloat(heightPercent)
  return PixelRatio.roundToNearestPixel((height * elemHeight) / 100)
}

export function isNumeric(number) {
  return !isNaN(parseFloat(number)) && isFinite(number)
}

export function copy(value, el) {
  const btn = el.currentTarget.lastElementChild
  let tmp = document.createElement('INPUT')
  let focus = document.activeElement

  btn.classList.add('active')
  setTimeout(() => {
    btn.classList.remove('active')
  }, 500)

  tmp.value = value

  document.body.appendChild(tmp)
  tmp.select()
  document.execCommand('copy')
  document.body.removeChild(tmp)
  focus.focus()
}

export function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}