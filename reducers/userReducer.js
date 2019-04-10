import { SET_USERID, SET_ALL_USERS, REGISTER_USER, SET_USER, SET_AUTH } from '../actions/userActions'

const initialState = {
    user: {},
    auth: {},
    users: [],
    register: { phone: '' }
}
const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER:
            return { ...state, user: { ...action.payload, image: "http://pluspng.com/img-png/user-png-icon-male-user-icon-512.png" }, }
        case SET_AUTH:
            return { ...state, auth: action.payload }
        case SET_ALL_USERS:
            return { ...state, users: [1, 2] }
        case REGISTER_USER:
            return { ...state, register: { phone: action.payload } }
    }
    return state;
}

export default userReducer