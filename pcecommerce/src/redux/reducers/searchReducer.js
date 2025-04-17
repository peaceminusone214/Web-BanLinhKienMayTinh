import {
  SET_SEARCH_RESULTS,
  CLEAR_SEARCH_RESULTS,
} from "../actions/searchAction";

const initialState = {
  results: [],
  keyword: "",
};

const searchReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SEARCH_RESULTS:
      return {
        ...state,
        results: action.payload.results,
        keyword: action.payload.keyword,
      };

    case CLEAR_SEARCH_RESULTS:
      return {
        ...state,
        results: [],
        keyword: "",
      };

    default:
      return state;
  }
};

export default searchReducer;
