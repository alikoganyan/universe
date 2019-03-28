import { SET_USERID, SET_ALL_USERS, REGISTER_USER } from '../actions/userActions'

const initialState = {
    user: {
        id: 2,
    },
    users: [],
    register: { phone: '' }
}
const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USERID:
            return { ...state, user: { user: action.payload } }
        case SET_ALL_USERS:
            return { ...state, users: [1, 2] }
        case REGISTER_USER:
            console.log(action.payload)
            return { ...state, register: { phone: action.payload } }
    }
    return state;
}

export default userReducer