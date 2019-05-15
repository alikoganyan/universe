export const SET_DIALOGS = 'SET_DIALOGS';
export const SET_CURRENT_DIALOGS = 'SET_CURRENT_DIALOGS';
export const setDialogs = (payload) => {
    return {
        type: SET_DIALOGS,
        payload,
    }
}

export const setCurrentDialogs = (payload) => {
    return {
        type: SET_CURRENT_DIALOGS,
        payload,
    }
}
