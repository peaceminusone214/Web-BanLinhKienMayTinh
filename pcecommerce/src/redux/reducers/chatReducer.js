import { ADD_MESSAGE, BOT_REPLY, CHAT_SET_LOADING } from "../actions/chatActions";

const initialState = {
    // luu mess client
    messages: [],
    loading: true,
};

export const chatReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_MESSAGE:
            return { ...state, messages: [...state.messages, action.payload] };
        case BOT_REPLY:
            return { ...state, messages: [...state.messages, action.payload] };
        case CHAT_SET_LOADING:
            return { ...state, loading: action.payload };
        default:
            return state;
    }
};

export default chatReducer;
