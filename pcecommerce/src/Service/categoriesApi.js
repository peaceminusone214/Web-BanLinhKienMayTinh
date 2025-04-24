import axios from "axios";

const BASE_URL = `${process.env.REACT_APP_API_URL}/product`;

export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/get-all-categories`, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Không lấy được sản phẩm:", error);
    throw error;
  }
};
