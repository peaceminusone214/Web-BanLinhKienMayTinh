import axios from "axios";

//base json
const BASE_URL = `${process.env.REACT_APP_API_URL}/product`;

export const fetchProducts = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/get-products`);
    return response.data;
  } catch (error) {
    console.error("Không lấy được sản phẩm:", error);
    throw error;
  }
};

export const fetchProductsByCategory = async (categoryId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/products-by-category/${categoryId}`
    );
    return response.data;
  } catch (error) {
    console.error("Không lấy được sản phẩm:", error);
    throw error;
  }
};

export const fetchProductsBySlug = async (slug) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/get-category-by-slug/${slug}`
    );
    return response.data;
  } catch (error) {
    console.error("Không lấy được sản phẩm:", error);
    throw error;
  }
};

export const getProductsByCategory = async (slug) => {
  const categoryRes = await axios.get(
    `${BASE_URL}/get-category-by-slug/${slug}`
  );
  const category = categoryRes.data;

  const productRes = await axios.get(`${BASE_URL}/get-products-category`, {
    params: { category_id: category._id },
  });

  return productRes.data;
};

export const fetchFilteredProducts = async (filters) => {
  try {
    const response = await axios.get(`${BASE_URL}/products-filter`, {
      params: filters,
    });

    return response.data;
  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    return [];
  }
};

export const searchProducts = async (keyword) => {
  try {
    const response = await axios.get(`${BASE_URL}/search`, {
      params: { q: keyword },
    });

    return response.data;
  } catch (error) {
    console.error("Lỗi khi tìm kiếm sản phẩm:", error);
    return [];
  }
};

export const compareProducts = async (productIds) => {
  try {
    const response = await axios.post(`${BASE_URL}/compare`, {
      productIds,
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi so sánh sản phẩm:", error);
    return [];
  }
};
