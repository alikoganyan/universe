import { SET_USERID } from '../actions/userActions'

const initialState = {
    user: {
        id: null
    },
}
const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USERID:
            return { ...state, user: { ...user, id: action.payload } }

    }
    return state;
}

export default userReducer