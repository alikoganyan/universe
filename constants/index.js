import { Dimensions, StyleSheet, Platform } from 'react-native'

export const languages = [
    { name: 'English', value: 'en' },
    { name: 'Russian', value: 'ru' }
]

export const { width, height } = Dimensions.get('window')

export const styles = {
	IconSize: 15,
    IconSizeSmall: 11,
    IconSizeLarge: 20,
    borderRadius: 7,
    sidePaddingNumber: Dimensions.get('window').width / 100 * 4.5,
    sidePadding: `4.5%`,
    HeaderHeightNumber: 50,
    HeaderHeight: `50px`,
    PressDelay: 700,
    fontSize: {
        xl: '30px',
        xs: '24px',
        large: '20px',
        header: '15px',
        text: '12px',
    },
    globalStyle: StyleSheet.create({
        droidSafeArea: {
            flex: 1,
            paddingTop: Platform.OS === 'android' ? 25 : 0,
        },
    }),
}