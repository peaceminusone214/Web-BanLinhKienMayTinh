import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCategoryBySlug } from "../../services/productService" 
import { getProductsByCategory } from "../../services/productService"; 

const CategoryPage = () => {
    const { slug } = useParams(); 
    const [category, setCategory] = useState(null);
    const [products, setProducts] = useState([]);
  
    useEffect(() => {
      const fetchCategory = async () => {
        const fetchedCategory = await getCategoryBySlug(slug); 
        setCategory(fetchedCategory);
      };
  
      fetchCategory(); 
    }, [slug]);
  
    useEffect(() => {
      const fetchProducts = async () => {
        if (category) {
          const result = await getProductsByCategory(category.slug); 
          setProducts(result); 
        }
      };
  
      if (category) {
        fetchProducts(); 
      }
    }, [category]);
  return (
    <div className="category-page">
      <h1>{category ? category.name.toUpperCase() : "Danh mục không xác định"}</h1>
      <div className="product-list">
        {products.length === 0 ? (
          <p>Không có sản phẩm trong danh mục này.</p>
        ) : (
          products.map((product) => (
            <div key={product.id} className="product-item">
              <img src={product.img} alt={product.name} />
              <h3>{product.name}</h3>
              <p>{product.price}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
