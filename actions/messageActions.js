export const ADD_MESSAGE = 'ADD_MESSAGE';
export const ADD_GROUP_MESSAGE = 'ADD_GROUP_MESSAGE';
export const START_SEARCH = 'START_SEARCH';
export const STOP_SEARCH = 'STOP_SEARCH';
export const GET_MESSAGES = 'GET_MESSAGES';
export const SET_ROOM = 'SET_ROOM';
export const SET_CURRENT_CHAT = 'SET_CURRENT_CHAT';
export const SET_CURRENT_ROOM_ID = 'SET_CURRENT_ROOM_ID';

export const addMessage = (payload) => ({
    type: ADD_MESSAGE,
    payload
});

export const startSearch = () => ({
    type: START_SEARCH
});

export const stopSearch = () => ({
    type: STOP_SEARCH
});

export const getMessages = (payload) => ({
    type: GET_MESSAGES,
    payload
});

export const setRoom = (payload) => ({
    type: SET_ROOM,
    payload
});

export const setCurrentChat = (payload) => ({
    type: SET_CURRENT_CHAT,
    payload
});

export const setCurrentRoomId = (payload) => ({
    type: SET_CURRENT_ROOM_ID,
    payload
});