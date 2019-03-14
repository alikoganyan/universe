import { DRAWER_OPEN } from '../actions/drawerActions'
const initialState = {
    open: false,
}
const drawerReducer = (state = initialState, action) => {
    switch (action.type) {
        case DRAWER_OPEN:

            return {
                ...state,
                open: true,
            }
    }
    return state;
}

export default drawerReducer;