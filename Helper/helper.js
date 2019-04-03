import { StyleSheet, Platform, Dimensions } from 'react-native';
import io from 'socket.io-client';
import { API_URL, API_PORT } from 'react-native-dotenv'
const socketUrl = `http://${API_URL}:${API_PORT}`
export default helper = {
    IconDarkColor: '#979897',
    IconLightColor: '#ABABAB',
    IconBlueColor: '#2B5275',
    IconSize: 15,
    IconSizeSmall: 11,
    IconSizeLarge: 20,
    borderRadius: 7,
    Colors: {
        background: '#fff',
        border: '#F1F1F1',
        color: '#2A2A2A',
        lightColor: '#5F6468',
        purple: '#8b81c5',
        green: '#abd070',
        yellow: '#fdb557',
        red: '#f96281',
        blue: '#4a83fa',
        lightBlue: '#dbe5fd',
        black: '#000000',
        barkBlue1: '#222222',
        darkBlue2: '#4d4d4d',
        grey1: '#5f6368',
        grey2: '#80868b',
        lightGrey1: '#b1b9c2',
        lightGrey2: '#f7f7f7',
    },
    socket: io(socketUrl, { test: '123', transports: ['websocket'] }),
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