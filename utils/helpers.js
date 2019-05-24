import { StyleSheet, Platform, Dimensions } from 'react-native';
import CryptoJS from 'crypto-js'
const encrypt = (e) => {
    const chipertext = CryptoJS.AES.encrypt(JSON.stringify(data), 'key').toString()
}
export default helper = {
    IconDarkColor: '#979897',
    IconLightColor: '#ABABAB',
    IconBlueColor: '#2B5275',
    IconSize: 17,
    IconSizeSmall: 11,
    IconSizeLarge: 20,
    borderRadius: 7,
    Colors: {
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
        red: '#70d0af',
        blue: '#4a83fa',
        blueDisabled: '#80a6f8',
        lightBlue: '#dbe5fd',
        black: '#000000',
        barkBlue1: '#222222',
        darkBlue2: '#4d4d4d',
        darkGrey: '#4d4d4d',
        grey1: '#5f6368',
        grey2: '#80868b',
        lightGrey1: '#b1b9c2',
        lightGrey2: '#f7f7f7',
        myMessage: '#3776F9',
        interlocatorMessage: '#F6F6F6',
    },
    opacity: 0.3,
    sidePaddingNumber: Dimensions.get('window').width / 100 * 4.5,
    sidePadding: Dimensions.get('window').height >= 1080 ? 48 : 16,
    topPaddingNumber: Dimensions.get('window').height / 100 * 5.6,
    topPadding: `5.6%`,
    HeaderHeight: Dimensions.get('window').height >= 1080 ? 168 : 56,
    HeaderHeightInner: Dimensions.get('window').height >= 1080 ? 72 : 24,
    PressDelay: 700,
    fontSize: {
        xl: 30,
        xs: 24,
        large: 20,
        header: 17,
        text: 14,
        sl: 12,
        sm: 11,
        md: 14
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
    return PixelRatio.roundToNearestPixel(width * elemWidth / 100)
}

export function heightPercentageToDP(heightPercent) {
    const elemHeight = parseFloat(heightPercent)
    return PixelRatio.roundToNearestPixel(height * elemHeight / 100)
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