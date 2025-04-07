import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

export const fetchUsers = async () => {
  const res = await axiosInstance.get("/user");
  return res.data;
};

export const createUser = async (userData) => {
  const res = await axiosInstance.post("/user", userData);
  return res.data;
};

export const updateUser = async (userId, updatedData) => {
  const res = await axiosInstance.put(`/user/${userId}`, updatedData);
  return res.data;
};

export const deleteUser = async (userId) => {
  const res = await axiosInstance.put(`/user/delete/${userId}`);
  return res.data;
};

export const getUserById = async (userId) => {
  const res = await axiosInstance.get(`/api/user/${userId}`);
  return res.data;
};
