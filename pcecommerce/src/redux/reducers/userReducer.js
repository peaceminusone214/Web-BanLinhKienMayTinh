import {
  SET_USERS,
  ADD_USER,
  UPDATE_USER,
  DELETE_USER,
  SET_SELECTED_USER,
  SET_USER_DATA,
  SET_EDIT_MODE,
} from "../actions/userActions";

const initialState = {
  users: [],
  selectedUser: null,
  userData: {},
  isEditMode: false,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USERS:
      return { ...state, users: action.payload };

    case ADD_USER:
      return { ...state, users: [...state.users, action.payload] };

    case UPDATE_USER:
      return {
        ...state,
        users: state.users.map((u) =>
          u._id === action.payload._id ? action.payload : u
        ),
        selectedUser: null,
        userData: {},
        isEditMode: false,
      };

    case DELETE_USER:
      return {
        ...state,
        users: state.users.map((u) =>
          u._id === action.payload ? { ...u, deleted: true } : u
        ),
      };

    case SET_SELECTED_USER:
      return { ...state, selectedUser: action.payload };

    case SET_USER_DATA:
      return { ...state, userData: action.payload };

    case SET_EDIT_MODE:
      return { ...state, isEditMode: action.payload };

    default:
      return state;
  }
};

export default userReducer;
