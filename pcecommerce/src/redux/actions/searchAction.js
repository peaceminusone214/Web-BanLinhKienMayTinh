import { searchProducts } from "../../Service/productApi";

export const SET_SEARCH_RESULTS = "SET_SEARCH_RESULTS";
export const CLEAR_SEARCH_RESULTS = "CLEAR_SEARCH_RESULTS";

export const setSearchResults = (results, keyword) => ({
  type: SET_SEARCH_RESULTS,
  payload: { results, keyword },
});

export const clearSearchResults = () => ({
  type: CLEAR_SEARCH_RESULTS,
});

export const fetchSearchResults = (keyword) => {
  return async (dispatch) => {
    try {
      const data = await searchProducts(keyword);
      dispatch(setSearchResults(data, keyword));
    } catch (error) {
      console.error("Lỗi khi tìm kiếm sản phẩm:", error);
    }
  };
};
