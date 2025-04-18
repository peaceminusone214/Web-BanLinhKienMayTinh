const initialState = {
  price: "",
  category: "",
  brand: "",
  sort: "",
  searchResults: [],
};

const filterReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_FILTERS":
      return { ...state, ...action.payload };
    case "CLEAR_FILTERS":
      return initialState;
    case "SET_SEARCH_RESULTS":
      return {
        ...state,
        searchResults: action.payload,
      };
    default:
      return state;
  }
};

export default filterReducer;
