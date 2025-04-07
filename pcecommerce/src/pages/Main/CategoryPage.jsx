import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CompFilter from "../../components/CompFilter";
import Skeleton from "../../components/Skeleton";
import ProductList from "../../components/ProductList";
import { fetchFilteredProducts } from "../../Service/productApi";
import { setProductsByCategorySlug, setLoading } from "../../redux/actions/productActions";

function CategoryPage() {
  const { slug } = useParams();
  const dispatch = useDispatch();

  const { productsByCategorySlug, loading } = useSelector((state) => state.product);
  const filter = useSelector((state) => state.filter);

  const categoryProducts = productsByCategorySlug[slug] || [];

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
     const loadProducts = async () => {
      try {
        dispatch(setLoading(true));
        const data = await fetchFilteredProducts({ ...filter, category: slug });
        dispatch(setProductsByCategorySlug(slug, data));
      } catch (error) {
        console.error("Lỗi khi load sản phẩm theo slug:", error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    loadProducts();
  }, [slug, filter, dispatch]);

  if (loading) {
    return (
      <div className="homepage-collection-swiper mx-auto" style={{ width: "1220px" }}>
        <CompFilter />
        <div className="grid grid--6-cols" id="js-collection-product">
          <Skeleton type="product" count={15} />
        </div>
      </div>
    );
  }


  return (
    <div className="homepage-collection-swiper mx-auto" style={{ width: "1220px" }}>
      <CompFilter />

      <div className="grid grid--6-cols" id="js-collection-product">
        {categoryProducts.length > 0 ? (
          <ProductList products={categoryProducts} />
        ) : (
          <p>Không có sản phẩm nào trong danh mục này.</p>
        )}
      </div>
    </div>
  );
}

export default CategoryPage;
