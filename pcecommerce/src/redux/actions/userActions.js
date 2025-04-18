// Action Types
export const SET_USERS = "SET_USERS";
export const ADD_USER = "ADD_USER";
export const UPDATE_USER = "UPDATE_USER";
export const DELETE_USER = "DELETE_USER"; // sxoa ho
export const SET_SELECTED_USER = "SET_SELECTED_USER";
export const SET_USER_DATA = "SET_USER_DATA";
export const SET_EDIT_MODE = "SET_EDIT_MODE";

// Action Creators
export const setUsers = (users) => ({
  type: SET_USERS,
  payload: users,
});

export const addUser = (user) => ({
  type: ADD_USER,
  payload: user,
});

export const updateUser = (user) => ({
  type: UPDATE_USER,
  payload: user,
});

export const deleteUser = (userId) => ({
  type: DELETE_USER,
  payload: userId,
});

export const setSelectedUser = (user) => ({
  type: SET_SELECTED_USER,
  payload: user,
});

export const setUserData = (data) => ({
  type: SET_USER_DATA,
  payload: data,
});

export const setEditMode = (isEdit) => ({
  type: SET_EDIT_MODE,
  payload: isEdit,
});
