import { ADD_RECEIVER, SET_RECEIVERS } from '../actions/tasksActions'
const initialState = {
    receivers: [
        {
            _id: 1,
            contacts: [],
            created_at: "2019-04-10T12:28:42.718Z",
            department: "",
            email: "",
            first_name: "",
            image: "",
            last_name: "",
            messages: [],
            middle_name: "",
            partition: "",
            phone_number: "+79194274251",
            post: "",
            role: "",
            settings: {
                language: "ru",
                notifications: false,
                partition_contacts: false,
                sound: true,
            },
            tasks: [],
            updated_at: "2019-04-10T12:28:42.718Z",
        },
    ]
}
const tasksReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_RECEIVER:
            return {
                ...state,
                receivers: [...state.receivers, action.payload],
            }
        case SET_RECEIVERS:
            return {
                ...state,
                receivers: action.payload,
            }
    }
    return state;
}

export default tasksReducer;