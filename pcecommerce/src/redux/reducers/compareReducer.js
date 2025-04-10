const initialState = {
    compareList: [],
};

const compareReducer = (state = initialState, action) => {
    switch (action.type) {
        case "ADD_TO_COMPARE":
            const exists = state.compareList.find(p => p._id === action.payload._id);
            if (exists) return state;
            return {
                ...state,
                compareList: [...state.compareList, action.payload],
            };

        case "REMOVE_FROM_COMPARE":
            return {
                ...state,
                compareList: state.compareList.filter(p => p._id !== action.payload),
            };

        case "CLEAR_COMPARE":
            return { ...state, compareList: [] };

        default:
            return state;
    }
};

export default compareReducer;
