import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./reducers/productReducer";
import filterReducer from "./reducers/filterReducer";
import searchReducer from "./reducers/searchReducer";
import compareReducer from "./reducers/compareReducer";
import chatReducer from "./reducers/chatReducer";
import userReducer from "./reducers/userReducer";

const store = configureStore({
  reducer: {
    compare: compareReducer,
    filter: filterReducer,
    product: productReducer,
    search: searchReducer,
    chat: chatReducer,
    user: userReducer,
  },
});

export default store;
