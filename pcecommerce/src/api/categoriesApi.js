import axios from 'axios';

//base json
const BASE_URL = 'http://localhost:3000/assets/data';


export const fetchCategories = async () => {
    try {
        // lay url base
        const response = await axios.get(`${BASE_URL}/categories.json`);
        return response.data;
    } catch (error) {
        console.error("Không lấy được sản phẩm:", error);
        throw error;
    }
}