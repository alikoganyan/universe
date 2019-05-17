import { SET_CONTACTS, SET_ERROR, SET_ALL_USERS, REGISTER_USER, SET_USER, SET_AUTH, SET_REGISTER_USER_NUMBER, SET_REGISTER_USER_SMS } from '../actions/userActions'

const initialState = {
    user: {},
    contacts: [],
    auth: '',
    users: [],
    error: false,
    register: { phone: '', sms: '' }
}
const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER:
            return { ...state, user: { ...action.payload }, }
        case SET_AUTH:
            return { ...state, auth: action.payload }
        case SET_ERROR:
            return { ...state, error: action.payload }
        case SET_ALL_USERS:
            return { ...state, users: [1, 2] }
        case REGISTER_USER:
            return { ...state, register: { phone: action.payload } }
        case SET_REGISTER_USER_NUMBER:
            return { ...state, register: { ...state.register, phone: action.payload } }
        case SET_REGISTER_USER_SMS:
            return { ...state, register: { ...state.register, sms: action.payload } }
        case SET_CONTACTS:
            return { ...state, contacts: [ ...action.payload ] }
        default:
            return state
    }

}

export default userReducer